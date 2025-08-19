import { Shield, Clock, MessageSquare, CreditCard } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Проверенные объявления",
      description: "Все квартиры проходят модерацию и проверку документов"
    },
    {
      icon: Clock,
      title: "Быстрый поиск",
      description: "Найдите квартиру мечты за несколько минут с помощью умных фильтров"
    },
    {
      icon: MessageSquare,
      title: "Прямая связь",
      description: "Общайтесь с арендодателями напрямую через защищённый чат"
    },
    {
      icon: CreditCard,
      title: "Безопасные платежи",
      description: "Оплачивайте аренду через платформу с гарантией возврата"
    }
  ];

  return (
    <section className="py-24 bg-gradient-elegant relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary rounded-full blur-3xl animate-float animation-delay-300"></div>
      </div>
      
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Наши преимущества</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Почему выбирают СнятьПросто?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Мы делаем процесс аренды максимально простым и безопасным для всех участников
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group animate-fade-in hover-lift" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="relative w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:shadow-glow group-hover:scale-110 transition-spring">
                  <Icon className="h-10 w-10 text-primary-foreground" />
                  <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-spring"></div>
                  
                  {/* Interactive widget for each feature */}
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold animate-bounce">
                      2мин
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
                  {index === 3 && (
                    <div className="absolute -top-1 -right-1 text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-bold">
                      100%
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-primary transition-spring">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base mb-4">{feature.description}</p>
                
                {/* Feature-specific widgets */}
                {index === 0 && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mt-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Проверено модераторами</span>
                    </div>
                  </div>
                )}
                
                {index === 1 && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 mt-4 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">⚡</div>
                      <div className="text-xs text-blue-700 font-medium">Средний поиск: 2 минуты</div>
                    </div>
                  </div>
                )}
                
                {index === 2 && (
                  <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4 mt-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-orange-700">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Онлайн</span>
                      </div>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  </div>
                )}
                
                {index === 3 && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-4 mt-4 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 mb-1">🔒</div>
                      <div className="text-xs text-purple-700 font-medium">SSL шифрование</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import { Sparkles } from "lucide-react";

export default FeaturesSection;