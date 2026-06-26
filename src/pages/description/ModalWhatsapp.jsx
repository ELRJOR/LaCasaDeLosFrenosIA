"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaQuestionCircle, FaWhatsapp } from "react-icons/fa";

const ModalWhatsapp = ({ isOpen, onClose, producto }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
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

    if (!formData.nombre?.trim()) {
      nuevosErrores.nombre = "Campo obligatorio";
    } else if (!soloLetras.test(formData.nombre)) {
      nuevosErrores.nombre = "Solo letras";
    }

    if (formData.apellidos?.trim() && !soloLetras.test(formData.apellidos)) {
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
      const {
        nombre,
        apellidos = "",
        razonSocial = "",
        marca = "",
        modelo = "",
        anio = "",
        mensaje = "",
      } = formData;

      const urlProducto = window.location.href;

      const texto =
        `SOLICITUD DE COTIZACION

Producto: 
*${producto?.nombre?.toUpperCase() || "PRODUCTO NO ESPECIFICADO"}*

Enlace del producto:
${urlProducto}

DATOS DEL CLIENTE:
- Nombre: ${nombre} ${apellidos}
- Empresa/Motivo: ${razonSocial}

DATOS DEL VEHICULO:
- Marca: ${marca}
- Modelo: ${modelo}
- Año: ${anio}

NOTAS ADICIONALES:
${mensaje ? `"${mensaje}"` : "Sin comentarios adicionales"}

---
Enviado desde el catálogo web.`;

      const numeroWhatsApp = "529993473626";
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;

      window.open(url, "_blank");
      setLoading(false);
      setErrors({});
      setFormData({});
      setShowTooltip(false);
      onClose();
    }, 1000);
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
            {/* Botón Cerrar */}
            <button
              onClick={() => {
                setErrors({});
                setFormData({});
                setLoading(false);
                setShowTooltip(false);
                onClose();
              }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 p-2 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all active:scale-90"
            >
              <IoClose size={20} />
            </button>

            <div className="p-6 sm:p-14">
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#25D366]/10 text-[#25D366] rounded-full mb-3 sm:mb-4">
                  <FaWhatsapp size={28} className="sm:size-[32px]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Cotizar vía WhatsApp</h2>
                <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">Bríndanos los detalles para tu cotización</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { name: "nombre", placeholder: "Nombre" },
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
                                  Indica si es para uso personal o el nombre de tu empresa.
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
                    name="mensaje"
                    value={formData.mensaje || ""}
                    onChange={handleChange}
                    placeholder="Mensaje adicional"
                    rows={3}
                    // CORREGIDO: Borde azul eliminado con focus:border-[#7FA82C]
                    className="w-full px-5 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#7FA82C] transition-all outline-none font-medium text-gray-900 text-sm sm:text-base resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-green-50 flex justify-center items-center gap-3 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs active:scale-95 disabled:opacity-70 mt-2 sm:mt-4"
                >
                  {loading ? (
                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaWhatsapp size={18} />
                      Enviar Cotización
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalWhatsapp;