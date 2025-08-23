import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './ClickableMap.css';

interface LocationInfo {
  city?: string;
  country?: string;
  displayName?: string;
}

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ClickableMapProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
  stepNumber: number;
  onUserSelectionChange?: (hasUserSelected: boolean) => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  onUserClick: () => void;
}> = ({ onLocationSelect, onUserClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
      onUserClick();
    },
  });
  return null;
};

const ClickableMap: React.FC<ClickableMapProps> = ({ 
  onLocationSelect, 
  selectedLocation, 
  stepNumber,
  onUserSelectionChange
}) => {
  const [mapKey, setMapKey] = useState(0);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  // Set default location to Barcelona if no location is selected
  useEffect(() => {
    if (!selectedLocation) {
      const barcelonaLocation = { lat: 41.3851, lng: 2.1734 };
      onLocationSelect(barcelonaLocation);
      setHasUserSelected(false);
      onUserSelectionChange?.(false);
    }
  }, [selectedLocation, onLocationSelect, onUserSelectionChange]);

  // Force map re-render when step changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [stepNumber]);

  // Fetch location info when coordinates change
  useEffect(() => {
    if (selectedLocation) {
      fetchLocationInfo(selectedLocation.lat, selectedLocation.lng);
    } else {
      setLocationInfo(null);
    }
  }, [selectedLocation]);

  const fetchLocationInfo = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=ca`
      );
      const data = await response.json();
      
      const location: LocationInfo = {
        city: data.address?.city || data.address?.town || data.address?.village || data.address?.municipality,
        country: data.address?.country,
        displayName: data.display_name
      };
      
      setLocationInfo(location);
    } catch (error) {
      console.error('Error fetching location info:', error);
      setLocationInfo(null);
    }
  };

  return (
    <div className="map-container">
      {selectedLocation && locationInfo && (
        <p className="selected-location">
          📍 {locationInfo.city && locationInfo.country 
            ? `${locationInfo.city}, ${locationInfo.country}`
            : locationInfo.displayName || 'Ubicació desconeguda'
          }
        </p>
      )}
      
      <div className="map-wrapper">
        <MapContainer
          key={mapKey}
          center={[45.0, 10.0]} // Center of Europe
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          className="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler 
            onLocationSelect={onLocationSelect} 
            onUserClick={() => {
              setHasUserSelected(true);
              onUserSelectionChange?.(true);
            }}
          />
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ClickableMap;
