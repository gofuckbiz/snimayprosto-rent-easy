import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Send,
  MessageCircle,
  User,
  Minimize2,
  Maximize2,
  Square,
  ChevronLeft
} from "lucide-react";
import { BACKEND_URL, listConversations, listMessages } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { authService } from "@/lib/auth-service";

interface Conversation {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyPrice: number;
  initiatorId: number;
  ownerId: number;
  initiatorName: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  unreadCount: number;
}

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  type: string;
  content: string;
  createdAt: string;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagesModal = ({ isOpen, onClose }: MessagesModalProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await listConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    if (!user) return;
    
    try {
      const data = await listMessages(conversationId);
      setMessages(data.items || []);
      
      // Connect WebSocket for real-time messages
      connectWebSocket(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const connectWebSocket = (conversationId: number) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const token = authService.getAccessToken(); // Get current access token from AuthService
    const wsUrl = `${BACKEND_URL.replace('http', 'ws')}/ws/chat/${conversationId}?token=${encodeURIComponent(token || '')}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connected for messages");
    };
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages(prev => [...prev, msg]);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    wsRef.current = ws;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !selectedConversation) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'text',
      content: newMessage.trim()
    }));
    
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages([]); // Clear previous messages
    loadMessages(conversation.id);
  };

  const handleClose = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setSelectedConversation(null);
    setMessages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`
        bg-background border border-border rounded-lg shadow-2xl
        ${isFullscreen ? 'w-full h-full m-0 rounded-none' : 'w-full max-w-4xl max-h-[80vh] mx-4'}
        ${isMinimized ? 'h-16' : 'h-[700px]'}
        transition-all duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            {selectedConversation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <MessageCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {selectedConversation ? selectedConversation.propertyTitle : 'Сообщения'}
            </h2>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
            >
              <Square className="h-4 w-4" />
            </Button>
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
          <div className="flex h-[calc(100%-4rem)]">
            {!selectedConversation ? (
              /* Conversations List */
              <div className="w-1/3 border-r border-border">
                <div className="p-4">
                  <h3 className="font-semibold mb-4">Диалоги</h3>
                  {isLoading ? (
                    <div className="text-center text-muted-foreground">Загрузка...</div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center text-muted-foreground">Нет активных диалогов</div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleConversationSelect(conversation)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{conversation.propertyTitle}</div>
                              <div className="text-sm text-muted-foreground truncate">
                                {conversation.initiatorName}
                              </div>
                              {conversation.lastMessage && (
                                <div className="text-xs text-muted-foreground truncate mt-1">
                                  {conversation.lastMessage.content}
                                </div>
                              )}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Chat Area */
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedConversation.initiatorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedConversation.propertyTitle} • {selectedConversation.propertyPrice} ₽
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Напишите сообщение..."
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesModal;
