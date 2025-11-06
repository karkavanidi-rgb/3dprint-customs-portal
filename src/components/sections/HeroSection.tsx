import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  t: any;
  scrollToSection: (sectionId: string) => void;
}

const HeroSection = ({ t, scrollToSection }: HeroSectionProps) => {
  const features = [
    { icon: 'Zap', title: t.hero.feature1Title, desc: t.hero.feature1Desc },
    { icon: 'Award', title: t.hero.feature2Title, desc: t.hero.feature2Desc },
    { icon: 'Users', title: t.hero.feature3Title, desc: t.hero.feature3Desc },
  ];

  return (
    <section id="home" className="pt-32 pb-20 px-4 relative">
      <div className="container mx-auto text-center relative z-10">
        <div className="mb-8 inline-block">
          <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
            {t.hero.badge}
          </Badge>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          {t.hero.title}<br />{t.hero.titleBreak}
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="text-lg px-8" onClick={() => scrollToSection('contacts')}>
            {t.hero.contactBtn}
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection('portfolio')}>
            {t.hero.portfolioBtn}
          </Button>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((item) => (
            <Card key={item.title} className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Icon name={item.icon} className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
