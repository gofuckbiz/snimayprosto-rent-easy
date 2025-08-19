import { Button } from "@/components/ui/button";
import { Search, Heart, User, Menu, MessageCircle } from "lucide-react";
import { useState } from "react";
import AuthForm from "./AuthForm";
import CreateListingForm from "./CreateListingForm";
import MessagesModal from "./MessagesModal";
import { useAuth } from "@/lib/auth-context";
import ProfileWidget from "./ProfileWidget";
import { Link } from "react-router-dom";

const Header = () => {
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const { user, loading } = useAuth();

  // Debug logging
  console.log("Header - User:", user);
  console.log("Header - User role:", user?.role);
  console.log("Header - Should show landlord button:", user && user.role === 'landlord');

  return (
    <>
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 animate-slide-down shadow-subtle">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-spring cursor-pointer">
            СнятьПросто
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/properties" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 relative group font-medium"
            >
              <span className="relative">
                Квартиры
                <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left rounded-full"></span>
              </span>
            </Link>
            {user && user.role === 'landlord' && (
              <Link 
                to="/my-listings" 
                className="text-foreground/80 hover:text-primary transition-all duration-300 relative group font-medium"
              >
                <span className="relative">
                  Мои объявления
                  <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left rounded-full"></span>
                </span>
              </Link>
            )}
            <Link 
              to="/rooms" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 relative group font-medium"
            >
              <span className="relative">
                Комнаты
                <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left rounded-full"></span>
              </span>
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 relative group font-medium"
            >
              <span className="relative">
                Как это работает
                <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left rounded-full"></span>
              </span>
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 relative group font-medium"
            >
              <span className="relative">
                Тарифы
                <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left rounded-full"></span>
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="lg" className="hidden md:flex hover:scale-105 transition-spring hover:bg-primary/10 rounded-xl">
            <Heart className="h-4 w-4 mr-2" />
            Избранное
          </Button>
          
          {/* Show Messages button for landlords */}
          {user && user.role === 'landlord' && (
            <Button 
              variant="ghost" 
              size="lg" 
              className="hidden md:flex hover:scale-105 transition-spring hover:bg-primary/10 rounded-xl"
              onClick={() => setIsMessagesOpen(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Сообщения
            </Button>
          )}
          
          {loading ? null : user ? (
            <div className="animate-in fade-in-0 duration-200">
              <ProfileWidget />
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="lg" 
              className="hover:scale-105 transition-spring hover:shadow-subtle rounded-xl border-2"
              onClick={() => setIsAuthFormOpen(true)}
            >
              <User className="h-4 w-4 mr-2" />
              Войти
            </Button>
          )}
          
          {/* Show "Разместить объявление" only for landlords */}
          {user && user.role === 'landlord' && (
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring rounded-xl font-semibold"
              onClick={() => setIsCreateListingOpen(true)}
            >
              Разместить объявление
            </Button>
          )}

          <Button variant="ghost" size="lg" className="md:hidden hover:scale-105 transition-spring rounded-xl">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </header>
      
      <AuthForm 
        isOpen={isAuthFormOpen} 
        onClose={() => setIsAuthFormOpen(false)} 
      />
      
      <CreateListingForm 
        isOpen={isCreateListingOpen} 
        onClose={() => setIsCreateListingOpen(false)} 
      />
      
      <MessagesModal 
        isOpen={isMessagesOpen} 
        onClose={() => setIsMessagesOpen(false)} 
      />
    </>
  );  
};

export default Header;