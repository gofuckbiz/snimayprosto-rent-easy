import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { login, register, updateUserRole } from "@/lib/api";
import { useAuth, AuthUser } from "@/lib/auth-context";
import RoleSelectionModal from "./RoleSelectionModal";

interface AuthFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthForm = ({ isOpen, onClose }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { toast } = useToast();
  const { setSession, reload } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login({ email: loginData.email, password: loginData.password });
      setSession(response.user as AuthUser, response.accessToken);
      onClose();
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
      });
      setSession(response.user as AuthUser, response.accessToken);
      setShowRoleSelection(true);
      toast({
        title: "Регистрация успешна",
        description: "Выберите вашу роль",
      });
    } catch (error: any) {
      console.error("Register error:", error);
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось зарегистрироваться",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (role: 'landlord' | 'tenant') => {
    console.log("Role selected:", role);
    try {
      console.log("Calling updateUserRole with role:", role);
      await updateUserRole(role);
      console.log("Role updated successfully");
      
      // Reload user data to get the updated role
      await reload();
      console.log("User data reloaded");
      
      setShowRoleSelection(false);
      onClose();
      
      toast({
        title: "Роль обновлена",
        description: `Вы выбрали роль: ${role === 'landlord' ? 'Арендодатель' : 'Арендатор'}`,
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить роль",
        variant: "destructive",
      });
    }
  };

  const handleRoleClose = () => {
    setShowRoleSelection(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">СнятьПросто</CardTitle>
            <CardDescription>
              Войдите в аккаунт или создайте новый
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Вход..." : "Войти"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName">Имя</Label>
                      <Input
                        id="register-firstName"
                        placeholder="Иван"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName">Фамилия</Label>
                      <Input
                        id="register-lastName"
                        placeholder="Иванов"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Телефон (необязательно)</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
                Закрыть
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleSelection}
        onRoleSelect={handleRoleSelect}
        onClose={handleRoleClose}
      />
    </>
  );
};

export default AuthForm;