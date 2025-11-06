const BackgroundShapes = () => {
  return (
    <>
      <div className="floating-cube" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
      <div className="floating-cube" style={{ top: '60%', right: '10%', animationDelay: '2s' }}></div>
      <div className="floating-shape shape-circle" style={{ top: '20%', right: '15%', animationDelay: '1s' }}></div>
      <div className="floating-shape shape-triangle" style={{ bottom: '15%', left: '8%', animationDelay: '3s' }}></div>
      <div className="floating-shape shape-hexagon" style={{ top: '45%', left: '12%', animationDelay: '4s' }}></div>
      <div className="floating-shape shape-circle" style={{ bottom: '25%', right: '20%', animationDelay: '2.5s' }}></div>
      <div className="floating-shape shape-triangle" style={{ top: '70%', right: '5%', animationDelay: '5s' }}></div>
    </>
  );
};

export default BackgroundShapes;
