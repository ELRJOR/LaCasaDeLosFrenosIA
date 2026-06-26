"use client";

import { useState } from "react";
import { X, Mail, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle, FaEnvelope } from "react-icons/fa";

const ModalCorreo = ({ isOpen, onClose, producto }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [mailtoLink, setMailtoLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value.trim()) delete newErrors[name];
      return newErrors;
    });
  };

  const validateForm = () => {
    const nuevosErrores = {};
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.nombres?.trim()) {
      nuevosErrores.nombres = "Campo obligatorio";
    } else if (!soloLetras.test(formData.nombres)) {
      nuevosErrores.nombres = "Solo letras";
    }

    if (!formData.apellidos?.trim()) {
      nuevosErrores.apellidos = "Campo obligatorio";
    } else if (!soloLetras.test(formData.apellidos)) {
      nuevosErrores.apellidos = "Solo letras";
    }

    if (!formData.razonSocial?.trim()) {
      nuevosErrores.razonSocial = "Indica el motivo";
    }

    ["marca", "modelo"].forEach((campo) => {
      if (!formData[campo]?.trim()) {
        nuevosErrores[campo] = "Campo obligatorio";
      }
    });

    const anio = formData.anio?.trim();
    if (!anio) {
      nuevosErrores.anio = "Año obligatorio";
    } else if (!/^\d{4}$/.test(anio) || parseInt(anio) < 1900) {
      nuevosErrores.anio = "Año inválido";
    }

    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errores = validateForm();
    setErrors(errores);
    if (Object.keys(errores).length > 0) return;

    setLoading(true);

    setTimeout(() => {
      const { nombres, apellidos, razonSocial, marca, modelo, anio, mensajeAdicional = "" } = formData;
      const urlProducto = window.location.href;
      const destinatario = "casafrenos99@gmail.com";
      const asunto = `Solicitud de Cotizacion: ${producto?.nombre || "Producto"}`;

      const mensaje =
        `SOLICITUD DE COTIZACION

Producto: 
${producto?.nombre?.toUpperCase() || "PRODUCTO NO ESPECIFICADO"}

Enlace del producto:
${urlProducto}

DATOS DEL CLIENTE:
- Nombre: ${nombres} ${apellidos}
- Empresa/Motivo: ${razonSocial}

DATOS DEL VEHICULO:
- Marca: ${marca}
- Modelo: ${modelo}
- Año: ${anio}

NOTAS ADICIONALES:
${mensajeAdicional ? `"${mensajeAdicional}"` : "Sin comentarios adicionales"}

---
Enviado desde el catálogo web.`;

      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        destinatario
      )}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;

      setMailtoLink(gmailURL);
      setLoading(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative my-auto"
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => {
                setMailtoLink(null);
                setErrors({});
                setFormData({});
                setLoading(false);
                setShowTooltip(false);
                onClose();
              }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 p-2 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all active:scale-90"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-14">
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-full mb-3 sm:mb-4">
                  <FaEnvelope size={28} className="sm:size-[32px]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {mailtoLink ? "Correo preparado" : "Cotizar por Correo"}
                </h2>
                {!mailtoLink && (
                  <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">Bríndanos los detalles para tu cotización</p>
                )}
              </div>

              {!mailtoLink ? (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { name: "nombres", placeholder: "Nombre" },
                      { name: "apellidos", placeholder: "Apellidos" },
                      {
                        name: "razonSocial",
                        placeholder: "Motivo o Empresa",
                        withInfo: true,
                      },
                      { name: "marca", placeholder: "Marca del auto" },
                      { name: "modelo", placeholder: "Modelo del auto" },
                      {
                        name: "anio",
                        placeholder: "Año (YYYY)",
                        maxLength: 4,
                        inputMode: "numeric",
                      },
                    ].map(({ name, placeholder, withInfo, ...props }) => (
                      <div key={name} className="flex flex-col gap-1">
                        <div className="relative flex items-center group">
                          <input
                            name={name}
                            value={formData[name] || ""}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className={`w-full px-5 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all outline-none font-semibold text-gray-900 text-sm sm:text-base placeholder:text-gray-400 placeholder:font-normal ${errors[name]
                              ? "border-red-100 bg-red-50 focus:border-red-400"
                              : "border-gray-50 bg-gray-50 focus:bg-white focus:border-[#7FA82C]"
                              }`}
                            {...props}
                          />
                          {withInfo && (
                            <div className="absolute right-4">
                              <button
                                type="button"
                                onClick={() => setShowTooltip(!showTooltip)}
                                className="text-gray-300 hover:text-[#7FA82C] transition-colors"
                              >
                                <FaQuestionCircle size={16} />
                              </button>
                              <AnimatePresence>
                                {showTooltip && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute bottom-full mb-3 right-0 w-48 bg-gray-900 text-white text-[10px] p-3 rounded-xl shadow-xl z-50 leading-tight font-medium"
                                  >
                                    Indica el nombre de tu empresa o si es para uso personal.
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                        {errors[name] && (
                          <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">
                            {errors[name]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="w-full">
                    <textarea
                      name="mensajeAdicional"
                      value={formData.mensajeAdicional || ""}
                      onChange={handleChange}
                      placeholder="Mensaje adicional"
                      rows={3}
                      className="w-full px-5 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#7FA82C] transition-all outline-none font-medium text-gray-900 text-sm sm:text-base resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-gray-100 flex justify-center items-center gap-3 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs active:scale-95 disabled:opacity-70 mt-2 sm:mt-4"
                  >
                    {loading ? (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Generar Correo"
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle size={40} className="sm:size-[48px]" />
                  </div>

                  <p className="text-gray-600 font-medium px-4 text-sm sm:text-base">
                    Todo listo. Al hacer clic en el botón, se abrirá <span className="font-bold text-gray-900">Gmail</span> con toda la información cargada.
                  </p>

                  <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4">
                    <a
                      href={mailtoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-green-100 uppercase tracking-widest text-[10px] sm:text-xs text-center active:scale-95"
                      onClick={() => {
                        setTimeout(() => {
                          setMailtoLink(null);
                          onClose();
                        }, 500);
                      }}
                    >
                      Abrir Gmail ahora
                    </a>
                    <button
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl transition-all uppercase tracking-widest text-[10px] sm:text-xs active:scale-95"
                      onClick={() => setMailtoLink(null)}
                    >
                      Editar datos
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalCorreo;