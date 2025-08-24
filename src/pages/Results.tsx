import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Results.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons
const targetIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -34],
  shadowSize: [32, 32],
  className: 'target-marker'
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-marker'
});

const lastPressedIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [57, 57],
  className: 'last-pressed-marker'
});

interface Response {
  id: string;
  name: string;
  lat_1: number;
  lon_1: number;
  lat_2: number;
  lon_2: number;
  notes: string;
  timestamp: number;
}

interface RankingEntry {
  name: string;
  distance: number;
  coordinates: { lat: number; lng: number };
}

interface LocationInfo {
  city?: string;
  country?: string;
  displayName?: string;
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<{ [key: string]: { lat: number; lng: number } }>({});
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(new Set());
  const [lastPressedId, setLastPressedId] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ [key: string]: LocationInfo }>({});
  const [locationType, setLocationType] = useState<'first' | 'second'>('first');

  const TARGET_LAT = 39.1508;
  const TARGET_LNG = 9.3990;

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const respostesRef = ref(database, 'respostes');
      const snapshot = await get(respostesRef);
      
      if (snapshot.exists()) {
        const responsesData = snapshot.val();
        const responsesArray: Response[] = Object.entries(responsesData).map(([id, data]) => {
          const responseData = data as Response;
          return {
            id,
            name: responseData.name,
            lat_1: responseData.lat_1,
            lon_1: responseData.lon_1,
            lat_2: responseData.lat_2,
            lon_2: responseData.lon_2,
            notes: responseData.notes,
            timestamp: responseData.timestamp
          };
        });
        setResponses(responsesArray);
      } else {
        setResponses([]);
      }
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError('Error al carregar les respostes');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchLocationInfo = async (lat: number, lng: number, id: string) => {
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
      
      setLocationInfo(prev => ({ ...prev, [id]: location }));
    } catch (error) {
      console.error('Error fetching location info:', error);
    }
  };

  const handleButtonClick = (response: Response) => {
    const coordinates = locationType === 'first' 
      ? { lat: response.lat_1, lng: response.lon_1 }
      : { lat: response.lat_2, lng: response.lon_2 };
    
    console.log('Adding marker for:', response.name, 'at:', coordinates);
    setSelectedMarkers(prev => ({ ...prev, [response.id]: coordinates }));
    setLastPressedId(response.id);
    
    // Fetch location info for the popup
    fetchLocationInfo(coordinates.lat, coordinates.lng, response.id);
    
    const distance = calculateDistance(coordinates.lat, coordinates.lng, TARGET_LAT, TARGET_LNG);
    const newEntry: RankingEntry = {
      name: response.name,
      distance,
      coordinates
    };
    
    setRanking(prev => {
      const updated = [...prev, newEntry];
      return updated.sort((a, b) => a.distance - b.distance);
    });
    
    setDisabledButtons(prev => new Set([...prev, response.id]));
  };

  const handleAllButtonClick = () => {
    const allMarkers: { [key: string]: { lat: number; lng: number } } = {};
    const allEntries: RankingEntry[] = [];
    
    responses.forEach(response => {
      const coordinates = locationType === 'first' 
        ? { lat: response.lat_1, lng: response.lon_1 }
        : { lat: response.lat_2, lng: response.lon_2 };
      
      allMarkers[response.id] = coordinates;
      
      // Fetch location info for each response
      fetchLocationInfo(coordinates.lat, coordinates.lng, response.id);
      
      const distance = calculateDistance(coordinates.lat, coordinates.lng, TARGET_LAT, TARGET_LNG);
      allEntries.push({
        name: response.name,
        distance,
        coordinates
      });
    });
    
    setSelectedMarkers(allMarkers);
    setRanking(allEntries.sort((a, b) => a.distance - b.distance));
    setDisabledButtons(new Set(responses.map(r => r.id)));
    setLastPressedId('all'); // Special ID for "all" button
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLocationTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value as 'first' | 'second';
    setLocationType(newType);
    // Clear current markers and ranking when switching types
    setSelectedMarkers({});
    setRanking([]);
    setDisabledButtons(new Set());
    setLastPressedId(null);
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Carregant resultats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>🗺️ Resultats del Viatge Sorpresa</h1>
        <div className="header-controls">
          <select 
            className="location-type-dropdown"
            value={locationType}
            onChange={handleLocationTypeChange}
          >
            <option value="first">On creus que anem?</option>
            <option value="second">On vols anar?</option>
          </select>
          <button className="back-button" onClick={handleBack}>
            ← Tornar
          </button>
        </div>
      </div>

      <div className="results-content">
        <div className="map-section">
          <div className="map-wrapper">
            <MapContainer
              center={[TARGET_LAT, TARGET_LNG]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              className="results-map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Target marker (Sardinia) */}
              <Marker 
                position={[TARGET_LAT, TARGET_LNG]}
                icon={targetIcon}
              />
              
              {/* Selected markers */}
              {Object.entries(selectedMarkers).map(([id, coords]) => {
                console.log('Rendering marker for ID:', id, 'at:', coords);
                const response = responses.find(r => r.id === id);
                const location = locationInfo[id];
                return (
                  <Marker 
                    key={id}
                    position={[coords.lat, coords.lng]}
                    icon={id === lastPressedId ? lastPressedIcon : userIcon}
                  >
                    <Popup>
                      <div className="marker-popup">
                        <strong>{response?.name}</strong>
                        <br />
                        <small>
                          📍 {location?.city && location?.country 
                            ? `${location.city}, ${location.country}`
                            : location?.displayName || 'Carregant ubicació...'
                          }
                        </small>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          <div className="buttons-section">
            <button 
              className={`all-button ${disabledButtons.size === responses.length ? 'disabled' : ''}`}
              onClick={handleAllButtonClick}
              disabled={disabledButtons.size === responses.length}
            >
              🎯 Tots ({responses.length})
            </button>
            
            <div className="user-buttons">
              {responses.map(response => (
                <button
                  key={response.id}
                  className={`user-button ${disabledButtons.has(response.id) ? 'disabled' : ''}`}
                  onClick={() => handleButtonClick(response)}
                  disabled={disabledButtons.has(response.id)}
                >
                  {response.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ranking-section">
          <h2>🏆 Ranking de Distàncies</h2>
          <p className="target-info">Objectiu: Sardenya</p>
          
          {ranking.length === 0 ? (
            <p className="no-ranking">Fes clic en els botons per veure el ranking</p>
          ) : (
            <div className="ranking-list">
              {ranking.map((entry, index) => {
                const response = responses.find(r => r.name === entry.name);
                const location = response ? locationInfo[response.id] : null;
                return (
                  <div key={index} className="ranking-entry">
                    <div className="ranking-position">#{index + 1}</div>
                    <div className="ranking-info">
                      <div className="ranking-name">{entry.name}</div>
                      <div className="ranking-location">
                        📍 {location?.city && location?.country 
                          ? `${location.city}, ${location.country}`
                          : location?.displayName || 'Carregant...'
                        }
                      </div>
                    </div>
                    <div className="ranking-distance">{entry.distance.toFixed(1)} km</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
