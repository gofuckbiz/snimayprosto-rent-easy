import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ProfileWidget = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-md p-3 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="avatar" className="h-full w-full rounded-full" />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <div className="font-semibold truncate">{user.name || "Без имени"}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Роль</span><span className="text-muted-foreground">{user.role || "user"}</span></div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button className="flex-1" variant="outline" onClick={() => setOpen(false)}>Закрыть</Button>
            <Button className="flex-1" variant="destructive" onClick={handleLogout}>Выйти</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWidget;


