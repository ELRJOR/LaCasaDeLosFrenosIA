import React, { useState, useEffect } from 'react';
import { FaCogs, FaRuler } from "react-icons/fa";
import { FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2, FiDownload, FiEye, FiPenTool } from 'react-icons/fi';
import { RiCloseFill, RiDeleteBin6Line, RiAddFill, RiImageAddFill } from 'react-icons/ri';
import { crearProducto, fetchProductos, actualizarProducto, eliminarProducto, obtenerCategorias } from '../../services/apiService';
import * as XLSX from "xlsx";
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../../utils/globalSweetAlert';
import { motion } from "framer-motion";


const Productos = () => {
    // Estados
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [orden, setOrden] = useState('recientes');
    const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
    const [productoDetalles, setProductoDetalles] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        imagen: null,
        previewUrl: null,
        stock: '',
        categoria_id: '',
        medidas: [],
        caracteristicas: []
    });

    // Obtener productos y categorías al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProductos();
                setProductos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al obtener productos:", error);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategoriasData = async () => {
            try {
                const data = await obtenerCategorias();
                setCategorias(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };

        fetchData();
        fetchCategoriasData();
    }, []);

    // Función para recargar los productos
    const fetchProductosData = async () => {
        try {
            const data = await fetchProductos();
            setProductos(data);
        } catch (error) {
            console.error("Error al recargar productos:", error);
        }
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en archivos con validación de tipo y tamaño
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validación de tipo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                showErrorAlert('Archivo no permitido', 'Solo se aceptan imágenes JPG, PNG o WEBP');
                e.target.value = null;
                return;
            }
            // Validación de tamaño (Máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showErrorAlert('Archivo muy pesado', 'La imagen no debe superar los 5MB');
                e.target.value = null;
                return;
            }

            setFormData(prev => ({
                ...prev,
                imagen: file,
                previewUrl: URL.createObjectURL(file)
            }));
        }
    };

    // Abrir modal para crear
    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            nombre: '',
            descripcion: '',
            imagen: null,
            previewUrl: null,
            stock: 1, // Valor por defecto
            categoria_id: '',
            medidas: [],
            caracteristicas: []
        });
        setModalAbierto(true);
    };

    // Abrir modal para editar
    const openEditModal = (producto) => {
        setModalMode('edit');
        setCurrentProduct(producto);
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            imagen: null,
            previewUrl: producto.imagen_url || producto.imagen,
            stock: producto.stock,
            categoria_id: producto.categoria_id,
            medidas: Array.isArray(producto.medidas) ? [...producto.medidas] : [],
            caracteristicas: Array.isArray(producto.caracteristicas) ? [...producto.caracteristicas] : []
        });
        setModalAbierto(true);
    };

    const openDetallesModal = (producto) => {
        setProductoDetalles(producto);
        setModalDetallesAbierto(true);
    };

    // Enviar formulario con validaciones de seguridad
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validaciones básicas de negocio
        if (!formData.nombre.trim()) {
            return showErrorAlert('Campo incompleto', 'El nombre del producto es obligatorio.');
        }
        if (!formData.categoria_id) {
            return showErrorAlert('Campo incompleto', 'Debes seleccionar una categoría.');
        }
        if (modalMode === 'create' && !formData.imagen) {
            return showErrorAlert('Falta imagen', 'Debes subir una imagen para crear el producto.');
        }

        // 2. VALIDACIÓN ESTRICTA DE NÚMEROS EN MEDIDAS
        // Revisamos si alguna medida tiene letras o está vacía
        const tieneErrorNumerico = formData.medidas.some(m =>
            m.valor === '' || isNaN(m.valor) || isNaN(parseFloat(m.valor))
        );

        if (tieneErrorNumerico) {
            return showErrorAlert(
                'Error en medidas',
                'Los valores de las medidas deben ser exclusivamente números (ejemplo: 10.5). No se permiten letras.'
            );
        }

        // 3. Limpieza y preparación de datos para el envío
        const dataFinal = {
            ...formData,
            medidas: formData.medidas.map(m => ({
                ...m,
                valor: parseFloat(m.valor) // Convertimos a número real
            })),
            caracteristicas: formData.caracteristicas.map(c => ({
                ...c,
                valor: String(c.valor) // Aseguramos que sea texto
            }))
        };

        try {
            if (modalMode === 'create') {
                await crearProducto(dataFinal);
                showSuccessAlert('¡Éxito!', 'Producto creado correctamente');
            } else {
                await actualizarProducto(currentProduct.id, dataFinal);
                showSuccessAlert('¡Actualizado!', 'Producto actualizado correctamente');
            }
            setModalAbierto(false);
            await fetchProductosData();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            // Error del servidor (por si algo se escapó de la validación frontal)
            showErrorAlert('Error al guardar', error.message || 'No se pudo procesar la solicitud.');
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        try {
            const result = await showConfirmationAlert(
                '¿Estás seguro?',
                'Esta acción eliminará el producto permanentemente del catálogo.'
            );
            if (result.isConfirmed) {
                await eliminarProducto(id);
                showSuccessAlert('Eliminado', 'El producto ha sido borrado con éxito.');
                await fetchProductosData();
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            showErrorAlert('Error', 'No se pudo eliminar el producto en este momento.');
        }
    };

    // Filtrar y ordenar productos
    const productosFiltrados = productos
        .filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
            const coincideCategoria = filtroCategoria === '' || producto.categoria_id.toString() === filtroCategoria;
            return coincideNombre && coincideCategoria;
        })
        .sort((a, b) => {
            if (orden === 'recientes') return new Date(b.creado_en) - new Date(a.creado_en);
            if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
            if (orden === 'nombre-desc') return b.nombre.localeCompare(a.nombre);
            if (orden === 'stock') return Number(a.stock) - Number(b.stock);
            if (orden === 'stock-desc') return Number(b.stock) - Number(a.stock);
            return 0;
        });

    // Exportar a Excel
    const exportToExcel = () => {
        const productosParaExportar = productosFiltrados.map(producto => {
            const categoria = categorias.find(c => c.id === producto.categoria_id);
            return {
                'Nombre': producto.nombre,
                'Descripción': producto.descripcion,
                'Stock Status': producto.stock === 1 ? 'Disponible' : 'No disponible',
                'Categoría': categoria ? categoria.nombre : 'Sin categoría',
            };
        });

        const ws = XLSX.utils.json_to_sheet(productosParaExportar);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventario");
        XLSX.writeFile(wb, "Reporte_Productos.xlsx");
    };




    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Productos</h1>

            {/* Barra de herramientas */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">

                    {/* LADO IZQUIERDO: Búsqueda y Filtros */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">

                        {/* BARRA DE BÚSQUEDA */}
                        <div className="relative w-full md:w-80">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="pl-11 pr-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] focus:border-transparent w-full transition-all bg-gray-50/50"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                            />
                        </div>

                        {/* SELECTORES DE FILTRO */}
                        <div className="flex flex-1 gap-2">
                            <select
                                className="flex-1 md:w-48 pl-3 pr-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] bg-white text-sm cursor-pointer hover:border-[#7FA82C] transition-colors"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map(categoria => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="flex-1 md:w-48 pl-3 pr-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] bg-white text-sm cursor-pointer hover:border-[#7FA82C] transition-colors"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                            >
                                <option value="recientes">Últimos agregados</option>
                                <option value="nombre">Nombre (A-Z)</option>
                                <option value="nombre-desc">Nombre (Z-A)</option>
                                <option value="stock">Stock (Menor a Mayor)</option>
                                <option value="stock-desc">Stock (Mayor a Menor)</option>
                            </select>
                        </div>
                    </div>

                    {/* LADO DERECHO: Botones de Acción (Estilo Cápsula Unificada) */}
                    <div className="flex items-center border-2 border-[#9DC435] rounded-xl overflow-hidden shadow-lg bg-white">

                        {/* BOTÓN AGREGAR */}
                        <button
                            onClick={openCreateModal}
                            className="flex items-center justify-center gap-2 bg-[#9DC435] hover:bg-[#8B9F2D] text-white px-6 py-2.5 text-sm font-bold transition-all active:scale-95"
                        >
                            <FiPlus className="text-lg" />
                            Agregar
                        </button>

                        {/* SEPARADOR Y BOTÓN EXCEL */}
                        <button
                            onClick={exportToExcel}
                            className="flex items-center justify-center gap-2 bg-white text-[#9DC435] border-l-2 border-[#9DC435] hover:bg-gray-50 px-6 py-2.5 text-sm font-bold transition-all active:scale-95"
                        >
                            <FiDownload className="text-lg" />
                            Excel
                        </button>
                    </div>
                </div>

                {/* CONTADOR Y ESTADO */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Resultados:</span>
                        <span className="text-[#7FA82C] font-black text-2xl">{productosFiltrados.length}</span>
                        <span className="text-gray-500 text-sm font-medium">productos encontrados</span>
                    </div>

                    {filtroNombre && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold uppercase">
                            Filtrando por: {filtroNombre}
                        </span>
                    )}
                </div>
            </div>

            {/* Tabla de productos */}
            {loading ? (
                <div className="flex justify-center items-center h-64 ">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="rounded-xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300 bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => setOrden('nombre')}
                                    >
                                        Nombre {orden === 'nombre' && '↓'}
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Imagen
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {productosFiltrados.length > 0 ? (
                                    productosFiltrados.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                                            {/* NOMBRE: Ajuste de línea si es muy largo */}


                                            {/* DESCRIPCIÓN: Limitada a 3 líneas con scroll o corte limpio */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="text-xs text-gray-600 line-clamp-3 max-w-xs break-words">
                                                    {producto.descripcion || "Sin descripción"}
                                                </div>
                                            </td>

                                            {/* CATEGORÍA */}
                                            <td className="px-6 py-4 align-middle text-sm text-gray-700">
                                                <span className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                                    {categorias.find(c => c.id === producto.categoria_id)?.nombre || 'General'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex justify-center">
                                                    {producto.imagen_url ? (
                                                        /* Contenedor con z-index bajo para que no estorbe a menos que sea hover */
                                                        <div className="relative w-20 h-20 flex items-center justify-center z-0 hover:z-50">
                                                            <img
                                                                src={producto.imagen_url}
                                                                alt={producto.nombre}
                                                                className="
            w-full h-full object-contain 
            rounded-lg border border-gray-200 bg-white shadow-sm 
            cursor-zoom-in
            /* ORIGEN CENTRADO */
            origin-center
            /* TRANSICIÓN LENTA: 700ms para que sea muy suave */
            transition-all duration-700 ease-in-out 
            /* EFECTO HOVER */
            hover:scale-[4] 
            hover:shadow-2xl 
            hover:border-gray-300
          "
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-[10px]">
                                                            Sin imagen
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* STOCK */}
                                            <td className="px-6 py-4 align-middle text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${producto.stock === 1
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-red-100 text-red-700 border-red-200'
                                                    }`}>
                                                    {producto.stock === 1 ? 'Disponible' : 'Agotado'}
                                                </span>
                                            </td>

                                            {/* ACCIONES (BOTONES MÁS GRANDES Y ROBUSTOS) */}
                                            <td className="px-6 py-4 align-middle text-right">
                                                <div className="flex justify-end gap-3">
                                                    {/* BOTÓN VER (Púrpura) */}
                                                    <button
                                                        onClick={() => openDetallesModal(producto)}
                                                        className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-90 border border-purple-200"
                                                        title="Ver detalles"
                                                    >
                                                        <FiEye size={22} />
                                                    </button>

                                                    {/* BOTÓN EDITAR (Azul) */}
                                                    <button
                                                        onClick={() => openEditModal(producto)}
                                                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-90 border border-blue-200"
                                                        title="Editar producto"
                                                    >
                                                        <FiEdit2 size={22} />
                                                    </button>

                                                    {/* BOTÓN ELIMINAR (Rojo) */}
                                                    <button
                                                        onClick={() => handleDelete(producto.id)}
                                                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all active:scale-90 border border-red-200"
                                                        title="Eliminar producto"
                                                    >
                                                        <FiTrash2 size={22} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                                            No se encontraron productos que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



            {/* Modal de Detalles */}
            {modalDetallesAbierto && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        {/* Cabecera */}
                        <div className="flex justify-between items-center border-b px-6 py-4 border-gray-700 bg-gray-800/50">
                            <h3 className="text-xl font-bold text-white truncate">
                                {productoDetalles?.nombre}
                            </h3>
                            <button
                                onClick={() => setModalDetallesAbierto(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-full"
                            >
                                <RiCloseFill size={28} />
                            </button>
                        </div>

                        {/* Contenido en Dos Columnas */}
                        <div className="flex flex-col md:flex-row overflow-y-auto">

                            {/* Columna Izquierda: Imagen */}
                            <div className="w-full md:w-1/2 p-6 bg-gray-900/50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-700">
                                <div className="relative w-full h-64 md:h-96 flex items-center justify-center bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                                    <img
                                        src={productoDetalles?.imagen_url}
                                        alt={productoDetalles?.nombre}
                                        className="max-w-full max-h-full object-contain transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Información */}
                            <div className="w-full md:w-1/2 p-6 space-y-8 overflow-y-auto">

                                {/* Sección de Medidas */}
                                <div>
                                    <h4 className="text-sm font-black text-[#7FA82C] uppercase tracking-widest mb-4 flex items-center">
                                        <FaRuler className="mr-2" /> Medidas
                                    </h4>
                                    {productoDetalles?.medidas?.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            {productoDetalles.medidas.map((medida, index) => (
                                                <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                                                    <span className="text-gray-400 text-xs font-bold uppercase">{medida.tipo_medida}</span>
                                                    <span className="text-white font-medium">{medida.valor}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No hay medidas registradas.</p>
                                    )}
                                </div>

                                {/* Sección de Características */}
                                <div>
                                    <h4 className="text-sm font-black text-[#7FA82C] uppercase tracking-widest mb-4 flex items-center">
                                        <FaCogs className="mr-2" /> Características
                                    </h4>
                                    {productoDetalles?.caracteristicas?.length > 0 ? (
                                        <div className="space-y-3">
                                            {productoDetalles.caracteristicas.map((caracteristica, index) => (
                                                <div key={index} className="bg-gray-700/30 p-3 rounded-lg border-l-4 border-[#7FA82C]">
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{caracteristica.tipo_caracteristica}</p>
                                                    <p className="text-gray-200 text-sm leading-relaxed">{caracteristica.valor}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No hay características registradas.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-700 bg-gray-800 flex justify-end">
                            <button
                                onClick={() => setModalDetallesAbierto(false)}
                                className="px-6 py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all active:scale-95"
                            >
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}


            {modalAbierto && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-gray-700"
                    >
                        {/* Cabecera */}
                        <div className="border-b border-gray-700 px-8 py-5 text-center relative bg-gray-800/50">
                            <h3 className="text-xl font-semibold text-white uppercase tracking-wider">
                                {modalMode === 'create' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
                            </h3>
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="absolute right-6 top-5 text-gray-400 hover:text-white transition-colors"
                            >
                                <RiCloseFill size={26} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-10 overflow-y-auto custom-scrollbar">

                            {/* Información General */}
                            <div className="space-y-6">
                                <h4 className="text-white text-sm font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3">
                                    Información General
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            /* Se agregó focus:ring-0 y se forzó focus:border-[#7FA82C] */
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Descripción</label>
                                        <textarea
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            rows="3"
                                            /* Se aplicó lo mismo aquí para evitar el azul */
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Categoría</label>
                                            <select
                                                name="categoria_id"
                                                value={formData.categoria_id}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {categorias.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Stock</label>
                                            <div
                                                onClick={() => setFormData({ ...formData, stock: formData.stock === 1 ? 0 : 1 })}
                                                className="flex items-center justify-between bg-gray-700/50 px-4 py-2.5 rounded-xl border border-gray-600 cursor-pointer hover:border-[#7FA82C] transition-all"
                                            >
                                                <span className="text-sm font-semibold">{formData.stock === 1 ? "Disponible" : "Agotado"}</span>
                                                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.stock === 1 ? 'bg-[#7FA82C]' : 'bg-gray-500'}`}>
                                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${formData.stock === 1 ? 'translate-x-5' : ''}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Imagen con Dropzone y Previsualización Funcional */}
                            <div className="space-y-4">
                                <h4 className="text-white text-sm font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3">
                                    Imagen del Producto
                                </h4>

                                <div className="relative group border-2 border-dashed border-gray-600 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#7FA82C] hover:bg-[#7FA82C]/5 transition-all min-h-[200px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required={modalMode === 'create' && !formData.previewUrl}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />

                                    {formData.previewUrl ? (
                                        <div className="text-center animate-in fade-in zoom-in-95 duration-300">
                                            <img
                                                src={formData.previewUrl}
                                                alt="Vista previa"
                                                className="max-h-48 rounded-lg shadow-xl mb-4 border-2 border-[#7FA82C] object-contain"
                                            />
                                            <p className="text-sm font-semibold text-white">¡Imagen cargada!</p>
                                            <p className="text-xs text-[#7FA82C] uppercase mt-1">Haz clic o arrastra para cambiar</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <RiImageAddFill className="mx-auto text-5xl text-gray-500 mb-3 group-hover:text-[#7FA82C] transition-colors" />
                                            <p className="text-base font-semibold text-white">Presiona aquí o arrastra tu imagen</p>
                                            <p className="text-xs text-gray-400 mt-2">Formatos aceptados: PNG, JPG o WEBP</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Medidas */}
                            <div className="space-y-4">
                                <h4 className="text-white text-sm font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3">Medidas Técnicas</h4>
                                <div className="space-y-3">
                                    {formData.medidas.map((medida, index) => (
                                        <div key={index} className="flex gap-3 animate-in slide-in-from-right-2">
                                            <input placeholder="Tipo" value={medida.tipo_medida} onChange={(e) => {
                                                const nuevas = [...formData.medidas]; nuevas[index].tipo_medida = e.target.value; setFormData({ ...formData, medidas: nuevas });
                                            }} className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all" />
                                            <input placeholder="Valor" value={medida.valor} onChange={(e) => {
                                                const nuevas = [...formData.medidas]; nuevas[index].valor = e.target.value; setFormData({ ...formData, medidas: nuevas });
                                            }} className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all" />
                                            <button type="button" onClick={() => {
                                                const nuevas = formData.medidas.filter((_, i) => i !== index); setFormData({ ...formData, medidas: nuevas });
                                            }} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><RiDeleteBin6Line size={20} /></button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, medidas: [...formData.medidas, { tipo_medida: '', valor: '' }] })}
                                        className="w-full py-3 border border-dashed border-[#7FA82C] rounded-xl text-[#7FA82C] hover:bg-[#7FA82C]/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest"
                                    >
                                        <RiAddFill size={18} /> Añadir Medida Técnica
                                    </button>
                                </div>
                            </div>

                            {/* Características */}
                            <div className="space-y-4">
                                <h4 className="text-white text-sm font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3">Características Especiales</h4>
                                <div className="space-y-3">
                                    {formData.caracteristicas.map((car, index) => (
                                        <div key={index} className="flex gap-3 animate-in slide-in-from-right-2">
                                            <input placeholder="Característica" value={car.tipo_caracteristica} onChange={(e) => {
                                                const nuevas = [...formData.caracteristicas]; nuevas[index].tipo_caracteristica = e.target.value; setFormData({ ...formData, caracteristicas: nuevas });
                                            }} className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all" />
                                            <input placeholder="Valor" value={car.valor} onChange={(e) => {
                                                const nuevas = [...formData.caracteristicas]; nuevas[index].valor = e.target.value; setFormData({ ...formData, caracteristicas: nuevas });
                                            }} className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all" />
                                            <button type="button" onClick={() => {
                                                const nuevas = formData.caracteristicas.filter((_, i) => i !== index); setFormData({ ...formData, caracteristicas: nuevas });
                                            }} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><RiDeleteBin6Line size={20} /></button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, caracteristicas: [...formData.caracteristicas, { tipo_caracteristica: '', valor: '' }] })}
                                        className="w-full py-3 border border-dashed border-[#7FA82C] rounded-xl text-[#7FA82C] hover:bg-[#7FA82C]/10 transition-all flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest"
                                    >
                                        <RiAddFill size={18} /> Añadir Característica
                                    </button>
                                </div>
                            </div>

                            {/* Footer de Botones */}
                            <div className="flex gap-4 pt-6 border-t border-gray-700">
                                <button type="button" onClick={() => setModalAbierto(false)} className="flex-1 py-3 border border-gray-600 rounded-xl text-xs font-semibold text-gray-300 hover:bg-gray-700 transition-all uppercase tracking-widest">Cancelar</button>
                                <button type="submit" className="flex-[2] py-3 bg-[#7FA82C] text-white text-xs font-semibold rounded-xl shadow-lg hover:bg-lime-700 active:scale-95 transition-all uppercase tracking-widest">
                                    {modalMode === 'create' ? 'Guardar Producto' : 'Actualizar Cambios'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}



        </div>
    );
};

export default Productos;