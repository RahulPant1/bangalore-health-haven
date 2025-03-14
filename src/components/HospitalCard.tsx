import { Hospital } from "@/types/hospital";
import { MapPin, Phone, ExternalLink, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomHospitalImage } from "@/utils/hospitalImages";

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`,
      "_blank"
    );
  };

  const handleCall = () => {
    if (hospital.phone) {
      window.location.href = `tel:${hospital.phone}`;
    }
  };

  const openWebsite = () => {
    if (hospital.website) {
      window.open(hospital.website, "_blank");
    }
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border border-gray-100">
      <div className="flex">
        <div className="w-64 h-48 flex-shrink-0">
          <img
            src={getRandomHospitalImage()}
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{hospital.name}</h3>
              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <p className="text-sm">{hospital.address}</p>
              </div>
              {hospital.types && (
                <p className="text-sm text-gray-500 mb-4">{hospital.types}</p>
              )}
            </div>
            {hospital.rating !== "N/A" && (
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-700">{hospital.rating}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={openGoogleMaps}
            >
              <MapPin className="h-3 w-3" />
              Map
            </Button>
            {hospital.phone && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleCall}
              >
                <Phone className="h-3 w-3" />
                Call
              </Button>
            )}
            {hospital.website && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={openWebsite}
              >
                <ExternalLink className="h-3 w-3" />
                Visit
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HospitalCard;
