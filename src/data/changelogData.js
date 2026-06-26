// src/data/changelogData.js
export const logCambios = [
    {
        fecha: "14 Mayo 2026",
        titulo: "Mantenimiento Preventivo y Reconfiguración por Renovación de Dominio",
        descripcion: "Optimización integral de la seguridad del sitio y actualización de protocolos SSL/TLS tras la renovación del dominio. Se reconfiguraron los endpoints de conexión con el backend cloud para garantizar una persistencia de datos ininterrumpida y un blindaje de red actualizado contra vulnerabilidades externas.",
        autor: "Yahir Ordoñez Puc, Jorge Ayala",
        isUrgent: true
    },
    {
        fecha: "6 Abril 2026",
        titulo: "Optimización de Formularios y Persistencia de Datos del Panel Administrativo",
        descripcion: "Se implementaron filtros de validación de datos de los formularios y una nueva función de previsualización de imágenes para productos. Además, el sistema ahora protege la información capturada: ante cualquier error de conexión o del servidor, el formulario conserva los datos permitiendo su corrección inmediata sin pérdida de progreso.",
        autor: "Yahir Ordoñez Puc",
        isUrgent: false
    },
    {
        fecha: "6 Abril 2026",
        titulo: "Modernización Visual y UX de la Pagina Principal",
        descripcion: "Rediseño moderno de la página principal y catálogo. Implementación de tarjetas informativas modernas, navegación de pestañas con desplazamiento táctil (drag-to-scroll) y mejora del sistema global de cotizaciones responsivo para WhatsApp y Correo.",
        autor: "Yahir Ordoñez Puc",
        isUrgent: false
    },
    {
        fecha: "4 Abril 2026",
        titulo: "Modernización visual y UX del panel administrativo",
        descripcion: "Implementación de nuevos estándares de diseño en tablas, elementos gráficos y mensajes de alerta. Refuerzo visual en campos de seguridad y optimización de flujos interactivos.",
        autor: "Yahir Ordoñez Puc",
        isUrgent: false
    },
    {
        fecha: "17 Febrero 2026",
        titulo: "Optimización de carga y Backend Cloud",
        descripcion: "Refactorización de la arquitectura de datos con Supabase y limpieza de estilos globales en Tailwind. Mejora en los tiempos de respuesta del inventario.",
        autor: "Yahir Ordoñez Puc",
        isUrgent: false
    },
    {
        fecha: "5 Enero 2026",
        titulo: "Seguridad y Row Level Security (RLS)",
        descripcion: "Configuración de políticas de seguridad a nivel de fila en la BD. Blindaje de datos sensibles y control de accesos por roles para proteger la información del negocio.",
        autor: "Yahir Ordoñez Puc",
        isUrgent: false
    }
];