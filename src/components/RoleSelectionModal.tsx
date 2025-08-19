import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  User, 
  Building2,
  CheckCircle
} from "lucide-react";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onRoleSelect: (role: 'landlord' | 'tenant') => void;
  onClose: () => void;
}

const RoleSelectionModal = ({ isOpen, onRoleSelect, onClose }: RoleSelectionModalProps) => {
  const [selectedRole, setSelectedRole] = useState<'landlord' | 'tenant' | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Кем вы являетесь?</CardTitle>
          <CardDescription>
            Выберите вашу роль, чтобы мы могли настроить интерфейс под ваши потребности
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Landlord Option */}
          <div
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedRole === 'landlord'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole('landlord')}
          >
            {selectedRole === 'landlord' && (
              <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-primary" />
            )}
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold">Продавец / Сдаю жильё</h3>
                  <Badge variant="secondary" className="text-xs">Арендодатель</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  У вас есть недвижимость для сдачи в аренду
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Размещение объявлений</li>
                  <li>• Управление арендой</li>
                  <li>• Общение с арендаторами</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tenant Option */}
          <div
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedRole === 'tenant'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole('tenant')}
          >
            {selectedRole === 'tenant' && (
              <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-primary" />
            )}
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold">Покупатель / Ищу жильё</h3>
                  <Badge variant="secondary" className="text-xs">Арендатор</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Вы ищете недвижимость для аренды
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Поиск и фильтрация</li>
                  <li>• Сохранение избранного</li>
                  <li>• Связь с владельцами</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Пропустить
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={!selectedRole}
              className="flex-1"
            >
              Подтвердить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionModal;
