import { useEffect } from 'react';

const ScrollToTop = () => {
  useEffect(() => {
    // Scroll ke atas setiap kali halaman di-refresh atau dimuat
    window.scrollTo(0, 0); 
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  return null;
};

export default ScrollToTop;
