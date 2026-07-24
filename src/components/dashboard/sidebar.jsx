import React, { useState } from 'react';
import { 
  IoHomeOutline, IoHome, 
  IoCartOutline, IoCart, 
  IoGridOutline, IoGrid, 
  IoPeopleOutline, IoPeople, 
  IoClipboardOutline, IoClipboard,
  IoHelpCircleOutline, IoHelpCircle,
  IoInformationCircleOutline, IoInformationCircle,
  IoLogOutOutline,
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipses,
  IoMenuOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Inicio',       tab: 'Inicio',       iconOut: IoHomeOutline,                iconFill: IoHome },
  { label: 'Productos',    tab: 'Productos',    iconOut: IoCartOutline,                iconFill: IoCart },
  { label: 'Categorías',   tab: 'Categorias',   iconOut: IoGridOutline,                iconFill: IoGrid },
  { label: 'Citas',     tab: 'Citas',     iconOut: IoPeopleOutline,              iconFill: IoPeople },
  { label: 'Pedidos',      tab: 'Pedidos',      iconOut: IoClipboardOutline,           iconFill: IoClipboard },
  { label: 'IA',           tab: 'AsistenteIA',  iconOut: IoChatbubbleEllipsesOutline,  iconFill: IoChatbubbleEllipses },
  { label: 'Ayuda',        tab: 'Ayuda',        iconOut: IoHelpCircleOutline,          iconFill: IoHelpCircle },
  { label: 'Acerca de',    tab: 'Configuraciones', iconOut: IoInformationCircleOutline, iconFill: IoInformationCircle },
];

// Tabs que se muestran en la barra inferior (los más usados)
const BOTTOM_TABS = ['Inicio', 'Productos', 'AsistenteIA', 'Pedidos'];

const Sidebar = ({ setActiveTab, activeTab }) => {
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isSidebarOpen = isPinnedOpen || isHovered;

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/loginAdmin');
    }, 1000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── SIDEBAR DESKTOP (igual que antes) ── */}
      <div
        onMouseEnter={() => !isPinnedOpen && setIsHovered(true)}
        onMouseLeave={() => !isPinnedOpen && setIsHovered(false)}
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 hidden md:flex flex-col min-h-screen shadow-2xl z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          {isSidebarOpen && (
            <h1 className="text-xl font-black tracking-tighter text-[#7FA82C]">
              <span className="text-white">PANEL</span>
            </h1>
          )}
          <button
            onClick={() => setIsPinnedOpen(!isPinnedOpen)}
            className={`p-2 rounded-xl transition-all ${isPinnedOpen ? 'bg-[#7FA82C] text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            {isPinnedOpen ? <BsPinAngleFill size={18} /> : <BsPinAngle size={18} />}
          </button>
        </div>

        <nav className="p-3 mt-4 flex-1 space-y-2">
          {NAV_ITEMS.slice(0, 6).map(item => (
            <SidebarButton
              key={item.tab}
              iconOutline={<item.iconOut size={22} />}
              iconFill={<item.iconFill size={22} />}
              label={item.label}
              isOpen={isSidebarOpen}
              active={activeTab === item.tab}
              onClick={() => setActiveTab(item.tab)}
            />
          ))}

          <div className="pt-6 mt-6 border-t border-gray-800 space-y-2">
            {NAV_ITEMS.slice(6).map(item => (
              <SidebarButton
                key={item.tab}
                iconOutline={<item.iconOut size={22} />}
                iconFill={<item.iconFill size={22} />}
                label={item.label}
                isOpen={isSidebarOpen}
                active={activeTab === item.tab}
                onClick={() => setActiveTab(item.tab)}
              />
            ))}

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full p-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 group"
            >
              <div className="min-w-[40px] flex justify-center">
                {isLoggingOut
                  ? <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
                  : <IoLogOutOutline size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                }
              </div>
              {isSidebarOpen && (
                <span className="ml-4 font-bold text-sm uppercase tracking-widest">
                  {isLoggingOut ? 'Saliendo...' : 'Salir'}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ── BARRA INFERIOR MÓVIL ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 py-2 safe-area-pb">
        {BOTTOM_TABS.map(tab => {
          const item = NAV_ITEMS.find(i => i.tab === tab);
          if (!item) return null;
          const active = activeTab === tab;
          const Icon = active ? item.iconFill : item.iconOut;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-[#7FA82C]' : 'text-gray-500'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}

        {/* Botón "Más" para el resto */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-500"
        >
          <IoMenuOutline size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Más</span>
        </button>
      </div>

      {/* ── MENÚ COMPLETO MÓVIL (drawer desde abajo) ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer */}
          <div className="relative bg-gray-900 rounded-t-3xl p-6 pb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-lg uppercase tracking-widest">Menú</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 p-2">
                <IoCloseOutline size={24} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {NAV_ITEMS.map(item => {
                const active = activeTab === item.tab;
                const Icon = active ? item.iconFill : item.iconOut;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleTabChange(item.tab)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                      active ? 'bg-[#7FA82C] text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-center">{item.label}</span>
                  </button>
                );
              })}

              {/* Cerrar sesión */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-800 text-red-400 transition-all"
              >
                {isLoggingOut
                  ? <div className="animate-spin h-6 w-6 border-2 border-red-400 border-t-transparent rounded-full" />
                  : <IoLogOutOutline size={24} />
                }
                <span className="text-[11px] font-bold uppercase tracking-wide">
                  {isLoggingOut ? 'Saliendo...' : 'Salir'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarButton = ({ iconOutline, iconFill, label, isOpen, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-xl mb-1 transition-all duration-300 group
      ${active ? 'bg-[#7FA82C] text-white shadow-lg shadow-lime-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
      ${active ? 'scale-[1.02]' : 'scale-100'} transform active:scale-95`}
  >
    <div className="min-w-[40px] flex justify-center">
      {active ? iconFill : iconOutline}
    </div>
    {isOpen && (
      <span className={`ml-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        {label}
      </span>
    )}
  </button>
);

export default Sidebar;
