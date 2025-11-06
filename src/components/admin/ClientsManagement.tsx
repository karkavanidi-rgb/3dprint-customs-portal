import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ClientItem } from './types';

interface ClientsManagementProps {
  clients: ClientItem[];
  clientsLoading: boolean;
  loadClients: (token: string) => void;
  setEditingClient: (item: ClientItem | null) => void;
  setIsDialogOpen: (open: boolean) => void;
  deleteClient: (id: number) => void;
  setNewClient: (item: Partial<ClientItem>) => void;
}

export default function ClientsManagement({
  clients,
  clientsLoading,
  loadClients,
  setEditingClient,
  setIsDialogOpen,
  deleteClient,
  setNewClient
}: ClientsManagementProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управление клиентами</CardTitle>
            <CardDescription>Добавляйте и редактируйте логотипы клиентов</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                const adminToken = localStorage.getItem('admin_token');
                if (adminToken) loadClients(adminToken);
              }}
              disabled={clientsLoading}
            >
              {clientsLoading ? (
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
            <Button onClick={() => { setEditingClient(null); setIsDialogOpen(true); }}>
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить клиента
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {clientsLoading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Icon name="ImageOff" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Список клиентов пуст. Нажмите "Обновить" или добавьте первого клиента.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative bg-gray-50 p-4">
                  <img 
                    src={item.logo_url} 
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x100?text=Нет+лого';
                    }}
                  />
                  {!item.is_visible && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Скрыто
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-center mb-4">{item.name}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setEditingClient(item);
                        setNewClient(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Icon name="Edit" size={16} className="mr-1" />
                      Изменить
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteClient(item.id)}
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
