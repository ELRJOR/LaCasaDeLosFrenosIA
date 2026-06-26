import { FaWhatsapp, FaMapMarkerAlt, FaFileDownload, FaUserTie } from 'react-icons/fa';

const AccesosDirectos = () => {
  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-5 gap-4">
      <a href="#vende" className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center hover:bg-red-50 transition-all">
        <FaUserTie className="text-red-600 text-2xl mb-2" />
        <span>VENDE CON NOSOTROS</span>
      </a>
      {/* Más accesos directos... */}
    </div>
  );
};

export default AccesosDirectos;