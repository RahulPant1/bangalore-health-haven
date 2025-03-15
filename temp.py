import os
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_api_key() -> str:
    """Get the Google Maps API key from environment variables."""
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        print("Error: Google Maps API key not found. Please set GOOGLE_MAPS_API_KEY in your .env file.")
        exit(1)
    return api_key

def get_place_details(place: dict, api_key: str) -> dict:
    """Extract and format place details from the API response."""
    try:
        place_id = place.get('id')
        name = place.get('displayName', {}).get('text', '')
        full_address = place.get('formattedAddress', '')
        latitude = place.get('location', {}).get('latitude', '')
        longitude = place.get('location', {}).get('longitude', '')
        website = place.get('websiteUri', '')
        description = place.get('editorialSummary', {}).get('text', '')

        # Basic rating extraction (New Places API doesn't provide detailed review snippets directly)
        rating = place.get('rating', 'N/A')

        return {
            'name': name,
            'full_address': full_address,
            'latitude': latitude,
            'longitude': longitude,
            'website': website,
            'description': description,
            'rating': rating
        }
    except Exception as e:
        print(f"Error processing place details: {e}")
        return {}

def main():
    """Main function to retrieve hospital data and export to CSV."""
    api_key = get_api_key()
    url = f"https://places.googleapis.com/v1/places:searchNearby?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    # payload = {
    #     "includedTypes": ["hospital"],
    #     "maxResultCount": 10,
    #     "locationRestriction": {
    #         "circle": {
    #             "center": {
    #                 "latitude": 12.9716,  # Bengaluru latitude
    #                 "longitude": 77.5946   # Bengaluru longitude
    #             },
    #             "radius": 20000.0  # 20,000 meters radius
    #         }
    #     }
    # }
    payload = {
    "includedTypes": ["hospital"],
    "locationRestriction": {
        "circle": {
            "center": {
                "latitude": 12.9716,
                "longitude": 77.5946
            },
                "radius": 1000.0
            }
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        data = response.json()
        places = data.get('places', [])
        hospitals_data = [get_place_details(place, api_key) for place in places]
        hospitals_data = [h for h in hospitals_data if h] #remove empty hospital entries.

        if hospitals_data:
            df = pd.DataFrame(hospitals_data)
            df.to_csv('bangalore_hospitals_new_api.csv', index=False)
            print(f"Successfully exported {len(hospitals_data)} hospitals to bangalore_hospitals_new_api.csv")
        else:
            print("No hospital data was found.")

    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    except ValueError as e:
        print(f"JSON decoding error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()