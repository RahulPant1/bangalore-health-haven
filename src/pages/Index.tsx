
import { useState } from "react";
import { Link } from "react-router-dom";
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bangalore Hospitals & Clinics Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Find the best healthcare facilities in Bangalore with detailed information, ratings, and directions.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/blog"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read Our Blog
            </Link>
            <Link
              to="/faq"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View FAQ
            </Link>
          </div>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
