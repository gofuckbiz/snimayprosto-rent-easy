import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api";

const HeroSection = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/90 to-primary/20"></div>
        
        {/* Animated geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/15 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-float animation-delay-400"></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-slide-down">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span className="text-sm font-medium">Новая платформа для аренды</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight animate-scale-in">
          <span className="block mb-2">Найти квартиру</span>
          <br />
          <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent animate-shimmer">
            стало просто
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
          Тысячи проверенных квартир от собственников.
          <br className="hidden md:block" />
          <span className="text-white/70">Без комиссии и переплат.</span>
        </p>

        {/* Enhanced search form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-5xl mx-auto shadow-elegant border border-white/30 animate-scale-in animation-delay-400 hover:shadow-glow transition-spring">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-hover:text-primary transition-smooth" />
              <Input 
                placeholder="Город или район" 
                className="pl-12 h-12 bg-white border-0 text-foreground hover:shadow-subtle transition-spring focus:scale-105 rounded-xl text-lg"
              />
            </div>
            
            <Select>
              <SelectTrigger className="h-12 bg-white border-0 text-foreground hover:shadow-subtle transition-spring focus:scale-105 rounded-xl text-lg">
                <SelectValue placeholder="Тип жилья" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="room">Комната</SelectItem>
                <SelectItem value="studio">Студия</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 bg-white border-0 text-foreground hover:shadow-subtle transition-spring focus:scale-105 rounded-xl text-lg">
                <SelectValue placeholder="Цена" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-30000">До 30 000 ₽</SelectItem>
                <SelectItem value="30000-50000">30 000 - 50 000 ₽</SelectItem>
                <SelectItem value="50000-100000">50 000 - 100 000 ₽</SelectItem>
                <SelectItem value="100000+">Свыше 100 000 ₽</SelectItem>
              </SelectContent>
            </Select>

            <Button className="h-12 bg-gradient-primary hover:shadow-elegant text-primary-foreground hover:scale-105 transition-spring rounded-xl text-lg font-semibold">
              <Search className="h-5 w-5 mr-3" />
              <span>Найти</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-foreground/70 text-base">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Найдено более <span className="font-bold text-foreground">
                {stats?.properties ? stats.properties.toLocaleString() : "10,000"}
              </span> объявлений</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-foreground">
                {stats?.satisfaction || 95}% довольных клиентов
              </span>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60 animate-fade-in animation-delay-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Проверенные объявления</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-100"></div>
            <span className="text-sm">Безопасные сделки</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
            <span className="text-sm">Поддержка {stats?.support || "24/7"}</span>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 animate-fade-in animation-delay-400">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="border-white/30 text-white hover:bg-white hover:text-foreground transition-spring hover:scale-105 backdrop-blur-sm bg-white/10"
            >
              <Link to="/how-it-works">
                Узнать, как это работает
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              asChild 
              className="bg-white text-foreground hover:bg-white/90 transition-spring hover:scale-105 shadow-elegant"
            >
              <Link to="/properties">
                Смотреть квартиры
                <Search className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <p className="mt-6 text-white/60 text-sm">
            Более <span className="font-semibold text-white">
              {stats?.properties ? stats.properties.toLocaleString() : "10,000"}
            </span> активных объявлений от проверенных арендодателей
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;