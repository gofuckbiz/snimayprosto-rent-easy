import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Flame, 
  TrendingUp, 
  Eye, 
  Star,
  CreditCard,
  Shield,
  Clock,
  Target
} from "lucide-react";
import { promoteProperty } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  propertyTitle: string;
  onPromoteSuccess: () => void;
}

const PromoteModal = ({ 
  isOpen, 
  onClose, 
  propertyId, 
  propertyTitle,
  onPromoteSuccess 
}: PromoteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const benefits = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Приоритет в поиске",
      description: "Ваше объявление всегда показывается первым"
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Больше просмотров",
      description: "До 5x больше просмотров от потенциальных арендаторов"
    },
    {
      icon: <Flame className="h-5 w-5" />,
      title: "Яркое выделение",
      description: "Специальный значок 🔥 и выделенный фон"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Быстрая аренда",
      description: "В среднем на 3 дня быстрее находят арендаторов"
    }
  ];

  const handlePromote = async () => {
    setIsLoading(true);
    try {
      await promoteProperty(propertyId);
      toast({
        title: "Объявление продвинуто!",
        description: "Ваше объявление теперь показывается первым в поиске",
      });
      onPromoteSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось продвинуть объявление",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <Card className="w-full max-w-2xl shadow-elegant border-0 animate-scale-in">
        <CardHeader className="text-center pb-6 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse-glow">
            <Flame className="h-10 w-10 text-white" />
          </div>
          
          <CardTitle className="text-3xl font-bold">
            Продвинуть объявление
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Сделайте ваше объявление более заметным
          </CardDescription>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="font-medium text-foreground">{propertyTitle}</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Что вы получите
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Продвижение на 7 дней</span>
              </div>
              <div className="text-4xl font-bold text-orange-900 mb-2">299 ₽</div>
              <p className="text-sm text-orange-700">
                Специальная цена для первого продвижения
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Гарантия возврата средств</span>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              size="lg"
            >
              Отмена
            </Button>
            <Button
              onClick={handlePromote}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-elegant"
              size="lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isLoading ? 'Обработка...' : 'Оплатить и продвинуть'}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Продвижение активируется сразу после оплаты</p>
            <p>Деньги списываются только при успешной активации</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoteModal;