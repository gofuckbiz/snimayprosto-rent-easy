import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Flame, 
  Eye, 
  Calendar,
  TrendingUp,
  Crown,
  Star,
  Home,
  MapPin,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyPlan, getMyListings, BACKEND_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import PlanUpgradeModal from "./PlanUpgradeModal";
import PromoteModal from "./PromoteModal";
import CreateListingForm from "./CreateListingForm";

interface PropertyWithPromotion {
  id: number;
  title: string;
  price: number;
  address: string;
  rooms: number;
  area: number;
  createdAt: string;
  images: Array<{ url: string; order: number }>;
  isPromoted: boolean;
  promotionExpiresAt?: string;
}

const MyListingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState<string>("");

  const { data: planData, refetch: refetchPlan } = useQuery({
    queryKey: ['myPlan'],
    queryFn: getMyPlan,
    enabled: !!user,
  });

  const { data: listingsData, refetch: refetchListings } = useQuery({
    queryKey: ['myListings'],
    queryFn: getMyListings,
    enabled: !!user,
  });

  const listings = (listingsData as any)?.items || [];
  const plan = planData?.plan;
  const activeListings = planData?.activeListings || 0;
  const canCreateMore = planData?.canCreateMore || false;

  const getPlanDisplayName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Базовый';
      case 'premium': return 'Премиум';
      case 'unlimited': return 'Безлимит';
      default: return planType;
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'free': return <Star className="h-4 w-4" />;
      case 'premium': return <TrendingUp className="h-4 w-4" />;
      case 'unlimited': return <Crown className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('/uploads')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  const handlePromote = (propertyId: number, propertyTitle: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedPropertyTitle(propertyTitle);
    setPromoteModalOpen(true);
  };

  const handleCreateListing = () => {
    if (!canCreateMore) {
      setUpgradeModalOpen(true);
      return;
    }
    setCreateListingOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="text-muted-foreground">Войдите в аккаунт, чтобы управлять объявлениями</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Мои объявления</h1>
            <p className="text-muted-foreground">Управляйте своими объявлениями и тарифным планом</p>
          </div>
          <Button
            onClick={handleCreateListing}
            className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать объявление
          </Button>
        </div>

        {/* Plan Status */}
        {plan && (
          <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getPlanIcon(plan.planType)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Тарифный план: {getPlanDisplayName(plan.planType)}
                    </CardTitle>
                    <CardDescription>
                      {activeListings} из {plan.maxListings === 999999 ? '∞' : plan.maxListings} объявлений
                    </CardDescription>
                  </div>
                </div>
                
                <div className="text-right">
                  {plan.planType !== 'unlimited' && (
                    <Button
                      onClick={() => setUpgradeModalOpen(true)}
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Улучшить план
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Использовано объявлений</span>
                  <span>{activeListings}/{plan.maxListings === 999999 ? '∞' : plan.maxListings}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: plan.maxListings === 999999 
                        ? '100%' 
                        : `${Math.min((activeListings / plan.maxListings) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: PropertyWithPromotion) => {
            const hasImages = listing.images && listing.images.length > 0;
            const imageUrl = hasImages ? getImageUrl(listing.images[0].url) : null;
            
            return (
              <Card 
                key={listing.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  listing.isPromoted 
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-lg' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Promoted Badge */}
                {listing.isPromoted && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold animate-pulse-glow">
                      🔥 Продвинуто
                    </Badge>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{listing.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {listing.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {listing.rooms === 0 ? 'Студия' : `${listing.rooms} комн.`}
                    </div>
                  </div>

                  {/* Promotion Status */}
                  {listing.isPromoted && listing.promotionExpiresAt && (
                    <div className="mb-4 p-2 bg-orange-100 rounded-lg">
                      <div className="flex items-center text-orange-800 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Продвижение до {new Date(listing.promotionExpiresAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Редактировать
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Просмотры
                      </Button>
                    </div>
                    
                    {!listing.isPromoted && (
                      <Button
                        onClick={() => handlePromote(listing.id, listing.title)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-lg transition-all"
                        size="sm"
                      >
                        <Flame className="h-3 w-3 mr-1" />
                        Продвинуть в топ
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Удалить
                    </Button>
                  </div>

                  {/* Created Date */}
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Создано {new Date(listing.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {listings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">У вас пока нет объявлений</h2>
            <p className="text-muted-foreground mb-6">Создайте первое объявление, чтобы начать сдавать недвижимость</p>
            <Button
              onClick={handleCreateListing}
              className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать первое объявление
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <PlanUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={plan?.planType || 'free'}
        activeListings={activeListings}
        onUpgradeSuccess={() => {
          refetchPlan();
          toast({
            title: "План обновлен",
            description: "Теперь вы можете создавать больше объявлений",
          });
        }}
      />

      <PromoteModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        propertyId={selectedPropertyId || 0}
        propertyTitle={selectedPropertyTitle}
        onPromoteSuccess={() => {
          refetchListings();
          toast({
            title: "Объявление продвинуто",
            description: "Ваше объявление теперь показывается первым",
          });
        }}
      />

      <CreateListingForm
        isOpen={createListingOpen}
        onClose={() => setCreateListingOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default MyListingsPage;