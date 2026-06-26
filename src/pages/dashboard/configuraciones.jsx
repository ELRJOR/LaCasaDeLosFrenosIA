import React from 'react';
import {
  FiInfo, FiCode, FiCheckCircle, FiUsers,
  FiCpu, FiShield, FiGitCommit, FiCalendar, FiRefreshCw, FiClock
} from 'react-icons/fi';
import { logCambios } from '../../data/changelogData';
import { licenciaInfo } from '../../data/renovacionData';


const Configuraciones = () => {
  return (
    <div className="w-full p-8 bg-white rounded-[3rem] shadow-xl border border-gray-100 space-y-12 max-w-6xl mx-auto my-8">

      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 text-left">
        <div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">Acerca del Sistema</h2>
          <p className="text-gray-600 mt-1 text-sm italic font-medium">
            Especificaciones técnicas, equipo de desarrollo y estado de la plataforma.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#F7FAF2] px-5 py-2.5 rounded-2xl border border-[#7FA82C]/20 shadow-sm">
          <FiCheckCircle className="text-[#7FA82C]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Build:</span>
          <span className="text-sm font-black text-[#7FA82C]">v1.0.6 - 2026</span>
        </div>
      </div>

      {/* CARDS TÉCNICAS */}
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-[#7FA82C] hover:bg-white hover:shadow-lg transition-all group">
          <div className="bg-blue-500/10 p-3 rounded-xl w-fit mb-4 text-blue-600 group-hover:scale-110 transition-transform">
            <FiCpu size={24} />
          </div>
          <h4 className="text-lg font-black text-gray-800 mb-1 uppercase tracking-tighter">Arquitectura</h4>
          <p className="text-sm text-gray-500 font-medium">React Engine + Tailwind CSS con base de datos Supabase Cloud.</p>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-[#7FA82C] hover:bg-white hover:shadow-lg transition-all group">
          <div className="bg-purple-500/10 p-3 rounded-xl w-fit mb-4 text-purple-600 group-hover:scale-110 transition-transform">
            <FiShield size={24} />
          </div>
          <h4 className="text-lg font-black text-gray-800 mb-1 uppercase tracking-tighter">Seguridad</h4>
          <p className="text-sm text-gray-500 font-medium">Encriptación de datos extremo a extremo y gestión de sesiones activa.</p>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-[#7FA82C] hover:bg-white hover:shadow-lg transition-all group">
          <div className="bg-amber-500/10 p-3 rounded-xl w-fit mb-4 text-amber-600 group-hover:scale-110 transition-transform">
            <FiInfo size={24} />
          </div>
          <h4 className="text-lg font-black text-gray-800 mb-1 uppercase tracking-tighter">Uso</h4>
          <p className="text-sm text-gray-500 font-medium">Exclusivo para la gestión interna de inventario y pedidos de clientes.</p>
        </div>
      </div>

      {/* PANEL DE LICENCIA ULTRA DESTACADO */}
      <div className="relative group overflow-hidden">
        {/* Efecto Glow de fondo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-[#7FA82C] rounded-[2.6rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative bg-gray-900 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* Icono animado */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-3xl border border-white/10 shadow-xl">
                <FiRefreshCw className="text-orange-400 animate-[spin_4s_linear_infinite]" size={40} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                {licenciaInfo.titulo}
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-[#7FA82C]/10 border border-[#7FA82C]/30 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiCheckCircle className="text-[#7FA82C]" />
                  <span className="text-xs font-black text-[#7FA82C] uppercase tracking-widest">
                    Estado: {licenciaInfo.estado}
                  </span>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiCalendar className="text-blue-400" />
                  <span className="text-xs font-black text-blue-100 uppercase tracking-widest">
                    Vence: {licenciaInfo.fechaVencimiento}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nota de precio estilo informativo */}
          <div className="relative lg:max-w-[280px]">
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-orange-500/20 p-5 rounded-2xl text-left">
              <p className="text-[10px] text-orange-200/80 font-medium leading-relaxed uppercase tracking-tight">
                <span className="text-orange-400 font-black block mb-1 underline decoration-orange-500/40">Aviso de Tarifa:</span>
                {licenciaInfo.mensajePrecio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE DESARROLLADORES */}
      <div className="bg-[#F7FAF2] border-2 border-[#7FA82C]/20 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden text-left">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#7FA82C] p-2 rounded-lg">
              <FiCode className="text-white text-xl" />
            </div>
            <h3 className="font-black text-gray-800 text-2xl tracking-tighter uppercase">Equipo de Desarrollo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-800">Yahir Ordoñez</p>
              <p className="text-[10px] text-[#7FA82C] font-black uppercase tracking-[0.3em]">Lead Developer</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l-2 border-[#7FA82C]/10 md:pl-10">
              <p className="text-2xl font-bold text-gray-800">Jorge Ayala</p>
              <p className="text-[10px] text-[#7FA82C] font-black uppercase tracking-[0.3em]">Full Stack Dev</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l-2 border-[#7FA82C]/10 md:pl-10">
              <p className="text-2xl font-bold text-gray-800">Angel Palma</p>
              <p className="text-[10px] text-[#7FA82C] font-black uppercase tracking-[0.3em]">Full Stack Dev</p>
            </div>
          </div>
        </div>
        <FiUsers className="absolute -right-10 -bottom-10 size-64 text-[#7FA82C]/5 rotate-12" />
      </div>

      {/* ÚLTIMOS CAMBIOS */}
      <div className="pt-6 text-left">
        <div className="flex items-center justify-between mb-6 ml-2">
          <div className="flex items-center gap-3">
            <FiClock className="text-[#7FA82C]" size={20} />
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Historial de Cambios</h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F7FAF0] border border-[#7FA82C]/20 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-2 rounded-full bg-[#7FA82C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7FA82C]"></span>
              </span>
              <span className="text-[10px] font-black text-[#7FA82C] uppercase tracking-tight">Últimos 3 cambios</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden">
          <div className="max-h-[450px] overflow-y-auto p-10 custom-scrollbar">
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-gray-200 z-0"></div>
            <div className="space-y-12 relative z-10">
              {logCambios.slice(0, 3).map((cambio, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-8 relative transition-all duration-300 ${!cambio.isUrgent ? 'opacity-70 hover:opacity-100' : ''}`}
                >
                  <div className={`shrink-0 z-10 p-2.5 rounded-xl shadow-lg text-white ${cambio.isUrgent ? 'bg-[#7FA82C] shadow-lime-200' : 'bg-gray-400'}`}>
                    <FiGitCommit size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${cambio.isUrgent ? 'text-[#7FA82C]' : 'text-gray-400'}`}>
                      {cambio.fecha}
                    </span>
                    <h5 className="text-lg font-bold text-gray-800 leading-tight">{cambio.titulo}</h5>
                    <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                      {cambio.descripcion}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-[9px] font-black rounded-full uppercase">Autor:</span>
                      <span className="text-xs font-bold text-gray-800">{cambio.autor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Footer Final */}
      <div className="pt-4 text-center">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em] hover:text-[#7FA82C] transition-colors cursor-default">
          La Casa de los Frenos • Software de Gestión • 2026
        </p>
      </div>
    </div>
  );
};

export default Configuraciones;