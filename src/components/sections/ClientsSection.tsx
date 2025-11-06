import { useState, useEffect } from 'react';

interface ClientsSectionProps {
  t: any;
}

interface ClientItem {
  id: number;
  name: string;
  logo_url: string;
  display_order: number;
}

const ClientsSection = ({ t }: ClientsSectionProps) => {
  const [clients, setClients] = useState<ClientItem[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/d584ff33-449c-4abe-8a4e-13cfe9b42ddc');
        const data = await response.json();
        setClients(data.clients || []);
      } catch (error) {
        console.error('Ошибка загрузки клиентов:', error);
      }
    };
    loadClients();
  }, []);

  return (
    <section id="clients" className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t.clients.title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t.clients.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 flex flex-col items-center justify-center"
            >
              <div className="w-full h-20 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img 
                  src={client.logo_url} 
                  alt={client.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                {client.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-gray-600 mt-1">{t.clients.stat1}</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-blue-300 to-purple-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-gray-600 mt-1">{t.clients.stat2}</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-purple-300 to-pink-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                5+
              </div>
              <div className="text-sm text-gray-600 mt-1">{t.clients.stat3}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;