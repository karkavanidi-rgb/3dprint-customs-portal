const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 px-4 relative z-50">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img 
            src="https://cdn.poehali.dev/files/3c3906bd-e851-4dbd-8fe8-2b8a7acff3cc.jpg" 
            alt="3DPrintCustom Logo" 
            className="w-12 h-12 object-contain rounded-xl"
          />
          <h3 className="text-2xl font-bold">3DPrintCustom</h3>
        </div>
        <p className="text-gray-300 mb-4">Инновационные технологии 3D-печати для вашего бизнеса</p>
        <p className="text-gray-400 text-sm">© 2024 3DPrintCustom. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;