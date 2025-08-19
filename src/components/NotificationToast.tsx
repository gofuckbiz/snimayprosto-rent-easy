import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NotificationToastProps {
  message: string;
  propertyTitle: string;
  senderName: string;
}

const NotificationToast = ({ message, propertyTitle, senderName }: NotificationToastProps) => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: `Новое сообщение от ${senderName}`,
      description: (
        <div className="mt-2">
          <div className="font-medium text-sm">{propertyTitle}</div>
          <div className="text-xs text-muted-foreground mt-1">{message}</div>
        </div>
      ),
      duration: 5000,
      className: "bg-green-50 border-green-200",
    });
  }, [message, propertyTitle, senderName, toast]);

  return null;
};

export default NotificationToast;
