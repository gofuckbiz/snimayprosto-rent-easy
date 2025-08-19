import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api";
import heroImage from "@/assets/hero-apartment.jpg";

const HeroSection = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/50"></div>
        <div className="absolute inset-0 opacity-50 animate-float">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-scale-in">
          Найти квартиру
          <br />
          <span className="bg-gradient-to-r from-white to-muted bg-clip-text text-transparent">
            стало просто
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto animate-fade-in animation-delay-200">
          Тысячи проверенных квартир от собственников. Без комиссии и переплат.
        </p>

        {/* Search form */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 max-w-4xl mx-auto shadow-elegant border border-white/30 animate-scale-in animation-delay-400 hover:shadow-card transition-spring">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-hover:text-primary transition-smooth" />
              <Input 
                placeholder="Город или район" 
                className="pl-10 bg-white border-0 text-foreground hover:shadow-subtle transition-spring focus:scale-105"
              />
            </div>
            
            <Select>
              <SelectTrigger className="bg-white border-0 text-foreground hover:shadow-subtle transition-spring focus:scale-105">
                <SelectValue placeholder="Тип жилья" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="room">Комната</SelectItem>
                <SelectItem value="studio">Студия</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-white border-0 text-foreground hover:shadow-subtle transition-spring focus:scale-105">
                <SelectValue placeholder="Цена" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-30000">До 30 000 ₽</SelectItem>
                <SelectItem value="30000-50000">30 000 - 50 000 ₽</SelectItem>
                <SelectItem value="50000-100000">50 000 - 100 000 ₽</SelectItem>
                <SelectItem value="100000+">Свыше 100 000 ₽</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gradient-primary hover:shadow-elegant text-primary-foreground h-full hover:scale-105 transition-spring">
              <Search className="h-4 w-4 mr-2" />
              Найти
            </Button>
          </div>
          
          <div className="text-foreground/70 text-sm">
            Найдено более <span className="font-semibold text-foreground">
              {stats?.properties ? stats.properties.toLocaleString() : "10,000"}
            </span> объявлений
          </div>
        </div>
        
        {/* Learn more button */}
        <div className="mt-8 animate-fade-in animation-delay-400">
          <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white hover:text-foreground transition-spring">
            <Link to="/how-it-works">
              Узнать, как это работает
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;