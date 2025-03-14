
import { useState } from 'react';
import { Hospital } from '@/types/hospital';

interface UseHospitalsProps {
  searchTerm?: string;
  nearMe?: boolean;
}

export const useHospitals = ({ searchTerm, nearMe }: UseHospitalsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchHospitals = async (params: Record<string, string> = {}, reset = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentPage = reset ? 1 : page;
      const queryParams = new URLSearchParams({
        ...params,
        page: currentPage.toString()
      }).toString();

      const response = await fetch(
        `https://feuxtstvjnsysirosxnu.supabase.co/functions/v1/get-hospitals?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldXh0c3R2am5zeXNpcm9zeG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjQ4MzAsImV4cCI6MjA1NTcwMDgzMH0.2mt3iNZ8og_ATWlNHKI_6siS2K_aRceay55kWswJP9Y`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }
      
      const data = await response.json();
      if (reset) {
        setHospitals(data);
      } else {
        setHospitals(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 20);
      setPage(currentPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!isLoading && hasMore) {
      await fetchHospitals({}, false);
    }
  };

  const findHospitalsNearMe = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      await fetchHospitals({ 
        lat: latitude.toString(), 
        lng: longitude.toString(),
        radius: '10'
      });
    } catch (err) {
      setError('Failed to get your location. Please enable location services.');
    }
  };

  return {
    hospitals,
    isLoading,
    error,
    fetchHospitals,
    findHospitalsNearMe,
    loadMore,
    hasMore
  };
};
