import { Button } from "@/components/ui/button";
import { Search, Heart, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-foreground hover:scale-105 transition-spring cursor-pointer">
            СнятьПросто
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-spring relative group">
              <span className="relative">
                Квартиры
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-spring relative group">
              <span className="relative">
                Комнаты
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-spring relative group">
              <span className="relative">
                Как это работает
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex hover:scale-105 transition-spring">
            <Heart className="h-4 w-4 mr-2" />
            Избранное
          </Button>
          
          <Button variant="outline" size="sm" className="hover:scale-105 transition-spring hover:shadow-subtle">
            <User className="h-4 w-4 mr-2" />
            Войти
          </Button>
          
          <Button variant="default" size="sm" className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring">
            Разместить объявление
          </Button>

          <Button variant="ghost" size="sm" className="md:hidden hover:scale-105 transition-spring">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;