import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
              <CardContent>
                <Button variant="outline" className="w-full">
                  {t.portfolio.detailsBtn}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;