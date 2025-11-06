import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { ClientItem } from './types';

interface ClientDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingClient: ClientItem | null;
  newClient: Partial<ClientItem>;
  setNewClient: (client: Partial<ClientItem>) => void;
  saveClient: (client: Partial<ClientItem>) => void;
  uploadingImage: boolean;
  isDragging: boolean;
  handleImageUpload: (file: File) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

export default function ClientDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingClient,
  newClient,
  setNewClient,
  saveClient,
  uploadingImage,
  isDragging,
  handleImageUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop
}: ClientDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingClient ? 'Редактировать клиента' : 'Добавить клиента'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название компании</Label>
            <Input
              id="name"
              value={newClient.name || ''}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              placeholder="Yandex"
            />
          </div>

          <div className="space-y-2">
            <Label>Логотип</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {newClient.logo_url ? (
                <div className="space-y-4">
                  <div className="max-h-40 flex items-center justify-center bg-gray-50 rounded p-4">
                    <img 
                      src={newClient.logo_url} 
                      alt="Preview" 
                      className="max-h-32 object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewClient({ ...newClient, logo_url: '' })}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Удалить логотип
                  </Button>
                </div>
              ) : (
                <>
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Перетащите изображение сюда или нажмите для выбора
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <Button variant="outline" size="sm" disabled={uploadingImage} asChild>
                      <span>
                        {uploadingImage ? (
                          <>
                            <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                            Загрузка...
                          </>
                        ) : (
                          <>
                            <Icon name="Upload" size={16} className="mr-2" />
                            Выбрать файл
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Порядок отображения</Label>
              <Input
                id="display_order"
                type="number"
                value={newClient.display_order || 0}
                onChange={(e) => setNewClient({ ...newClient, display_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_visible">Видимость</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="is_visible"
                  checked={newClient.is_visible ?? true}
                  onCheckedChange={(checked) => setNewClient({ ...newClient, is_visible: checked })}
                />
                <Label htmlFor="is_visible" className="cursor-pointer">
                  {newClient.is_visible ? 'Виден' : 'Скрыт'}
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => saveClient(newClient)} className="flex-1">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
