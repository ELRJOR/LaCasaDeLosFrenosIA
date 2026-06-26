"use client";

import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

const Footer = () => {
  const categories = ["Balatas", "Tambores", "Herrajes", "Discos", "Líquidos", "Accesorios"];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-[#0D0F0F] text-white pt-16"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo y redes */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-[#9DC435] leading-none uppercase tracking-tighter">
                LA CASA DE LOS <br /> FRENOS
              </h3>
              <p className="text-gray-400 mt-2 text-sm font-extrabold">
                Fabricantes directos - No revendedores
              </p>
            </div>

            <div className="flex gap-4">
              {/* Facebook - Reemplaza con tu link real */}
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#9DC435" }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl text-gray-400 transition-colors"
              >
                <FaFacebookF />
              </motion.a>
              {/* Instagram - Reemplaza con tu link real */}
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#9DC435" }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl text-gray-400 transition-colors"
              >
                <FaInstagram />
              </motion.a>
              {/* WhatsApp Directo */}
              <motion.a
                href="https://wa.me/529993473626"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#9DC435" }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl text-gray-400 transition-colors"
              >
                <FaWhatsapp />
              </motion.a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase text-sm">Categorías</h4>
            <ul className="space-y-3 text-gray-400">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link to="/catalogo" className="hover:text-[#9DC435] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-[#9DC435] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase text-sm">Enlaces rápidos</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a
                  href="#inicio"
                  className="hover:text-[#9DC435] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Inicio
                </a>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-[#9DC435] transition-colors">
                  Productos
                </Link>
              </li>

            </ul>
          </div>

          {/* Contacto Directo */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase text-sm">Contáctanos</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <HiOutlineLocationMarker className="text-[#9DC435] text-xl shrink-0" />
                <span className="leading-snug">
                  5 40 26E COL LIENZO CHARRO, <br />
                  UMAN, YUC. CP. 97390
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <HiOutlinePhone className="text-[#9DC435] text-xl shrink-0" />
                <a href="tel:9993473626" className="group-hover:text-[#9DC435] transition-colors">
                  (999) 347-3626
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <HiOutlineMail className="text-[#9DC435] text-xl shrink-0" />
                <a href="mailto:casafrenos99@gmail.com" className="group-hover:text-[#9DC435] transition-colors">
                  casafrenos99@gmail.com
                </a>
              </li>
            </ul>

            <Link
              to="/contacto"
              className="inline-block mt-8 bg-[#9DC435] hover:bg-white text-black font-black px-6 py-3 rounded-xl transition-all active:scale-95 text-xs uppercase tracking-[0.1em]"
            >
              Agenda una reunión
            </Link>
          </div>
        </div>

        {/* Línea y copyright */}
        <div className="mt-16 border-t border-white/5 py-8 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} La Casa de los Frenos. <br className="md:hidden" />
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;