# Bangalore Hospitals Directory

This Python script retrieves information about hospitals in Bangalore, India using the Google Maps Places API and exports the data to a CSV file.

## Features

- Retrieves detailed information about hospitals in Bangalore
- Includes name, address, location coordinates, website, and review information
- Exports data to a CSV file
- Limits results to 10 hospitals for testing purposes
- Includes error handling and address parsing

## Prerequisites

- Python 3.7 or higher
- Google Maps API key with Places API enabled

## Installation

1. Clone this repository or download the files
2. Install the required packages:
```bash
pip install -r requirements.txt
```

## Configuration

1. Create a `.env` file in the project directory
2. Add your Google Maps API key to the `.env` file:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Usage

Run the script using Python:
```bash
python get_bangalore_hospitals.py
```

The script will:
1. Search for hospitals in Bangalore
2. Retrieve detailed information for up to 10 hospitals
3. Export the data to `bangalore_hospitals.csv`

## Output

The script creates a CSV file (`bangalore_hospitals.csv`) with the following columns:
- Name
- Full Address
- Street Address
- City
- Postal Code
- Latitude
- Longitude
- Website
- Description
- Review Information

## Error Handling

The script includes error handling for:
- Missing API key
- API request failures
- Data parsing issues

## Notes

- The script uses a 20km radius from Bangalore's city center
- Address parsing may vary in accuracy depending on the format of the address returned by the API
- Review information is limited to overall ratings due to API limitations 