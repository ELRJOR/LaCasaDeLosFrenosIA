import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/menuHover.css';
import '../../styles/buttonContactHover.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Estado para mostrar/ocultar el botón de subir
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5800) { // Aparece tras bajar 300px
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const menuItems = [
    { name: 'INICIO', id: 'inicio', route: '/' },
    { name: 'PRODUCTOS', id: 'productos', route: '/catalogo' },
    { name: 'ENCUÉNTRANOS', id: 'encuentranos', route: '/encuentranos' },
    { name: '¿QUIÉNES SOMOS?', id: 'catalogos', route: '/nosotros' },
    { name: 'CONTACTO', id: 'contacto', route: '/contacto' },
    { name: 'LOGIN', id: 'login', route: '/loginAdmin' }
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  const iconVariants = {
    top: {
      closed: { rotate: 0, translateY: 0 },
      opened: { rotate: 45, translateY: 10 }
    },
    middle: {
      closed: { opacity: 1 },
      opened: { opacity: 0 }
    },
    bottom: {
      closed: { rotate: 0, translateY: 0 },
      opened: { rotate: -45, translateY: -10 }
    }
  };


  return (
    <header className="relative w-full z-50">
      {/* Navbar Desktop - Usando bg-[#0D0F0F] con transparencia 40% para el blur */}
      <nav className="hidden md:flex items-center justify-between px-6 h-[100px] bg-[#0D0F0F]/40 backdrop-blur-md border-b border-white/10 text-white">
        <Link to="/" className="flex items-center h-full">
          <Link to="/" className="flex items-center h-full group">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center h-full"
            >
              {/* Contenedor del Logo */}
              <img
                src={logo}
                alt="Logo"
                className="h-[60px] md:h-[80px] lg:h-[90px] w-auto object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              />

              {/* Texto Unificado al mismo tamaño con Sombra de Profundidad */}
              <div className="ml-3 md:ml-4 flex flex-col lg:flex-row lg:items-center leading-none">
                {/* Añadimos `textShadow` de forma local para controlarla mejor:
        - 0 offset horizontal
        - 2px offset vertical (hacia abajo)
        - 4px de desenfoque (blur)
        - Negro con 30% opacidad
      */}
                <h1
                  className="uppercase font-black text-[#9DC435] tracking-tighter"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  <span className="text-[20px] md:text-[26px] lg:text-[30px] block lg:inline">
                    La Casa de los
                  </span>
                  <span className="text-[20px] md:text-[26px] lg:text-[30px] block lg:inline lg:ml-2">
                    Frenos
                  </span>
                </h1>
              </div>
            </motion.div>
          </Link>
        </Link>
        <div className="flex items-center">
          <ul className="menu-hover flex gap-6 items-center">
                {menuItems.map((item) => (
                <li key={item.id}><Link to={item.route}>{item.name}</Link></li>
            ))}
          </ul>
        </div>
      </nav>

      {/* BOTÓN VOLVER ARRIBA */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            /* - bg-[#9DC435]/40: Bajamos la opacidad al 40% para que sea muy transparente.
               - backdrop-blur-md: Aumentamos el desenfoque del fondo.
               - p-2 md:p-3: Más pequeño en móvil.
            */
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] flex items-center bg-[#9DC435]/70 backdrop-blur-md p-2.5 md:p-3 rounded-full border border-white/10 shadow-xl active:scale-90 transition-all group overflow-hidden"
          >
            {/* TEXTO ANIMADO (Solo visible en Desktop/Hover) */}
            <span className="max-w-0 opacity-0 text-[10px] md:text-xs font-bold text-white uppercase whitespace-nowrap tracking-wider group-hover:max-w-xs group-hover:opacity-100 group-hover:mr-2 transition-all duration-500 ease-in-out">
              Volver arriba
            </span>

            {/* ICONO CHEVRON BLANCO */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 md:w-6 md:h-6 stroke-white fill-none stroke-[2.5] transition-transform group-hover:-translate-y-0.5"
            >
              <path d="M4.5 15.75l7.5-7.5 7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navbar Mobile - Usando bg-[#0D0F0F] */}
      <nav className="md:hidden flex items-center justify-between px-4 h-[80px] bg-[#0D0F0F]/60 backdrop-blur-md border-b border-white/10 text-white z-50 relative">
        <Link to="/" className="flex items-center h-full min-w-0 group">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center h-full"
          >
            {/* Logo con efecto hover */}
            <img
              src={logo}
              alt="Logo"
              className="h-[50px] w-auto object-contain mr-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            />

            {/* Texto en una sola línea a 20px */}
            <span
              className="text-[20px] font-black text-[#9DC435] uppercase whitespace-nowrap tracking-tighter"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              La Casa de los Frenos
            </span>
          </motion.div>
        </Link>

        {/* Botón Hamburguesa con animación de entrada */}
        <motion.button
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative w-12 h-12 flex flex-col justify-center items-center focus:outline-none z-50"
        >
          <div className="flex flex-col justify-between h-[22px] w-7">
            <motion.span
              variants={iconVariants.top}
              animate={mobileMenuOpen ? "opened" : "closed"}
              className="w-7 h-[2px] bg-[#9DC435] block origin-center"
            />
            <motion.span
              variants={iconVariants.middle}
              animate={mobileMenuOpen ? "opened" : "closed"}
              className="w-7 h-[2px] bg-[#9DC435] block"
            />
            <motion.span
              variants={iconVariants.bottom}
              animate={mobileMenuOpen ? "opened" : "closed"}
              className="w-7 h-[2px] bg-[#9DC435] block origin-center"
            />
          </div>
        </motion.button>
      </nav>

      {/* Mobile Menu Animado - Usando bg-[#0D0F0F] al 95% para casi opacidad total */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 pt-[80px] bg-[#0D0F0F]/95 backdrop-blur-xl md:hidden z-40"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col p-8 gap-6 h-full"
            >
              {menuItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  {item.id === 'contacto' ? (
                    /* BOTÓN DE CONTACTO (Sin línea inferior porque es el último) */
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 5px rgba(157, 196, 53, 0.1)",
                          "0 0 25px rgba(157, 196, 53, 0.4)",
                          "0 0 5px rgba(157, 196, 53, 0.1)"
                        ],
                        borderColor: [
                          "rgba(157, 196, 53, 0.2)",
                          "rgba(157, 196, 53, 0.7)",
                          "rgba(157, 196, 53, 0.2)"
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mt-4 rounded-lg border overflow-hidden"
                    >
                      <Link
                        to={item.route}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex justify-center items-center py-3 px-6 text-[#9DC435] text-xl font-bold transition-all duration-300 hover:bg-[#9DC435] hover:text-[#0D0F0F] active:scale-95"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ) : (
                    /* OPCIONES DEL MENÚ CON LÍNEA DIVISORIA SUTIL */
                    <Link
                      to={item.route}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-bold text-white hover:text-[#9DC435] active:scale-95 transition-all block pb-4 border-b border-white/10"
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="mt-auto pb-10 text-[8px] text-center text-gray-500/60 tracking-[0.25em] font-light uppercase leading-loose px-6"
              >
                <div className="mb-1">
                  Fabricantes Directos — No Revendedores
                </div>
                <div className="opacity-40 normal-case tracking-[0.1em]">
                  Distribuidora e Importadora de Partes de Frenos • {new Date().getFullYear()}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;