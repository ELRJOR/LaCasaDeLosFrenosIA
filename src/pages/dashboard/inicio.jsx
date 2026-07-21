import React, { useState, useEffect } from 'react';
import { FiBox, FiLayers, FiDollarSign, FiPieChart, FiShoppingCart, FiStar, FiPackage } from 'react-icons/fi';
import { FaBoxes, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import { obtenerCategorias, fetchProductos, obtenerPedidos, obtenerClientes } from '../../services/apiService';

Chart.register(...registerables);

const Dashboard = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productosData, categoriasData, pedidosData, clientesData] = await Promise.all([
                    fetchProductos(),
                    obtenerCategorias(),
                    obtenerPedidos(),
                    obtenerClientes()
                ]);
                setProductos(Array.isArray(productosData) ? productosData : []);
                setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
                setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
                setClientes(Array.isArray(clientesData) ? clientesData : []);
            } catch (error) {
                console.error("Error al obtener datos:", error);
                setProductos([]); setCategorias([]); setPedidos([]); setClientes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalProductos = productos.length;
    const totalCategorias = categorias.length;
    const totalPedidos = pedidos.length;

    const productosPorCategoria = categorias.map(categoria => ({
        nombre: categoria.nombre,
        cantidad: productos.filter(p => p.categoria_id === categoria.id).length
    }));

    const productosMasCaros = [...productos].sort((a, b) => b.precio - a.precio).slice(0, 5);
    const productosMenosStock = [...productos].sort((a, b) => a.stock - b.stock).slice(0, 5);

    const dataProductosPorCategoria = {
        labels: productosPorCategoria.map(item => item.nombre),
        datasets: [{
            label: 'Productos por Categoría',
            data: productosPorCategoria.map(item => item.cantidad),
            backgroundColor: ['#9DC435','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'],
            borderWidth: 1
        }]
    };

    const disponibilidadStock = productos.reduce(
        (acc, prod) => { prod.stock > 0 ? acc.disponibles++ : acc.noDisponibles++; return acc; },
        { disponibles: 0, noDisponibles: 0 }
    );

    const dataDisponibilidadStock = {
        labels: ['Disponibles', 'No disponibles'],
        datasets: [{
            label: 'Productos por disponibilidad',
            data: [disponibilidadStock.disponibles, disponibilidadStock.noDisponibles],
            backgroundColor: ['#4BC0C0', '#FF6384'],
            borderColor: ['#159C9C', '#C70039'],
            borderWidth: 1
        }]
    };

    const productosPorMes = productos.reduce((acc, producto) => {
        const fecha = new Date(producto.creado_en);
        const claveMes = fecha.toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[claveMes] = (acc[claveMes] || 0) + 1;
        return acc;
    }, {});

    const dataProductosPorMes = {
        labels: Object.keys(productosPorMes),
        datasets: [{
            label: 'Productos creados por mes',
            data: Object.values(productosPorMes),
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderWidth: 2, fill: true, tension: 0.3
        }]
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="p-3 md:p-6 bg-gray-50 min-h-screen">

            {/* TÍTULO */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-1">Panel de Control</h1>
                <p className="text-sm text-gray-500">Resumen general de tu inventario y estadísticas clave</p>
            </div>

            {/* TARJETAS - 2 columnas en móvil, 4 en desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">

                <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full"></div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/20 text-white w-fit">
                            <FiBox size={20} />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-emerald-100 tracking-widest">Inventario</span>
                        <p className="text-3xl md:text-4xl font-black text-white">{totalProductos}</p>
                        <span className="text-xs text-emerald-100 font-semibold">Productos</span>
                    </div>
                </div>

                <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full"></div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/20 text-white w-fit">
                            <FiLayers size={20} />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-blue-100 tracking-widest">Organización</span>
                        <p className="text-3xl md:text-4xl font-black text-white">{totalCategorias}</p>
                        <span className="text-xs text-blue-100 font-semibold">Categorías</span>
                    </div>
                </div>

                <div className="group bg-gradient-to-br from-amber-500 to-orange-600 p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full"></div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/20 text-white w-fit">
                            <FiPieChart size={20} />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-orange-100 tracking-widest">Comunidad</span>
                        <p className="text-3xl md:text-4xl font-black text-white">{clientes.length}</p>
                        <span className="text-xs text-orange-100 font-semibold">Clientes</span>
                    </div>
                </div>

                <div className="group bg-gradient-to-br from-violet-600 to-purple-700 p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full"></div>
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/20 text-white w-fit">
                            <FiShoppingCart size={20} />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-purple-100 tracking-widest">Ventas</span>
                        <p className="text-3xl md:text-4xl font-black text-white">{totalPedidos}</p>
                        <span className="text-xs text-purple-100 font-semibold">Pedidos</span>
                    </div>
                </div>

            </div>

            {/* GRÁFICAS */}
            <div className="space-y-6 mb-8">

                {/* Gráfica línea - flujo inventario */}
                <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm p-4 md:p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 md:mb-8">
                        <FaChartLine className="text-cyan-600" size={22} />
                        <div>
                            <h2 className="text-base md:text-2xl font-black text-gray-800 tracking-tighter">FLUJO DE INVENTARIO</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registro de altas por mes</p>
                        </div>
                    </div>
                    <div className="h-48 md:h-80 w-full">
                        <Line
                            data={{ ...dataProductosPorMes, datasets: dataProductosPorMes.datasets.map(d => ({
                                ...d, label: 'Productos', borderColor: '#0891b2',
                                backgroundColor: 'rgba(8,145,178,0.15)', stepped: true,
                                borderWidth: 3, pointRadius: 3, pointBackgroundColor: '#0891b2',
                            }))}}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { font: { size: 10 }, color: '#9ca3af' } },
                                    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9ca3af' } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Gráficas pie y bar - 1 col móvil, 2 col desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm p-4 md:p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 md:mb-8">
                            <FaChartPie className="text-emerald-500" size={22} />
                            <div>
                                <h2 className="text-base md:text-xl font-black text-gray-800 tracking-tighter">CATEGORÍAS</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distribución global</p>
                            </div>
                        </div>
                        <div className="h-48 md:h-64 w-full">
                            <Pie data={dataProductosPorCategoria} options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 10 }, color: '#9ca3af' } } }
                            }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm p-4 md:p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 md:mb-8">
                            <FaChartBar className="text-rose-500" size={22} />
                            <div>
                                <h2 className="text-base md:text-xl font-black text-gray-800 tracking-tighter">DISPONIBILIDAD</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comparativa de stock</p>
                            </div>
                        </div>
                        <div className="h-48 md:h-64 w-full">
                            <Bar data={dataDisponibilidadStock} options={{
                                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9ca3af' } },
                                    y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#4b5563' } }
                                }
                            }} />
                        </div>
                    </div>

                </div>
            </div>

            {/* TABLA ÚLTIMOS PRODUCTOS */}
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm mb-6 overflow-hidden border border-gray-100">

                <div className="px-4 md:px-10 py-5 md:py-8 flex items-center gap-3 md:gap-4">
                    <div className="p-3 md:p-4 bg-gray-900 rounded-xl md:rounded-2xl text-white">
                        <FiPackage size={20} />
                    </div>
                    <div>
                        <h2 className="text-base md:text-2xl font-black text-gray-800 tracking-tighter">RECIÉN LLEGADOS</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Últimos 5 ingresos</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 md:px-10 py-3 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Categoría</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="px-4 md:px-10 py-3 md:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right hidden md:table-cell">Imagen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {productos.slice(-5).reverse().map((producto) => (
                                <tr key={producto.id} className="hover:bg-gray-50/50 transition-all">
                                    <td className="px-4 md:px-10 py-4 md:py-6">
                                        <span className="font-bold text-gray-800 text-sm md:text-base uppercase tracking-tight block">
                                            {producto.nombre}
                                        </span>
                                        <span className="text-[10px] text-gray-400 italic">#{producto.id.toString().slice(-5)}</span>
                                    </td>
                                    <td className="px-3 md:px-8 py-4 md:py-6 hidden sm:table-cell">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-xl text-[11px] font-bold uppercase">
                                            {categorias.find(c => c.id === producto.categoria_id)?.nombre || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-8 py-4 md:py-6 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 md:px-4 py-1 rounded-full border text-[10px] font-black uppercase ${
                                            producto.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${producto.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            {producto.stock > 0 ? 'OK' : 'Agotado'}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-6 text-right hidden md:table-cell">
                                        {producto.imagen_url ? (
                                            <img src={producto.imagen_url} alt={producto.nombre}
                                                className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-xl md:rounded-2xl border-2 border-white shadow-md ml-auto" />
                                        ) : (
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                                                <FiPackage size={16} className="text-gray-300" />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 md:px-10 py-4 md:py-6 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registros más recientes</p>
                    <div className="flex gap-1">
                        {[1,2,3].map(i => <div key={i} className={`h-1 rounded-full ${i===1?'w-4 bg-[#7FA82C]':'w-1 bg-gray-200'}`}></div>)}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
