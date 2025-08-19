import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-background py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full blur-2xl animate-float animation-delay-300"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="text-3xl font-bold mb-6 text-white">
              СнятьПросто
            </div>
            <p className="text-background/80 mb-8 leading-relaxed text-lg">
              Современная платформа для аренды квартир. Находите идеальное жильё быстро и безопасно.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-background/80">
                <MapPin className="h-5 w-5" />
                <span className="text-base">Москва, Россия</span>
              </div>
              <div className="flex items-center space-x-3 text-background/80">
                <Phone className="h-5 w-5" />
                <span className="text-base">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3 text-background/80">
                <Mail className="h-5 w-5" />
                <span className="text-base">info@snyatprosto.ru</span>
              </div>
            </div>
          </div>

          {/* For Tenants */}
          <div>
            <h3 className="font-bold mb-6 text-background text-lg">Арендаторам</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Поиск квартир</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Как снять квартиру</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Проверка документов</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Помощь и поддержка</a></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h3 className="font-bold mb-6 text-background text-lg">Арендодателям</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Разместить объявление</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Управление объявлениями</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Аналитика</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Тарифы</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-6 text-background text-lg">Компания</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">О нас</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Вакансии</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Пресс-центр</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-spring hover:translate-x-1 inline-block">Партнёрам</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/60 text-base">
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

import { Home, Sparkles } from "lucide-react";

export default Footer;