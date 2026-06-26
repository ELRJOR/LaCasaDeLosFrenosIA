import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import aseLogo from "../../assets/images/Empresas/ASE.jpg";
import boosterLogo from "../../assets/images/Empresas/booster.jpg";
import goldenLogo from "../../assets/images/Empresas/Golden.png";
import katLogo from "../../assets/images/Empresas/Kat.png";
import rapidosLogo from "../../assets/images/Empresas/Rapidos.jpg";
import riverLogo from "../../assets/images/Empresas/river.jpg";
import rocaLogo from "../../assets/images/Empresas/Roca.jpg";
import apsaLogo from "../../assets/images/Empresas/APSA.jpg";
import sdaLogo from "../../assets/images/Empresas/SDA.jpg";
import amsaLogo from "../../assets/images/Empresas/Amsa.jpg";
import yucarroLogo from "../../assets/images/Empresas/yucarro.jpg";

const companyLogos = [
  { name: "ASE", logo: aseLogo },
  { name: "Booster", logo: boosterLogo },
  { name: "Golden", logo: goldenLogo },
  { name: "KAT", logo: katLogo },
  { name: "Rápidos", logo: rapidosLogo },
  { name: "River", logo: riverLogo },
  { name: "Roca", logo: rocaLogo },
  { name: "APSA", logo: apsaLogo },
  { name: "SDA", logo: sdaLogo },
  { name: "Amsa", logo: amsaLogo },
  { name: "yucarro", logo: yucarroLogo },
];

const EmpresasAliadas = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="empresas" ref={sectionRef} className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">

        {/* TÍTULO CON TAMAÑOS AJUSTADOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-20 px-4"
        >
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-gray-800">
            NUESTROS <span className="text-[#9DC435]">CLIENTES Y PROVEEDORES</span>
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-gray-500 mt-4 max-w-xs md:max-w-3xl mx-auto leading-relaxed">
            Confianza mutua, compromiso y resultados durante más de una década de trabajo conjunto.
          </p>
        </motion.div>

        {/* CONTENEDOR DEL CARRUSEL CON PAUSA QUIRÚRGICA */}
        <div className="relative mt-10 group">
          {/* Degradados laterales */}
          <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden relative h-32 md:h-40 flex items-center">
            <motion.div
              /* Usamos group-hover para pausar el play-state de la animación de CSS */
              className="flex gap-12 md:gap-24 items-center absolute left-0 will-change-transform group-hover:[animation-play-state:paused]"
              animate={isInView ? { x: ["0%", "-50%"] } : {}}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              }}
            >
              {[...companyLogos, ...companyLogos].map((company, i) => (
                <div
                  key={i}
                  className="h-20 w-32 md:h-28 md:w-48 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-full max-w-full object-contain pointer-events-none"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpresasAliadas;