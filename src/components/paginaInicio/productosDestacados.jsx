import { useEffect, useState, useMemo } from 'react';
import { fetchProductos, obtenerCategorias } from '../../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaStar, FaCogs, FaLeaf, FaTag, FaChevronRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductosDestacados = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
  const [productoActual, setProductoActual] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataProductos, dataCategorias] = await Promise.all([
          fetchProductos(),
          obtenerCategorias()
        ]);
        const ultimas = dataCategorias.slice(-5).reverse();
        setCategorias(ultimas);
        setCategoriaPrincipal(ultimas[0]?.nombre || '');
        const primerProducto = dataProductos.find(p => p.categoria_id === ultimas[0]?.id);
        setProductos(dataProductos);
        setProductoActual(primerProducto || dataProductos[0]);

        dataProductos.forEach((prod) => {
          if (prod.imagen_url) {
            const img = new Image();
            img.src = prod.imagen_url;
          }
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (categorias.length === 0 || productos.length === 0) return;
    let indexCategoria = 0;
    let indexLetra = 0;
    let escribiendo = true;
    let timeout;

    const manejarEscritura = () => {
      const nombreCompleto = categorias[indexCategoria].nombre;
      if (escribiendo) {
        setCategoriaPrincipal(nombreCompleto.slice(0, indexLetra + 1));
        indexLetra++;
        if (indexLetra === nombreCompleto.length) {
          escribiendo = false;
          timeout = setTimeout(manejarEscritura, 2500);
          return;
        }
      } else {
        setCategoriaPrincipal(nombreCompleto.slice(0, indexLetra - 1));
        indexLetra--;
        if (indexLetra === 0) {
          escribiendo = true;
          indexCategoria = (indexCategoria + 1) % categorias.length;
          const nuevoProducto = productos.find(p => p.categoria_id === categorias[indexCategoria].id);
          if (nuevoProducto) setProductoActual(nuevoProducto);
        }
      }
      timeout = setTimeout(manejarEscritura, escribiendo ? 100 : 50);
    };
    timeout = setTimeout(manejarEscritura, 100);
    return () => clearTimeout(timeout);
  }, [categorias, productos]);

  const características = useMemo(() => [
    { icono: <FaStar />, titulo: 'Alta calidad', desc: 'Materiales premium para mayor duración.' },
    { icono: <FaCogs />, titulo: 'Precisión técnica', desc: 'Fabricación controlada para desempeño óptimo.' },
    { icono: <FaLeaf />, titulo: 'Ecológico', desc: 'Cumple con normas de seguridad ambiental.' },
    { icono: <FaCheckCircle />, titulo: 'Garantizado', desc: 'Ideal para múltiples aplicaciones.' }
  ], []);

  if (!productoActual) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 md:py-24 bg-white px-6 overflow-hidden"
    >
      {/* HEADER */}
      <div className="text-center mb-10 md:mb-16">
        <span className="text-[#7FA82C] text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-4 block">
          Productos de calidad
        </span>
        <div className="min-h-[80px] md:min-h-[100px] flex justify-center items-center text-center">
          <h2 className="text-2xl md:text-5xl font-extrabold uppercase text-gray-900 leading-tight flex flex-col md:flex-row items-center justify-center gap-x-2 md:gap-x-4">
            <span>Especialistas en</span>
            <div className="text-[#7FA82C] relative inline-block whitespace-nowrap">
              {categoriaPrincipal}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block ml-1 w-[2px] md:w-[3px] h-[20px] md:h-[45px] bg-[#7FA82C] align-middle"
              />
            </div>
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* COLUMNA IZQUIERDA: Tarjeta Compacta */}
        <div className="relative flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={productoActual.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative bg-white border border-[#7FA82C]/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl w-full max-w-[280px] md:max-w-[380px] h-[340px] md:h-[460px] overflow-hidden flex flex-col justify-between"
            >
              <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
              />

              {/* Etiqueta con esquinas totalmente redondeadas */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-[#7FA82C] text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-20 shadow-md">
                <FaTag className="text-[9px] md:text-[11px]" />
                {productoActual.categoria_nombre}
              </div>

              {/* Título Producto */}
              <div className="text-center min-h-[40px] md:min-h-[60px] flex items-center mt-10 md:mt-12">
                <h3 className="text-lg md:text-2xl font-black text-gray-800 uppercase tracking-tighter leading-tight line-clamp-2 px-2">
                  {productoActual.nombre}
                </h3>
              </div>

              {/* Imagen Compacta */}
              <div className="flex-grow w-full flex items-center justify-center p-2 md:p-4">
                <img
                  src={productoActual.imagen_url || '/placeholder.svg'}
                  alt={productoActual.nombre}
                  loading="eager"
                  className="w-full h-full max-h-[100px] md:max-h-[220px] object-contain transition-opacity duration-300"
                />
              </div>


            </motion.div>
          </AnimatePresence>
        </div>

        {/* COLUMNA DERECHA: Características */}
        <div className="flex flex-col space-y-3 md:space-y-5">
          {características.map((item, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.02, backgroundColor: "#ffffff", borderColor: "#7FA82C" }}
              className="flex items-center gap-4 md:gap-6 p-4 md:p-6 border border-transparent rounded-[1.2rem] md:rounded-[2rem] bg-[#f9fdf4] shadow-sm transition-all duration-400"
            >
              <div className="text-[#7FA82C] text-xl md:text-3xl shrink-0">{item.icono}</div>
              <div>
                <h4 className="text-sm md:text-lg font-bold text-gray-800 uppercase tracking-tight">{item.titulo}</h4>
                <p className="text-[10px] md:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOTÓN CATÁLOGO */}
      <div className="pt-12 md:pt-20 text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          <Link
            to="/catalogo"
            className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-3.5 md:py-5 text-[9px] md:text-xs font-black rounded-full bg-[#7FA82C] text-white uppercase tracking-widest overflow-hidden shadow-xl shadow-[#7FA82C]/40 transition-all hover:scale-105"
          >
            <span className="relative z-10">Ver catálogo completo</span>
            <FaChevronRight className="relative z-10 transition-transform group-hover:translate-x-1" />
            <motion.div
              animate={{ x: ['-150%', '150%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductosDestacados;