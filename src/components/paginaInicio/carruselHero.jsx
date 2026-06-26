"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useDrag } from "@use-gesture/react";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";

// Imágenes
import mecanicoCamion from "../../assets/images/mecanico_camion1.jpg";
import ciudadAuto from "../../assets/images/ciudad_auto.png";
import balata from "../../assets/images/balata.png";

const Banner = () => {
  const [slideActual, setSlideActual] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null);

  const banners = [
    {
      imagen: mecanicoCamion,
      voltear: false,
      contenido: (
        <div className="text-white w-full max-w-2xl space-y-4 sm:space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start -mt-12 sm:-mt-24">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight uppercase drop-shadow-2xl"
          >
            ESPECIALISTAS EN<br />
            <span className="text-[#9DC435]">MAQUILA DE FRENOS</span>
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl font-medium max-w-md"
          >
            Somos importadores directos de partes industriales para frenos.
            Fabricamos, no revendemos. Asegura calidad y precio desde el origen.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center sm:items-start gap-6"
          >
            <Link
              to="/nosotros#quienes-somos"
              className="inline-flex items-center justify-center px-10 py-4 text-xs sm:text-sm font-black rounded-full bg-[#9DC435] text-black hover:bg-white transition-all duration-300 shadow-2xl uppercase tracking-widest"
            >
              CONOCER MÁS
            </Link>
            {/* Flecha solo visible en móvil */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="block sm:hidden text-[#9DC435] text-2xl"
            >
              <FaChevronDown />
            </motion.div>
          </motion.div>
        </div>
      ),
    },
    {
      imagen: ciudadAuto,
      voltear: true,
      contenido: (
        <div className="text-white w-full max-w-2xl space-y-4 sm:space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start -mt-12 sm:-mt-24">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight uppercase"
          >
            PRODUCTOS DE<br />
            <span className="text-[#9DC435]">ALTO DESEMPEÑO</span>
          </motion.h2>
          <div className="space-y-3">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.9 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base sm:text-lg font-medium"
            >
              Discos y pastillas de máxima calidad para tu seguridad.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="hidden sm:flex flex-col gap-2 opacity-90 text-sm md:text-base"
            >
              {["Alta durabilidad", "Alto rendimiento", "Potencia mejorada"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#9DC435] text-sm" /> {item}
                </li>
              ))}
            </motion.ul>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center sm:items-start gap-6"
          >
            <Link
              to="/catalogo#catalogo"
              className="inline-flex items-center justify-center px-10 py-4 text-xs sm:text-sm font-black rounded-full bg-[#9DC435] text-black hover:bg-white transition-all duration-300 shadow-2xl uppercase tracking-widest"
            >
              VER PRODUCTOS
            </Link>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="block sm:hidden text-[#9DC435] text-2xl"
            >
              <FaChevronDown />
            </motion.div>
          </motion.div>
        </div>
      ),
    },
    {
      imagen: balata,
      voltear: false,
      contenido: (
        <div className="text-white w-full max-w-2xl space-y-4 sm:space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start -mt-12 sm:-mt-24">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight uppercase"
          >
            CALIDAD<br />
            <span className="text-[#9DC435]">INDUSTRIAL</span>
          </motion.h2>
          <div className="space-y-3">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.9 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base sm:text-lg font-medium"
            >
              Marcas líderes en frenos para transporte pesado.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="hidden sm:flex flex-col gap-2 opacity-90 text-sm md:text-base"
            >
              {["American Brake Block", "Euro Friction", "Meritor", "Zapatas de frenos"].map((marca, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#9DC435] text-sm" /> {marca}
                </li>
              ))}
            </motion.ul>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center sm:items-start gap-6"
          >
            <Link
              to="/#empresas"
              className="inline-flex items-center justify-center px-10 py-4 text-xs sm:text-sm font-black rounded-full bg-[#9DC435] text-black hover:bg-white transition-all duration-300 shadow-2xl uppercase tracking-widest"
            >
              CONOCER MARCAS
            </Link>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="block sm:hidden text-[#9DC435] text-2xl mt-8"
            >
              <FaChevronDown />
            </motion.div>
          </motion.div>
        </div>
      ),
    },
  ];

  const siguienteSlide = useCallback(() => setSlideActual((prev) => (prev + 1) % banners.length), [banners.length]);
  const anteriorSlide = useCallback(() => setSlideActual((prev) => (prev - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (isHovering) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(siguienteSlide, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovering, siguienteSlide]);

  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX !== 0) {
      if (swipeX === 1) anteriorSlide();
      if (swipeX === -1) siguienteSlide();
      if (timerRef.current) { clearInterval(timerRef.current); if (!isHovering) timerRef.current = setInterval(siguienteSlide, 7000); }
    }
  }, { swipe: { distance: 20, velocity: 0.1 } });

  return (
    <div
      {...bind()}
      className="relative w-full h-[100dvh] sm:h-[500px] md:h-[600px] lg:h-[750px] overflow-hidden bg-black touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slideActual}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.25 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src={banners[slideActual].imagen}
            alt="Banner"
            className={`w-full h-full object-cover pointer-events-none ${banners[slideActual].voltear ? "scale-x-[-1]" : ""}`}
          />
          <div className="absolute inset-0 bg-black/40 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/20" />

          <div className="absolute inset-0 flex items-center justify-center sm:justify-start px-6 sm:px-12 md:px-24 lg:px-32">
            <div className="pointer-events-auto w-full">
              {banners[slideActual].contenido}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hidden sm:flex absolute inset-0 items-center justify-between px-6 pointer-events-none z-40">
        <button onClick={anteriorSlide} className="w-10 h-10 flex items-center justify-center text-white/10 hover:text-[#9DC435] transition-all duration-300 pointer-events-auto"><FaChevronLeft className="text-3xl" /></button>
        <button onClick={siguienteSlide} className="w-10 h-10 flex items-center justify-center text-white/10 hover:text-[#9DC435] transition-all duration-300 pointer-events-auto"><FaChevronRight className="text-3xl" /></button>
      </div>

      {/* Solo Dots en la parte inferior */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setSlideActual(idx); if (timerRef.current) clearInterval(timerRef.current); }}
            className={`transition-all duration-700 rounded-full h-1 ${idx === slideActual ? "w-10 bg-[#9DC435]" : "w-2 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;