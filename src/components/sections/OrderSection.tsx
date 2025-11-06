import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface OrderSectionProps {
  t: any;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

const OrderSection = ({ t, handleFormSubmit, isSubmitting = false }: OrderSectionProps) => {
  const [customerType, setCustomerType] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [plastic, setPlastic] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    
    if (file) {
      const maxSize = 7 * 1024 * 1024;
      
      if (file.size > maxSize) {
        setFileError('Файл слишком большой. Максимальный размер: 7 МБ. Для больших файлов отправьте на zakaz@3dprintcustom.ru');
        setFileName('');
        setFilePreview(null);
        e.target.value = '';
        return;
      }
      
      setFileName(file.name);
      setFilePreview(file.name);
    } else {
      setFileName('');
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFilePreview(null);
    setFileError('');
    const fileInput = document.getElementById('model-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <section id="order" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.order.sectionTitle}
          </h2>
          <p className="text-xl text-gray-600">{t.order.sectionSubtitle}</p>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">{t.order.title}</CardTitle>
            <CardDescription>{t.order.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order-length">{t.order.length}</Label>
                  <Input id="order-length" name="length" type="number" placeholder="100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-width">{t.order.width}</Label>
                  <Input id="order-width" name="width" type="number" placeholder="100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-height">{t.order.height}</Label>
                  <Input id="order-height" name="height" type="number" placeholder="100" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plastic-type">{t.order.plastic}</Label>
                <Select value={plastic} onValueChange={setPlastic} required>
                  <SelectTrigger id="plastic-type">
                    <SelectValue placeholder={t.order.plasticPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pla">{t.order.plasticOptions.pla}</SelectItem>
                    <SelectItem value="abs">{t.order.plasticOptions.abs}</SelectItem>
                    <SelectItem value="petg">{t.order.plasticOptions.petg}</SelectItem>
                    <SelectItem value="nylon">{t.order.plasticOptions.nylon}</SelectItem>
                    <SelectItem value="resin">{t.order.plasticOptions.resin}</SelectItem>
                    <SelectItem value="tpu">{t.order.plasticOptions.tpu}</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="plastic" value={plastic} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">{t.order.color}</Label>
                <Select value={color} onValueChange={setColor} required>
                  <SelectTrigger id="color">
                    <SelectValue placeholder={t.order.colorPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">{t.order.colorOptions.white}</SelectItem>
                    <SelectItem value="black">{t.order.colorOptions.black}</SelectItem>
                    <SelectItem value="red">{t.order.colorOptions.red}</SelectItem>
                    <SelectItem value="blue">{t.order.colorOptions.blue}</SelectItem>
                    <SelectItem value="green">{t.order.colorOptions.green}</SelectItem>
                    <SelectItem value="yellow">{t.order.colorOptions.yellow}</SelectItem>
                    <SelectItem value="orange">{t.order.colorOptions.orange}</SelectItem>
                    <SelectItem value="purple">{t.order.colorOptions.purple}</SelectItem>
                    <SelectItem value="gray">{t.order.colorOptions.gray}</SelectItem>
                    <SelectItem value="transparent">{t.order.colorOptions.transparent}</SelectItem>
                    <SelectItem value="custom">{t.order.colorOptions.custom}</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="color" value={color} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="infill">{t.order.infill}</Label>
                <Input id="infill" name="infill" type="number" min="10" max="100" defaultValue="15" placeholder="15" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">{t.order.quantity}</Label>
                <Input id="quantity" name="quantity" type="number" min="1" placeholder="1" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-file">{t.order.file}</Label>
                <Input 
                  id="model-file" 
                  name="model" 
                  type="file" 
                  accept=".stl,.step,.dwg,.obj,.3mf,.zip,.rar,.7z"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500">{t.order.fileFormats}</p>
                
                {fileError && (
                  <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <Icon name="AlertCircle" className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-sm text-red-700">{fileError}</p>
                  </div>
                )}
                
                {filePreview && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="File" className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                      <p className="text-xs text-gray-500">Файл готов к отправке</p>
                    </div>
                    <Icon name="CheckCircle2" className="text-green-500 flex-shrink-0" size={20} />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors group"
                      aria-label="Удалить файл"
                    >
                      <Icon name="X" className="text-gray-400 group-hover:text-red-600" size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order-description">{t.order.description}</Label>
                <Textarea 
                  id="order-description" 
                  name="description" 
                  placeholder={t.order.descriptionPlaceholder} 
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer-type">{t.order.customerType}</Label>
                <Select value={customerType} onValueChange={setCustomerType} required>
                  <SelectTrigger id="customer-type">
                    <SelectValue placeholder={t.order.customerTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">{t.order.customerTypeOptions.individual}</SelectItem>
                    <SelectItem value="legal">{t.order.customerTypeOptions.legal}</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="customerType" value={customerType} />
              </div>
              
              {customerType === 'legal' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">{t.order.companyName}</Label>
                    <Input id="company-name" name="companyName" type="text" placeholder="ООО Рога и копыта" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inn">{t.order.inn}</Label>
                    <Input id="inn" name="inn" type="text" placeholder="1234567890" required />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">{t.order.email}</Label>
                <Input id="contact-email" name="email" type="email" placeholder="example@mail.com" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">{t.order.phone}</Label>
                <Input id="contact-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" />
              </div>
              
              <Button type="submit" size="lg" className="w-full text-lg py-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2" size={20} />
                    {t.order.submit}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderSection;