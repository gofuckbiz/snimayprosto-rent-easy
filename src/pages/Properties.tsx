import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import { useQuery } from "@tanstack/react-query";
import { listProperties, BACKEND_URL } from "@/lib/api";
import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  title: string;
  price: number;
  address: string;
  rooms: number;
  area?: number;
  images?: Array<{ url: string; order: number }>;
  isPromoted?: boolean;
};

const PropertiesPage = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const city = params.get("city") || undefined;
  const isRoomsPage = location.pathname === "/rooms";

  // Trigger animation when route changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const { data, isLoading } = useQuery({
    queryKey: ["properties", { city }],
    queryFn: () => listProperties({ city }) as Promise<{ items: Item[] }>,
  });

  const items = data?.items || [];

  const getImageUrl = (item: Item) => {
    if (item.images && item.images.length > 0) {
      
      const sortedImages = [...item.images].sort((a, b) => a.order - b.order);
      const imageUrl = sortedImages[0].url;
      
      // If the URL starts with /uploads, prepend the backend URL
      if (imageUrl.startsWith('/uploads')) {
        return `${BACKEND_URL}${imageUrl}`;
      }
      
      return imageUrl;
    }
    return ""; // Return empty string to trigger fallback
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FilterBar />
      <section className={`py-12 bg-background transition-all duration-500 ${
        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}>
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {isRoomsPage 
                  ? (city ? `Комнаты — ${city}` : "Все комнаты")
                  : (city ? `Квартиры — ${city}` : "Все квартиры")
                }
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? "Загрузка..." : `Найдено ${items.length} ${isRoomsPage ? 'комнат' : 'квартир'}`}
              </p>
            </div>
          </div>

          {!isLoading && items.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-muted-foreground text-lg">
                {isRoomsPage ? 'Комнаты не найдены' : 'Объявления не найдены'}
              </p>
              <p className="text-muted-foreground">Попробуйте изменить фильтры или создать новое объявление</p>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            {!isLoading && items.map((p) => (
              <PropertyCard
                key={p.id}
                id={String(p.id)}
                title={p.title}
                price={p.price || 0}
                address={p.address || ""}
                bedrooms={p.rooms || 0}
                bathrooms={1}
                area={p.area || 0}
                imageUrl={getImageUrl(p)}
                isPromoted={p.isPromoted}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PropertiesPage;


