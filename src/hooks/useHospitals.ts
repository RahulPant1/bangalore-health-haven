import { useState } from 'react';
import { Hospital } from '@/types/hospital';

const SUPABASE_URL = 'https://feuxtstvjnsysirosxnu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldXh0c3R2am5zeXNpcm9zeG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjQ4MzAsImV4cCI6MjA1NTcwMDgzMH0.2mt3iNZ8og_ATWlNHKI_6siS2K_aRceay55kWswJP9Y';

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

  // const fetchHospitals = async (params: Record<string, string> = {}, reset = true) => {
  //   setIsLoading(true);
  //   setError(null);
    
  //   try {
  //     const currentPage = reset ? 1 : page;
  //     const queryParams = new URLSearchParams({
  //       ...params,
  //       page: currentPage.toString()
  //     }).toString();

  //     const response = await fetch(
  //       `${SUPABASE_URL}/functions/v1/get-hospitals-v3?${queryParams}`,
  //       {
  //         method: 'GET',
  //         mode: 'cors',
  //         // credentials: 'include',
  //         headers: {
  //           'Authorization': `Bearer ${ANON_KEY}`
  //         }
  //       }
  //     );
      
  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => null);
  //       throw new Error(errorData?.message || 'Failed to fetch hospitals');
  //     }
      
  //     const data = await response.json();
  //     if (reset) {
  //       setHospitals(data);
  //     } else {
  //       setHospitals(prev => [...prev, ...data]);
  //     }
  //     setHasMore(data.length === 20);
  //     setPage(currentPage + 1);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchHospitals = async (params: Record<string, string> = {}, reset = true) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const currentPage = reset ? 1 : page; // Ensure the correct page is used
      const queryParams = new URLSearchParams({
        ...params,
        page: currentPage.toString()
      }).toString();
  
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-hospitals-v3?${queryParams}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${ANON_KEY}`
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch hospitals');
      }
  
      const data = await response.json();
  
      if (reset) {
        setHospitals(data); // Reset hospitals on first call
      } else {
        setHospitals(prev => [...prev, ...data]); // Append new results on scroll
      }
  
      setHasMore(data.length > 0); // If no data returned, stop pagination
      setPage(currentPage + 1); // Move to the next page
  
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
        radius: '5000'
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
