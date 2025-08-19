import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getMyPlan } from "@/lib/api";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { 
  User, 
  Mail, 
  Phone, 
  Crown, 
  Star, 
  Zap,
  Calendar,
  Settings
} from "lucide-react";

const ProfileWidget = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { data: planData } = useQuery({
    queryKey: ['myPlan'],
    queryFn: getMyPlan,
    enabled: !!user,
  });

  if (!user) return null;

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const plan = planData?.plan;
  
  const getPlanDisplayName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Базовый';
      case 'premium': return 'Премиум';
      case 'unlimited': return 'Безлимит';
      default: return 'Базовый';
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'free': return <Star className="h-3 w-3" />;
      case 'premium': return <Zap className="h-3 w-3" />;
      case 'unlimited': return <Crown className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'premium': return 'bg-blue-100 text-blue-700';
      case 'unlimited': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-spring"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar className="h-6 w-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="h-full w-full rounded-full" />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <span className="text-sm font-medium max-w-[140px] truncate">{user.name || user.email}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl p-4 animate-in fade-in-0 zoom-in-95">
          {/* User Info Header */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="avatar" className="h-full w-full rounded-full" />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <div className="font-bold text-base truncate">{user.name || "Без имени"}</div>
              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          {/* Contact Information */}
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-sm flex items-center">
              <User className="h-4 w-4 mr-2" />
              Контактная информация
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Email</span>
                </div>
                <span className="text-muted-foreground truncate max-w-[150px]">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span>Телефон</span>
                  </div>
                  <span className="text-muted-foreground">{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span>Роль</span>
                <Badge variant="outline" className="text-xs">
                  {user.role === 'landlord' ? 'Арендодатель' : 
                   user.role === 'tenant' ? 'Арендатор' : 'Пользователь'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Регистрация</span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}
                </span>
              </div>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          {/* Current Plan */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-3">Текущий тариф</h4>
            {plan ? (
              <div className={`p-3 rounded-lg ${getPlanColor(plan.planType)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getPlanIcon(plan.planType)}
                    <span className="font-semibold text-sm">
                      {getPlanDisplayName(plan.planType)}
                    </span>
                  </div>
                  {plan.planType !== 'free' && (
                    <span className="text-xs font-medium">
                      {plan.planType === 'premium' ? '500₽/мес' : '2000₽/мес'}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-1 opacity-80">
                  {planData?.activeListings || 0} из {plan.maxListings === 999999 ? '∞' : plan.maxListings} объявлений
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Загрузка...</div>
              </div>
            )}
          </div>
          
          <Separator className="mb-4" />
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setOpen(false);
                setSettingsOpen(true);
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Настройки профиля
            </Button>
            
            <Button 
              className="w-full" 
              variant="outline" 
              size="sm"
              onClick={() => setOpen(false)}
            >
              Закрыть
            </Button>
            
            <Button 
              className="w-full" 
              variant="destructive" 
              size="sm"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default ProfileWidget;


