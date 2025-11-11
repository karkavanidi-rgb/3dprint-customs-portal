import { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PortfolioSectionProps {
  t: any;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
}

const PortfolioSection = ({ t }: PortfolioSectionProps) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPortfolio = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b');
      const data = await response.json();
      setPortfolioItems(data.portfolio || []);
    } catch (error) {
      console.error('Ошибка загрузки портфолио:', error);
      setPortfolioItems([
        {
          id: 1,
          title: 'Архитектурные модели',
          description: 'Прототипы зданий и сооружений',
          image_url: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/c9bfcd24-ae58-41ef-bd0a-90e33c1b3557.jpg',
          display_order: 1,
          is_visible: true
        },
        {
          id: 2,
          title: 'Промышленные детали',
          description: 'Функциональные запчасти и механизмы',
          image_url: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/7d9a3f81-b582-4b41-9ffe-af9e56d32cd0.jpg',
          display_order: 2,
          is_visible: true
        },
        {
          id: 3,
          title: 'Дизайнерские изделия',
          description: 'Уникальные декоративные элементы',
          image_url: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/0f9e8dda-0c61-4b9d-aff4-8b6c99f882a0.jpg',
          display_order: 3,
          is_visible: true
        },
        {
          id: 4,
          title: 'Цветная печать',
          description: 'Многоцветные изделия высокой детализации',
          image_url: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/6ec8f6c5-a3f6-46f7-a935-9871ac02c7b3.jpg',
          display_order: 4,
          is_visible: true
        },
        {
          id: 5,
          title: 'Формы для литья',
          description: 'Мастер-модели для производства',
          image_url: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/4f73c864-e09e-43f4-9b5f-55fe37a69e59.jpg',
          display_order: 5,
          is_visible: true
        },
        {
          id: 6,
          title: 'Постобработка деталей',
          description: 'Шлифовка, покраска и сборка',
          image_url: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/a1e4c71a-dc9f-4c5d-82b7-66f93bc7d48a.jpg',
          display_order: 6,
          is_visible: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 px-4 relative">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.portfolio.title}
          </h2>
          <p className="text-xl text-gray-600">{t.portfolio.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all border-2 hover:border-primary cursor-pointer">
              <div className="h-64 relative overflow-hidden bg-gray-100">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
                <CardDescription className="text-base">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;