
export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  website: string;
  rating: string;
  user_ratings: string;
  summary: string;
  types: string;
  opening_hours: string;
  phone: string;
}

export const hospitals: Hospital[] = [
  {
    id: "ChIJ3assUnhFrjsRx4a-FqvNnOk",
    name: "Primary Health Centre - M G Palya",
    address: "mg palya, P9HQ+J22, Ramnagar, Karnataka 562109, India",
    latitude: "12.7290172",
    longitude: "77.3875294",
    website: "",
    rating: "4.8",
    user_ratings: "4",
    summary: "",
    types: "hospital, health, point_of_interest, establishment",
    opening_hours: "Opening hours not available",
    phone: ""
  },
  {
    id: "ChIJZdyfKEZFrjsRGqzWvIJEUwE",
    name: "Hospital",
    address: "M9XX+93F, Gollahalli, Karnataka 562109, India",
    latitude: "12.6984458",
    longitude: "77.3976667",
    website: "",
    rating: "2.5",
    user_ratings: "2",
    summary: "",
    types: "hospital, health, point_of_interest, establishment",
    opening_hours: "Opening hours not available",
    phone: ""
  },
  {
    id: "ChIJObNFBSZFrjsR_YKpm4B8FEE",
    name: "Govt. Hospital Gollahalli",
    address: "Gollahalli, Karnataka 562112, India",
    latitude: "12.6897709",
    longitude: "77.3984704",
    website: "",
    rating: "N/A",
    user_ratings: "0",
    summary: "",
    types: "hospital, health, point_of_interest, establishment",
    opening_hours: "Opening hours not available",
    phone: ""
  }
];
