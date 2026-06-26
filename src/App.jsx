import { BrowserRouter as Router, Routes, Route, useLocation, } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/paginaInicio/navBar';
import Inicio from './pages/landing/home';



import Footer from './pages/footer/footer';
import Dashboard from './pages/dashboard/dashboard';
import LoginPage from './pages/dashboard/login';
import ProtectedRoute from './components/dashboard/protectedRoute';
import Catalogo from './pages/catalog/catalogo';
import DetalleProducto from './pages/description/DetalleProducto';
import UbicacionEmpresa from './components/paginaInicio/ubicacionEmpresa';
import QuienesSomos from './components/paginaInicio/quienesSomos';
import Contactar from './components/paginaInicio/contacto';
import Configuraciones from './pages/dashboard/configuraciones';


import ScrollToTop from './components/global/scrollTop';

const AppContent = () => {
  const location = useLocation();

  // Scroll suave a elemento cuando hay hash en la URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/configuraciones');


  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col justify-between">
      {/* Mostrar Navbar solo si NO es dashboard */}
      {!isDashboard && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />

          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<QuienesSomos />} />
          <Route path="/encuentranos" element={<UbicacionEmpresa />} />
          <Route path="/contacto" element={<Contactar />} />
          <Route path="/loginAdmin" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Nueva ruta protegida para configuraciones */}
          <Route
            path="/configuraciones"
            element={
              <ProtectedRoute>
                <Configuraciones />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Mostrar Footer solo si NO es dashboard */}
      {!isDashboard && <Footer />}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <Router>
      <ScrollToTop /> {/* 👈 Aquí se coloca */}
      <AppContent />
    </Router>
  );
};

export default App;
