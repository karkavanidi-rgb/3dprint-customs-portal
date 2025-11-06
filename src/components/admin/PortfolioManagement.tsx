import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PortfolioItem } from './types';

interface PortfolioManagementProps {
  portfolio: PortfolioItem[];
  portfolioLoading: boolean;
  loadPortfolio: (token: string) => void;
  setEditingItem: (item: PortfolioItem | null) => void;
  setIsDialogOpen: (open: boolean) => void;
  deletePortfolioItem: (id: number) => void;
  setNewItem: (item: Partial<PortfolioItem>) => void;
}

export default function PortfolioManagement({
  portfolio,
  portfolioLoading,
  loadPortfolio,
  setEditingItem,
  setIsDialogOpen,
  deletePortfolioItem,
  setNewItem
}: PortfolioManagementProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управление портфолио</CardTitle>
            <CardDescription>Добавляйте и редактируйте работы в разделе "Наши работы"</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                const adminToken = localStorage.getItem('admin_token');
                if (adminToken) loadPortfolio(adminToken);
              }}
              disabled={portfolioLoading}
            >
              {portfolioLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Обновить
                </>
              )}
            </Button>
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить работу
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {portfolioLoading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        ) : portfolio.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icon name="ImageOff" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Портфолио пусто. Нажмите "Обновить" или добавьте первую работу.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Нет+изображения';
                    }}
                  />
                  {!item.is_visible && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Скрыто
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setEditingItem(item);
                        setNewItem(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Icon name="Edit" size={16} className="mr-1" />
                      Изменить
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deletePortfolioItem(item.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}