import React, { useState } from 'react';
import { FiHelpCircle, FiSend, FiMail } from 'react-icons/fi';

const preguntas = [
  {
    pregunta: '¿Qué es el dominio y por qué debo pagarlo?',
    respuesta: 'El dominio es el "nombre" de tu página en internet (ej. tunegocio.com). Es un servicio externo que se debe renovar anualmente para que tu sitio siga visible. Sin este pago, la página deja de funcionar automáticamente.'
  },
  {
    pregunta: '¿Por qué el costo de renovación puede variar?',
    respuesta: 'El precio lo definen los proveedores internacionales (como GoDaddy) y puede variar según el tipo de moneda o promociones vigentes. Nosotros no cobramos una comisión extra por capricho; el costo es lo que el proveedor solicita para mantener el nombre activo.'
  },

  {
    pregunta: '¿Cómo agrego un producto correctamente?',
    respuesta: 'Ve a "Agregar Producto", llena todos los campos y asigna una categoría válida. Luego da clic en "Guardar".'
  },
  {
    pregunta: '¿Cómo editar un producto existente?',
    respuesta: 'Desde la lista de productos, haz clic en el ícono de lápiz. Podrás modificar datos como nombre, stock e imagen.'
  },
  {
    pregunta: '¿Cómo revisar pedidos pendientes?',
    respuesta: 'Ingresa a "Pedidos", filtra por estado "pendiente" para ver los pedidos aún sin completar.'
  },
  {
    pregunta: '¿Por qué un producto no aparece?',
    respuesta: 'Asegúrate de que tenga stock, categoría válida y no haya sido eliminado. Revisa también errores en consola o backend.'
  },
  {
    pregunta: '¿Cómo contacto soporte técnico?',
    respuesta: 'Puedes escribirnos directamente a pucbeto327@gmail.com o usar la sección de contacto al final de esta página.'
  },
];

const Ayuda = () => {
  const [problema, setProblema] = useState('');

  const handleEnviar = () => {
    if (!problema.trim()) return alert('Por favor, describe tu problema');
    alert('Gracias por tu reporte. Nuestro equipo lo revisará pronto.');
    setProblema('');
  };

  return (
    <div className="w-full p-8 bg-gray-100 rounded-lg shadow-md space-y-10">
      {/* Encabezado */}
      <div className="flex items-center border-b pb-4">
        <div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">Centro de Ayuda</h2>
          <p className="text-gray-600 mt-1 text-sm italic">¿Dudas sobre el sistema o renovaciones? Aquí puedes resolverlas.</p>
        </div>
      </div>

      {/* Preguntas y respuestas visibles */}
      <div className="grid md:grid-cols-2 gap-6">
        {preguntas.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-md shadow-sm border border-gray-200 hover:border-[#7FA82C] transition-colors">
            <h4 className="text-lg font-semibold text-[#7FA82C] mb-2">{item.pregunta}</h4>
            <p className="text-sm text-gray-800 leading-relaxed">{item.respuesta}</p>
          </div>
        ))}
      </div>

      {/* Contacto directo */}
      <div className="bg-[#F7FAF2] border border-[#7FA82C] rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <FiMail className="text-[#7FA82C] mr-2" />
            <h3 className="font-semibold text-gray-800 text-lg">¿Aún necesitas ayuda con tu pago o el sistema?</h3>
          </div>
          <p className="text-sm text-gray-600">
            Escríbeme directamente a: <span className="text-[#7FA82C] font-bold text-base">yahirordzdev@gmail.com</span>
          </p>
        </div>

        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=yahirordzdev@gmail.com&su=${encodeURIComponent("Duda/Problema con el Sistema La Casa de los Frenos")}&body=${encodeURIComponent("Hola, tengo una duda o problema con el sistema. Aquí te dejo los detalles:")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 md:mt-0 bg-[#7FA82C] text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-[#6a8d24] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
        >
          <FiSend /> Enviar correo ahora
        </a>
      </div>
    </div>
  );
};

export default Ayuda;