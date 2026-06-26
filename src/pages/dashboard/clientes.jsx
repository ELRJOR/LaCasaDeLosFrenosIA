import React, { useState, useEffect } from 'react';
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiDownload, FiRefreshCw
} from 'react-icons/fi';
import { RiCloseFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from '../../services/apiService';
import * as XLSX from 'xlsx';
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../../utils/globalSweetAlert';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentCliente, setCurrentCliente] = useState(null);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [formData, setFormData] = useState({ nombre: '', correo: '', telefono: '', direccion: '' });
    const [filtroCorreo, setFiltroCorreo] = useState('');
    const [filtroTelefono, setFiltroTelefono] = useState('');
    const [filtroDireccion, setFiltroDireccion] = useState('');


    useEffect(() => {
        fetchClientesData();
    }, []);

    const fetchClientesData = async () => {
        try {
            setLoading(true);
            const data = await obtenerClientes();
            setClientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            showErrorAlert('Error', 'No se pudieron cargar los clientes.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ nombre: '', correo: '', telefono: '', direccion: '' });
        setModalAbierto(true);
    };

    const openEditModal = (cliente) => {
        setModalMode('edit');
        setCurrentCliente(cliente);
        setFormData({
            nombre: cliente.nombre || '',
            correo: cliente.correo || '',
            telefono: cliente.telefono || '',
            direccion: cliente.direccion || ''
        });
        setModalAbierto(true);
    };

    // Validaciones claras antes de enviar
    const validateForm = () => {
        const { nombre, correo, telefono } = formData;

        if (!nombre.trim()) {
            showErrorAlert('Campo Requerido', 'El nombre del cliente es obligatorio.');
            return false;
        }

        // Validación de Correo (Regex estándar)
        if (correo) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                showErrorAlert('Formato Inválido', 'El correo electrónico no es válido.');
                return false;
            }
        }

        // Validación de Teléfono (10 dígitos)
        if (telefono) {
            const telRegex = /^\d{10}$/;
            if (!telRegex.test(telefono.replace(/\s/g, ""))) {
                showErrorAlert('Formato Inválido', 'El teléfono debe contener 10 dígitos numéricos.');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const loader = showLoadingAlert(modalMode === 'create' ? 'Registrando cliente...' : 'Actualizando cliente...');

            if (modalMode === 'create') {
                await crearCliente(formData);
                if (loader) loader.close();
                showSuccessAlert('¡Éxito!', 'Cliente registrado correctamente.');
            } else {
                await actualizarCliente(currentCliente.id, formData);
                if (loader) loader.close();
                showSuccessAlert('¡Éxito!', 'Información de cliente actualizada.');
            }

            // SOLO SE CIERRA SI LA API RESPONDE BIEN
            setModalAbierto(false);
            await fetchClientesData();
        } catch (error) {
            // SI FALLA LA API, EL MODAL SE QUEDA ABIERTO
            console.error('Error al guardar cliente:', error);
            Swal.close();
            const msg = error.response?.data?.message || 'No se pudo guardar la información del cliente.';
            showErrorAlert('Error al guardar', msg);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await showConfirmationAlert(
            '¿Eliminar cliente?',
            'Esta acción quitará al cliente de tu lista permanentemente.'
        );

        if (!confirm.isConfirmed) return;

        const loader = showLoadingAlert('Eliminando cliente...');
        try {
            await eliminarCliente(id);
            loader.close();
            showSuccessAlert('Eliminado', 'El cliente ha sido eliminado.');
            fetchClientesData();
        } catch (error) {
            loader.close();
            const msg = error.response?.data?.message || 'Hubo un error al intentar eliminar al cliente.';
            showErrorAlert('Error', msg);
        }
    };

    const showLoadingAlert = (message) => Swal.fire({
        title: message,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    const hayFiltrosActivos = filtroNombre || filtroCorreo || filtroTelefono || filtroDireccion;

    const clientesFiltrados = clientes.filter(c => {
        const nombreMatch = filtroNombre ? (c.nombre || '').toLowerCase().includes(filtroNombre.toLowerCase()) : false;
        const correoMatch = filtroCorreo ? (c.correo || '').toLowerCase().includes(filtroCorreo.toLowerCase()) : false;
        const telefonoMatch = filtroTelefono ? (c.telefono || '').toLowerCase().includes(filtroTelefono.toLowerCase()) : false;
        const direccionMatch = filtroDireccion ? (c.direccion || '').toLowerCase().includes(filtroDireccion.toLowerCase()) : false;

        if (!hayFiltrosActivos) return true;

        return (nombreMatch || correoMatch || telefonoMatch || direccionMatch);
    });

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(clientesFiltrados.map(c => ({
            'Nombre': c.nombre,
            'Correo': c.correo || '—',
            'Teléfono': c.telefono || '—',
            'Dirección': c.direccion || '—'
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        XLSX.writeFile(wb, 'reporte_clientes.xlsx');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Clientes</h1>

            {/* Barra de herramientas de Clientes (Unificada y Coherente) */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6">

                    {/* LADO IZQUIERDO: Búsqueda y Filtros Múltiples */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 flex-1">

                        {/* BARRA DE BÚSQUEDA PRINCIPAL */}
                        <div className="relative w-full lg:w-72">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] focus:border-transparent w-full transition-all bg-gray-50/50 text-sm"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                            />
                        </div>

                        {/* GRUPO DE FILTROS SECUNDARIOS (Estilo Coherente) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            <input
                                type="text"
                                placeholder="Correo"
                                className="px-3 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] text-sm bg-white"
                                value={filtroCorreo}
                                onChange={(e) => setFiltroCorreo(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Teléfono"
                                className="px-3 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] text-sm bg-white"
                                value={filtroTelefono}
                                onChange={(e) => setFiltroTelefono(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Dirección"
                                className="px-3 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] text-sm bg-white"
                                value={filtroDireccion}
                                onChange={(e) => setFiltroDireccion(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* LADO DERECHO: Botones de Acción (Estilo Cápsula Unificada) */}
                    <div className="flex items-center border-2 border-[#9DC435] rounded-xl overflow-hidden shadow-lg bg-white h-fit">
                        <button
                            onClick={openCreateModal}
                            className="flex items-center justify-center gap-2 bg-[#9DC435] hover:bg-[#8B9F2D] text-white px-6 py-2.5 text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
                        >
                            <FiPlus className="text-lg" />
                            Agregar Cliente
                        </button>

                        <button
                            onClick={exportToExcel}
                            className="flex items-center justify-center gap-2 bg-white text-[#9DC435] border-l-2 border-[#9DC435] hover:bg-gray-50 px-6 py-2.5 text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
                        >
                            <FiDownload className="text-lg" />
                            Excel
                        </button>
                    </div>
                </div>

                {/* PIE DE HERRAMIENTA: Contador de resultados con línea divisoria */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Resultados:</span>
                        <span className="text-[#7FA82C] font-black text-2xl mx-1">{clientesFiltrados.length}</span>
                        <span className="text-gray-500 text-sm font-medium">clientes encontrados</span>
                    </div>

                    {(filtroNombre || filtroCorreo || filtroTelefono || filtroDireccion) && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-pulse">
                            Filtros Activos
                        </span>
                    )}
                </div>
            </div>


            {/* Tabla de Clientes (Versión Final Pulida) */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7FA82C]"></div>
                </div>
            ) : (
                <div className="rounded-xl shadow-xl overflow-hidden border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Correo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {clientesFiltrados.length > 0 ? (
                                    clientesFiltrados.map(cliente => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 transition-colors group">
                                            {/* NOMBRE */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="text-sm font-bold text-gray-900 break-words max-w-[220px]">
                                                    {cliente.nombre}
                                                </div>
                                            </td>

                                            {/* CORREO */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="text-sm text-gray-600 truncate max-w-[200px]" title={cliente.correo}>
                                                    {cliente.correo || <span className="text-gray-300 font-medium italic text-xs tracking-widest">S/C</span>}
                                                </div>
                                            </td>

                                            {/* TELÉFONO */}
                                            <td className="px-6 py-4 align-middle text-sm text-gray-600 font-medium">
                                                {cliente.telefono || <span className="text-gray-300 font-medium italic text-xs tracking-widest">S/T</span>}
                                            </td>

                                            {/* DIRECCIÓN */}
                                            <td className="px-6 py-4 align-middle">
                                                <div className="text-sm text-gray-600 line-clamp-1 max-w-[250px]" title={cliente.direccion}>
                                                    {cliente.direccion || <span className="text-gray-300 font-medium italic text-xs tracking-widest">S/D</span>}
                                                </div>
                                            </td>

                                            {/* ACCIONES (Estilo Cápsulas Cuadradas Coherente) */}
                                            <td className="px-6 py-4 align-middle text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(cliente)}
                                                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-90 border border-blue-100"
                                                        title="Editar cliente"
                                                    >
                                                        <FiEdit2 size={20} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(cliente.id)}
                                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all active:scale-90 border border-red-100"
                                                        title="Eliminar cliente"
                                                    >
                                                        <FiTrash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <p className="px-6 py-12 text-center text-gray-500 italic">No se encontraron clientes registrados.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {modalAbierto && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-700"
                    >
                        {/* Cabecera */}
                        <div className="border-b border-gray-700 px-8 py-5 text-center relative bg-gray-800/50">
                            <h3 className="text-xl font-semibold text-white uppercase tracking-wider">
                                {modalMode === 'create' ? 'Agregar Nuevo Cliente' : 'Editar Cliente'}
                            </h3>
                            <button
                                onClick={() => setModalAbierto(false)}
                                className="absolute right-6 top-5 text-gray-400 hover:text-white transition-colors"
                            >
                                <RiCloseFill size={26} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Título de sección sutil */}
                            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3 mb-2">
                                Información de Contacto
                            </h4>

                            <div className="space-y-4">
                                {[
                                    { id: 'nombre', label: 'Nombre Completo', placeholder: 'Ej: Juan Pérez' },
                                    { id: 'correo', label: 'Correo Electrónico', placeholder: 'ejemplo@correo.com' },
                                    { id: 'telefono', label: 'Teléfono', placeholder: '999 000 0000' },
                                    { id: 'direccion', label: 'Dirección', placeholder: 'Calle 20 x 15 y 17...' }
                                ].map((field) => (
                                    <div key={field.id}>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                            {field.label}
                                        </label>
                                        <input
                                            name={field.id}
                                            type={field.id === 'correo' ? 'email' : 'text'}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            /* Eliminamos azul con focus:ring-0 y forzamos el verde */
                                            className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-[#7FA82C] focus:ring-0 transition-all placeholder:text-gray-500"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Footer de Botones */}
                            <div className="flex gap-4 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setModalAbierto(false)}
                                    className="flex-1 py-3 border border-gray-600 rounded-xl text-xs font-semibold text-gray-300 hover:bg-gray-700 transition-all uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3 bg-[#7FA82C] text-white rounded-xl text-xs font-semibold shadow-lg hover:bg-[#6B9526] active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    {modalMode === 'create' ? 'Registrar Cliente' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Clientes;
