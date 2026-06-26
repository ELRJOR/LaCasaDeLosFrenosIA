import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Componentes
import CarruselHero from '../../components/paginaInicio/carruselHero';
import ProductosDestacados from '../../components/paginaInicio/productosDestacados';
import Contactar from '../../components/paginaInicio/bannerDos';
import Servicios from '../../components/paginaInicio/servicios';
import EmpresasAliadas from '../../components/paginaInicio/empresasAliadas';
import TestimoniosClientes from '../../components/paginaInicio/testimonios';
import UbicacionEmpresa from '../../components/paginaInicio/ubicacionEmpresa';
import PreguntasFrecuentes from '../../components/paginaInicio/preguntas';

import AbogadosSeccion from '../../components/paginaInicio/seccionAbogados';


const PaginaInicio = () => {
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const location = useLocation();

  // Inicializar AOS (animaciones)
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  // Detectar scrollTo de la URL y hacer scroll
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');

    if (scrollTo) {
      scroller.scrollTo(scrollTo, {
        duration: 600,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -80, // si tienes un navbar fijo, ajusta este valor
      });
    }
  }, [location]);

  return (
    <div className="font-sans bg-gray-50">
      <CarruselHero />
      <ProductosDestacados />
      <Contactar />
      <Servicios />
      <UbicacionEmpresa /> 
      <EmpresasAliadas />
      <AbogadosSeccion />
      
      <TestimoniosClientes />
      <PreguntasFrecuentes />

    </div>
  );
};

export default PaginaInicio;
