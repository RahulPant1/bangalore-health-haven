
import { useState } from "react";
import { hospitals } from "@/types/hospital";
import SearchBar from "@/components/SearchBar";
import HospitalCard from "@/components/HospitalCard";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.types.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bangalore Hospitals & Clinics Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the best healthcare facilities in Bangalore with detailed information, ratings, and directions.
          </p>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="grid gap-6 mt-8">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hospitals found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
