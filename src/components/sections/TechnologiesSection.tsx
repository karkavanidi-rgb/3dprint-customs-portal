import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface TechnologiesSectionProps {
  t: any;
  technologies: Array<{
    icon: string;
    name: string;
    desc: string;
  }>;
}

const TechnologiesSection = ({ t, technologies }: TechnologiesSectionProps) => {
  return (
    <section id="technologies" className="py-20 px-4 relative">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.technologies.title}
          </h2>
          <p className="text-xl text-gray-600">{t.technologies.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech) => (
            <Card key={tech.name} className="group hover:shadow-xl transition-all border-2 hover:border-primary cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon name={tech.icon} className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">{tech.name}</CardTitle>
                <CardDescription className="text-base">{tech.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Check" className="text-green-600" size={20} />
                    <span className="text-sm">{t.technologies.check1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Check" className="text-green-600" size={20} />
                    <span className="text-sm">{t.technologies.check2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Check" className="text-green-600" size={20} />
                    <span className="text-sm">{t.technologies.check3}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;
