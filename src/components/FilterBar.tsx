import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const FilterBar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentCity = searchParams.get("city");

  const activeFilters = [
    ...(currentCity ? [`Город: ${currentCity}`] : []),
    "1-2 комнаты",
    "До 50,000 ₽",
    "Центральный район"
  ];

  const handleCityChange = (city: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (city === "all") {
      newParams.delete("city");
    } else {
      newParams.set("city", city);
    }
    navigate(`?${newParams.toString()}`);
  };

  const clearCityFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("city");
    navigate(`?${newParams.toString()}`);
  };

  return (
    <div className="bg-background/95 backdrop-blur-md border-b border-border sticky top-16 z-40 py-4 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={currentCity || "all"} onValueChange={handleCityChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Город" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                <SelectItem value="Москва">Москва</SelectItem>
                <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                <SelectItem value="Казань">Казань</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Тип жилья" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="room">Комната</SelectItem>
                <SelectItem value="studio">Студия</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Количество комнат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Студия</SelectItem>
                <SelectItem value="1">1 комната</SelectItem>
                <SelectItem value="2">2 комнаты</SelectItem>
                <SelectItem value="3">3 комнаты</SelectItem>
                <SelectItem value="4+">4+ комнат</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Цена" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-30000">До 30,000 ₽</SelectItem>
                <SelectItem value="30000-50000">30,000 - 50,000 ₽</SelectItem>
                <SelectItem value="50000-100000">50,000 - 100,000 ₽</SelectItem>
                <SelectItem value="100000+">100,000+ ₽</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-spring">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Все фильтры
            </Button>
          </div>

          {/* Sort */}
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="price-low">Сначала дешевые</SelectItem>
              <SelectItem value="price-high">Сначала дорогие</SelectItem>
              <SelectItem value="area">По площади</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center mt-4">
            <span className="text-sm text-muted-foreground">Активные фильтры:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 hover:scale-105 transition-spring">
                {filter}
                {filter.startsWith("Город:") ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent hover:scale-110 transition-spring"
                    onClick={clearCityFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0 hover:bg-transparent hover:scale-110 transition-spring">
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:scale-105 transition-spring">
              Очистить все
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;