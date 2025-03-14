
import { useEffect, useRef, useCallback } from "react";
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
    findHospitalsNearMe,
    loadMore,
    hasMore
  } = useHospitals();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastHospitalElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);

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
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1606293926075-91acedc891cc?auto=format&fit=crop&w=200&q=80"
              alt="Bangalore cityscape left"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <h1 className="text-4xl font-bold text-gray-900">
              Bangalore Hospitals & Clinics Directory
            </h1>
            <img
              src="https://images.unsplash.com/photo-1582719472380-c5862b6f3480?auto=format&fit=crop&w=200&q=80"
              alt="Bangalore cityscape right"
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
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

        {isLoading && hospitals.length === 0 && (
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
          {hospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              ref={index === hospitals.length - 1 ? lastHospitalElementRef : null}
            >
              <HospitalCard hospital={hospital} />
            </div>
          ))}
        </div>

        {isLoading && hospitals.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading more hospitals...</p>
          </div>
        )}

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
