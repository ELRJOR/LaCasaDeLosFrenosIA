import { useState, useEffect } from "react";
import { mostrarCitas } from "../../services/apiService";

const ESTADO_STYLES = {
  pendiente: "bg-[#7FA82C]/10 text-[#5c7d1f] border-[#7FA82C]/30",
  en_proceso: "bg-blue-50 text-blue-700 border-blue-200",
  completada: "bg-gray-100 text-gray-600 border-gray-200",
  cancelada: "bg-red-50 text-red-600 border-red-200",
};

const ESTADO_LABEL = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  completada: "Completada",
  cancelada: "Cancelada",
};

const formatFecha = (fecha) => {
  if (!fecha) return "Sin fecha";
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MostrarCitas = () => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        setCargando(true);
        const data = await mostrarCitas();
        setCitas(data.citas || []);
      } catch (err) {
        console.error("Error al cargar citas:", err);
        setError("No se pudieron cargar tus citas. Intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    cargarCitas();
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7FA82C]/20 border-t-[#7FA82C]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white px-6 py-10 text-center">
        <p className="text-gray-500">No tienes citas registradas.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-800">Mis citas</h2>

      {citas.map((cita) => (
        <div
          key={cita.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-800">{cita.motivo_cita}</p>
              {cita.vehiculo && (
                <p className="text-sm text-gray-500">
                  {cita.vehiculo.marca} {cita.vehiculo.modelo}
                  {cita.vehiculo.anio ? ` (${cita.vehiculo.anio})` : ""}
                  {cita.vehiculo.placas ? ` · ${cita.vehiculo.placas}` : ""}
                </p>
              )}
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                ESTADO_STYLES[cita.estado] || "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {ESTADO_LABEL[cita.estado] || cita.estado}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <p>
              <span className="text-gray-400">Fecha:</span> {formatFecha(cita.fecha)}
            </p>
            {cita.kilometraje != null && (
              <p>
                <span className="text-gray-400">Km:</span> {cita.kilometraje}
              </p>
            )}
            {cita.tipo_falla && (
              <p className="col-span-2">
                <span className="text-gray-400">Tipo de falla:</span> {cita.tipo_falla}
              </p>
            )}
            {cita.diagnostico && (
              <p className="col-span-2">
                <span className="text-gray-400">Diagnóstico:</span> {cita.diagnostico}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MostrarCitas;