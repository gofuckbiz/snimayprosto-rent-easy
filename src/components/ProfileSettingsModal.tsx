import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Camera, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Upload,
  Edit3
} from "lucide-react";
import { useAuth, AuthUser } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSettingsModal = ({ isOpen, onClose }: ProfileSettingsModalProps) => {
  const { user, setSession } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Можно загружать только изображения",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5 МБ",
        variant: "destructive",
      });
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user context with new data
      const updatedUser: AuthUser = {
        ...user!,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: avatarPreview || undefined,
      };
      
      // Get current access token
      const currentToken = localStorage.getItem('accessToken') || '';
      setSession(updatedUser, currentToken);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initials = (formData.name || formData.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <Card className="w-full max-w-2xl shadow-elegant border-0 animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-6 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <User className="h-10 w-10 text-white" />
          </div>
          
          <CardTitle className="text-3xl font-bold">
            Настройки профиля
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Обновите вашу контактную информацию и фото профиля
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Avatar Section */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold flex items-center justify-center">
              <Camera className="h-5 w-5 mr-2" />
              Фото профиля
            </h3>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-border shadow-lg">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-white">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="hover:scale-105 transition-spring"
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить фото
              </Button>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center">
              <Edit3 className="h-5 w-5 mr-2" />
              Контактная информация
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Имя и фамилия
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Иван Иванов"
                  className="h-12 rounded-xl border-2 focus:border-primary transition-spring"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className="h-12 rounded-xl border-2 focus:border-primary transition-spring"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Телефон
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="h-12 rounded-xl border-2 focus:border-primary transition-spring"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl"
              size="lg"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 h-12 bg-black hover:bg-black/90 text-white hover:shadow-elegant hover:scale-105 transition-spring rounded-xl"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Ваши данные защищены и используются только для связи с арендаторами</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsModal;