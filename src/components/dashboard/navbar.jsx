import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronDown, FiClock } from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const getSaludo = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

const Navbar = ({ activeTab }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [hoy] = useState(new Date()); 
  const [horaActual, setHoraActual] = useState(new Date());
  const calendarRef = useRef(null);

  // Lógica para el nombre del Tab
  const displayTab = activeTab === 'Configuraciones' ? 'Acerca de' : (activeTab || 'Panel');

  useEffect(() => {
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  return (
    <nav className="px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-[40] shadow-sm">
      <style>{`
        /* Estilos generales del contenedor */
        .react-calendar { border: none !important; font-family: inherit !important; width: 280px !important; background: white !important; }
        
        /* Estilos de los días (números) */
        .react-calendar__tile { color: #1f2937 !important; font-weight: 700 !important; padding: 12px 8px !important; font-size: 14px !important; }
        .react-calendar__tile--active { background: #7FA82C !important; color: white !important; border-radius: 12px !important; }
        .react-calendar__tile--now { background: #f0fdf4 !important; color: #7FA82C !important; border-radius: 12px !important; }
        .react-calendar__tile:enabled:hover { background-color: #f3f4f6 !important; border-radius: 12px !important; color: #000 !important; }
        
        /* Navegación (Mes y flechas) */
        .react-calendar__navigation button { color: #7FA82C !important; font-weight: 800 !important; font-size: 16px !important; }
        .react-calendar__navigation button:enabled:hover { background-color: #f7faf0 !important; border-radius: 10px; }

        /* CORRECCIÓN: Nombres de los días (L, M, M, J, V...) */
        .react-calendar__month-view__weekdays__weekday { 
          color: #374151 !important; /* Gris oscuro para contraste alto */
          text-decoration: none !important; 
          font-weight: 800 !important; 
          text-transform: uppercase; 
          font-size: 11px !important; 
          padding: 8px 0 !important;
        }
        
        /* Eliminar subrayado de los nombres de los días */
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
          border-bottom: none !important;
          cursor: default !important;
        }
      `}</style>

      <div className="flex items-center justify-between mx-auto">
        <div className="flex flex-col text-left">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 text-left">
            Sistema / <span className="text-[#7FA82C]">{displayTab}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight leading-none">
            {getSaludo()}, <span className="text-[#7FA82C]">Manuel</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Reloj - Solo hora */}
          <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
            <FiClock className="text-gray-400" size={18} />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Hora Local</span>
              <span className="text-sm font-bold text-gray-700 leading-none tabular-nums">
                {horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Calendario Informativo */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-4 bg-white border-2 border-gray-100 px-5 py-2.5 rounded-2xl hover:border-[#7FA82C] transition-all active:scale-95 shadow-sm group"
            >
              <div className="bg-[#F7FAF0] p-2 rounded-lg group-hover:bg-[#7FA82C] transition-colors">
                <FiCalendar size={18} className="text-[#7FA82C] group-hover:text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1 text-left">Hoy</span>
                <span className="text-sm font-bold text-gray-800 leading-none">
                  {hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <FiChevronDown className={`text-gray-300 transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''}`} size={18} />
            </button>

            {showCalendar && (
              <div className="absolute right-0 mt-4 z-50 bg-white shadow-2xl p-4 rounded-3xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                <Calendar
                  value={hoy}
                  calendarType="gregory"
                  prev2Label={null}
                  next2Label={null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;