import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Order, statusLabels, statusColors } from './types';

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  expandedOrder: number | null;
  setExpandedOrder: (id: number | null) => void;
  updateOrderStatus: (orderId: number, newStatus: string) => void;
  deleteOrder: (orderId: number) => void;
  exportToExcel: (orders: Order[]) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchEmail: string;
  setSearchEmail: (email: string) => void;
}

export default function OrdersList({
  orders,
  loading,
  expandedOrder,
  setExpandedOrder,
  updateOrderStatus,
  deleteOrder,
  exportToExcel,
  filterStatus,
  setFilterStatus,
  searchEmail,
  setSearchEmail
}: OrdersListProps) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
        <p className="mt-4 text-gray-600">Загрузка заявок...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Inbox" size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Заявок пока нет</p>
        </CardContent>
      </Card>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesEmail = !searchEmail || order.email.toLowerCase().includes(searchEmail.toLowerCase());
    return matchesStatus && matchesEmail;
  });

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label>Фильтр по статусу</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="processing">В работе</SelectItem>
              <SelectItem value="completed">Выполненные</SelectItem>
              <SelectItem value="cancelled">Отмененные</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Поиск по email</Label>
          <Input
            placeholder="Введите email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Найдено заявок: {filteredOrders.length} из {orders.length}
        </h2>
        <Button 
          onClick={() => exportToExcel(filteredOrders)}
          variant="default"
          disabled={filteredOrders.length === 0}
        >
          <Icon name="Download" size={18} className="mr-2" />
          Экспорт в Excel
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icon name="Search" size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Заявки не найдены</p>
            <p className="text-sm text-gray-500 mt-2">Попробуйте изменить фильтры</p>
          </CardContent>
        </Card>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <span>Заявка #{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {order.email} • {new Date(order.created_at).toLocaleString('ru-RU')}
                  </CardDescription>
                </div>
                <Icon 
                  name={expandedOrder === order.id ? "ChevronUp" : "ChevronDown"} 
                  size={24} 
                  className="text-gray-400"
                />
              </div>
            </CardHeader>

            {expandedOrder === order.id && (
              <CardContent className="border-t bg-gray-50 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="User" size={18} />
                      Информация о клиенте
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Тип:</span> {order.customer_type === 'legal' ? 'Юр. лицо' : 'Физ. лицо'}</p>
                      {order.company_name && <p><span className="font-medium">Компания:</span> {order.company_name}</p>}
                      {order.inn && <p><span className="font-medium">ИНН:</span> {order.inn}</p>}
                      <p><span className="font-medium">Email:</span> {order.email}</p>
                      {order.phone && <p><span className="font-medium">Телефон:</span> {order.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Box" size={18} />
                      Параметры печати
                    </h3>
                    <div className="space-y-2 text-sm">
                      {order.length && <p><span className="font-medium">Размеры:</span> {order.length}×{order.width}×{order.height} мм</p>}
                      {order.plastic_type && <p><span className="font-medium">Материал:</span> {order.plastic_type}</p>}
                      {order.color && <p><span className="font-medium">Цвет:</span> {order.color}</p>}
                      {order.infill && <p><span className="font-medium">Заполнение:</span> {order.infill}%</p>}
                      <p><span className="font-medium">Количество:</span> {order.quantity} шт</p>
                    </div>
                  </div>
                </div>

                {order.description && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Описание
                    </h3>
                    <p className="text-sm bg-white p-4 rounded-lg border">{order.description}</p>
                  </div>
                )}

                {order.file_url && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Paperclip" size={18} />
                      Файл модели
                    </h3>
                    <a 
                      href={order.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Icon name="Download" size={16} />
                      {order.file_name || 'Скачать файл'}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label className="mb-2 block">Изменить статус</Label>
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="processing">В работе</SelectItem>
                          <SelectItem value="completed">Выполнена</SelectItem>
                          <SelectItem value="cancelled">Отменена</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteOrder(order.id)}
                      className="h-10"
                    >
                      <Icon name="Trash2" size={18} className="mr-2" />
                      Удалить заявку
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
}