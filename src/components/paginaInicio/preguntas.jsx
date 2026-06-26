import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    pregunta: '¿Qué tipo de frenos manejan?',
    respuesta: 'Nos especializamos en frenos industriales, para transporte pesado y automotriz, incluyendo pastillas, discos y zapatas con los más altos estándares de fricción.',
  },
  {
    pregunta: '¿Fabrican productos o solo distribuyen?',
    respuesta: 'Somos fabricantes directos, lo que garantiza el mejor precio del mercado y un control de calidad total en cada pieza. No somos revendedores.',
  },
  {
    pregunta: '¿Dónde están ubicados?',
    respuesta: 'Nuestras oficinas se encuentra en Umán, Yucatán. Puedes consultar el mapa interactivo en la sección de Ubicación para llegar sin problemas.',
  },
  {
    pregunta: '¿Puedo pedir productos al mayoreo?',
    respuesta: '¡Por supuesto! Contamos con esquemas de precios especiales para compras por volumen, flotas de transporte y distribuidores frecuentes.',
  },
];

const PreguntasFrecuentes = () => {
  const [activo, setActivo] = useState(null);

  const toggle = (index) => {
    setActivo(activo === index ? null : index);
  };

  return (
    <section className="bg-white text-gray-800 py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Encabezado Unificado */}
        <div className="text-center mb-16">

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900"
          >
            PREGUNTAS <span className="text-[#7FA82C]">FRECUENTES</span>
          </motion.h2>

        </div>

        {/* Lista de Acordeones */}
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${activo === index
                ? 'border-[#7FA82C] shadow-lg shadow-[#7FA82C]/5 bg-[#F7FAF0]/30'
                : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors"
              >
                <span className={`font-bold text-sm md:text-base tracking-tight ${activo === index ? 'text-[#7FA82C]' : 'text-gray-800'
                  }`}>
                  {item.pregunta}
                </span>
                <div className={`shrink-0 ml-4 p-2 rounded-full transition-all duration-300 ${activo === index ? 'bg-[#7FA82C] text-white rotate-180' : 'bg-gray-50 text-gray-400'
                  }`}>
                  <FaChevronDown size={12} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {activo === index && (
                  <motion.div
                    key="respuesta"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 text-sm md:text-base leading-relaxed border-t border-[#7FA82C]/10 pt-4">
                      {item.respuesta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreguntasFrecuentes;