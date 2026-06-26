import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import manufacturaImg from '../../assets/images/manufactura.png';
import facturaImg from '../../assets/images/factura.jpg';
import distribucionImg from '../../assets/images/distribucion.jpg';

const servicios = [
  {
    titulo: "Manufactura",
    imagen: manufacturaImg,
    descripcion: "Producción especializada de componentes de freno con estándares de calidad industrial.",
  },
  {
    titulo: "Facturación",
    imagen: facturaImg,
    descripcion: "Emisión de facturas claras y precisas para clientes nacionales y foráneos, con cumplimiento fiscal.",
  },
  {
    titulo: "Distribución",
    imagen: distribucionImg,
    descripcion: "Logística eficiente para entregar en tiempo y forma a cualquier parte del país.",
  },
];

const Servicios = () => {
  const [activo, setActivo] = useState(null);
  const [expansionCompleta, setExpansionCompleta] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const handleCardClick = (index) => {
    if (!isMobile) return;
    if (activo === index) {
      setActivo(null);
      setExpansionCompleta(null);
    } else {
      setActivo(index);
      setExpansionCompleta(index);
    }
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
      }}
      className="py-20 bg-white text-gray-800"
    >
      {/* TÍTULO ORIGINAL AJUSTADO PARA PANTALLAS GRANDES */}
      <div className="text-center mb-16 md:mb-20 px-4">
        <motion.h2
          /* Escalamos de 3xl en móvil, a 5xl en tablets y hasta 6xl en pantallas grandes */
          className="text-3xl md:text-2xl lg:text-5xl font-black uppercase tracking-tighter"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          NUESTRA <span className="text-[#9DC435]">ESPECIALIZACIÓN</span>
        </motion.h2>

        <motion.p
          /* Ajustamos el tamaño del párrafo y el ancho máximo para que no se estire demasiado */
          className="text-sm md:text-lg lg:text-xl text-gray-500 mt-4 max-w-xs md:max-w-3xl mx-auto leading-relaxed"

          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
          }}
        >
          Nos destacamos en procesos integrales que garantizan calidad, cumplimiento y eficiencia para tu negocio.
        </motion.p>
      </div>

      <motion.div
        className={`flex max-w-[1550px] mx-auto px-4 ${isMobile ? "flex-col h-auto gap-4" : "h-[550px] gap-1"}`}
        onMouseLeave={() => {
          if (!isMobile) {
            setActivo(null);
            setExpansionCompleta(null);
          }
        }}
      >
        {servicios.map((item, index) => {
          const isActive = index === activo;
          const mostrarTexto = isActive && expansionCompleta === index;

          return (
            <motion.div
              key={index}
              animate={
                isMobile
                  ? (isActive ? { height: "320px" } : { height: "150px" })
                  : {
                    flexBasis: activo === null ? "33.333%" : isActive ? "65%" : "17.5%",
                    opacity: activo === null ? 1 : isActive ? 1 : 0.8,
                    height: "100%"
                  }
              }
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => {
                if (!isMobile) {
                  setActivo(index);
                  setExpansionCompleta(null);
                }
              }}
              onAnimationComplete={() => {
                if (isActive && !isMobile) setExpansionCompleta(index);
              }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className={`relative overflow-hidden bg-cover bg-center cursor-pointer shadow-md flex flex-col justify-end ${isActive ? "z-10 shadow-2xl" : "z-0"}`}
              style={{
                backgroundImage: `url(${item.imagen})`,
                borderTopLeftRadius: !isMobile && index === 0 ? "40px" : isMobile ? "20px" : "0px",
                borderBottomLeftRadius: !isMobile && index === 0 ? "40px" : isMobile ? "20px" : "0px",
                borderTopRightRadius: !isMobile && index === 2 ? "40px" : isMobile ? "20px" : "0px",
                borderBottomRightRadius: !isMobile && index === 2 ? "40px" : isMobile ? "20px" : "0px",
              }}
            >
              {/* Overlay suave */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  backgroundColor: mostrarTexto || (isMobile && isActive)
                    ? "rgba(0, 0, 0, 0.75)"
                    : "rgba(0, 0, 0, 0.40)"
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              {/* Contenido: JUSTIFY-END asegura que todo esté abajo */}
              <div className="relative p-8 md:p-10 text-white h-full flex flex-col justify-end z-20 w-full overflow-hidden">

                {/* Título: Blindado y abajo */}
                <div className="w-full">
                  <motion.h3
                    layout="position"
                    className={`${isMobile ? "text-2xl" : "text-4xl"} font-black uppercase mb-1 whitespace-nowrap`}
                  >
                    {item.titulo}
                  </motion.h3>
                </div>

                {/* Párrafo: Aparece arriba del título si usas flex-col-reverse, pero aquí lo dejamos debajo para orden lógico */}
                <div className={`${isMobile ? (isActive ? "h-auto" : "h-0") : (mostrarTexto ? "h-auto" : "h-0")} overflow-hidden relative`}>
                  <AnimatePresence>
                    {(mostrarTexto || (isMobile && isActive)) && (
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{
                          duration: 0.6,
                          delay: 0.3,
                          ease: "easeOut"
                        }}
                        className="text-white/90 text-sm md:text-lg leading-tight font-medium"
                      >
                        {item.descripcion}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default Servicios;