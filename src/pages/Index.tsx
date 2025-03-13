
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import HospitalCard from "@/components/HospitalCard";
import { useHospitals } from "@/hooks/useHospitals";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const Index = () => {
  const { 
    hospitals, 
    isLoading, 
    error, 
    fetchHospitals, 
    findHospitalsNearMe 
  } = useHospitals();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSearch = (term: string) => {
    fetchHospitals({ search: term });
  };

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

        <div className="space-y-4 mb-8">
          <SearchBar 
            searchTerm="" 
            onSearchChange={handleSearch} 
          />
          
          <div className="flex justify-center">
            <Button
              onClick={findHospitalsNearMe}
              className="flex items-center gap-2"
              variant="outline"
            >
              <MapPin className="h-4 w-4" />
              Hospitals Near Me
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading hospitals...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {!isLoading && !error && hospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hospitals found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
