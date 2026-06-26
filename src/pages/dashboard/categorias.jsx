import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { RiCloseFill } from 'react-icons/ri';
import { motion } from "framer-motion";
import Swal from 'sweetalert2'; // Añade esto al inicio con los otros imports
import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from '../../services/apiService';
import * as XLSX from "xlsx";
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../../utils/globalSweetAlert';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentCategoria, setCurrentCategoria] = useState(null);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [orden, setOrden] = useState('fecha-desc');
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        nombre: ''
    });

    // Obtener productos y categorías al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await obtenerCategorias();
                if (Array.isArray(data)) {
                    setCategorias(data);
                    setError(null);
                } else {
                    throw new Error("Datos recibidos no son un array");
                }
            } catch (error) {
                console.error("Error al obtener categorías:", error);
                setError("Error al cargar categorías");
                setCategorias([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ nombre: '' });
        setModalAbierto(true);
    };

    const openEditModal = (categoria) => {
        setModalMode('edit');
        setCurrentCategoria(categoria);
        setFormData({ nombre: categoria.nombre });
        setModalAbierto(true);
    };

    const fetchCategoriasData = async () => {
        setLoading(true);
        try {
            const data = await obtenerCategorias();
            setCategorias(Array.isArray(data) ? data : []);
            setError(null);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            setError("Error al cargar las categorías");
        } finally {
            setLoading(false);
        }
    };

    // Enviar formulario con validaciones y bloqueo de cierre en caso de error
    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombreLimpio = formData.nombre.trim();

        // 1. Validación: Campo vacío
        if (!nombreLimpio) {
            return showErrorAlert('Campo incompleto', 'El nombre de la categoría es requerido');
        }

        // 2. Validación: Evitar duplicados locales (Case insensitive)
        const existe = categorias.some(cat =>
            cat.nombre.toLowerCase() === nombreLimpio.toLowerCase() &&
            (modalMode === 'create' || cat.id !== currentCategoria.id)
        );

        if (existe) {
            return showErrorAlert('Categoría duplicada', 'Ya existe una categoría con este nombre');
        }

        try {
            // Mostrar loader preventivo (opcional, si tu API tarda)
            const loader = showLoadingAlert(modalMode === 'create' ? 'Creando categoría...' : 'Actualizando categoría...');

            if (modalMode === 'create') {
                await crearCategoria(nombreLimpio);
                loader.close();
                showSuccessAlert('¡Éxito!', 'Categoría creada correctamente');
            } else {
                await actualizarCategoria(currentCategoria.id, nombreLimpio);
                loader.close();
                showSuccessAlert('¡Éxito!', 'Categoría actualizada correctamente');
            }

            // SI LLEGÓ HASTA AQUÍ, LA API FUE EXITOSA:
            setModalAbierto(false); // Cerramos el modal
            await fetchCategoriasData(); // Recargamos lista

        } catch (error) {
            // SI FALLA LA API: No se cierra el modal para permitir corregir
            console.error('Error al guardar categoría:', error);

            // Cerramos el loader de SweetAlert antes de mostrar el error
            if (Swal.isVisible()) Swal.close();

            const mensajeError = error.response?.data?.message || 'No se pudo procesar la solicitud en el servidor';
            showErrorAlert('Error al guardar', mensajeError);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await showConfirmationAlert(
                '¿Estás seguro?',
                'Esta categoría se eliminará permanentemente. Asegúrate de que no tenga productos asociados.'
            );

            if (result.isConfirmed) {
                const loader = showLoadingAlert('Eliminando categoría...');

                await eliminarCategoria(id);

                loader.close();
                showSuccessAlert('¡Eliminado!', 'La categoría fue eliminada correctamente');
                await fetchCategoriasData();
            }
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            if (Swal.isVisible()) Swal.close();

            // Mensaje específico si la categoría está en uso (llave foránea)
            const errorMsg = error.response?.status === 409
                ? 'No se puede eliminar: Esta categoría tiene productos vinculados.'
                : (error.response?.data?.message || 'Error al intentar eliminar la categoría.');

            showErrorAlert('Acción rechazada', errorMsg);
        }
    };

    // Función auxiliar para mostrar carga (Asegúrate de tener Swal disponible)
    const showLoadingAlert = (message) => {
        return Swal.fire({
            title: message,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };

    const categoriasFiltradas = categorias
        .filter(categoria =>
            categoria.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
        )
        .sort((a, b) => {
            if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
            if (orden === 'nombre-desc') return b.nombre.localeCompare(a.nombre);

            // ORDENAR POR RECIENTES (created_at)
            if (orden === 'fecha-desc') {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            if (orden === 'fecha') {
                return new Date(a.created_at) - new Date(b.created_at);
            }
            return 0;
        });

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(categoriasFiltradas.map(categoria => ({
            'Nombre': categoria.nombre,
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Categorías");
        XLSX.writeFile(wb, "categorias.xlsx");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Categorías</h1>

            {/* Barra de herramientas de Categorías (Corregida para coherencia total) */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">

                        {/* Barra de búsqueda con estilo cápsula suave */}
                        <div className="relative w-full md:w-80">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] focus:border-transparent w-full transition-all bg-gray-50/50"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                            />
                        </div>

                        {/* Filtro de Orden */}
                        <div className="flex space-x-2 w-full md:w-auto">
                            <select
                                className="pl-3 pr-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] bg-white text-sm cursor-pointer hover:border-[#7FA82C] transition-colors w-full"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                            >
                                <option value="nombre">Nombre (A-Z)</option>
                                <option value="nombre-desc">Nombre (Z-A)</option>
                                <option value="fecha">Fecha (Antiguas)</option>
                                <option value="fecha-desc">Fecha (Recientes)</option>
                            </select>
                        </div>
                    </div>

                    {/* BOTONES DE ACCIÓN GRUPADOS (Estilo Cápsula Unificada) */}
                    <div className="flex items-center border-2 border-[#7FA82C] rounded-xl overflow-hidden shadow-lg bg-white w-full md:w-auto">
                        <button
                            onClick={openCreateModal}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#9DC435] hover:bg-[#8B9F2D] text-white px-6 py-2.5 text-sm font-bold transition-all active:scale-95"
                        >
                            <FiPlus className="text-lg" />
                            Agregar Categoría
                        </button>

                        <button
                            onClick={exportToExcel}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#9DC435] border-l-2 border-[#7FA82C] hover:bg-gray-50 px-6 py-2.5 text-sm font-bold transition-all active:scale-95"
                        >
                            <FiDownload className="text-lg" />
                            Excel
                        </button>
                    </div>
                </div>

                {/* Contador de resultados corregido con la línea de separación */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Resultados:</span>
                        <span className="text-[#7FA82C] font-black text-2xl mx-1">{categoriasFiltradas.length}</span>
                        <span className="text-gray-500 text-sm font-medium">categorías encontradas</span>
                    </div>

                    {filtroNombre && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold uppercase">
                            Buscando: {filtroNombre}
                        </span>
                    )}
                </div>
            </div>

            {/* Tabla de categorías mejorada */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
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
                                        Nombre de Categoría {orden === 'nombre' && '↓'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {categoriasFiltradas.length > 0 ? (
                                    categoriasFiltradas.map((categoria) => (
                                        <tr key={categoria.id} className="hover:bg-gray-50 transition-colors">
                                            {/* NOMBRE DE CATEGORÍA */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="text-sm font-bold text-gray-900 break-words max-w-md">
                                                    {categoria.nombre}
                                                </div>
                                            </td>

                                            {/* ACCIONES (Mismo estilo que productos) */}
                                            <td className="px-6 py-4 align-middle text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    {/* BOTÓN EDITAR (Azul) */}
                                                    <button
                                                        onClick={() => openEditModal(categoria)}
                                                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-90 border border-blue-200"
                                                        title="Editar categoría"
                                                    >
                                                        <FiEdit2 size={20} />
                                                    </button>

                                                    {/* BOTÓN ELIMINAR (Rojo) */}
                                                    <button
                                                        onClick={() => handleDelete(categoria.id)}
                                                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all active:scale-90 border border-red-200"
                                                        title="Eliminar categoría"
                                                    >
                                                        <FiTrash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-gray-500 italic">
                                            No se encontraron categorías que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* Modal para agregar/editar categoría */}


            {modalAbierto && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-gray-700"
                    >
                        {/* Cabecera */}
                        <div className="border-b border-gray-700 px-8 py-5 text-center relative bg-gray-800/50">
                            <h3 className="text-xl font-semibold text-white uppercase tracking-wider">
                                {modalMode === 'create' ? 'Agregar Nueva Categoría' : 'Editar Categoría'}
                            </h3>
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="absolute right-6 top-5 text-gray-400 hover:text-white transition-colors"
                            >
                                <RiCloseFill size={26} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Información General */}
                            <div className="space-y-6">
                                <h4 className="text-white text-sm font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3">
                                    Detalles de Categoría
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                            Nombre de la Categoría
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ej: Electrónica, Hogar, Ropa..."
                                            /* Eliminamos el azul con focus:ring-0 y forzamos el verde */
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer de Botones */}
                            <div className="flex gap-4 pt-6 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setModalAbierto(false)}
                                    className="flex-1 py-3 border border-gray-600 rounded-xl text-xs font-semibold text-gray-300 hover:bg-gray-700 transition-all uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3 bg-[#7FA82C] text-white text-xs font-semibold rounded-xl shadow-lg hover:bg-lime-700 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    {modalMode === 'create' ? 'Guardar Categoría' : 'Actualizar Cambios'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Categorias;