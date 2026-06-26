"use client";

import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Truck, Shield, Mail, Tag, Info } from "lucide-react";
import { FaArrowLeft, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { obtenerProductoPorId } from "../../services/apiService";
import ModalCorreo from "./modalCorreo";
import ModalWhatsapp from "./ModalWhatsapp";
import { motion, AnimatePresence } from "framer-motion";

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [mostrarModalWhatsapp, setMostrarModalWhatsapp] = useState(false);
  const [tabActivo, setTabActivo] = useState("descripcion");
  const [cargando, setCargando] = useState(true);

  // --- LÓGICA DE SCROLL HORIZONTAL (DRAG) ---
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Ajuste de sensibilidad
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setCargando(true);
        const data = await obtenerProductoPorId(id);
        setProducto(data);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setTimeout(() => setCargando(false), 600);
      }
    };
    fetchProducto();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8 text-center">
        <div className="w-full max-w-6xl animate-pulse flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 h-[450px] bg-gray-100 rounded-[2.5rem]"></div>
          <div className="w-full lg:w-1/2 space-y-6 text-left">
            <div className="h-6 w-32 bg-gray-100 rounded-full"></div>
            <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            <div className="h-32 w-full bg-gray-50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  return (
    <div className="bg-white min-h-screen w-full font-sans pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <Link to="/catalogo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-100 text-gray-500 hover:border-[#7FA82C] hover:text-[#7FA82C] transition-all group">
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            VOLVER AL CATÁLOGO
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Columna Imagen */}
          <motion.div className="w-full lg:w-1/2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-xl shadow-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={producto.imagen_url || "/placeholder.svg"}
                alt={producto.nombre}
                className="object-contain w-full h-[320px] md:h-[450px]"
              />
            </div>
          </motion.div>

          {/* Columna Información */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 text-[#7FA82C] text-xs font-black uppercase tracking-[0.2em] mb-4">
              <Tag size={14} strokeWidth={3} />
              {producto.categoria_nombre}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              {producto.nombre}
            </h1>

            <div className="mb-8 flex gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase border ${producto.stock === 0 ? 'text-red-500 border-red-100 bg-red-50' : 'text-green-600 border-green-100 bg-green-50'}`}>
                {producto.stock === 0 ? "Agotado" : "Disponible"}
              </span>
            </div>

            {/* TABS: Con funcionalidad de arrastre habilitada */}
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="overflow-x-auto -mx-4 px-4 mb-8 no-scrollbar border-b border-gray-100 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex gap-10 whitespace-nowrap">
                {["descripcion", "especificaciones", "medidas"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTabActivo(tab)}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${tabActivo === tab ? "text-[#7FA82C]" : "text-gray-400"}`}
                  >
                    {tab === "descripcion" ? "Descripción" : tab}
                    {tabActivo === tab && (
                      <motion.div layoutId="activeTabDetail" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#7FA82C] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENIDO DINÁMICO: Estética minimalista con jerarquía vertical */}
            <div className="text-gray-600 leading-relaxed mb-8 min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tabActivo}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >

                  {/* Descripción: Tamaño estándar y legible */}
                  {tabActivo === "descripcion" && (
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-gray-700 shadow-sm">
                      {producto.descripcion?.trim() ? (
                        <p className="text-xl leading-relaxed font-medium">
                          {producto.descripcion}
                        </p>
                      ) : (
                        <p className="italic text-gray-400">Sin descripción disponible.</p>
                      )}
                    </div>
                  )}

                  {/* Especificaciones y Medidas: Título arriba (normal) y Valor abajo (grande) */}
                  {(tabActivo === "especificaciones" || tabActivo === "medidas") && (
                    <div className="grid grid-cols-1 gap-4">
                      {(tabActivo === "especificaciones" ? producto.caracteristicas : producto.medidas)?.length ? (
                        (tabActivo === "especificaciones" ? producto.caracteristicas : producto.medidas).map((item, i) => (
                          <div
                            key={i}
                            className="p-8 bg-white rounded-[2rem] border border-gray-100 flex flex-col gap-1 hover:border-[#7FA82C]/30 transition-all duration-300 shadow-sm"
                          >
                            {/* Título: Letras normales, sin negritas */}
                            <span className="text-xs md:text-sm text-gray-400 uppercase tracking-[0.2em] font-normal">
                              {tabActivo === "especificaciones" ? item.tipo_caracteristica : item.tipo_medida}
                            </span>

                            {/* Valor: Grande y limpio abajo */}
                            <span className="text-gray-900 text-3xl md:text-4xl tracking-tighter leading-tight font-medium">
                              {item.valor}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 italic py-16 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                          <Info size={28} strokeWidth={1} />
                          <span className="text-sm">No hay detalles técnicos para mostrar.</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <button onClick={() => setMostrarModalWhatsapp(true)} className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white py-5 px-8 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                <FaWhatsapp className="text-xl" /> WhatsApp
              </button>
              <button onClick={() => setMostrarModalCorreo(true)} className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white py-5 px-8 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                <FaEnvelope className="text-lg" /> Vía Correo
              </button>
            </div>

            {/* SERVICIOS ADICIONALES */}
            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex gap-4 p-5 rounded-2xl bg-green-50/30 border border-green-100">
                <Truck className="text-[#7FA82C] shrink-0" size={24} />
                <div className="text-left">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">Logística de Envío</h4>
                  <p className="text-gray-500 text-[11px] font-medium leading-snug mt-1 italic">
                    * Sujeto a condiciones de zona y volumen. Los tiempos pueden variar según logística.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-2xl bg-blue-50/30 border border-blue-100">
                <Shield className="text-blue-500 shrink-0" size={24} />
                <div className="text-left">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">Garantía del componente</h4>
                  <p className="text-gray-500 text-[11px] font-medium leading-snug mt-1 italic">
                    * Garantía directa contra defectos de fabricación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <ModalCorreo isOpen={mostrarModalCorreo} onClose={() => setMostrarModalCorreo(false)} producto={producto} />
      <ModalWhatsapp isOpen={mostrarModalWhatsapp} onClose={() => setMostrarModalWhatsapp(false)} producto={producto} />
    </div>
  );
};

export default DetalleProducto;