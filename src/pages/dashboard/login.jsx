import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/apiService';
import { FiUser, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ usuario: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await loginAdmin(credentials);
            if (response.error) throw new Error(response.error);
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Credenciales incorrectas');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decoración de fondo (Círculos difuminados) */}
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#7FA82C]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#7FA82C]/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md z-10">
                {/* Logo o Título */}
                <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-4">
                        <FiLock className="text-4xl text-[#7FA82C]" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-800 tracking-tighter">
                        PANEL DE<span className="text-[#7FA82C]"> ADMINISTRADOR</span>
                    </h2>
                    <p className="text-gray-500 font-medium mt-2">Ingresa tus credenciales para acceder</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-white"
                >
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Alerta de Error con Animación */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                                >
                                    <FiAlertCircle className="shrink-0" size={18} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                       {/* Campo Usuario */}
<div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
        Usuario
    </label>
    <div className="relative group">
        <FiUser 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" 
            size={20} 
        />
        <input
            name="usuario"
            type="text"
            required
            value={credentials.usuario}
            onChange={handleInputChange}
            placeholder="Ingresa tu usuario"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all  text-gray-700 shadow-inner"
        />
    </div>
</div>

{/* Campo Password - Usando Ojo Nativo del Sistema */}
<div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
        Contraseña
    </label>
    <div className="relative group">
        {/* Mantenemos el icono de la izquierda para la coherencia visual */}
        <FiLock 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" 
            size={20} 
        />
        <input
            name="password"
            type="password" 
            required
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Ingresa tu contraseña"
            /* Quitamos el pr-14 y el showPassword, dejamos que el sistema haga lo suyo */
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all text-gray-700 shadow-inner"
        />
    </div>
</div>
                        {/* Botón de Acción */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full relative bg-[#7FA82C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-lime-200 hover:bg-[#6e9126] hover:shadow-2xl transition-all active:scale-[0.98] overflow-hidden"
                            >
                                <span className={isLoading ? 'opacity-0' : 'opacity-100 flex items-center justify-center gap-2'}>
                                    Acceder al Panel
                                </span>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

               
            </div>
        </div>
    );
};

export default LoginPage;