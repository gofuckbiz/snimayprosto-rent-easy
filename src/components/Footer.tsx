import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              СнятьПросто
            </div>
            <p className="text-background/80 mb-6">
              Современная платформа для аренды квартир. Находите идеальное жильё быстро и безопасно.
            </p>
            <div className="flex items-center space-x-2 text-background/80 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Москва, Россия</span>
            </div>
            <div className="flex items-center space-x-2 text-background/80 mb-2">
              <Phone className="h-4 w-4" />
              <span>+7 (495) 123-45-67</span>
            </div>
            <div className="flex items-center space-x-2 text-background/80">
              <Mail className="h-4 w-4" />
              <span>info@snyatprosto.ru</span>
            </div>
          </div>

          {/* For Tenants */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Арендаторам</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Поиск квартир</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Как снять квартиру</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Проверка документов</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Помощь и поддержка</a></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Арендодателям</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Разместить объявление</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Управление объявлениями</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Аналитика</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Тарифы</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-background">Компания</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">О нас</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Вакансии</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Пресс-центр</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Партнёрам</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/60 text-sm">
            © 2024 СнятьПросто. Все права защищены.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
              Пользовательское соглашение
            </a>
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;