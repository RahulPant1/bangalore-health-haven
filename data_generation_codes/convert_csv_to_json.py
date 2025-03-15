# Convert a csv file into a json file
# Usage: python convert_csv_to_json.py <input_csv_file> <output_json_file>
# Example: python convert_csv_to_json.py input.csv output.json
import csv
import json
import sys

def convert_csv_to_json(csv_file_path, json_file_path):
    """
    Converts a CSV file to a JSON file.

    Args:
        csv_file_path (str): The path to the input CSV file.
        json_file_path (str): The path to the output JSON file.
    """
    data = []
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)

    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_csv_to_json.py <input_csv_file> <output_json_file>")
        sys.exit(1)

    csv_file_path = sys.argv[1]
    json_file_path = sys.argv[2]

    convert_csv_to_json(csv_file_path, json_file_path)

    print(f"Successfully converted {csv_file_path} to {json_file_path}")