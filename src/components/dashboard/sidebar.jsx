import React, { useState } from 'react';
// Cambiamos a Ionicons para tener el efecto de relleno (Fill)
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
} from 'react-icons/io5';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveTab, activeTab }) => {
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const isSidebarOpen = isPinnedOpen || isHovered;

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/loginAdmin');
    }, 1000);
  };

  return (
    <div
      onMouseEnter={() => !isPinnedOpen && setIsHovered(true)}
      onMouseLeave={() => !isPinnedOpen && setIsHovered(false)}
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 hidden md:flex flex-col min-h-screen shadow-2xl z-50`}
    >
      {/* Encabezado con Logo/Panel */}
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

      {/* Navegación Principal */}
      <nav className="p-3 mt-4 flex-1 space-y-2">
        <SidebarButton 
          iconOutline={<IoHomeOutline size={22} />} 
          iconFill={<IoHome size={22} />} 
          label="Inicio" 
          isOpen={isSidebarOpen} 
          active={activeTab === 'Inicio'} 
          onClick={() => setActiveTab('Inicio')} 
        />
        <SidebarButton 
          iconOutline={<IoCartOutline size={22} />} 
          iconFill={<IoCart size={22} />} 
          label="Productos" 
          isOpen={isSidebarOpen} 
          active={activeTab === 'Productos'} 
          onClick={() => setActiveTab('Productos')} 
        />
        <SidebarButton 
          iconOutline={<IoGridOutline size={22} />} 
          iconFill={<IoGrid size={22} />} 
          label="Categorías" 
          isOpen={isSidebarOpen} 
          active={activeTab === 'Categorias'} 
          onClick={() => setActiveTab('Categorias')} 
        />
        <SidebarButton 
          iconOutline={<IoPeopleOutline size={22} />} 
          iconFill={<IoPeople size={22} />} 
          label="Clientes" 
          isOpen={isSidebarOpen} 
          active={activeTab === 'Clientes'} 
          onClick={() => setActiveTab('Clientes')} 
        />
        <SidebarButton 
          iconOutline={<IoClipboardOutline size={22} />} 
          iconFill={<IoClipboard size={22} />} 
          label="Pedidos" 
          isOpen={isSidebarOpen} 
          active={activeTab === 'Pedidos'} 
          onClick={() => setActiveTab('Pedidos')} 
        />

        <SidebarButton
        iconOutline={<IoChatbubbleEllipsesOutline size={22} />}
        iconFill={<IoChatbubbleEllipses size={22} />}
        label="Asistente IA"
        isOpen={isSidebarOpen}
        active={activeTab === 'AsistenteIA'}
        onClick={() => setActiveTab('AsistenteIA')}
        />

        {/* Sección de Soporte/Acerca de */}
        <div className="pt-6 mt-6 border-t border-gray-800 space-y-2">
          <SidebarButton 
            iconOutline={<IoHelpCircleOutline size={22} />} 
            iconFill={<IoHelpCircle size={22} />} 
            label="Ayuda" 
            isOpen={isSidebarOpen} 
            active={activeTab === 'Ayuda'} 
            onClick={() => setActiveTab('Ayuda')} 
          />
          <SidebarButton 
            iconOutline={<IoInformationCircleOutline size={22} />} 
            iconFill={<IoInformationCircle size={22} />} 
            label="Acerca de" 
            isOpen={isSidebarOpen} 
            active={activeTab === 'Configuraciones'} 
            onClick={() => setActiveTab('Configuraciones')} 
          />

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full p-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 group"
          >
            <div className="min-w-[40px] flex justify-center">
              {isLoggingOut ? (
                <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
              ) : (
                <IoLogOutOutline size={24} className="group-hover:rotate-180 transition-transform duration-500" />
              )}
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
  );
};

/* Sub-componente del Botón con lógica de Relleno */
const SidebarButton = ({ iconOutline, iconFill, label, isOpen, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-xl mb-1 transition-all duration-300 group
      ${active 
        ? 'bg-[#7FA82C] text-white shadow-lg shadow-lime-900/20' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }
      ${active ? 'scale-[1.02]' : 'scale-100'} 
      transform active:scale-95`}
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