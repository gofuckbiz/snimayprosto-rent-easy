import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import { useQuery } from "@tanstack/react-query";
import { listProperties, BACKEND_URL } from "@/lib/api";
import { useSearchParams } from "react-router-dom";

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
  const city = params.get("city") || undefined;

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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{city ? `Квартиры — ${city}` : "Все квартиры"}</h2>
              <p className="text-muted-foreground">
                {isLoading ? "Загрузка..." : `Найдено ${items.length} квартир`}
              </p>
            </div>
          </div>

          {!isLoading && items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Объявления не найдены</p>
              <p className="text-muted-foreground">Попробуйте изменить фильтры или создать новое объявление</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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


