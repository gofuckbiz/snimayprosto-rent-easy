import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  isNew?: boolean;
  isFavorite?: boolean;
}

const PropertyCard = ({ 
  id,
  title, 
  price, 
  address, 
  bedrooms, 
  bathrooms, 
  area, 
  imageUrl,
  isNew = false,
  isFavorite = false 
}: PropertyCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleImageError = () => {
    console.log("Image failed to load:", imageUrl);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleDetailsClick = () => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-spring cursor-pointer border border-border/50 hover:scale-105 animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden">
        {!imageError && imageUrl ? (
          <>
            {imageLoading && (
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Загрузка...</p>
                </div>
              </div>
            )}
            <img 
              src={imageUrl} 
              alt={title}
              className={`w-full h-48 object-cover group-hover:scale-110 transition-spring duration-500 ${
                imageLoading ? 'hidden' : ''
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </>
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Фото</p>
              {imageUrl && (
                <p className="text-xs mt-1 opacity-75">URL: {imageUrl}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <Badge className="bg-primary text-primary-foreground font-medium">
              Новое
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 w-8 h-8 p-0 bg-white/90 hover:bg-white hover:scale-110 transition-spring ${
            isFavorite ? 'text-red-500' : 'text-muted-foreground'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current animate-scale-in' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-spring line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{address}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3 w-3" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-3 w-3" />
            <span>{area} м²</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-muted-foreground text-sm">/месяц</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-spring"
            onClick={handleDetailsClick}
          >
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;