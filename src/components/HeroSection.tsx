import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-apartment.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Современные квартиры для аренды" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Найти квартиру
          <br />
          <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
            стало просто
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
          Тысячи проверенных квартир от собственников. Без комиссии и переплат.
        </p>

        {/* Search form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-4xl mx-auto shadow-elegant border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Город или район" 
                className="pl-10 bg-white border-0 text-foreground"
              />
            </div>
            
            <Select>
              <SelectTrigger className="bg-white border-0 text-foreground">
                <SelectValue placeholder="Тип жилья" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="room">Комната</SelectItem>
                <SelectItem value="studio">Студия</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-white border-0 text-foreground">
                <SelectValue placeholder="Цена" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-30000">До 30 000 ₽</SelectItem>
                <SelectItem value="30000-50000">30 000 - 50 000 ₽</SelectItem>
                <SelectItem value="50000-100000">50 000 - 100 000 ₽</SelectItem>
                <SelectItem value="100000+">Свыше 100 000 ₽</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gradient-primary hover:shadow-elegant text-white h-full">
              <Search className="h-4 w-4 mr-2" />
              Найти
            </Button>
          </div>
          
          <div className="text-white/80 text-sm">
            Найдено более <span className="font-semibold text-white">10,000</span> объявлений
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;