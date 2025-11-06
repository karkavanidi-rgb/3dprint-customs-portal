import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ContactsSectionProps {
  t: any;
}

const ContactsSection = ({ t }: ContactsSectionProps) => {
  return (
    <section id="contacts" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.contacts.title}
          </h2>
          <p className="text-xl text-gray-600">{t.contacts.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Icon name="Mail" className="text-white" size={24} />
              </div>
              <CardTitle>{t.contacts.email}</CardTitle>
              <CardDescription className="text-base">{t.contacts.emailValue}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Icon name="MapPin" className="text-white" size={24} />
              </div>
              <CardTitle>{t.contacts.address}</CardTitle>
              <CardDescription className="text-base">{t.contacts.addressValue}</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="text-base px-4 py-2">{t.contacts.badge1}</Badge>
            <Badge variant="outline" className="text-base px-4 py-2">{t.contacts.badge2}</Badge>
            <Badge variant="outline" className="text-base px-4 py-2">{t.contacts.badge3}</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
