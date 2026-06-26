import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import ubicacionImg from "../../assets/images/EmpresaUbicacion.jpg";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const UbicacionEmpresa = () => {
  const [mostrarInfo, setMostrarInfo] = useState(true);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hidden: {
      opacity: 0,
      y: 30
    }
  };

  return (
    <section
      id="encuentranos"
      className="bg-white text-gray-800 overflow-hidden pt-16 pb-0 relative"
      ref={ref}
    >
      {/* Título y descripción con animación */}
      <div className="text-center mb-16 px-6">
        {/* Cejilla superior (Label) */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#7FA82C] text-sm font-black uppercase tracking-[0.3em] mb-3 block"
        >
          Visítanos
        </motion.span>

        {/* Título Principal Corregido */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-5xl font-extrabold uppercase tracking-tight text-gray-900 mb-6"
        >
          NUESTRA <span className="text-[#7FA82C]">UBICACIÓN</span>
        </motion.h2>

        {/* Descripción con mejor legibilidad */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-sm md:text-lg lg:text-xl text-gray-500 mt-4 max-w-xs md:max-w-3xl mx-auto leading-relaxed"
        >
          Te esperamos en nuestras oficinas para brindarte atención personalizada
          y asesoría experta en todos nuestros sistemas de frenos.
        </motion.p>
      </div>


      {/* Contenedor principal - Versión para desktop */}
      <div className="hidden md:block relative w-full h-[520px] overflow-hidden shadow-inner border border-gray-100">
        <iframe
          title="Ubicación de la empresa"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3727.523372780033!2d-89.755853!3d20.891253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDUzJzI4LjUiTiA4OcKwNDUnMjEuMSJX!5e0!3m2!1ses-419!2smx!4v1747533434769!5m2!1ses-419!2smx"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute top-0 left-0 z-0"
        ></iframe>

        <AnimatePresence>
          {mostrarInfo && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="absolute top-8 right-8 z-20 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-900/10 max-w-sm w-full overflow-hidden"
            >
              {/* Header con Imagen */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={ubicacionImg}
                  alt="Oficinas CasaFrenos"
                  className="w-full h-full object-cover [object-position:50%_70%] transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMostrarInfo(false)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2.5 text-gray-800 shadow-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <FaTimes size={14} />
                </motion.button>

                <div className="absolute bottom-4 left-6">
                  <p className="text-[#7FA82C] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Contacto Directo</p>
                  <h3 className="text-white font-bold text-xl leading-none">Visítanos hoy</h3>
                </div>
              </div>

              {/* CONTENIDO INTERACTIVO TOTAL (Igual que en móvil) */}
              <div className="p-8 space-y-6 text-left">

                {/* Dirección - ESTÁTICA */}
                <div className="flex items-start gap-4 px-1">
                  <div className="bg-[#F7FAF0] p-2.5 rounded-xl shrink-0">
                    <FaMapMarkerAlt className="text-[#7FA82C] text-sm" />
                  </div>
                  <p className="text-sm text-gray-600 font-bold leading-snug pt-1">
                    5 40 26E, Col. Lienzo Charro, Umán, Yuc. CP 97390
                  </p>
                </div>

                {/* Teléfonos - Bloque Clickeable con Pulso */}
                <motion.a
                  href="tel:9993473626"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-4 group px-1 cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-[#7FA82C] rounded-xl z-0"
                    />
                    <div className="relative bg-[#F7FAF0] p-2.5 rounded-xl text-[#7FA82C] z-10 group-hover:bg-[#7FA82C] group-hover:text-white transition-colors shadow-sm">
                      <FaPhoneAlt size={14} />
                    </div>
                  </div>
                  <div className="flex flex-col text-gray-800 text-sm font-black tracking-tight group-hover:text-[#7FA82C] transition-colors">
                    <span>999 347 3626 / 999 546 4133</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toca para llamar</span>
                  </div>
                </motion.a>

                {/* Correo - Bloque Clickeable con Pulso */}
                <motion.a
                  href="mailto:casafrenos99@gmail.com"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-4 group px-1 cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 bg-[#7FA82C] rounded-xl z-0"
                    />
                    <div className="relative bg-[#F7FAF0] p-2.5 rounded-xl text-[#7FA82C] z-10 group-hover:bg-[#7FA82C] group-hover:text-white transition-colors shadow-sm">
                      <FaEnvelope size={14} />
                    </div>
                  </div>
                  <div className="flex flex-col overflow-hidden group-hover:text-[#7FA82C] transition-colors">
                    <span className="text-sm text-gray-800 font-black truncate">casafrenos99@gmail.com</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enviar correo</span>
                  </div>
                </motion.a>

                {/* Horario - Solo lectura */}
                <div className="flex items-center gap-4 border-t border-gray-50 pt-4 px-1">
                  <div className="bg-[#F7FAF0] p-2.5 rounded-xl shrink-0 text-[#7FA82C]">
                    <FaClock size={14} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Horario</span>
                    <span className="text-xs text-gray-600 font-bold uppercase tracking-tighter">
                      Lun - Vie: 9:00 am - 6:30 pm
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTÓN RE-ABRIR DESKTOP */}
        {!mostrarInfo && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#7FA82C" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarInfo(true)}
            className="absolute top-8 right-8 z-30 flex items-center gap-3 bg-[#7FA82C] border-2 border-[#7FA82C] px-8 py-4 rounded-full text-[11px] font-black text-white shadow-xl shadow-[#7FA82C]/40 uppercase tracking-[0.2em] transition-all"
          >
            <FaInfoCircle className="text-base" />
            <span>Ver información</span>
          </motion.button>
        )}
      </div>

      {/* Versión para móvil - Bloques de contacto 100% interactivos */}
      <div className="md:hidden relative w-full px-2 flex flex-col items-center">

        {/* Mapa con layout */}
        <motion.div
          layout
          /* 'w-full' para que use todo el ancho del contenedor */
          className="relative w-full overflow-hidden"
          /* Cambiamos el paddingBottom a 56.25% (Ratio 16:9) para que sea más ancho que alto */
          style={{ paddingBottom: '56.25%', height: 0 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={controls}
          variants={variants}
        >
          <iframe
            title="Ubicación móvil"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3727.523372780033!2d-89.755853!3d20.891253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDUzJzI4LjUiTiA4OcKwNDUnMjEuMSJX!5e0!3m2!1ses-419!2smx!4v1747533434769!5m2!1ses-419!2smx"
            width="100%"
            height="100%"
            style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            /* Mantenemos tus bordes redondeados chidos */
            className="rounded-[2.5rem] shadow-2xl border border-white/10"
          ></iframe>
        </motion.div>

        {/* Contenedor dinámico */}
        <motion.div
          layout
          className="w-full mt-6 mb-10 flex justify-center"
        >
          <AnimatePresence mode="wait">
            {mostrarInfo ? (
              <motion.div
                key="modal-info"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-900/10 w-[95%] overflow-hidden mx-auto"
              >
                {/* Header con Imagen */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={ubicacionImg}
                    alt="Oficinas CasaFrenos"
                    className="w-full h-full object-cover [object-position:50%_70%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMostrarInfo(false)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2.5 text-gray-800"
                  >
                    <FaTimes size={14} />
                  </motion.button>
                  <div className="absolute bottom-4 left-6">
                    <p className="text-[#7FA82C] text-[9px] font-black uppercase tracking-[0.2em] mb-1">Contacto Directo</p>
                    <h3 className="text-white font-bold text-lg leading-none text-left">Visítanos hoy</h3>
                  </div>
                </div>

                {/* CONTENIDO INTERACTIVO TOTAL */}
                <div className="p-6 space-y-6 text-left">

                  {/* Dirección - ESTÁTICA (Sin enlace) */}
                  <div className="flex items-start gap-4 text-left px-1">
                    <div className="bg-[#F7FAF0] p-2.5 rounded-xl shrink-0">
                      <FaMapMarkerAlt className="text-[#7FA82C] text-sm" />
                    </div>
                    <p className="text-sm text-gray-600 font-bold leading-snug pt-1">
                      5 40 26E, Col. Lienzo Charro, Umán, Yuc. CP 97390
                    </p>
                  </div>

                  {/* Teléfonos - Todo el bloque es el enlace */}
                  <motion.a
                    href="tel:9993473626"
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-4 text-left group px-1"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-[#7FA82C] rounded-xl z-0"
                      />
                      <div className="relative bg-[#F7FAF0] p-2.5 rounded-xl shrink-0 text-[#7FA82C] z-10 group-active:bg-[#7FA82C] group-active:text-white transition-colors">
                        <FaPhoneAlt size={14} />
                      </div>
                    </div>
                    <div className="flex flex-col text-gray-800 text-sm font-black tracking-tight group-active:text-[#7FA82C] transition-colors">
                      <span>999 347 3626 / 999 546 4133</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toca para llamar</span>
                    </div>
                  </motion.a>

                  {/* Correo - Todo el bloque es el enlace */}
                  <motion.a
                    href="mailto:casafrenos99@gmail.com"
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-4 text-left group px-1"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 bg-[#7FA82C] rounded-xl z-0"
                      />
                      <div className="relative bg-[#F7FAF0] p-2.5 rounded-xl shrink-0 text-[#7FA82C] z-10 group-active:bg-[#7FA82C] group-active:text-white transition-colors">
                        <FaEnvelope size={14} />
                      </div>
                    </div>
                    <div className="flex flex-col overflow-hidden group-active:text-[#7FA82C] transition-colors">
                      <span className="text-sm text-gray-800 font-black truncate">casafrenos99@gmail.com</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enviar correo</span>
                    </div>
                  </motion.a>

                  {/* Horario - Solo lectura */}
                  <div className="flex items-center gap-4 text-left border-t border-gray-50 pt-4 px-1">
                    <div className="bg-[#F7FAF0] p-2.5 rounded-xl shrink-0 text-[#7FA82C]">
                      <FaClock size={14} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Horario</span>
                      <span className="text-xs text-gray-600 font-bold uppercase tracking-tighter">
                        Lun - Vie: 9:00 am - 6:30 pm
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              /* BOTÓN RE-ABRIR */
              <motion.button
                key="btn-abrir"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMostrarInfo(true)}
                className="flex items-center gap-3 bg-[#7FA82C] px-8 py-4 rounded-full text-[10px] font-black text-white shadow-xl shadow-[#7FA82C]/40 uppercase tracking-[0.2em]"
              >
                <FaInfoCircle className="text-base" />
                <span>Ver información</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default UbicacionEmpresa;