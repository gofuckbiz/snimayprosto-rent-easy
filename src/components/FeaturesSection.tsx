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
    <section className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Почему выбирают СнятьПросто?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы делаем процесс аренды максимально простым и безопасным для всех участников
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-elegant group-hover:scale-110 transition-spring">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-spring">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;