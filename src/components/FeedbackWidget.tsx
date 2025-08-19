import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  X, 
  Star, 
  Send, 
  Heart,
  Lightbulb,
  Bug,
  Smile
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const feedbackTypes = [
    { value: "review", label: "Отзыв о сайте", icon: <Star className="h-4 w-4" /> },
    { value: "suggestion", label: "Предложение", icon: <Lightbulb className="h-4 w-4" /> },
    { value: "bug", label: "Сообщить об ошибке", icon: <Bug className="h-4 w-4" /> },
    { value: "other", label: "Другое", icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, напишите ваш отзыв",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Спасибо за отзыв!",
        description: "Ваше мнение очень важно для нас",
      });
      
      // Reset form
      setFeedback("");
      setFeedbackType("");
      setRating(0);
      setIsModalOpen(false);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="relative">
          {/* Main Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full bg-gradient-primary hover:shadow-glow hover:scale-110 transition-spring shadow-elegant ${
              isOpen ? 'rotate-45' : ''
            }`}
            size="sm"
          >
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </Button>

          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-foreground text-background text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Оставить отзыв
            </div>
          )}

          {/* Expanded Menu */}
          {isOpen && (
            <div className="absolute bottom-16 left-0 bg-background border border-border rounded-xl shadow-elegant p-3 min-w-[200px] animate-scale-in">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10"
                  onClick={() => {
                    setIsModalOpen(true);
                    setFeedbackType("review");
                  }}
                >
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Оставить отзыв
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10"
                  onClick={() => {
                    setIsModalOpen(true);
                    setFeedbackType("suggestion");
                  }}
                >
                  <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                  Предложение
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-primary/10"
                  onClick={() => {
                    setIsModalOpen(true);
                    setFeedbackType("bug");
                  }}
                >
                  <Bug className="h-4 w-4 mr-2 text-red-500" />
                  Сообщить об ошибке
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <Card className="w-full max-w-md shadow-elegant border-0 animate-scale-in">
            <CardHeader className="text-center pb-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <MessageSquare className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <CardTitle className="text-2xl font-bold">
                Ваше мнение важно
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Помогите нам стать лучше
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Тип обращения</Label>
                  <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            {type.icon}
                            <span className="ml-2">{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating (only for reviews) */}
                {feedbackType === "review" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Оценка</Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-spring"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              star <= rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback Text */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {feedbackType === "review" ? "Ваш отзыв" : 
                     feedbackType === "suggestion" ? "Ваше предложение" :
                     feedbackType === "bug" ? "Описание проблемы" : "Сообщение"}
                  </Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      feedbackType === "review" ? "Поделитесь впечатлениями о сайте..." :
                      feedbackType === "suggestion" ? "Как мы можем улучшить сайт?" :
                      feedbackType === "bug" ? "Опишите проблему, с которой вы столкнулись..." :
                      "Напишите ваше сообщение..."
                    }
                    className="min-h-[120px] rounded-xl resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="w-full h-12 bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring rounded-xl font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Отправить
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center text-xs text-muted-foreground">
                <div className="flex items-center justify-center space-x-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span>Спасибо за помощь в улучшении СнятьПросто</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;