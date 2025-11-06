import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { PortfolioItem } from './types';

interface PortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: Partial<PortfolioItem>;
  setItem: (item: Partial<PortfolioItem>) => void;
  onSave: () => void;
  uploadingImage: boolean;
  isDragging: boolean;
  onImageUpload: (file: File) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function PortfolioDialog({
  isOpen,
  onClose,
  item,
  setItem,
  onSave,
  uploadingImage,
  isDragging,
  onImageUpload,
  onDragOver,
  onDragLeave,
  onDrop
}: PortfolioDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.id ? 'Редактировать работу' : 'Добавить работу'}</DialogTitle>
          <DialogDescription>
            Заполните информацию о работе для портфолио
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название работы</Label>
            <Input
              id="title"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              placeholder="Например: Архитектурные модели"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              placeholder="Краткое описание работы"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url">Изображение</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                value={item.image_url}
                onChange={(e) => setItem({ ...item, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingImage}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {uploadingImage ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={18} className="mr-2" />
                    Загрузить
                  </>
                )}
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file);
                }}
              />
            </div>
            <div 
              className={`mt-2 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt="Предпросмотр"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Ошибка+загрузки';
                  }}
                />
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <Icon name="ImagePlus" size={48} className="mb-2" />
                  <p className="text-sm">Перетащите изображение сюда</p>
                  <p className="text-xs mt-1">или нажмите кнопку "Загрузить"</p>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Порядок отображения</Label>
              <Input
                id="display_order"
                type="number"
                value={item.display_order}
                onChange={(e) => setItem({ ...item, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_visible">Видимость</Label>
              <Select 
                value={item.is_visible ? 'true' : 'false'}
                onValueChange={(value) => setItem({ ...item, is_visible: value === 'true' })}
              >
                <SelectTrigger id="is_visible">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Видимо</SelectItem>
                  <SelectItem value="false">Скрыто</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSave}>
            {item.id ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}