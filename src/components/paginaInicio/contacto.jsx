"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
} from "react-icons/hi";

const Contactar = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mailtoLink, setMailtoLink] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Por favor ingresa tu nombre.");
      return;
    }
    const destinatario = "casafrenos99@gmail.com";
    const asunto = "Cotización general";
    const cuerpo = `Hola, mi nombre es ${nombre}. Estoy interesado(a) en recibir información o cotización de sus productos. ¿Podrían ayudarme?`;

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      destinatario
    )}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    setMailtoLink(gmailURL);
    setError("");
  };

  return (
    <section className="bg-white text-gray-800 py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Lado Izquierdo: Información */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <span className="text-[#7FA82C] text-sm font-black uppercase tracking-[0.3em] mb-4 block">Contacto</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              ESTAMOS PARA <span className="text-[#7FA82C]">AYUDARTE</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Nuestro equipo está listo para resolver tus dudas, ayudarte con cotizaciones o brindarte asesoría técnica sobre refacciones.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { icon: HiOutlineLocationMarker, title: "Ubicación", content: "5 40 26E COL LIENZO CHARRO, UMAN, YUC" },
              { icon: HiOutlinePhone, title: "Teléfono", content: "(999) 347-3626" },
              { icon: HiOutlineMail, title: "Correo", content: "casafrenos99@gmail.com" },
              { icon: HiOutlineClock, title: "Horario", content: "Lunes a Viernes: 9:00 am – 6:30 pm" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="bg-[#F7FAF0] p-3 rounded-xl">
                  <item.icon className="text-[#7FA82C] text-xl" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">{item.title}</h4>
                  <p className="text-gray-700 font-bold text-sm md:text-base leading-snug">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lado Derecho: Formulario / Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-gray-50/50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden"
        >
          {/* Decoración sutil */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7FA82C]/5 rounded-full blur-3xl"></div>

          {!mailtoLink ? (
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Cotizar por correo</h3>
              <p className="text-gray-500 text-sm mb-8 font-medium">Completa tu nombre para generar el mensaje automático.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del solicitante</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Escribe tu nombre completo"
                    className={`w-full bg-white text-black px-6 py-4 rounded-2xl text-sm shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#7FA82C]/10 ${error ? "border-2 border-red-400 bg-red-50" : "border-2 border-transparent focus:border-[#7FA82C]"
                      }`}
                  />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#7FA82C] hover:bg-[#6a8e25] text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-[#7FA82C]/20 text-sm uppercase tracking-widest"
                >
                  Preparar correo
                </button>
              </form>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <div className="w-20 h-20 bg-[#F7FAF0] rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineMail className="text-[#7FA82C] text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">¡Correo Generado!</h3>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                El mensaje está listo. Haz clic en el botón para abrir tu aplicación de correo.
              </p>
              <div className="space-y-3">
                <a
                  href={mailtoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#7FA82C] hover:bg-[#6a8e25] text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-[#7FA82C]/20 text-sm uppercase tracking-widest"
                  onClick={() => { setMailtoLink(null); setNombre(""); }}
                >
                  Enviar con Gmail
                </a>
                <button
                  onClick={() => setMailtoLink(null)}
                  className="w-full text-gray-400 hover:text-gray-600 font-bold py-2 text-xs uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contactar;