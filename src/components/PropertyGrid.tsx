import PropertyCard from "./PropertyCard";
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";
import apartment4 from "@/assets/apartment-4.jpg";

const PropertyGrid = () => {
  const properties = [
    {
      id: "1",
      title: "Стильная квартира в центре с панорамными окнами",
      price: 45000,
      address: "ул. Тверская, 12, Центральный район",
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      imageUrl: apartment1,
      isNew: true,
      isFavorite: false
    },
    {
      id: "2", 
      title: "Современная студия в новостройке рядом с метро",
      price: 32000,
      address: "ул. Новая, 8, Московский район",
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      imageUrl: apartment2,
      isNew: true,
      isFavorite: true
    },
    {
      id: "3",
      title: "Уютная квартира с ремонтом и мебелью",
      price: 38000,
      address: "пр. Ленина, 45, Кировский район",
      bedrooms: 1,
      bathrooms: 1,
      area: 42,
      imageUrl: apartment3,
      isNew: false,
      isFavorite: false
    },
    {
      id: "4",
      title: "Просторная квартира в престижном районе",
      price: 85000,
      address: "ул. Рубинштейна, 23, Центральный район",
      bedrooms: 3,
      bathrooms: 2,
      area: 95,
      imageUrl: apartment4,
      isNew: false,
      isFavorite: true
    },
    {
      id: "5",
      title: "Комфортная двушка с балконом и видом на парк",
      price: 52000,
      address: "ул. Парковая, 15, Петроградский район",
      bedrooms: 2,
      bathrooms: 1,
      area: 58,
      imageUrl: apartment1,
      isNew: false,
      isFavorite: false
    },
    {
      id: "6",
      title: "Дизайнерская квартира в историческом центре",
      price: 75000,
      address: "Невский пр., 42, Центральный район",
      bedrooms: 2,
      bathrooms: 2,
      area: 78,
      imageUrl: apartment2,
      isNew: true,
      isFavorite: false
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Рекомендуемые квартиры</h2>
            <p className="text-muted-foreground">
              Найдено {properties.length} квартир по вашим критериям
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:shadow-elegant transition-all duration-300">
            Показать ещё квартиры
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;