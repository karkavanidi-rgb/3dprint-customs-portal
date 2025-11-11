import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
import { Order, PortfolioItem, ClientItem, statusLabels } from '@/components/admin/types';
import OrdersList from '@/components/admin/OrdersList';
import PortfolioManagement from '@/components/admin/PortfolioManagement';
import PortfolioDialog from '@/components/admin/PortfolioDialog';
import ClientsManagement from '@/components/admin/ClientsManagement';
import ClientDialog from '@/components/admin/ClientDialog';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchEmail, setSearchEmail] = useState('');
  
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_visible: true
  });

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<ClientItem>>({
    name: '',
    logo_url: '',
    display_order: 0,
    is_visible: true
  });

  const login = () => {
    setLoginError('');
    const savedPassword = localStorage.getItem('admin_password') || 'QWERTY987654321ZAQWSX';
    
    if (password !== savedPassword) {
      setLoginError('Неверный пароль');
      return;
    }
    
    const adminToken = 'a8f3K9mP2xR7qL5nB4vC6wE1sH0jT3yU8zG2d';
    localStorage.setItem('admin_token', adminToken);
    setIsAuthenticated(true);
    setToken(adminToken);
    setPassword('');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
    setPassword('');
    setLoginError('');
    setOrders([]);
  };

  const changePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    const savedPassword = localStorage.getItem('admin_password') || 'QWERTY987654321ZAQWSX';
    
    if (currentPassword !== savedPassword) {
      setPasswordError('Текущий пароль неверный');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Новый пароль должен быть не менее 8 символов');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    localStorage.setItem('admin_password', newPassword);
    setPasswordSuccess('Пароль успешно изменен!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setShowPasswordChange(false);
      setPasswordSuccess('');
    }, 2000);
  };

  const loadOrders = async (adminToken: string) => {
    console.log('📥 Loading orders with token:', adminToken);
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://functions.poehali.dev/df2e7780-9527-410f-8848-48ea6e18479d', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      console.log('📡 Response status:', response.status);

      if (response.status === 401) {
        setError('Неверный токен доступа. Проверьте правильность введённого токена.');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) {
        setError(`Ошибка сервера: ${response.status}`);
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();
      console.log('📦 Received data:', data);
      console.log('📋 Orders count:', data.orders?.length || 0);
      setOrders(data.orders || []);
    } catch (err) {
      setError('Ошибка загрузки заявок. Проверьте подключение к интернету.');
      console.error('❌ Orders fetch error:', err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      const response = await fetch('https://functions.poehali.dev/1b30405e-8c9f-44e4-b6c7-6a8d3df8a2e8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      });

      if (response.ok) {
        loadOrders(adminToken);
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const deleteOrder = async (orderId: number) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    if (!confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/df2e7780-9527-410f-8848-48ea6e18479d', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ order_id: orderId })
      });

      if (response.ok) {
        loadOrders(adminToken);
      } else {
        alert('Ошибка при удалении заявки');
      }
    } catch (err) {
      console.error('Ошибка удаления заявки:', err);
      alert('Ошибка при удалении заявки');
    }
  };

  const exportToExcel = (ordersToExport: Order[]) => {
    const exportData = ordersToExport.map(order => ({
      'ID заявки': order.id,
      'Дата создания': new Date(order.created_at).toLocaleString('ru-RU'),
      'Статус': statusLabels[order.status],
      'Тип клиента': order.customer_type === 'legal' ? 'Юр. лицо' : 'Физ. лицо',
      'Компания': order.company_name || '-',
      'ИНН': order.inn || '-',
      'Email': order.email,
      'Телефон': order.phone || '-',
      'Длина (мм)': order.length || '-',
      'Ширина (мм)': order.width || '-',
      'Высота (мм)': order.height || '-',
      'Материал': order.plastic_type || '-',
      'Цвет': order.color || '-',
      'Заполнение (%)': order.infill || '-',
      'Количество': order.quantity,
      'Описание': order.description || '-',
      'Файл': order.file_name || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявки');

    const colWidths = [
      { wch: 10 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
      { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 15 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
      { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 40 }, { wch: 20 }
    ];
    worksheet['!cols'] = colWidths;

    const fileName = `Заявки_3DPrint_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const loadPortfolio = async (adminToken: string) => {
    setPortfolioLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки портфолио:', err);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const savePortfolioItem = async (item: Partial<PortfolioItem>) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      const method = item.id ? 'PUT' : 'POST';
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        loadPortfolio(adminToken);
        setIsDialogOpen(false);
        setEditingItem(null);
        setNewItem({
          title: '',
          description: '',
          image_url: '',
          display_order: 0,
          is_visible: true
        });
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const deletePortfolioItem = async (id: number) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    if (!confirm('Удалить эту работу из портфолио?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        loadPortfolio(adminToken);
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setUploadingImage(true);
    
    try {
      // Читаем файл как base64
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          setNewItem({ ...newItem, image_url: dataUrl });
          setUploadingImage(false);
        } catch (err) {
          console.error('Ошибка обработки:', err);
          alert('Ошибка обработки изображения');
          setUploadingImage(false);
        }
      };
      
      reader.onerror = () => {
        alert('Ошибка чтения файла');
        setUploadingImage(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert('Ошибка загрузки изображения');
      setUploadingImage(false);
    }
  };

  const handleClientLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setUploadingImage(true);
    
    try {
      // Читаем файл как base64
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          setNewClient({ ...newClient, logo_url: dataUrl });
          setUploadingImage(false);
        } catch (err) {
          console.error('Ошибка обработки:', err);
          alert('Ошибка обработки изображения');
          setUploadingImage(false);
        }
      };
      
      reader.onerror = () => {
        alert('Ошибка чтения файла');
        setUploadingImage(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert('Ошибка загрузки изображения');
      setUploadingImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleClientDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleClientLogoUpload(file);
    }
  };

  const loadClients = async (adminToken: string) => {
    setClientsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/d584ff33-449c-4abe-8a4e-13cfe9b42ddc', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки клиентов:', err);
    } finally {
      setClientsLoading(false);
    }
  };

  const saveClient = async (item: Partial<ClientItem>) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      const method = item.id ? 'PUT' : 'POST';
      const response = await fetch('https://functions.poehali.dev/d584ff33-449c-4abe-8a4e-13cfe9b42ddc', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        loadClients(adminToken);
        setIsClientDialogOpen(false);
        setEditingClient(null);
        setNewClient({
          name: '',
          logo_url: '',
          display_order: 0,
          is_visible: true
        });
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const deleteClient = async (id: number) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    if (!confirm('Удалить этого клиента?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/d584ff33-449c-4abe-8a4e-13cfe9b42ddc', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        loadClients(adminToken);
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'portfolio') {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        loadPortfolio(adminToken);
      }
    }
    if (isAuthenticated && activeTab === 'clients') {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        loadClients(adminToken);
      }
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Админ-панель 3DPC</CardTitle>
            <p className="text-sm text-gray-500 text-center mt-2">Введите пароль для доступа</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
              />
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
            </div>
            <Button onClick={login} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPasswordChange(true)}>
              <Icon name="Key" size={18} className="mr-2" />
              Сменить пароль
            </Button>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Briefcase" size={18} className="mr-2" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Icon name="Users" size={18} className="mr-2" />
              Клиенты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersList
              orders={orders}
              loading={loading}
              expandedOrder={expandedOrder}
              setExpandedOrder={setExpandedOrder}
              updateOrderStatus={updateOrderStatus}
              deleteOrder={deleteOrder}
              exportToExcel={exportToExcel}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              searchEmail={searchEmail}
              setSearchEmail={setSearchEmail}
            />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioManagement
              portfolio={portfolio}
              portfolioLoading={portfolioLoading}
              loadPortfolio={loadPortfolio}
              setEditingItem={setEditingItem}
              setIsDialogOpen={setIsDialogOpen}
              deletePortfolioItem={deletePortfolioItem}
              setNewItem={setNewItem}
            />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientsManagement
              clients={clients}
              clientsLoading={clientsLoading}
              loadClients={loadClients}
              setEditingClient={setEditingClient}
              setIsDialogOpen={setIsClientDialogOpen}
              deleteClient={deleteClient}
              setNewClient={setNewClient}
            />
          </TabsContent>
        </Tabs>

        <PortfolioDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingItem={editingItem}
          newItem={newItem}
          setNewItem={setNewItem}
          savePortfolioItem={savePortfolioItem}
          uploadingImage={uploadingImage}
          isDragging={isDragging}
          handleImageUpload={handleImageUpload}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
        />

        <ClientDialog
          isDialogOpen={isClientDialogOpen}
          setIsDialogOpen={setIsClientDialogOpen}
          editingClient={editingClient}
          newClient={newClient}
          setNewClient={setNewClient}
          saveClient={saveClient}
          uploadingImage={uploadingImage}
          isDragging={isDragging}
          handleImageUpload={handleClientLogoUpload}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleClientDrop}
        />

        {showPasswordChange && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Смена пароля
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Повторите новый пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && changePassword()}
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                )}
                <Button onClick={changePassword} className="w-full">
                  Сменить пароль
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}