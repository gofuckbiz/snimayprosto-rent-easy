import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Check, 
  Star, 
  Zap, 
  Crown,
  CreditCard,
  Shield,
  TrendingUp
} from "lucide-react";
import { upgradePlan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  activeListings: number;
  onUpgradeSuccess: () => void;
}

const PlanUpgradeModal = ({ 
  isOpen, 
  onClose, 
  currentPlan, 
  activeListings,
  onUpgradeSuccess 
}: PlanUpgradeModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'unlimited' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      id: 'free' as const,
      name: 'Базовый',
      price: 0,
      period: 'бесплатно',
      listings: 3,
      icon: <Star className="h-6 w-6" />,
      features: [
        'До 3 объявлений',
        'Базовая поддержка',
        'Стандартное размещение'
      ],
      color: 'bg-muted',
      textColor: 'text-muted-foreground',
      current: currentPlan === 'free'
    },
    {
      id: 'premium' as const,
      name: 'Премиум',
      price: 500,
      period: 'в месяц',
      listings: 10,
      icon: <Zap className="h-6 w-6" />,
      features: [
        'До 10 объявлений',
        'Приоритетная поддержка',
        'Расширенная статистика',
        'Скидка на продвижение'
      ],
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-white',
      popular: true,
      current: currentPlan === 'premium'
    },
    {
      id: 'unlimited' as const,
      name: 'Безлимит',
      price: 2000,
      period: 'в месяц',
      listings: 999999,
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Неограниченные объявления',
        'VIP поддержка',
        'Детальная аналитика',
        'Бесплатное продвижение',
        'Персональный менеджер'
      ],
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-white',
      current: currentPlan === 'unlimited'
    }
  ];

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      await upgradePlan(selectedPlan);
      toast({
        title: "План обновлен",
        description: `Вы успешно перешли на план ${plans.find(p => p.id === selectedPlan)?.name}`,
      });
      onUpgradeSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить план",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-background rounded-2xl shadow-elegant border border-border/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/30 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Выберите тарифный план
              </h2>
              <p className="text-muted-foreground mt-2">
                У вас {activeListings} активных объявлений. Выберите план для расширения возможностей.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  selectedPlan === plan.id 
                    ? 'border-primary shadow-glow' 
                    : plan.current
                    ? 'border-green-500 shadow-lg'
                    : 'border-border hover:border-primary/50'
                } ${plan.popular ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => !plan.current && plan.id !== 'free' && setSelectedPlan(plan.id as 'premium' | 'unlimited')}
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
                  <div className={`mx-auto mb-4 p-4 rounded-2xl w-16 h-16 flex items-center justify-center ${plan.color} ${plan.textColor}`}>
                    {plan.icon}
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

                  {!plan.current && plan.id !== 'free' && (
                    <Button
                      className={`w-full mt-6 ${
                        selectedPlan === plan.id 
                          ? 'bg-black hover:bg-black/90 text-white hover:shadow-elegant' 
                          : 'bg-muted hover:bg-muted/80'
                      } transition-all duration-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id as 'premium' | 'unlimited');
                      }}
                    >
                      {selectedPlan === plan.id ? 'Выбрано' : 'Выбрать план'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Section */}
          {selectedPlan && (
            <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Подтверждение покупки</h3>
                  <p className="text-muted-foreground">
                    План: {plans.find(p => p.id === selectedPlan)?.name} - {plans.find(p => p.id === selectedPlan)?.price} ₽/месяц
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Безопасная оплата</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-elegant flex-1"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isLoading ? 'Обработка...' : 'Оплатить и активировать'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlan(null)}
                  size="lg"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanUpgradeModal;