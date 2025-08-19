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
    <div className="group bg-gradient-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-spring cursor-pointer border border-border/30 hover:scale-105 animate-fade-in hover-lift">
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
              className={`w-full h-52 object-cover group-hover:scale-110 transition-spring duration-700 ${
                imageLoading ? 'hidden' : ''
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </>
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Home className="h-16 w-16 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Фото недоступно</p>
              {imageUrl && (
                <p className="text-xs mt-1 opacity-75">URL: {imageUrl}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isNew && (
            <Badge className="bg-gradient-primary text-primary-foreground font-semibold shadow-lg backdrop-blur-sm">
              Новое
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-spring shadow-lg ${
            isFavorite ? 'text-red-500' : 'text-muted-foreground'
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current animate-pulse-glow' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-spring line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="font-medium">{bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            <span className="font-medium">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            <span className="font-medium">{area} м²</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-muted-foreground text-base font-medium">/месяц</span>
          </div>
          
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring rounded-xl font-semibold"
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