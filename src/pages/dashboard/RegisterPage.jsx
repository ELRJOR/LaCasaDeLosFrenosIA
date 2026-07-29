import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarMecanico } from '../../services/apiService';
import { FiUser, FiLock, FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Turnstile } from "@marsidev/react-turnstile";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        correo: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [captchaToken, setCaptchaToken] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!captchaToken) {
            setError("Completa la verificación de seguridad.");
            return;
        }

        setIsLoading(true);
        try {
            await registrarMecanico({
                ...formData,
                captchaToken
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/loginAdmin');
            }, 1800);
        } catch (err) {
            setError(err.message || 'Error al registrar cuenta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#7FA82C]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#7FA82C]/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md z-10">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-4">
                        <FiUser className="text-4xl text-[#7FA82C]" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-800 tracking-tighter">
                        CREAR<span className="text-[#7FA82C]"> CUENTA</span>
                    </h2>
                    <p className="text-gray-500 font-medium mt-2">Regístrate como mecánico</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-white"
                >
                    <form className="space-y-5" onSubmit={handleSubmit}>

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
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-green-50 border border-green-100 p-3 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold"
                                >
                                    <FiCheckCircle className="shrink-0" size={18} />
                                    Cuenta creada. Redirigiendo al login...
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Nombre completo
                            </label>
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" size={20} />
                                <input
                                    name="nombre"
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Juan Pérez"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all text-gray-700 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Usuario
                            </label>
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" size={20} />
                                <input
                                    name="usuario"
                                    type="text"
                                    required
                                    value={formData.usuario}
                                    onChange={handleInputChange}
                                    placeholder="juan123"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all text-gray-700 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Correo
                            </label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" size={20} />
                                <input
                                    name="correo"
                                    type="email"
                                    required
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    placeholder="juan@gmail.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all text-gray-700 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" size={20} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all text-gray-700 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Confirmar contraseña
                            </label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7FA82C] transition-colors z-10" size={20} />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#7FA82C]/10 focus:border-[#7FA82C] outline-none transition-all text-gray-700 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center pt-2 gap-4">
                            <Turnstile
                                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                onSuccess={(token) => setCaptchaToken(token)}
                                onExpire={() => setCaptchaToken("")}
                                onError={() => setCaptchaToken("")}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="group w-full relative bg-[#7FA82C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-lime-200 hover:bg-[#6e9126] hover:shadow-2xl transition-all active:scale-[0.98] overflow-hidden disabled:opacity-70"
                            >
                                <span className={isLoading ? 'opacity-0' : 'opacity-100 flex items-center justify-center gap-2'}>
                                    Crear cuenta
                                </span>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-500 pt-2">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/loginAdmin" className="text-[#7FA82C] font-bold hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;