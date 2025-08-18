import { Button } from "@/components/ui/button";
import { Search, Heart, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            СнятьПросто
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Квартиры
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Комнаты
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Как это работает
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Heart className="h-4 w-4 mr-2" />
            Избранное
          </Button>
          
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Войти
          </Button>
          
          <Button variant="default" size="sm" className="bg-gradient-primary hover:shadow-elegant">
            Разместить объявление
          </Button>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;