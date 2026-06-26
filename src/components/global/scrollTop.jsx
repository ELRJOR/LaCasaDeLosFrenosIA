import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // CAMBIO CLAVE: Quitamos el "smooth" para que sea instantáneo
    window.scrollTo(0, 0); 
    
    // Si quieres asegurar que Framer Motion detecte el cambio de página
    // puedes forzar un pequeño refresco de los observadores:
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;