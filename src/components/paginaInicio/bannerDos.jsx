"use client";

import { motion } from 'framer-motion';
import banner2 from '../../assets/images/banner4.png';

const Banner = () => {
  return (
    <section className="relative w-full h-[300px] xs:h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[850px] overflow-hidden bg-white">
      {/* Imagen de fondo clara */}
      <div className="absolute inset-0 z-0">
        <img
          src={banner2}
          alt="Banner fondo"
          className="w-full h-full object-cover brightness-[.75]"
        />

        {/* Difuminado blanco arriba y abajo */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[120px] xs:h-[150px] sm:h-[200px] bg-gradient-to-b from-white via-white/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[120px] xs:h-[150px] sm:h-[200px] bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>
      </div>

      {/* Contenedor Principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-20 flex items-center h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40"
      >
        <div className="text-left space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6 max-w-4xl">
          
          {/* Título: Entrada desde la izquierda con delay corto */}
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-snug sm:leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
          >
            <span className="text-white">CENTRO DE </span>
            <span className="text-[#9DC435]">MAQUILA DE FRENOS</span>
          </motion.h1>

          {/* Subtítulo: Aparece de abajo hacia arriba justo después */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-white text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
          >
            DISTRIBUIDORA E IMPORTADORA DE PARTES DE FRENOS
          </motion.p>

          {/* Badge: Aparece con un pequeño rebote (scale) al final */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.6 
            }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#9DC435]/10 border border-[#9DC435]/30 backdrop-blur-sm px-4 py-1.5 rounded-full"
          >
            <div className="w-1.5 h-1.5 bg-[#9DC435] rounded-full animate-pulse" />
            <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest">
              FABRICANTES DIRECTOS — NO REVENDEDORES
            </span>
          </motion.div>

          {/* Botón: Entrada suave final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="pt-1 sm:pt-2"
          >
            {/* Aquí va tu botón */}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;
