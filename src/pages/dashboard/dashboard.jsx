import React, { useState } from 'react';
import { 
  HiExclamationCircle, HiX, HiMail, HiCalendar, 
  HiShieldCheck, HiBell, HiGlobeAlt,
  HiClipboardCheck, HiClipboardCopy
} from "react-icons/hi";
import { motion, AnimatePresence } from 'framer-motion';

// Componentes del Dashboard (Asegura que las rutas sean correctas)
import Sidebar from '../../components/dashboard/sidebar';
import Navbar from '../../components/dashboard/navbar';
import Inicio from './inicio';
import Productos from './productos';
import Categorias from './categorias';
import Clientes from './clientes';
import Pedidos from './pedidos';
import AIChat from './aichat';
import Ayuda from './ayuda';
import Configuraciones from './configuraciones';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Inicio');
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [announcement] = useState({
    id: 'RENOVACION_MAYO_2026',
    active: false,
    priority: "warning", // "warning" (Naranja) o "urgent" (Rojo)
    title: "¡Atención! Se acerca la renovación anual del sistema",
    details: {
      date: "3 de mayo, 2026",
      cost: "MXN 3999.99 / año",
      contactEmail: "pucbeto327@gmail.com", 
      message: "Hola, recibí el aviso de mantenimiento. Por favor, confírmame los pasos para el pago de La Casa de los Frenos."
    }
  });

  const isUrgent = announcement.priority === "urgent";
  const themeColor = isUrgent ? "bg-red-600" : "bg-amber-500";
  const textColor = isUrgent ? "text-red-600" : "text-amber-600";
  const accentColor = isUrgent ? "#dc2626" : "#f59e0b";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(announcement.details.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Inicio': return <Inicio />;
      case 'Productos': return <Productos />;
      case 'Categorias': return <Categorias />;
      case 'Clientes': return <Clientes />;
      case 'Pedidos': return <Pedidos />;
      case 'AsistenteIA': return <AIChat />;
      case 'Ayuda': return <Ayuda />;
      case 'Configuraciones': return <Configuraciones />;
      default: return <Inicio />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-full relative">
        <Navbar activeTab={activeTab} />

        {/* --- BANNER SUPERIOR --- */}
        <AnimatePresence>
          {announcement.active && showBanner && (
            <motion.div 
              initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -70, opacity: 0 }}
              className={`${themeColor} text-white px-8 py-3 flex items-center justify-between shadow-lg z-10 border-b border-white/10`}
            >
              <div className="flex items-center gap-4">
                <div className={`bg-white ${textColor} p-1.5 rounded-full ${isUrgent ? 'animate-bounce' : 'animate-pulse'} shadow-md`}>
                  {isUrgent ? <HiExclamationCircle size={22} /> : <HiBell size={22} />}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] opacity-80 leading-none mb-1">Aviso {isUrgent ? 'Urgente' : 'Importante'}</p>
                  <p className="text-sm font-bold tracking-wide">{announcement.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setShowModal(true)} className="bg-white text-gray-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-gray-100 transition-all shadow-md active:scale-95">Ver Detalles</button>
                <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><HiX size={20} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {renderContent()}
        </div>
      </div>

      {/* --- MODAL DE RENOVACIÓN --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full border-t-[14px] border-solid relative overflow-hidden"
              style={{ borderTopColor: accentColor }}
            >
              <div className="p-10 lg:p-14">
                {/* Cabecera */}
                <div className="flex justify-between items-start mb-10">
                  <div className="text-left">
                    <div className={`inline-flex p-4 rounded-2xl ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'} mb-4`}>
                      {isUrgent ? <HiShieldCheck size={40} /> : <HiBell size={40} />}
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Mantenimiento Digital</h3>
                    <p className={`text-[11px] font-black uppercase tracking-[0.4em] mt-3 ${textColor}`}>{isUrgent ? 'Acción Requerida' : 'Aviso Preventivo'}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-gray-500 transition-colors"><HiX size={35} /></button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Izquierda: Explicación Limpia */}
                  <div className="space-y-8 text-left">
                    <p className="text-2xl font-bold text-gray-800 leading-tight">Tu local digital  <span className="text-[#7FA82C]">La Casa de los Frenos</span> necesita seguir abierto.</p>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4 items-start text-gray-600">
                        <div className="mt-1 text-[#7FA82C] shrink-0"><HiGlobeAlt size={28} /></div>
                        <p className="text-base font-medium leading-snug">Este pago asegura que tus clientes te sigan encontrando en Google y que tu catálogo esté disponible las 24 horas.</p>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-[2rem] border-l-4 border-gray-200">
                        <p className="text-sm italic font-semibold text-gray-700">"Es como la renta anual de tu local físico; asegura la visibilidad de tu negocio en todo internet."</p>
                      </div>

                      {/* Copiar Correo */}
                      <div className="pt-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">Correo de soporte:</p>
                        <div className={`flex items-center justify-between px-5 py-3 rounded-2xl border-2 transition-all ${copied ? 'bg-green-50 border-green-500' : 'bg-white border-gray-100'}`}>
                          <code className="text-xs font-bold text-gray-700 truncate">{announcement.details.contactEmail}</code>
                          <button onClick={handleCopyEmail} className={`p-2 rounded-lg transition-colors ${copied ? 'text-green-600' : 'text-[#7FA82C]'}`}>
                            {copied ? <HiClipboardCheck size={22} /> : <HiClipboardCopy size={22} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Derecha: Tarjeta y Nota Final */}
                  <div className="space-y-6 flex flex-col justify-between">
                    <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7FA82C]/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="space-y-8 relative z-10">
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Vencimiento:</span>
                          <div className="flex items-center gap-3">
                            <HiCalendar size={24} className={isUrgent ? 'text-red-500' : 'text-amber-500'} />
                            <span className="text-2xl font-black">{announcement.details.date}</span>
                          </div>
                        </div>
                        <div className="h-px bg-gray-800 w-full"></div>
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Pago Anual Actual</span>
                          <span className="text-4xl font-black text-white block">{announcement.details.cost}</span>
                        </div>
                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${announcement.details.contactEmail}&su=CONFIRMACION&body=${encodeURIComponent(announcement.details.message)}`} target="_blank" rel="noopener noreferrer" className={`w-full ${themeColor} text-white flex items-center justify-center gap-3 py-6 rounded-[1.5rem] font-black shadow-xl hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]`}>
                          <HiMail size={24} /> Contactar ahora
                        </a>
                      </div>
                    </div>

                    {/* NOTA DE TRANSPARENCIA INTEGRADA AL FINAL */}
                    <div className="px-6 space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-gray-400">
                            <div className="w-4 h-px bg-gray-300"></div> Transparencia y Garantía
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">
                         Nosotros no cobramos esto, lo cobran los proveedores; nosotros solo hacemos el movimiento por ti. El costo final puede variar.
                            <span className="text-emerald-600 font-bold ml-1 italic">Se entrega comprobante al finalizar el proceso.</span>
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;