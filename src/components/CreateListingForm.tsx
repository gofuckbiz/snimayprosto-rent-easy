import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Upload, MapPin, Home, Bed, RussianRuble as Ruble, Phone, Mail, Star, Eye, Save, Image as ImageIcon, Trash2, Plus } from "lucide-react";

interface CreateListingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  address: string;
  propertyType: string;
  rooms: string;
  price: string;
  priceType: string;
  phone: string;
  email: string;
  amenities: string[];
  isUrgent: boolean;
  visibility: string;
}

interface Photo {
  id: string;
  file: File;
  preview: string;
}

const CreateListingForm = ({ isOpen, onClose }: CreateListingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    address: "",
    propertyType: "",
    rooms: "",
    price: "",
    priceType: "month",
    phone: "",
    email: "",
    amenities: [],
    isUrgent: false,
    visibility: "public"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amenitiesList = [
    "Балкон", "Мебель", "Холодильник", "Стиральная машина", 
    "Интернет", "Парковка", "Лифт", "Кондиционер", "Посудомоечная машина"
  ];

  const propertyTypes = [
    { value: "apartment", label: "Квартира" },
    { value: "room", label: "Комната" },
    { value: "house", label: "Дом" },
    { value: "studio", label: "Студия" }
  ];

  const roomOptions = [
    { value: "studio", label: "Студия" },
    { value: "1", label: "1 комната" },
    { value: "2", label: "2 комнаты" },
    { value: "3", label: "3 комнаты" },
    { value: "4", label: "4 комнаты" },
    { value: "5+", label: "5+ комнат" }
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (photos.length >= 10) return;
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photos: "Можно загружать только изображения" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photos: "Размер файла не должен превышать 5 МБ" }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          file,
          preview: e.target?.result as string
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    handleInputChange("amenities", newAmenities);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Заголовок обязателен";
    if (!formData.address.trim()) newErrors.address = "Адрес обязателен";
    if (!formData.propertyType) newErrors.propertyType = "Выберите тип недвижимости";
    if (!formData.rooms) newErrors.rooms = "Укажите количество комнат";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Укажите корректную цену";
    if (!formData.phone.trim()) newErrors.phone = "Телефон обязателен";
    if (photos.length === 0) newErrors.photos = "Добавьте хотя бы одну фотографию";

    // Phone validation
    const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Некорректный формат телефона";
    }

    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Некорректный формат email";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Here you would submit the form data
    console.log("Form submitted:", formData, photos);
    
    // Show success notification and close
    onClose();
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    console.log("Preview:", formData, photos);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] bg-white rounded-2xl shadow-elegant border border-border/30 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-border/30 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Разместить объявление
              </h2>
              <p className="text-muted-foreground mt-1">
                Создайте привлекательное объявление для быстрого поиска арендаторов
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-spring text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-spring ${
                  currentStep >= step 
                    ? 'bg-gradient-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 transition-spring ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Основная информация</h3>
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Заголовок объявления *
                </Label>
                <Input
                  id="title"
                  placeholder="Например: Светлая 2-комнатная квартира у метро Динамо"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`hover:shadow-subtle transition-spring focus:scale-105 ${
                    errors.title ? 'border-destructive' : ''
                  }`}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Описание
                </Label>
                <Textarea
                  id="description"
                  placeholder="Опишите особенности квартиры, район, транспортную доступность..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[120px] hover:shadow-subtle transition-spring focus:scale-105"
                />
              </div>

              {/* Property Type and Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Тип недвижимости *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                    <SelectTrigger className={`hover:shadow-subtle transition-spring ${
                      errors.propertyType ? 'border-destructive' : ''
                    }`}>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Количество комнат *</Label>
                  <Select value={formData.rooms} onValueChange={(value) => handleInputChange("rooms", value)}>
                    <SelectTrigger className={`hover:shadow-subtle transition-spring ${
                      errors.rooms ? 'border-destructive' : ''
                    }`}>
                      <SelectValue placeholder="Выберите количество" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomOptions.map((room) => (
                        <SelectItem key={room.value} value={room.value}>
                          {room.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.rooms && <p className="text-sm text-destructive">{errors.rooms}</p>}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Цена *</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Ruble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="50000"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className={`pl-10 hover:shadow-subtle transition-spring focus:scale-105 ${
                        errors.price ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  <Select value={formData.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">в месяц</SelectItem>
                      <SelectItem value="day">в день</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Фотографии и местоположение</h3>
              
              {/* Photos Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Фотографии * (до 10 штук)</Label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-spring">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Перетащите фотографии сюда</p>
                    <p className="text-muted-foreground mb-4">или нажмите для выбора файлов</p>
                    <Button type="button" variant="outline" className="hover:scale-105 transition-spring">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить фото
                    </Button>
                  </label>
                </div>

                {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}

                {/* Photo Preview Grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.preview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-border"
                        />
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-spring hover:scale-110"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Адрес *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="address"
                    placeholder="Москва, ул. Тверская, 12"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`pl-10 hover:shadow-subtle transition-spring focus:scale-105 ${
                      errors.address ? 'border-destructive' : ''
                    }`}
                  />
                </div>
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              {/* Map Placeholder */}
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center border border-border">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Интерактивная карта</p>
                  <p className="text-sm text-muted-foreground">Укажите точное местоположение</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Дополнительная информация</h3>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Контактная информация</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Телефон *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`pl-10 hover:shadow-subtle transition-spring focus:scale-105 ${
                          errors.phone ? 'border-destructive' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email (необязательно)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@mail.ru"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 hover:shadow-subtle transition-spring focus:scale-105 ${
                          errors.email ? 'border-destructive' : ''
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <h4 className="font-medium">Удобства</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        className="hover:scale-110 transition-spring"
                      />
                      <Label htmlFor={amenity} className="text-sm cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Дополнительные опции</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-subtle transition-spring">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Срочная продажа</p>
                        <p className="text-sm text-muted-foreground">Выделить объявление</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) => handleInputChange("isUrgent", checked as boolean)}
                      className="hover:scale-110 transition-spring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Видимость объявления</Label>
                    <Select value={formData.visibility} onValueChange={(value) => handleInputChange("visibility", value)}>
                      <SelectTrigger className="hover:shadow-subtle transition-spring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Для всех пользователей</SelectItem>
                        <SelectItem value="registered">Только для зарегистрированных</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-border/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="hover:scale-105 transition-spring"
                >
                  Назад
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="hover:scale-105 transition-spring hover:shadow-subtle"
              >
                <Eye className="h-4 w-4 mr-2" />
                Предпросмотр
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring"
                >
                  Далее
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-spring"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Опубликовать
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingForm;