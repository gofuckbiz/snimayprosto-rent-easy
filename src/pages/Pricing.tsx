import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  Star, 
  Zap, 
  Crown,
  CreditCard,
  Shield,
  TrendingUp,
  Flame,
  Users,
  BarChart3,
  Headphones
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import AuthForm from "@/components/AuthForm";
import PlanUpgradeModal from "@/components/PlanUpgradeModal";
import { useQuery } from "@tanstack/react-query";
import { getMyPlan } from "@/lib/api";

const PricingPage = () => {
  const { user } = useAuth();
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'unlimited' | null>(null);

  const { data: planData } = useQuery({
    queryKey: ['myPlan'],
    queryFn: getMyPlan,
    enabled: !!user,
  });

  const currentPlan = planData?.plan?.planType || 'free';
  const activeListings = planData?.activeListings || 0;

  const plans = [
    {
      id: 'free' as const,
      name: 'Базовый',
      price: 0,
      period: 'бесплатно',
      listings: 3,
      icon: <Star className="h-8 w-8" />,
      features: [
        'До 3 объявлений',
        'Базовая поддержка',
        'Стандартное размещение',
        'Основные фильтры поиска'
      ],
      color: 'from-gray-100 to-gray-200',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      current: currentPlan === 'free',
      popular: false
    },
    {
      id: 'premium' as const,
      name: 'Премиум',
      price: 500,
      period: 'в месяц',
      listings: 10,
      icon: <Zap className="h-8 w-8" />,
      features: [
        'До 10 объявлений',
        'Приоритетная поддержка',
        'Расширенная статистика',
        'Скидка 50% на продвижение',
        'Выделение в поиске'
      ],
      color: 'from-blue-100 to-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      current: currentPlan === 'premium',
      popular: true
    },
    {
      id: 'unlimited' as const,
      name: 'Безлимит',
      price: 2000,
      period: 'в месяц',
      listings: 999999,
      icon: <Crown className="h-8 w-8" />,
      features: [
        'Неограниченные объявления',
        'VIP поддержка 24/7',
        'Детальная аналитика',
        'Бесплатное продвижение',
        'Персональный менеджер',
        'Приоритет в поиске'
      ],
      color: 'from-purple-100 to-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      current: currentPlan === 'unlimited',
      popular: false
    }
  ];

  const promotionFeatures = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Приоритет в поиске",
      description: "Ваше объявление всегда показывается первым"
    },
    {
      icon: <Flame className="h-6 w-6" />,
      title: "Яркое выделение",
      description: "Специальный значок 🔥 и выделенный фон"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Больше просмотров",
      description: "До 5x больше просмотров от арендаторов"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Быстрая аренда",
      description: "В среднем на 3 дня быстрее"
    }
  ];

  const handleSelectPlan = (planId: 'premium' | 'unlimited') => {
    if (!user) {
      setIsAuthFormOpen(true);
      return;
    }
    setSelectedPlan(planId);
    setUpgradeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-4">
              <CreditCard className="h-3 w-3 mr-1" />
              Тарифные планы
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Тарифы
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Выберите подходящий план для размещения объявлений и продвижения ваших предложений
          </p>
          
          {user && (
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Текущий план: <span className="font-bold">{plans.find(p => p.current)?.name || 'Базовый'}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:scale-105 border-2 ${
                  plan.current 
                    ? 'border-green-500 shadow-lg bg-green-50/50' 
                    : 'border-border hover:border-primary/50'
                } ${plan.popular ? 'ring-2 ring-primary/20 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1 font-semibold">
                      Популярный
                    </Badge>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                      Текущий план
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 rounded-2xl w-20 h-20 flex items-center justify-center bg-gradient-to-br ${plan.color}`}>
                    <div className={plan.iconColor}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price} ₽</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">
                      {plan.listings === 999999 ? 'Неограниченно' : `До ${plan.listings}`} объявлений
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {!plan.current && (
                    <Button
                      className={`w-full mt-6 ${
                        plan.id === 'free' 
                          ? 'bg-muted hover:bg-muted/80' 
                          : 'bg-gradient-primary hover:shadow-elegant'
                      } transition-all duration-300`}
                      onClick={() => plan.id !== 'free' && handleSelectPlan(plan.id)}
                      disabled={plan.id === 'free'}
                    >
                      {plan.id === 'free' ? 'Текущий план' : 'Выбрать план'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Features */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Flame className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Продвижение объявлений
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Сделайте ваши объявления более заметными и найдите арендаторов быстрее
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {promotionFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-orange-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-3 p-3 bg-orange-100 rounded-xl w-14 h-14 flex items-center justify-center text-orange-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Promotion Pricing */}
          <div className="max-w-md mx-auto">
            <Card className="border-orange-200 bg-white shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Продвижение в топ</CardTitle>
                <CardDescription>Выделите ваше объявление среди других</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold text-orange-600">299 ₽</div>
                <p className="text-muted-foreground">за 7 дней продвижения</p>
                
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Гарантия результата</span>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  size="lg"
                  onClick={() => !user ? setIsAuthFormOpen(true) : null}
                >
                  <Flame className="h-4 w-4 mr-2" />
                  {user ? 'Продвинуть объявление' : 'Войти для продвижения'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
            <p className="text-muted-foreground">Ответы на популярные вопросы о тарифах</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Можно ли изменить план в любое время?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Да, вы можете повысить или понизить тарифный план в любое время. 
                  При повышении плана доплачиваете разницу, при понижении - остаток переносится на следующий период.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Что происходит с объявлениями при смене тарифа?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Все ваши объявления остаются активными. При понижении тарифа вы не сможете создавать новые объявления 
                  до тех пор, пока количество активных не станет меньше лимита нового плана.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как работает продвижение объявлений?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Продвинутые объявления показываются в топе результатов поиска, выделяются специальным значком 🔥 
                  и имеют цветной фон. Продвижение действует 7 дней с момента активации.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AuthForm 
        isOpen={isAuthFormOpen} 
        onClose={() => setIsAuthFormOpen(false)} 
      />
      
      {selectedPlan && (
        <PlanUpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => {
            setUpgradeModalOpen(false);
            setSelectedPlan(null);
          }}
          currentPlan={currentPlan}
          activeListings={activeListings}
          onUpgradeSuccess={() => {
            setUpgradeModalOpen(false);
            setSelectedPlan(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default PricingPage;