import { useEffect, useState, useCallback } from "react"; // Añadimos useCallback
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const testimonials = [
  {
    quote: "Calidad impecable en todos los pedidos. Atención rápida y siempre dispuestos a ayudar.",
    author: "Lic. Carlos H., ASE",
  },
  {
    quote: "Nos apoyan en cada etapa del proceso, siempre con profesionalismo y rapidez.",
    author: "Ing. Laura V., Booster",
  },
  {
    quote: "Excelente trato, entrega puntual y calidad garantizada. Recomendados totalmente.",
    author: "Sr. Jorge M., Golden",
  },
  {
    quote: "El mejor aliado en logística y suministro. Una experiencia sin complicaciones.",
    author: "Dra. Erika T., River",
  },
];

const TestimoniosClientes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const totalSlides = Math.ceil(testimonials.length / slidesToShow);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función para avanzar (usamos useCallback para que el interval no se resetee innecesariamente)
  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goTo = (index) => setCurrentIndex(index);

  // --- LÓGICA DE AUTO-PLAY ---
  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      next();
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(autoPlayInterval); // Limpiar al desmontar o cambiar
  }, [next]);
  // ----------------------------

  const getVisibleTestimonials = () => {
    const start = currentIndex * slidesToShow;
    let visibles = testimonials.slice(start, start + slidesToShow);
    if (visibles.length < slidesToShow) {
      visibles = [...visibles, ...testimonials.slice(0, slidesToShow - visibles.length)];
    }
    return visibles;
  };

  return (
    <section className="py-24 bg-[#f6fff4] text-gray-800 overflow-hidden font-poppins">
      <div className="max-w-6xl mx-auto px-6">

        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#7FA82C] text-sm font-black uppercase tracking-[0.3em] mb-3 block"
          >
            Opiniones Reales
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900 mb-6"
          >
            TESTIMONIOS DE <span className="text-[#7FA82C]">CLIENTES</span>
          </motion.h2>
          <p className="text-sm md:text-lg lg:text-xl text-gray-500 mt-4 max-w-xs md:max-w-3xl mx-auto leading-relaxed">
            Confianza, compromiso y calidad reflejada en sus palabras.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {getVisibleTestimonials().map((t, i) => (
              <motion.div
                key={`${currentIndex}-${i}`} // Importante para la animación al cambiar
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-[#7FA82C]/10 rounded-[2.5rem] p-8 shadow-xl shadow-[#7FA82C]/5 text-center flex flex-col justify-between"
              >
                <div>
                  <FaQuoteLeft className="text-4xl text-[#7FA82C] mb-6 mx-auto opacity-30" />
                  <p className="text-gray-700 font-semibold italic text-base mb-6">"{t.quote}"</p>
                </div>
                <p className="text-sm font-extrabold text-[#7FA82C] uppercase tracking-widest">{t.author}</p>
              </motion.div>
            ))}
          </div>

          {/* Indicadores y flechas */}
          <div className="flex items-center justify-between mt-12 px-2">
            {/* Dots */}
            <div className="flex space-x-3">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 transition-all duration-500 rounded-full ${i === currentIndex ? "w-10 bg-[#7FA82C]" : "w-2 bg-[#7FA82C]/20"
                    }`}
                />
              ))}
            </div>

            {/* Flechas */}
            <div className="flex space-x-4">
              <button
                onClick={prev}
                className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 text-[#7FA82C] hover:bg-[#7FA82C] hover:text-white transition-all active:scale-90"
              >
                <MdArrowBackIos className="translate-x-1" />
              </button>
              <button
                onClick={next}
                className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 text-[#7FA82C] hover:bg-[#7FA82C] hover:text-white transition-all active:scale-90"
              >
                <MdArrowForwardIos />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimoniosClientes;