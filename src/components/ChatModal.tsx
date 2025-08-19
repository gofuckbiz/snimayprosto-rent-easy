import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Phone,
  Mail,
  Heart
} from "lucide-react";
import { BACKEND_URL } from "@/lib/api";

interface Message {
  id: number;
  senderId: number;
  content: string;
  type: string;
  createdAt: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage?: string;
  currentUserId: number;
}

const ChatModal = ({ 
  isOpen, 
  onClose, 
  propertyId, 
  propertyTitle, 
  propertyPrice, 
  propertyImage,
  currentUserId 
}: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !conversationId) {
      startConversation();
    }
  }, [isOpen]);

  // Add a test message when conversation starts
  useEffect(() => {
    if (conversationId && messages.length === 0) {
      console.log("Adding test message to verify chat is working");
      setMessages([{
        id: 999,
        senderId: 0, // System message
        content: "Чат подключен! Напишите сообщение, чтобы начать разговор.",
        type: "text",
        createdAt: new Date().toISOString()
      }]);
    }
  }, [conversationId, messages.length]);

  const startConversation = async () => {
    setIsLoading(true);
    try {
      console.log("Starting conversation for property:", propertyId);
      const token = localStorage.getItem('accessToken');
      console.log("Token exists:", !!token);
      
      const response = await fetch(`${BACKEND_URL}/chat/start/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Start conversation response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to start conversation:", errorText);
        throw new Error('Failed to start conversation');
      }
      
      const conv = await response.json();
      console.log("Conversation created:", conv);
      setConversationId(conv.id);
      
      // Load messages
      console.log("Loading messages for conversation:", conv.id);
      const messagesResponse = await fetch(`${BACKEND_URL}/chat/${conv.id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log("Messages response status:", messagesResponse.status);
      
      if (messagesResponse.ok) {
        const data = await messagesResponse.json();
        console.log("Loaded messages:", data);
        setMessages(data.items || []);
      } else {
        const errorText = await messagesResponse.text();
        console.error("Failed to load messages:", errorText);
      }
      
      // Connect WebSocket
      console.log("Connecting to WebSocket...");
      const wsUrl = `${BACKEND_URL.replace('http', 'ws')}/ws/chat/${conv.id}?token=${encodeURIComponent(token || '')}`;
      console.log("WebSocket URL:", wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log("WebSocket connected successfully");
      };
      
      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        try {
          const msg = JSON.parse(event.data);
          console.log("Parsed message:", msg);
          setMessages(prev => [...prev, msg]);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current) {
      console.log("Cannot send message:", { 
        messageEmpty: !newMessage.trim(), 
        wsNotReady: !wsRef.current 
      });
      return;
    }
    
    console.log("Sending message:", newMessage.trim());
    console.log("WebSocket ready state:", wsRef.current.readyState);
    
    wsRef.current.send(JSON.stringify({ 
      type: 'text', 
      content: newMessage.trim() 
    }));
    
    console.log("Message sent via WebSocket");
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    wsRef.current?.close();
    setMessages([]);
    setConversationId(null);
    setNewMessage("");
    setIsFullscreen(false);
    setIsMinimized(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`
        bg-background border border-border rounded-lg shadow-2xl
        ${isFullscreen ? 'w-full h-full m-0 rounded-none' : 'w-full max-w-2xl max-h-[80vh] mx-4'}
        ${isMinimized ? 'h-16' : 'h-[600px]'}
        transition-all duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            {propertyImage && (
              <img 
                src={propertyImage.startsWith('/uploads') ? `${BACKEND_URL}${propertyImage}` : propertyImage}
                alt={propertyTitle}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-sm">{propertyTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {propertyPrice.toLocaleString('ru-RU')} ₽/месяц
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            
            {!isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Начните разговор с владельцем</p>
                  <p className="text-sm">Задайте вопросы о квартире</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[70%] px-3 py-2 rounded-lg text-sm
                        ${message.senderId === currentUserId 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                        }
                      `}
                    >
                      {message.content}
                      <div className={`text-xs mt-1 ${message.senderId === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Прикрепить файл"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Отправить фото"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    className="w-full resize-none border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-8 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
