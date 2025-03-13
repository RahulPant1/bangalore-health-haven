
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

  const fetchHospitals = async (params: Record<string, string> = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(
        `https://feuxtstvjnsysirosxnu.supabase.co/functions/v1/get-hospitals?${queryParams}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }
      
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
    } finally {
      setIsLoading(false);
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
    findHospitalsNearMe
  };
};
