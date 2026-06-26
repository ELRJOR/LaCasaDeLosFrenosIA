import React, { useEffect, useState } from 'react';
import { FiTrash2, FiDownload, FiEye, FiPlus, FiUser, FiCalendar, FiClipboard, FiList, FiClock, FiEdit2, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { RiCloseFill, RiAddFill, RiDeleteBin6Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import Select from 'react-select';





const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#374151', // bg-gray-700
        borderColor: state.isFocused ? '#7FA82C' : '#4B5563', // verde y gray-600
        color: '#F9FAFB', // text-gray-100
        outline: 'none',

        boxShadow: state.isFocused ? '0 0 0 1px #7FA82C' : 'none',
        '&:hover': {
            borderColor: '#7FA82C'
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: '#F9FAFB'
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#374151' // bg-gray-700
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#4B5563' : '#374151',
        color: '#F9FAFB',
        '&:active': {
            backgroundColor: '#7FA82C'
        }
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9CA3AF' // text-gray-400
    }),
    input: (base) => ({
        ...base,
        color: '#F9FAFB'
    })
};


import {
    obtenerPedidos,
    eliminarPedido,
    crearPedido,
    fetchProductos,
    actualizarPedido,
    obtenerClientes
} from '../../services/apiService';
import {
    showSuccessAlert,
    showErrorAlert,
    showConfirmationAlert
} from '../../utils/globalSweetAlert';
import * as XLSX from 'xlsx';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalDetalle, setModalDetalle] = useState(false);
    const [modalCrear, setModalCrear] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');


    const [ordenFecha, setOrdenFecha] = useState('reciente');


    const [productos, setProductos] = useState([]);
    const [productosPedido, setProductosPedido] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);



    const [modoEditar, setModoEditar] = useState(false);




    const [nuevoPedido, setNuevoPedido] = useState({
        clienteId: '',
        fecha: '',
        estado: '',
        observaciones: ''
    });

    // --- EFECTOS INICIALES ---
    useEffect(() => {
        const cargarTodo = async () => {
            setLoading(true);
            await Promise.all([fetchPedidos(), fetchClientes(), fetchProductosData()]);
            setLoading(false);
        };
        cargarTodo();
    }, []);

    // --- CARGA DE DATOS (API) ---
    const fetchProductosData = async () => {
        try {
            const data = await fetchProductos();
            setProductos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error productos:", error);
        }
    };

    const fetchPedidos = async () => {
        try {
            const data = await obtenerPedidos();
            setPedidos(Array.isArray(data) ? data : []);
        } catch (err) {
            showErrorAlert('Error', 'No se pudieron cargar los pedidos');
        }
    };

    const fetchClientes = async () => {
        try {
            const data = await obtenerClientes();
            setClientes(Array.isArray(data) ? data : []);
        } catch (err) {
            showErrorAlert('Error', 'No se pudieron cargar los clientes');
        }
    };

    // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
    const pedidosFiltrados = pedidos
        .filter(p => {
            const nombreCliente = p.cliente?.nombre?.toLowerCase() || '';
            const coincideCliente = nombreCliente.includes(filtroCliente.toLowerCase());
            const coincideEstado = filtroEstado ? p.estado === filtroEstado : true;
            return coincideCliente && coincideEstado;
        })
        .sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return ordenFecha === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
        });

    // --- GESTIÓN DE MODALES Y FORMULARIO ---
    const abrirDetalle = (pedido) => {
        setPedidoSeleccionado(pedido);
        setModalDetalle(true);
    };

    const abrirEditar = (pedido) => {
        if (!pedido || !pedido.id) return showErrorAlert('Error', 'Pedido no válido');

        setModoEditar(true);
        setPedidoSeleccionado(pedido);

        // Formatear fecha para inputs datetime-local (YYYY-MM-DDTHH:mm)
        const fechaISO = new Date(pedido.fecha).toISOString().slice(0, 16);

        setNuevoPedido({
            clienteId: pedido.cliente?.id || '',
            fecha: fechaISO,
            estado: pedido.estado || 'pendiente',
            observaciones: pedido.observaciones || ''
        });

        // Mapear productos del pedido al estado temporal del formulario
        const productosMapeados = (pedido.pedido_productos || [])
            .map(pp => pp?.producto?.id ? ({
                producto_id: pp.producto.id,
                nombre: pp.producto.nombre || 'Producto sin nombre',
                cantidad: pp.cantidad || 1
            }) : null)
            .filter(Boolean);

        setProductosPedido(productosMapeados);
        setModalCrear(true);
    };

    // --- PERSISTENCIA (GUARDAR / ACTUALIZAR) ---
    const handleGuardarPedido = async () => {
        // Validaciones preventivas
        if (!nuevoPedido.clienteId) return showErrorAlert('Campo Requerido', 'Debes seleccionar un cliente.');
        if (!nuevoPedido.fecha) return showErrorAlert('Campo Requerido', 'La fecha y hora son obligatorias.');
        if (productosPedido.length === 0) return showErrorAlert('Faltan Productos', 'El pedido debe tener al menos un producto.');

        const payload = {
            cliente_id: nuevoPedido.clienteId,
            fecha: nuevoPedido.fecha,
            estado: nuevoPedido.estado || 'pendiente',
            observaciones: nuevoPedido.observaciones,
            productos: productosPedido.map(p => ({
                producto_id: p.producto_id,
                cantidad: p.cantidad
            }))
        };

        const loader = showLoadingAlert(modoEditar ? 'Actualizando pedido...' : 'Registrando pedido...');

        try {
            if (modoEditar) {
                await actualizarPedido(pedidoSeleccionado.id, payload);
                showSuccessAlert('¡Actualizado!', 'El pedido se modificó correctamente.');
            } else {
                await crearPedido(payload);
                showSuccessAlert('¡Éxito!', 'El pedido ha sido creado con éxito.');
            }

            // --- SI LA API RESPONDE BIEN, LIMPIAMOS Y CERRAMOS ---
            loader.close();
            setModalCrear(false);
            setModoEditar(false);
            setNuevoPedido({ clienteId: '', fecha: '', estado: '', observaciones: '' });
            setProductosPedido([]);
            setProductoSeleccionado('');
            setCantidadSeleccionada(1);

            await fetchPedidos(); // Refrescar tabla

        } catch (err) {
            // SI HAY ERROR: El modal no se cierra, el usuario no pierde lo que escribió
            if (loader) loader.close();
            console.error('Error al procesar pedido:', err);
            showErrorAlert('Error al guardar', err.message || 'Error en el servidor al procesar el pedido.');
        }
    };

    // --- ELIMINACIÓN ---
    const handleEliminarPedido = async (id) => {
        const confirm = await showConfirmationAlert('¿Eliminar pedido?', 'Esta acción es permanente y no se puede deshacer.');
        if (!confirm.isConfirmed) return;

        const loader = showLoadingAlert('Eliminando...');
        try {
            await eliminarPedido(id);
            loader.close();
            showSuccessAlert('Eliminado', 'El pedido ha sido borrado.');
            fetchPedidos();
        } catch (err) {
            loader.close();
            showErrorAlert('Error', 'No se pudo eliminar el pedido. Verifique su conexión.');
        }
    };

    // --- UTILIDADES ---
    const showLoadingAlert = (message) => {
        return Swal.fire({
            title: message,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
    };

    const exportarExcel = () => {
        if (pedidosFiltrados.length === 0) return showErrorAlert('Sin datos', 'No hay nada que exportar.');

        const ws = XLSX.utils.json_to_sheet(
            pedidosFiltrados.map(p => ({
                'Cliente': p.cliente?.nombre || '—',
                'Fecha': new Date(p.fecha).toLocaleString(),
                'Estado': p.estado?.toUpperCase(),
                'Total Items': p.pedido_productos?.length || 0,
                'Observaciones': p.observaciones || 'Sin notas'
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
        XLSX.writeFile(wb, `Reporte_Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Pedidos</h1>

            {/* Barra de herramientas de Pedidos (Unificada y Coherente) */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">

                    {/* LADO IZQUIERDO: Búsqueda y Filtros de Estado/Fecha */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">

                        {/* BUSCADOR DE CLIENTE */}
                        <div className="relative w-full md:w-72">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] focus:border-transparent w-full transition-all bg-gray-50/50 text-sm"
                                value={filtroCliente}
                                onChange={(e) => setFiltroCliente(e.target.value)}
                            />
                        </div>

                        {/* SELECTORES DE ESTADO Y ORDEN (Estilo Coherente) */}
                        <div className="flex gap-2 flex-1 md:flex-none">
                            <select
                                className="flex-1 md:w-44 pl-3 pr-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] bg-white text-sm cursor-pointer hover:border-[#7FA82C] transition-colors"
                                value={nuevoPedido.estado}
                                onChange={(e) => setNuevoPedido({ ...nuevoPedido, estado: e.target.value })}
                            >
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="procesando">Procesando</option>
                                <option value="completado">Completado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>

                            <select
                                className="flex-1 md:w-56 pl-3 pr-8 py-2.5 border border-gray-200 text-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FA82C] bg-white text-sm cursor-pointer hover:border-[#7FA82C] transition-colors"
                                value={ordenFecha}
                                onChange={(e) => setOrdenFecha(e.target.value)}
                            >
                                <option value="reciente">Fecha (Reciente primero)</option>
                                <option value="antiguo">Fecha (Antiguo primero)</option>
                            </select>
                        </div>
                    </div>

                    {/* LADO DERECHO: Botones de Acción (Estilo Cápsula Unificada) */}
                    <div className="flex items-center border-2 border-[#9DC435] rounded-xl overflow-hidden shadow-lg bg-white h-fit">
                        <button
                            onClick={() => {
                                setModoEditar(false);
                                setNuevoPedido({
                                    clienteId: '',
                                    fecha: '',
                                    estado: 'pendiente',
                                    observaciones: ''
                                });
                                setProductosPedido([]);
                                setProductoSeleccionado('');
                                setCantidadSeleccionada(1);
                                setModalCrear(true);
                            }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#9DC435] hover:bg-[#8B9F2D] text-white px-6 py-2.5 text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
                        >
                            <FiPlus className="text-lg" />
                            Crear Pedido
                        </button>

                        <button
                            onClick={exportarExcel}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#9DC435] border-l-2 border-[#9DC435] hover:bg-gray-50 px-6 py-2.5 text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
                        >
                            <FiDownload className="text-lg" />
                            Excel
                        </button>
                    </div>
                </div>

                {/* PIE DE HERRAMIENTA: Contador con línea de congruencia */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Resultados:</span>
                        <span className="text-[#7FA82C] font-black text-2xl mx-1">{pedidosFiltrados.length}</span>
                        <span className="text-gray-500 text-sm font-medium">pedidos encontrados</span>
                    </div>

                    {(filtroCliente || nuevoPedido.estado) && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-pulse">
                            Filtros Activos
                        </span>
                    )}
                </div>
            </div>

            {/* Tabla de Pedidos Mejorada (Congruencia Total) */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-b-4 border-[#7FA82C]"></div>
                </div>
            ) : (
                <div className="rounded-xl shadow-xl overflow-hidden border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">CLIENTE</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">FECHA</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">PRODUCTOS</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">ESTADO</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                                {pedidosFiltrados.length > 0 ? pedidosFiltrados.map(pedido => (
                                    <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                        {/* CLIENTE */}
                                        <td className="px-6 py-4 align-middle">
                                            <div className="text-sm font-bold text-gray-900 break-words max-w-[200px]">
                                                {pedido.cliente?.nombre || '—'}
                                            </div>
                                        </td>

                                        {/* FECHA */}
                                        <td className="px-6 py-4 align-middle text-sm text-gray-600">
                                            {new Date(pedido.fecha).toLocaleString()}
                                        </td>

                                        {/* CANTIDAD DE PRODUCTOS */}
                                        <td className="px-6 py-4 align-middle text-center">
                                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">
                                                {pedido.pedido_productos?.length || 0} items
                                            </span>
                                        </td>

                                        {/* ESTADO CON DISEÑO MEJORADO */}
                                        <td className="px-6 py-4 align-middle text-center">
                                            <span
                                                className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                                    ${pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                                        : pedido.estado === 'procesando' ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                            : pedido.estado === 'completado' ? 'bg-green-100 text-green-700 border-green-300'
                                                                : pedido.estado === 'cancelado' ? 'bg-red-100 text-red-700 border-red-300'
                                                                    : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                                            >
                                                {pedido.estado || '—'}
                                            </span>
                                        </td>

                                        {/* ACCIONES (Grandes y Robustas) */}
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => abrirDetalle(pedido)}
                                                    className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-90 border border-purple-200"
                                                    title="Ver detalle"
                                                >
                                                    <FiEye size={20} />
                                                </button>
                                                <button
                                                    onClick={() => abrirEditar(pedido)}
                                                    className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-90 border border-blue-200"
                                                    title="Editar pedido"
                                                >
                                                    <FiEdit2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarPedido(pedido.id)}
                                                    className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all active:scale-90 border border-red-200"
                                                    title="Eliminar pedido"
                                                >
                                                    <FiTrash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                            No se encontraron pedidos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modalDetalle && pedidoSeleccionado && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-gray-700"
                    >
                        {/* Header Centrado */}
                        <div className="border-b border-gray-700 px-8 py-6 text-center relative bg-gray-800/50">
                            <h3 className="text-xl font-semibold text-white uppercase tracking-[0.2em]">
                                Detalle del Pedido
                            </h3>
                            <button
                                onClick={() => setModalDetalle(false)}
                                className="absolute right-6 top-7 text-gray-400 hover:text-white transition-colors"
                            >
                                <RiCloseFill size={28} />
                            </button>
                        </div>

                        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
                            {/* Sección: Cliente */}
                            <div className="space-y-4">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.3em] text-center border-b border-gray-700 pb-3">Información del Cliente</h4>
                                <div className="flex items-center gap-4 bg-gray-700/50 p-5 rounded-xl border border-gray-600">
                                    <div className="bg-[#7FA82C]/20 p-3 rounded-full text-[#7FA82C]">
                                        <FiUser size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Nombre del Cliente</p>
                                        <p className="text-lg font-semibold">{pedidoSeleccionado.cliente?.nombre || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección: Datos del Pedido */}
                            <div className="space-y-4">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.3em] text-center border-b border-gray-700 pb-3">Logística y Estado</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600 text-center">
                                        <FiCalendar className="mx-auto mb-2 text-gray-400" />
                                        <p className="text-[10px] text-gray-400 uppercase">Fecha</p>
                                        <p className="text-sm font-semibold">{new Date(pedidoSeleccionado.fecha).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600 text-center">
                                        <FiClock className="mx-auto mb-2 text-gray-400" />
                                        <p className="text-[10px] text-gray-400 uppercase">Hora</p>
                                        <p className="text-sm font-semibold">{new Date(pedidoSeleccionado.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600 text-center">
                                        <FiList className="mx-auto mb-2 text-gray-400" />
                                        <p className="text-[10px] text-gray-400 uppercase">Estado</p>
                                        <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${pedidoSeleccionado.estado === 'completado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {pedidoSeleccionado.estado}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sección: Observaciones */}
                            <div className="space-y-4">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.2em] text-center border-b border-gray-700 pb-3">Notas Adicionales</h4>
                                <div className="bg-gray-700/20 border border-gray-700 p-5 rounded-xl text-sm text-gray-300 italic leading-relaxed">
                                    {pedidoSeleccionado.observaciones || "Sin observaciones registradas."}
                                </div>
                            </div>

                            {/* Sección: Productos */}
                            <div className="space-y-4">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.3em] text-center border-b border-gray-700 pb-3">Artículos del Pedido</h4>
                                <div className="space-y-2">
                                    {pedidoSeleccionado.pedido_productos?.map((pp, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-700 px-5 py-4 rounded-xl border border-gray-600">
                                            <span className="font-medium text-sm">{pp.producto?.nombre || 'Producto eliminado'}</span>
                                            <span className="bg-[#7FA82C] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">× {pp.cantidad}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {modalCrear && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-gray-700"
                    >
                        {/* Header Centrado */}
                        <div className="border-b border-gray-700 px-8 py-5 text-center relative bg-gray-800/50">
                            <h3 className="text-xl font-semibold text-white uppercase tracking-widest">
                                {modoEditar ? 'Gestionar Pedido' : 'Nuevo Pedido'}
                            </h3>
                            <button onClick={() => setModalCrear(false)} className="absolute right-6 top-5 text-gray-400 hover:text-white transition-colors">
                                <RiCloseFill size={26} />
                            </button>
                        </div>

                        <form className="p-8 space-y-10 overflow-y-auto custom-scrollbar">

                            {/* 1. Datos Generales */}
                            <div className="space-y-6">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.3em] text-center border-b border-gray-700 pb-3">Configuración del Pedido</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Cliente</label>
                                        <Select
                                            options={clientes.map(c => ({ value: c.id, label: c.nombre }))}
                                            value={clientes.find(c => c.id === nuevoPedido.clienteId) ? { value: nuevoPedido.clienteId, label: clientes.find(c => c.id === nuevoPedido.clienteId)?.nombre } : null}
                                            onChange={(selected) => setNuevoPedido(prev => ({ ...prev, clienteId: selected?.value || '' }))}
                                            placeholder="Seleccionar cliente responsable..."
                                            styles={customSelectStyles}
                                            isClearable
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Fecha de Entrega</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:border-[#7FA82C] focus:ring-0 outline-none text-sm transition-all"
                                                value={nuevoPedido.fecha?.split('T')[0] || ''}
                                                onChange={(e) => {
                                                    const h = nuevoPedido.fecha?.split('T')[1]?.slice(0, 5) || '00:00';
                                                    setNuevoPedido(prev => ({ ...prev, fecha: `${e.target.value}T${h}` }));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Hora Programada</label>
                                            <input
                                                type="time"
                                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:border-[#7FA82C] focus:ring-0 outline-none text-sm transition-all"
                                                value={nuevoPedido.fecha?.split('T')[1]?.slice(0, 5) || ''}
                                                onChange={(e) => {
                                                    const f = nuevoPedido.fecha?.split('T')[0] || new Date().toISOString().split('T')[0];
                                                    setNuevoPedido(prev => ({ ...prev, fecha: `${f}T${e.target.value}` }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Estado Operativo</label>
                                        <select
                                            value={nuevoPedido.estado}
                                            onChange={(e) => setNuevoPedido(prev => ({ ...prev, estado: e.target.value }))}
                                            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:border-[#7FA82C] focus:ring-0 outline-none appearance-none cursor-pointer text-sm"
                                        >
                                            <option value="">Selecciona el estado...</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="procesando">Procesando</option>
                                            <option value="completado">Completado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Observaciones */}
                            <div className="space-y-6">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.3em] text-center border-b border-gray-700 pb-3">Observaciones</h4>
                                <textarea
                                    rows="3"
                                    value={nuevoPedido.observaciones}
                                    onChange={(e) => setNuevoPedido(prev => ({ ...prev, observaciones: e.target.value }))}
                                    placeholder="Detalles sobre la entrega, pagos o empaque..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:border-[#7FA82C] focus:ring-0 outline-none resize-none text-sm transition-all"
                                />
                            </div>

                            {/* 3. Selección de Productos */}
                            <div className="space-y-6">
                                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.3em] text-center border-b border-gray-700 pb-3">Artículos</h4>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Select
                                            options={productos.map(p => ({ value: p.id, label: p.nombre }))}
                                            value={productoSeleccionado ? { value: productoSeleccionado, label: productos.find(p => p.id === productoSeleccionado)?.nombre } : null}
                                            onChange={(selected) => setProductoSeleccionado(selected?.value || '')}
                                            placeholder="Elegir producto..."
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={cantidadSeleccionada}
                                        onChange={(e) => setCantidadSeleccionada(parseInt(e.target.value) || 1)}
                                        className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:border-[#7FA82C] focus:ring-0 outline-none text-center font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!productoSeleccionado || cantidadSeleccionada < 1) return;
                                            const prod = productos.find(p => p.id === productoSeleccionado);
                                            setProductosPedido(prev => {
                                                const existe = prev.find(p => p.producto_id === prod.id);
                                                if (existe) return prev.map(p => p.producto_id === prod.id ? { ...p, cantidad: p.cantidad + cantidadSeleccionada } : p);
                                                return [...prev, { producto_id: prod.id, nombre: prod.nombre, cantidad: cantidadSeleccionada }];
                                            });
                                            setProductoSeleccionado('');
                                            setCantidadSeleccionada(1);
                                        }}
                                        className="bg-[#7FA82C] px-5 rounded-xl font-bold hover:bg-lime-700 transition-all shadow-lg shadow-lime-900/20"
                                    >
                                        <RiAddFill size={24} />
                                    </button>
                                </div>

                                {/* Lista de productos agregados (Unificada) */}
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                    {productosPedido.length > 0 ? (
                                        productosPedido.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center bg-gray-700/50 border border-gray-600 px-5 py-3 rounded-xl animate-in slide-in-from-right-2">
                                                <div>
                                                    <p className="font-medium text-sm">{p.nombre}</p>
                                                    <p className="text-[10px] text-[#7FA82C] font-bold uppercase">Unidades: {p.cantidad}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setProductosPedido(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <RiDeleteBin6Line size={20} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-xs text-gray-500 py-4 italic">No hay productos agregados todavía.</p>
                                    )}
                                </div>
                            </div>

                            {/* Footer de Botones */}
                            <div className="flex gap-4 pt-6 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setModalCrear(false)}
                                    className="flex-1 py-3.5 border border-gray-600 rounded-xl text-xs font-semibold text-gray-300 hover:bg-gray-700 transition-all uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGuardarPedido}
                                    className="flex-[2] py-3.5 bg-[#7FA82C] text-white rounded-xl text-xs font-bold shadow-xl hover:bg-lime-700 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    Finalizar Registro
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}


        </div>
    );
};

export default Pedidos;
