import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  activeSection: string;
  mobileMenuOpen: boolean;
  language: 'ru' | 'en' | 'zh';
  t: any;
  scrollToSection: (sectionId: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setLanguage: (lang: 'ru' | 'en' | 'zh') => void;
}

const Navigation = ({
  activeSection,
  mobileMenuOpen,
  language,
  t,
  scrollToSection,
  setMobileMenuOpen,
  setLanguage,
}: NavigationProps) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const mobileLanguageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileLanguageMenuRef.current && !mobileLanguageMenuRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageMenuOpen]);

  const navItems = [
    { id: 'home', label: t.nav.home, color: 'from-blue-600 to-cyan-500' },
    { id: 'technologies', label: t.nav.technologies, color: 'from-purple-600 to-pink-500' },
    { id: 'materials', label: t.nav.materials, color: 'from-green-600 to-emerald-500' },
    { id: 'portfolio', label: t.nav.portfolio, color: 'from-orange-600 to-yellow-500' },
    { id: 'order', label: t.nav.order, color: 'from-pink-600 to-rose-500' },
    { id: 'contacts', label: t.nav.contacts, color: 'from-indigo-600 to-purple-500' },
  ];

  const languages = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: 'ru' | 'en' | 'zh') => {
    setLanguageMenuOpen(false);
    setIsChanging(true);
    setTimeout(() => {
      setLanguage(langCode);
      setTimeout(() => {
        setIsChanging(false);
      }, 400);
    }, 200);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/3c3906bd-e851-4dbd-8fe8-2b8a7acff3cc.jpg" 
              alt="3DPrintCustom Logo" 
              className="w-12 h-12 object-contain rounded-xl"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              3DPrintCustom
            </h1>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-all duration-200 relative group ${
                  activeSection === item.id ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent` : 'text-gray-600 hover:opacity-80'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${item.color} transition-all duration-200 ${
                  activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
            <div className="relative ml-4 border-l pl-4" ref={languageMenuRef}>
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 p-1.5 rounded-lg text-base hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all relative group"
                title={currentLanguage?.label}
              >
                <span className={`inline-block transition-all duration-300 group-hover:scale-110 ${isChanging ? 'flag-change' : ''}`}>{currentLanguage?.flag}</span>
                <Icon name={languageMenuOpen ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-gray-600 transition-transform duration-200" />
                <span className="absolute inset-0 rounded-lg border border-transparent group-hover:border-blue-200 transition-colors duration-200"></span>
              </button>
              {languageMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in slide-in-from-top-5 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as 'ru' | 'en' | 'zh')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${
                        language === lang.code ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      {language === lang.code && (
                        <Icon name="Check" size={12} className="ml-auto text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="md:hidden relative" ref={mobileLanguageMenuRef}>
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 p-1 rounded text-sm hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all relative group"
                title={currentLanguage?.label}
              >
                <span className={`inline-block transition-all duration-300 group-hover:scale-110 ${isChanging ? 'flag-change' : ''}`}>{currentLanguage?.flag}</span>
                <Icon name={languageMenuOpen ? 'ChevronUp' : 'ChevronDown'} size={10} className="text-gray-600 transition-transform duration-200" />
                <span className="absolute inset-0 rounded border border-transparent group-hover:border-blue-200 transition-colors duration-200"></span>
              </button>
              {languageMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in slide-in-from-top-5 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as 'ru' | 'en' | 'zh')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-100 transition-colors ${
                        language === lang.code ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''
                      }`}
                    >
                      <span className="text-xs">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      {language === lang.code && (
                        <Icon name="Check" size={10} className="ml-auto text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 space-y-2 animate-in slide-in-from-top-5 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;