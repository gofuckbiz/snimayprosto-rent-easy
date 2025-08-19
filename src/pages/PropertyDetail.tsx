import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProperty, BACKEND_URL } from "@/lib/api";
import { Property } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatModal from "@/components/ChatModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail, 
  Heart,
  Calendar,
  Star,
  Home,
  Edit,
  Trash2,
  MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import AuthForm from "@/components/AuthForm";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [chatOpen, setChatOpen] = useState(false);
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id!),
    enabled: !!id,
  });

  const handleImageError = (imageIndex: number) => {
    setImageError(prev => ({ ...prev, [imageIndex]: true }));
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('/uploads')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  const openChat = () => {
    if (!property) return;
    
    // Check if user is authenticated
    if (!user) {
      setIsAuthFormOpen(true);
      return;
    }

    setChatOpen(true);
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="h-96 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Объявление не найдено</h2>
            <p className="text-muted-foreground mb-6">
              {error instanceof Error ? error.message : "Произошла ошибка при загрузке объявления"}
            </p>
            <Button onClick={() => navigate("/properties")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к списку
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amenities = property.amenities ? property.amenities.split(',') : [];
  const hasImages = property.images && property.images.length > 0;
  const propertyImage = hasImages ? getImageUrl(property.images[0].url) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/properties")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          К списку квартир
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Title and Price */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{property.address}</span>
                {property.city && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{property.city}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right ml-6">
              <div className="text-3xl font-bold text-primary">
                {property.price.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-muted-foreground">
                {property.priceType === 'month' ? 'в месяц' : 'за период'}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {property.isUrgent && (
              <Badge variant="destructive">Срочно</Badge>
            )}
            <Badge variant="secondary">
              {property.propertyType === 'apartment' ? 'Квартира' : 'Студия'}
            </Badge>
            <Badge variant="outline">
              {property.rooms === 0 ? 'Студия' : `${property.rooms} комн.`}
            </Badge>
            {property.area > 0 && (
              <Badge variant="outline">{property.area} м²</Badge>
            )}
          </div>
        </div>

        {/* Images */}
        {hasImages && (
          <div className="mb-8">
            <div className="relative">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {!imageError[currentImageIndex] ? (
                  <img
                    src={getImageUrl(property.images[currentImageIndex].url)}
                    alt={`${property.title} - фото ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(currentImageIndex)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Image Navigation */}
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {!imageError[index] ? (
                      <img
                        src={getImageUrl(image.url)}
                        alt={`${property.title} - миниатюра ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Home className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Описание</h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-foreground">
                  {property.description || "Описание не указано"}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Удобства</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">{amenity.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
              <div className="space-y-3">
                {property.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{property.phone}</span>
                  </div>
                )}
                {property.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{property.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Детали недвижимости</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Тип</span>
                  <span className="font-medium">
                    {property.propertyType === 'apartment' ? 'Квартира' : 'Студия'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Комнаты</span>
                  <span className="font-medium">
                    {property.rooms === 0 ? 'Студия' : `${property.rooms} комн.`}
                  </span>
                </div>
                <Separator />
                {property.area > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Площадь</span>
                      <span className="font-medium">{property.area} м²</span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Дата публикации</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {/* Show different content based on user role and ownership */}
              {user && user.id === property.ownerId ? (
                // Property owner - show edit/delete options
                <div className="space-y-3">
                  <Button className="w-full" size="lg" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать объявление
                  </Button>
                  <Button className="w-full" size="lg" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить объявление
                  </Button>
                </div>
              ) : (
                // Buyer or not logged in - show chat button
                <Button className="w-full" size="lg" onClick={openChat}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {user ? 'Написать продавцу' : 'Войти для чата'}
                </Button>
              )}
              
              {property.phone && (
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <a href={`tel:${property.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Позвонить
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <ChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          propertyPrice={property.price}
          propertyImage={propertyImage}
          currentUserId={user?.id || 0}
        />
      )}

      {/* Auth Form */}
      <AuthForm 
        isOpen={isAuthFormOpen} 
        onClose={() => setIsAuthFormOpen(false)} 
      />

      <Footer />
    </div>
  );
};

export default PropertyDetail;


