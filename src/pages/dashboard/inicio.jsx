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
                setProductos([]);
                setCategorias([]);
                setPedidos([]);
                setClientes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalProductos = productos.length;
    const totalCategorias = categorias.length;
    const valorTotalInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    const promedioPrecios = totalProductos > 0 ? productos.reduce((sum, p) => sum + p.precio, 0) / totalProductos : 0;
    const totalPedidos = pedidos.length;
    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
    const pedidosCompletados = pedidos.filter(p => p.estado === 'completado').length;

    const productosPorCategoria = categorias.map(categoria => ({
        nombre: categoria.nombre,
        cantidad: productos.filter(p => p.categoria_id === categoria.id).length
    }));

    const productosMasCaros = [...productos]
        .sort((a, b) => b.precio - a.precio)
        .slice(0, 5);

    const productosMenosStock = [...productos]
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

    const dataProductosPorCategoria = {
        labels: productosPorCategoria.map(item => item.nombre),
        datasets: [
            {
                label: 'Productos por Categoría',
                data: productosPorCategoria.map(item => item.cantidad),
                backgroundColor: [
                    '#9DC435',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderWidth: 1
            }
        ]
    };

    const dataPreciosProductos = {
        labels: productosMasCaros.map(p => p.nombre),
        datasets: [
            {
                label: 'Productos más caros',
                data: productosMasCaros.map(p => p.precio),
                backgroundColor: '#9DC435',
                borderColor: '#8B9F2D',
                borderWidth: 2
            }
        ]
    };

    const dataStockProductos = {
        labels: productosMenosStock.map(p => p.nombre),
        datasets: [
            {
                label: 'Stock disponible',
                data: productosMenosStock.map(p => p.stock),
                backgroundColor: '#FF6384',
                borderColor: '#C70039',
                borderWidth: 2,
                fill: true
            }
        ]
    };

    const disponibilidadStock = productos.reduce(
        (acc, prod) => {
            if (prod.stock && prod.stock > 0) {
                acc.disponibles += 1;
            } else {
                acc.noDisponibles += 1;
            }
            return acc;
        },
        { disponibles: 0, noDisponibles: 0 }
    );

    const dataDisponibilidadStock = {
        labels: ['Disponibles', 'No disponibles'],
        datasets: [
            {
                label: 'Productos por disponibilidad',
                data: [disponibilidadStock.disponibles, disponibilidadStock.noDisponibles],
                backgroundColor: ['#4BC0C0', '#FF6384'],
                borderColor: ['#159C9C', '#C70039'],
                borderWidth: 1
            }
        ]
    };

    const productosPorMes = productos.reduce((acc, producto) => {
        const fecha = new Date(producto.creado_en);
        const claveMes = fecha.toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[claveMes] = (acc[claveMes] || 0) + 1;
        return acc;
    }, {});

    const dataProductosPorMes = {
        labels: Object.keys(productosPorMes),
        datasets: [
            {
                label: 'Productos creados por mes',
                data: Object.values(productosPorMes),
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }
        ]
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Bienvenido al Panel de Control</h1>
                <p className="text-gray-600">Resumen general de tu inventario y estadísticas clave</p>
            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    
    {/* CARD: PRODUCTOS (Verde Esmeralda) */}
    <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 p-7 rounded-[2.5rem] shadow-xl shadow-emerald-200/50 hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-2 -top-2 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-inner">
                <FiBox size={30} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-emerald-100 tracking-[0.2em] mb-1">Inventario</span>
                <h3 className="text-white text-sm font-bold leading-none mb-2">Total Productos</h3>
                <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{totalProductos}</p>
            </div>
        </div>
    </div>

    {/* CARD: CATEGORÍAS (Azul Eléctrico) */}
    <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-7 rounded-[2.5rem] shadow-xl shadow-blue-200/50 hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-2 -top-2 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-inner">
                <FiLayers size={30} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-blue-100 tracking-[0.2em] mb-1">Organización</span>
                <h3 className="text-white text-sm font-bold leading-none mb-2">Categorías</h3>
                <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{totalCategorias}</p>
            </div>
        </div>
    </div>

    {/* CARD: CLIENTES (Naranja Atardecer) */}
    <div className="group bg-gradient-to-br from-amber-500 to-orange-600 p-7 rounded-[2.5rem] shadow-xl shadow-orange-200/50 hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-2 -top-2 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-inner">
                <FiPieChart size={30} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-orange-100 tracking-[0.2em] mb-1">Comunidad</span>
                <h3 className="text-white text-sm font-bold leading-none mb-2">Total Clientes</h3>
                <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{clientes.length}</p>
            </div>
        </div>
    </div>

    {/* CARD: PEDIDOS (Púrpura Real) */}
    <div className="group bg-gradient-to-br from-violet-600 to-purple-700 p-7 rounded-[2.5rem] shadow-xl shadow-purple-200/50 hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <div className="absolute -right-2 -top-2 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-inner">
                <FiShoppingCart size={30} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-purple-100 tracking-[0.2em] mb-1">Ventas</span>
                <h3 className="text-white text-sm font-bold leading-none mb-2">Total Pedidos</h3>
                <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{totalPedidos}</p>
            </div>
        </div>
    </div>

</div>

          <div className="space-y-10">
  
  {/* --- GRÁFICA 1: FLUJO DE INVENTARIO (ESCALONADO) --- */}
  <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 p-8 border border-gray-50 group transition-all duration-500 hover:shadow-cyan-100/30">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <FaChartLine className="text-cyan-600 group-hover:scale-110 transition-transform" size={28} />
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter">FLUJO DE INVENTARIO</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Registro de Altas (Modo Escalón)</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Datos en Tiempo Real</span>
      </div>
    </div>

    <div className="h-80 w-full px-2">
      <Line
        data={{
          ...dataProductosPorMes,
          datasets: dataProductosPorMes.datasets.map(dataset => ({
            ...dataset,
            label: 'Productos',
            borderColor: '#0891b2',
            backgroundColor: 'rgba(8, 145, 178, 0.15)',
            fill: true,
            stepped: true, // Efecto de escalones funcional
            borderWidth: 4,
            pointRadius: 4,
            pointBackgroundColor: '#0891b2',
            pointBorderColor: '#fff',
            pointHoverRadius: 9,
          }))
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1f2937',
              padding: 15,
              cornerRadius: 15,
              titleFont: { size: 14, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6', drawBorder: false },
              ticks: { stepSize: 1, font: { weight: '700' }, color: '#9ca3af' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { weight: '700' }, color: '#9ca3af' }
            }
          }
        }}
      />
    </div>
  </div>

  {/* --- FILA DE GRÁFICAS DE COMPARACIÓN --- */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    {/* Gráfico 2: CATEGORÍAS (PIE) */}
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 p-8 border border-gray-50 group transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaChartPie className="text-emerald-500 group-hover:rotate-12 transition-transform" size={26} />
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tighter leading-none">CATEGORÍAS</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Distribución Global</p>
          </div>
        </div>
      </div>
      <div className="relative h-64 w-full">
        <Pie
          data={dataProductosPorCategoria}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { 
                  usePointStyle: true, 
                  padding: 20, 
                  font: { size: 11, weight: '700' }, 
                  color: '#9ca3af' 
                }
              }
            }
          }}
        />
      </div>
    </div>

    {/* Gráfico 3: DISPONIBILIDAD (BARRA HORIZONTAL - MÁS FUNCIONAL) */}
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 p-8 border border-gray-50 group transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaChartBar className="text-rose-500 group-hover:scale-110 transition-transform" size={26} />
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tighter leading-none">DISPONIBILIDAD</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Comparativa de Stock</p>
          </div>
        </div>
      </div>
      <div className="h-64 w-full">
        <Bar
          data={dataDisponibilidadStock} // Usando tus mismos datos pero en formato Bar
          options={{
            indexAxis: 'y', // Barra horizontal para mejor lectura
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { backgroundColor: '#1f2937', cornerRadius: 12 }
            },
            scales: {
              x: { 
                grid: { display: false },
                ticks: { font: { weight: '700' }, color: '#9ca3af' }
              },
              y: { 
                grid: { display: false },
                ticks: { font: { weight: '700' }, color: '#4b5563' }
              }
            }
          }}
        />
      </div>
    </div>

  </div>
</div>
            {/* --- TABLA DE ÚLTIMOS PRODUCTOS (ESTILO PREMIUM) --- */}
<div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 mb-10 overflow-hidden border border-gray-50 transition-all hover:shadow-gray-200">
    
    {/* Encabezado de la Tabla */}
    <div className="px-10 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="p-4 bg-gray-900 rounded-2xl text-white shadow-lg shadow-gray-200">
                <FiPackage size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tighter">
                    RECIÉN LLEGADOS
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    Últimos 5 ingresos al sistema
                </p>
            </div>
        </div>
        
    </div>

    {/* Contenedor de la Tabla */}
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Imagen</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {productos.slice(-5).reverse().map((producto) => (
                    <tr key={producto.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                        {/* Nombre */}
                        <td className="px-10 py-6">
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-base group-hover:text-[#7FA82C] transition-colors uppercase tracking-tight">
                                    {producto.nombre}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium italic">ID: #{producto.id.toString().slice(-5)}</span>
                            </div>
                        </td>

                        {/* Categoría */}
                        <td className="px-8 py-6">
                            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider">
                                {categorias.find(c => c.id === producto.categoria_id)?.nombre || 'General'}
                            </span>
                        </td>

                        {/* Stock Badge */}
                        <td className="px-8 py-6 text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                                producto.stock === 1
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${producto.stock === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {producto.stock === 1 ? 'Disponible' : 'Agotado'}
                                </span>
                            </div>
                        </td>

                        {/* Imagen con Efecto */}
                        <td className="px-10 py-6 text-right">
                            {producto.imagen_url ? (
                                <div className="relative inline-block group/img">
                                    <div className="absolute inset-0 bg-[#7FA82C] rounded-2xl blur-md opacity-0 group-hover/img:opacity-20 transition-opacity"></div>
                                    <img
                                        src={producto.imagen_url}
                                        alt={producto.nombre}
                                        className="relative w-14 h-14 object-cover rounded-2xl border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl border border-dashed border-gray-300">
                                    <FiPackage size={18} className="text-gray-300" />
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* Footer decorativo de la tabla */}
    <div className="px-10 py-6 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Mostrando los registros más recientes
        </p>
        <div className="flex gap-1">
            {[1, 2, 3].map(i => <div key={i} className={`h-1 rounded-full ${i === 1 ? 'w-4 bg-[#7FA82C]' : 'w-1 bg-gray-200'}`}></div>)}
        </div>
    </div>
</div>



        </div>
    );
};

export default Dashboard;
