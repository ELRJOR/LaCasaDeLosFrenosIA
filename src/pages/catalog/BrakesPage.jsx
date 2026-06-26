import BrakesCatalog from "../../components/catalog/BrakesCatalog"

export default function BrakesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#7FA82C] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Frenos de Alta Calidad</h1>
          <p className="text-white text-opacity-90 mt-2">Seguridad y rendimiento garantizado para tu vehículo</p>
        </div>
      </div>

      <BrakesCatalog />
    </div>
  )
}
