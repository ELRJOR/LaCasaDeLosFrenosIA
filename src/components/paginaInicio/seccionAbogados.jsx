import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaUserTie } from 'react-icons/fa';
import legalImage from '../../assets/images/Abogados.jpg';

const AbogadosSeccion = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const handleWhatsAppClick = () => {
    if (!nombre.trim()) {
      setError("Por favor ingresa tu nombre.");
      return;
    }
    const numero = "529993469732";
    const mensaje = `Hola, me llamo ${nombre}. Me gustaría contactar para saber más acerca de asesoría jurídica.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      /* Mantenemos el fondo blanco y bordes de la sección principal */
      className="bg-white text-gray-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-100 w-full max-w-6xl mx-auto mt-10 mb-24 md:mb-32 border border-gray-100 flex flex-col md:flex-row items-center gap-10 lg:gap-16 overflow-hidden"
    >
      {/* Contenedor de Imagen OPTIMIZADO PARA MÓVIL */}
      <div className="w-full md:w-1/2 lg:w-[40%] group">
        {/* h-[180px] en móvil para que sea compacta, h-[400px] en desktop */}
        <div className="relative h-[180px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-[2rem]">
          <img
            src={legalImage}
            alt="Soporte legal"
            /*object-contain asegura que la imagen se vea COMPLETA sin cortes */
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="w-full md:w-1/2 text-left">
        <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full mb-6">
          <FaUserTie className="text-[#7FA82C] text-sm" />
          <span className="text-[#7FA82C] text-[10px] font-black uppercase tracking-widest">Respaldo Jurídico</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight uppercase">
          Apoyo de <span className="text-[#7FA82C]">abogados y consultores</span>
        </h2>

        <p className="mb-8 text-lg text-gray-600 text-sm mt-2">
          Nuestro equipo experto está listo para brindarte la asesoría jurídica necesaria, resolviendo cualquier situación legal con profesionalismo y ética.
        </p>

        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError("");
            }}
            placeholder="Tu nombre completo"
            className={`w-full px-6 py-4 rounded-2xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#7FA82C]/10 ${error ? "border-2 border-red-400 bg-red-50" : "border-2 border-gray-100 focus:border-[#7FA82C]"
              }`}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold text-red-500 flex items-center gap-2 ml-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          <button
            onClick={handleWhatsAppClick}
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#7FA82C] text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-[#7FA82C]/20 hover:bg-[#6a8e25] active:scale-95 uppercase tracking-widest text-xs sm:text-sm"
          >
            <FaWhatsapp className="text-xl" />
            Enviar WhatsApp
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AbogadosSeccion;