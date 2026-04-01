import React, { useState, useEffect } from 'react';

const getWindowSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

const Footer = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize);

  useEffect(() => {
    const handleResize = () => setWindowSize(getWindowSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className="footer">
      <p>© 2026 Movie Gallery. Labs Project.</p>
      <div className="window-info">
        Window size: {windowSize.width} x {windowSize.height}
      </div>
    </footer>
  );
};

export default Footer;