"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronRight, ChevronLeft, Filter, Tag, X } from "lucide-react";
import { FaTag, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchProductos, obtenerCategorias } from "../../services/apiService";
import { motion, AnimatePresence } from "framer-motion";

// --- SKELETON PARA CARGA ---
const CardSkeleton = () => (
  <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-4 animate-pulse h-[320px]">
    <div className="w-full h-40 bg-gray-200 rounded-2xl mb-4" />
    <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4" />
    <div className="h-10 bg-gray-200 rounded-xl w-full mt-auto" />
  </div>
);

// --- PRODUCTO CARD ---
const ProductoCard = React.memo(({ producto }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <Link
      to={`/producto/${producto.id}`}
      className="group relative flex flex-col h-full bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#9DC435]/10 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="absolute top-4 right-4 bg-[#9DC435] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
        <FaTag size={10} />
        {producto.categoria_nombre}
      </div>

      <div className="h-44 sm:h-56 bg-gray-50/50 flex items-center justify-center overflow-hidden p-6">
        <img
          src={producto.imagen_url || "/placeholder.svg"}
          alt={producto.nombre}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow gap-4">
        <h3 className="text-gray-800 text-sm sm:text-lg text-center font-bold line-clamp-2 min-h-[2.5rem]">
          {producto.nombre}
        </h3>
        <span className="mt-auto w-full text-center border-2 border-[#7FA82C] text-[#7FA82C] group-hover:bg-[#7FA82C] group-hover:text-white text-xs font-black py-3 rounded-xl transition-all duration-300 uppercase tracking-widest">
          Ver detalles
        </span>
      </div>
    </Link>
  </motion.div>
));

function BrakesCatalog() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const productosPorPagina = 8;

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        const [datosProds, datosCats] = await Promise.all([fetchProductos(), obtenerCategorias()]);
        setProductos(datosProds);
        setCategorias(datosCats);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setTimeout(() => setCargando(false), 600);
      }
    };
    obtenerDatos();
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideCat = filtroCategoria === "" || p.categoria_nombre === filtroCategoria;
      const coincideBus = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCat && coincideBus;
    });
  }, [productos, filtroCategoria, busqueda]);

  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimer = indexUltimo - productosPorPagina;
  const productosActuales = productosFiltrados.slice(indexPrimer, indexUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (num) => {
    setPaginaActual(num);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div id="catalogo" className="bg-[#FBFCFE] py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Banner */}
      <div
        className="max-w-7xl mx-auto relative rounded-[2.5rem] overflow-hidden mb-10 bg-cover bg-center shadow-2xl h-48 md:h-64"
        style={{ backgroundImage: "url('/CatalogoBanner.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2">Nuestro catálogo</h1>
          <p className="text-sm md:text-xl max-w-2xl opacity-90">Selección premium de sistemas de pastas y balatas.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-72 flex-shrink-0">

          {/* BUSCADOR Y FILTRO EN LA MISMA FILA PARA MÓVIL */}
          <div className="flex md:flex-col gap-3 mb-8 md:sticky md:top-6">

            {/* Buscador */}
            <div className="relative flex-[2] group">
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                className="w-full text-gray-700 bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 shadow-md focus:border-[#7FA82C] focus:ring-1 focus:ring-[#7FA82C] outline-none transition-all text-sm font-bold"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#7FA82C]" size={18} />
            </div>

            {/* Filtro Móvil (Aparece al lado del buscador) */}
            <div className="relative flex-[1] md:hidden">
              <select
                value={filtroCategoria}
                onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
                className="w-full bg-white border border-gray-200 rounded-2xl px-3 py-3 shadow-md appearance-none font-bold text-sm text-gray-700 focus:border-[#7FA82C] focus:ring-1 focus:ring-[#7FA82C] outline-none transition-all"
              >
                <option value="">Todas</option>
                {categorias.map(cat => <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90" size={18} />
            </div>

            {/* Categorías Desktop (Se mantiene el estilo moderno) */}
            <div className="hidden md:block bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50">
              <h2 className="text-lg font-bold mb-2 text-gray-800 uppercase">Filtrar por</h2>
              <h3 className="font-semibold text-gray-400 mb-4 uppercase text-[10px] tracking-widest">Categorías</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setFiltroCategoria(""); setPaginaActual(1); }}
                  className={`flex items-center justify-between px-5 py-3 rounded-xl text-sm font-bold transition-all ${filtroCategoria === "" ? "bg-[#7FA82C] text-white shadow-lg shadow-[#7FA82C]/30" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <span>Todas</span>
                  {filtroCategoria === "" && <FaCheck size={10} />}
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setFiltroCategoria(cat.nombre); setPaginaActual(1); }}
                    className={`flex items-center justify-between px-5 py-3 rounded-xl text-sm font-bold transition-all ${filtroCategoria === cat.nombre ? "bg-[#7FA82C] text-white shadow-lg shadow-[#7FA82C]/30" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span className="truncate">{cat.nombre}</span>
                    {filtroCategoria === cat.nombre && <FaCheck size={10} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-8 px-2">
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              Mostrando <span className="text-[#7FA82C]">{productosActuales.length}</span> de <span className="text-gray-500">{productosFiltrados.length}</span> productos
            </p>
          </div>

          <AnimatePresence mode="wait">
            {cargando ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : productosActuales.length > 0 ? (
              <motion.div
                key={`${filtroCategoria}-${busqueda}-${paginaActual}`}
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 mb-12"
              >
                {productosActuales.map((p) => <ProductoCard key={p.id} producto={p} />)}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <X className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Sin resultados</p>
              </div>
            )}
          </AnimatePresence>

          {/* Paginación */}
          {!cargando && totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="p-3 rounded-xl bg-white shadow-md border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={24} className="text-[#7FA82C]" />
              </button>
              <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-md border border-gray-100">
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => cambiarPagina(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${paginaActual === i + 1 ? "bg-[#7FA82C] text-white shadow-lg shadow-[#7FA82C]/20" : "text-gray-400 hover:text-gray-800"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="p-3 rounded-xl bg-white shadow-md border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"
              >
                <ChevronRight size={24} className="text-[#7FA82C]" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default BrakesCatalog;