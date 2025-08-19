import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Search, 
  MessageCircle, 
  Shield, 
  Star, 
  Users, 
  Zap, 
  CheckCircle,
  ArrowRight,
  MapPin,
  Camera,
  CreditCard,
  Heart,
  TrendingUp,
  Globe,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStats, Stats } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Counter animation component
const AnimatedCounter = ({ value, suffix = "", duration = 2000 }: { value: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(value * easeOutQuart);
        
        setCount(currentCount);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-foreground mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const HowItWorks = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in', 'fade-in-0', 'slide-in-from-bottom-4');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Умный поиск",
      description: "Найдите идеальное жилье с помощью продвинутых фильтров по району, цене и удобствам"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Точная геолокация",
      description: "Интерактивные карты покажут точное расположение каждого объекта"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Встроенный чат",
      description: "Общайтесь с владельцами напрямую через удобный мессенджер"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Качественные фото",
      description: "Детальные фотографии и виртуальные туры по каждому объекту"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Безопасность",
      description: "Проверенные объявления и защищенные платежи"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Сообщество",
      description: "Отзывы и рейтинги от реальных пользователей"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Регистрация",
      description: "Создайте аккаунт за 30 секунд",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "02",
      title: "Поиск",
      description: "Найдите подходящее жилье",
      icon: <Search className="h-6 w-6" />
    },
    {
      number: "03",
      title: "Связь",
      description: "Напишите владельцу",
      icon: <MessageCircle className="h-6 w-6" />
    },
    {
      number: "04",
      title: "Сделка",
      description: "Договоритесь и снимайте",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const statsData = [
    { 
      value: stats?.properties || 0,
      suffix: "+",
      label: "Объявлений", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      value: stats?.users || 0,
      suffix: "+",
      label: "Пользователей", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      value: stats?.satisfaction || 0,
      suffix: "%",
      label: "Довольных клиентов", 
      icon: <Star className="h-5 w-5" /> 
    },
    { 
      value: 0, // Support is static text
      suffix: "",
      label: "Поддержка", 
      icon: <Zap className="h-5 w-5" />,
      staticText: stats?.support || "24/7"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-foreground/5 via-background to-foreground/3 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center scroll-animate">
            <Badge variant="secondary" className="mb-4 animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Инновационная платформа
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Как работает СнятьПросто
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Мы создали самую удобную платформу для поиска и сдачи недвижимости. 
              Простой интерфейс, умные алгоритмы и безопасные сделки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/properties">
                  Начать поиск
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">
                  Узнать больше
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Home className="h-8 w-8 text-foreground/20" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <Search className="h-6 w-6 text-foreground/15" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-spin-slow">
          <MessageCircle className="h-5 w-5 text-foreground/20" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Мы объединили лучшие технологии и удобство использования для создания идеальной платформы
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="scroll-animate hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border shadow-md">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-foreground/5 rounded-full w-16 h-16 flex items-center justify-center text-foreground">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Всего 4 простых шага
            </h2>
            <p className="text-lg text-muted-foreground">
              От поиска до заселения за несколько минут
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="scroll-animate text-center relative">
                <div className="mb-6 mx-auto p-4 bg-foreground rounded-full w-20 h-20 flex items-center justify-center text-background text-2xl font-bold">
                  {step.number}
                </div>
                <div className="mb-4 mx-auto p-3 bg-background rounded-full w-12 h-12 flex items-center justify-center text-foreground shadow-md border border-border">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 text-muted-foreground">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="scroll-animate text-center">
                <div className="mb-4 mx-auto p-3 bg-foreground/5 rounded-full w-16 h-16 flex items-center justify-center text-foreground">
                  {stat.icon}
                </div>
                {stat.staticText ? (
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.staticText}
                  </div>
                ) : (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                )}
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Преимущества для всех
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-foreground/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Для арендаторов</h3>
                    <p className="text-muted-foreground">Быстрый поиск, проверенные объявления, безопасные сделки</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-foreground/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Для арендодателей</h3>
                    <p className="text-muted-foreground">Простое размещение, широкий охват, быстрые контакты</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-foreground/10 rounded-full">
                    <Globe className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Для рынка</h3>
                    <p className="text-muted-foreground">Прозрачность, конкуренция, развитие рынка</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="scroll-animate">
              <Card className="p-8 shadow-xl border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl mb-2">Технологии будущего</CardTitle>
                  <CardDescription className="text-lg">
                    Мы используем современные технологии для создания лучшего опыта
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-foreground" />
                    <span>Адаптивный дизайн</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-foreground" />
                    <span>Быстрая работа</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-foreground" />
                    <span>Безопасность данных</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-foreground" />
                    <span>Удобный интерфейс</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-foreground to-foreground/80 text-background">
        <div className="container mx-auto px-4 text-center">
          <div className="scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Присоединяйтесь к тысячам довольных пользователей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/properties">
                  Найти жилье
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground" asChild>
                <Link to="/">
                  Разместить объявление
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
