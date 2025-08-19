import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}

const MapComponent = ({ onLocationSelect, initialLat, initialLng, initialAddress }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [address, setAddress] = useState(initialAddress || '');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLat, setCurrentLat] = useState(initialLat || 55.7558);
  const [currentLng, setCurrentLng] = useState(initialLng || 37.6176);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([currentLat, currentLng], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add initial marker if coordinates are provided
    if (initialLat && initialLng) {
      const marker = L.marker([initialLat, initialLng]).addTo(map);
      markerRef.current = marker;
    }

    // Handle map click to place marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCurrentLat(lat);
      setCurrentLng(lng);
      
      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      
      // Add new marker
      const marker = L.marker([lat, lng]).addTo(map);
      markerRef.current = marker;
      
      // Reverse geocode to get address
      reverseGeocode(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Geocoding function using Nominatim (OpenStreetMap)
  const geocodeAddress = async (searchAddress: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);
        
        setCurrentLat(latNum);
        setCurrentLng(lngNum);
        
        // Update map view
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latNum, lngNum], 16);
          
          // Remove existing marker
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }
          
          // Add new marker
          const marker = L.marker([latNum, lngNum]).addTo(mapInstanceRef.current);
          markerRef.current = marker;
        }
        
        // Update address with formatted result
        const formattedAddress = data[0].display_name;
        setAddress(formattedAddress);
        
        // Notify parent component
        onLocationSelect(latNum, lngNum, formattedAddress);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data = await response.json();
      const formattedAddress = data.display_name;
      
      setAddress(formattedAddress);
      onLocationSelect(lat, lng, formattedAddress);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleSearch = () => {
    if (address.trim()) {
      geocodeAddress(address.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLat(latitude);
          setCurrentLng(longitude);
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 16);
            
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current);
            }
            
            const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
            markerRef.current = marker;
          }
          
          reverseGeocode(latitude, longitude);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Адрес</label>
        <div className="flex space-x-2">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите адрес..."
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !address.trim()}
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            variant="outline"
            size="sm"
            title="Использовать текущее местоположение"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-border"
          style={{ minHeight: '256px' }}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="text-sm text-muted-foreground">Поиск адреса...</div>
          </div>
        )}
      </div>

      {/* Coordinates Display */}
      <div className="text-xs text-muted-foreground">
        Координаты: {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
      </div>
    </div>
  );
};

export default MapComponent;
