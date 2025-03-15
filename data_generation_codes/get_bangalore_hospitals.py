import os
import sys
import json
import time
from typing import Dict, List, Optional, Set, Tuple
import requests
import pandas as pd
from dotenv import load_dotenv
import csv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Constants
OUTPUT_CSV = 'bangalore_hospitals.csv'
PROCESSED_IDS_FILE = 'processed_place_ids.json'
MAX_RESULTS_PER_PAGE = 20  # Maximum allowed by the API
PAGE_TOKEN_DELAY = 7  # Increased delay for better pagination handling
SEARCH_RADIUS = 5000  # Reduced search radius to 5km
GRID_STEP = 3000  # Move search center every 3km

# Define Bangalore's approximate bounding box
BANGALORE_CENTER = {'lat': 12.9716, 'lng': 77.5946}  # City center
BANGALORE_BOUNDS = {
    'north': 13.2,
    'south': 12.7,
    'east': 77.8,
    'west': 77.4
}

def get_api_key() -> str:
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        print("Error: Google Maps API key not found. Please set GOOGLE_MAPS_API_KEY in your .env file.")
        sys.exit(1)
    return api_key

def load_processed_ids() -> Set[str]:
    try:
        if os.path.exists(PROCESSED_IDS_FILE):
            with open(PROCESSED_IDS_FILE, 'r') as f:
                return set(json.load(f))
    except Exception as e:
        print(f"Warning: Could not load processed IDs: {str(e)}")
    return set()

def save_processed_ids(processed_ids: Set[str]) -> None:
    try:
        with open(PROCESSED_IDS_FILE, 'w') as f:
            json.dump(list(processed_ids), f)
    except Exception as e:
        print(f"Warning: Could not save processed IDs: {str(e)}")

def format_opening_hours(current_opening: Dict) -> str:
    if not current_opening:
        return "Opening hours not available"
    status = current_opening.get('openNow', False)
    status_text = "Open now" if status else "Closed"
    secondary_text = current_opening.get('secondaryText', {}).get('text', '')
    return f"{status_text} - {secondary_text}" if secondary_text else status_text

def setup_csv_file(file_path: str) -> None:
    """Creates the CSV file with headers if it does not exist."""
    if not Path(file_path).exists():
        with open(file_path, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                "ID", "Name", "Address", "Latitude", "Longitude", "Website",
                "Rating", "User Ratings", "Summary", "Types", "Opening Hours", "Phone"
            ])

def append_to_csv(file_path: str, hospital_data: Dict) -> None:
    """Appends a hospital record to the CSV file."""
    with open(file_path, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            hospital_data.get('id', ''),
            hospital_data.get('name', ''),
            hospital_data.get('address', ''),
            hospital_data.get('latitude', ''),
            hospital_data.get('longitude', ''),
            hospital_data.get('website', ''),
            hospital_data.get('rating', ''),
            hospital_data.get('user_ratings', ''),
            hospital_data.get('summary', ''),
            hospital_data.get('types', ''),
            hospital_data.get('opening_hours', ''),
            hospital_data.get('phone', '')
        ])

def search_hospitals(api_key: str, location: Dict[str, float], page_token: str = None) -> Dict:
    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": (
            "places.id,places.displayName,places.formattedAddress,places.location,"
            "places.websiteUri,places.rating,places.userRatingCount,places.editorialSummary,"
            "places.types,places.regularOpeningHours,places.nationalPhoneNumber"
        )
    }
    data = {
        "includedTypes": ["hospital"],
        "maxResultCount": MAX_RESULTS_PER_PAGE,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": location['lat'], "longitude": location['lng']},
                "radius": SEARCH_RADIUS
            }
        }
    }
    if page_token:
        print(f"Using page token: {page_token[:20]}...")
        data["pageToken"] = page_token
        print("Waiting before using page token...")
        time.sleep(PAGE_TOKEN_DELAY)
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text[:500]}...")
        response.raise_for_status()
        result = response.json()
        places = result.get('places', [])
        next_token = result.get('nextPageToken')
        print(f"Retrieved {len(places)} places in this page")
        print(f"Next page token: {'Present' if next_token else 'None'}")
        if next_token:
            print("Waiting after receiving next page token...")
            time.sleep(PAGE_TOKEN_DELAY)
        return {'places': places, 'next_page_token': next_token}
    except requests.exceptions.RequestException as e:
        print(f"Error searching for hospitals: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response content: {e.response.text}")
        return {'places': [], 'next_page_token': None}

def get_hospital_details(place: Dict) -> Dict:
    """Extract relevant details from a place object."""
    try:
        display_name = place.get('displayName', {}).get('text', '')
        location = place.get('location', {})
        place_types = place.get('types', [])
        types_str = ', '.join(place_types) if place_types else 'Not available'
        current_opening = place.get('regularOpeningHours', {})
        opening_hours = format_opening_hours(current_opening)
        
        return {
            'id': place.get('id', ''),
            'name': display_name,
            'address': place.get('formattedAddress', ''),
            'latitude': location.get('latitude', ''),
            'longitude': location.get('longitude', ''),
            'website': place.get('websiteUri', ''),
            'rating': place.get('rating', 'N/A'),
            'user_ratings': place.get('userRatingCount', 0),
            'summary': place.get('editorialSummary', {}).get('text', ''),
            'types': types_str,
            'opening_hours': opening_hours,
            'phone': place.get('nationalPhoneNumber', '')
        }
    except Exception as e:
        print(f"Error processing hospital details: {str(e)}")
        return {}

def process_location(api_key: str, location: Dict[str, float], processed_ids: Set[str]) -> Tuple[int, Set[str]]:
    """
    Process a single location point and its surrounding area.
    Args:
        api_key: Google Maps API key
        location: Dictionary containing latitude and longitude
        processed_ids: Set of already processed place IDs
    Returns:
        Tuple of (number of new places processed, updated processed_ids set)
    """
    location_total = 0
    page_count = 0
    next_page_token = None
    
    print(f"\n=== Processing location: lat={location['lat']:.4f}, lng={location['lng']:.4f} ===")
    
    while True:
        page_count += 1
        print(f"\n--- Processing Page {page_count} ---")
        
        result = search_hospitals(api_key, location, next_page_token)
        places = result.get('places', [])
        
        if not places:
            print("No more hospitals found for this location")
            break
        
        for place in places:
            place_id = place.get('id')
            display_name = place.get('displayName', {}).get('text', 'Unknown')
            
            if place_id in processed_ids:
                print(f"Skipping already processed hospital: {display_name}")
                continue
            
            hospital_details = get_hospital_details(place)
            if hospital_details:
                append_to_csv(OUTPUT_CSV, hospital_details)
                processed_ids.add(place_id)
                location_total += 1
                print(f"Processed hospital: {hospital_details['name']}")
                save_processed_ids(processed_ids)
        
        next_page_token = result.get('next_page_token')
        print(f"End of page {page_count}. Location total so far: {location_total}")
        
        if not next_page_token:
            print("No more pages available for this location")
            break
    
    return location_total, processed_ids

def generate_grid_locations() -> List[Dict[str, float]]:
    """Generate a grid of locations to search across Bangalore."""
    grid_locations = []
    lat = BANGALORE_BOUNDS['south']
    while lat <= BANGALORE_BOUNDS['north']:
        lng = BANGALORE_BOUNDS['west']
        while lng <= BANGALORE_BOUNDS['east']:
            grid_locations.append({'lat': lat, 'lng': lng})
            lng += GRID_STEP / 111000  # Convert meters to degrees (approximate)
        lat += GRID_STEP / 111000
    return grid_locations

def main():
    """Main function to retrieve hospital data and export to CSV."""
    try:
        api_key = get_api_key()
        processed_ids = load_processed_ids()
        setup_csv_file(OUTPUT_CSV)
        total_processed = 0
        
        grid_locations = generate_grid_locations()
        print(f"Generated {len(grid_locations)} grid points to search")
        
        for i, location in enumerate(grid_locations, 1):
            print(f"\nProcessing grid point {i}/{len(grid_locations)}")
            location_total, processed_ids = process_location(api_key, location, processed_ids)
            total_processed += location_total
            print(f"Grid point total: {location_total}")
            print(f"Running total: {total_processed}")
            
            if i < len(grid_locations):  # Don't wait after the last location
                print("\nWaiting before processing next location...")
                time.sleep(PAGE_TOKEN_DELAY * 3)
        
        print(f"\nFinished processing all locations.")
        print(f"Total hospitals added: {total_processed}")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
