import { motion } from 'framer-motion';
import ImgQuienessomos from '../../assets/images/quienesSomos.png';
import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaHandsHelping,
  FaTools,
  FaCertificate,
} from 'react-icons/fa';

const infoPrincipal = [
  {
    titulo: 'Nuestra Misión',
    texto: 'Brindar soluciones eficientes, seguras y confiables en mantenimiento y distribución de sistemas de freno.',
    icono: <FaBullseye className="text-4xl text-[#7FA82C]" />,
  },
  {
    titulo: 'Nuestra Visión',
    texto: 'Ser líderes en México en soluciones de frenos, destacando por calidad, innovación y servicio.',
    icono: <FaEye className="text-4xl text-[#7FA82C]" />,
  },
  {
    titulo: 'Nuestros Valores',
    texto: 'Compromiso, responsabilidad, excelencia, honestidad y mejora continua.',
    icono: <FaHeart className="text-4xl text-[#7FA82C]" />,
  },
];

const diferencia = [
  {
    titulo: 'Atención Personalizada',
    texto: 'Trato directo, humano y adaptado a cada necesidad.',
    icono: FaHandsHelping,
  },
  {
    titulo: 'Experiencia Técnica',
    texto: 'Más de 10 años respaldan nuestro dominio del sector.',
    icono: FaTools,
  },
  {
    titulo: 'Calidad Garantizada',
    texto: 'Solo productos confiables, procesos seguros y control total.',
    icono: FaCertificate,
  },
];

const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className="bg-white text-gray-800 py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* --- SECCIÓN 1: QUIÉNES SOMOS --- */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#7FA82C] text-sm font-black uppercase tracking-[0.3em] mb-2 block"
          >
            Trayectoria y Compromiso
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold uppercase"
          >
            ¿QUIÉNES <span className="text-[#7FA82C]">SOMOS?</span>
          </motion.h2>
        </div>

        {/* Cards superiores */}
        <div className="grid gap-8 md:grid-cols-3 mb-24 md:mb-32">
          {infoPrincipal.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-[#f6fff4] border border-[#7FA82C]/20 rounded-3xl p-8 text-center shadow-xl shadow-[#7FA82C]/5 will-change-transform"
            >
              <div className="mb-6 flex justify-center">{item.icono}</div>
              <h3 className="text-2xl font-bold text-[#7FA82C] mb-3">{item.titulo}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.texto}</p>
            </motion.div>
          ))}
        </div>

        {/* --- SECCIÓN 2: DIFERENCIADOR --- */}
        <div className="relative">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[#7FA82C] text-sm font-black uppercase tracking-[0.3em] mb-2 block"
            >
              Valor Agregado
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold uppercase"
            >
              ¿QUÉ <span className="text-[#7FA82C]">NOS DIFERENCIA?</span>
            </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contenedor de Imagen Optimizado */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} // Reducido el desplazamiento para suavidad
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative group mt-4 md:mt-0 will-change-transform"
            >
              <div
                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 bg-white" // Fondo gris claro mientras carga
                style={{
                  maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                }}
              >
                <img
                  src={ImgQuienessomos}
                  alt="Nuestro diferencial"
                  loading="lazy" // Carga perezosa para no saturar el inicio
                  className="w-full h-auto min-h-[350px] max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Decoración detrás - blur optimizado */}
              <div className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 bg-[#7FA82C]/10 rounded-full blur-2xl"></div>
            </motion.div>

            {/* Cards laterales */}
            <div className="space-y-6">
              {diferencia.map((item, i) => {
                const Icono = item.icono;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 8 }}
                    className="flex items-center bg-white border border-gray-100 rounded-[2rem] p-6 shadow-lg shadow-gray-100 hover:border-[#7FA82C]/30 transition-all group will-change-transform"
                  >
                    <div className="bg-[#f6fff4] text-[#7FA82C] w-14 h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center rounded-2xl shadow-sm group-hover:bg-[#7FA82C] group-hover:text-white transition-colors mr-6">
                      <Icono className="text-2xl md:text-3xl" />
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#7FA82C] transition-colors">
                        {item.titulo}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        {item.texto}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienesSomos;
