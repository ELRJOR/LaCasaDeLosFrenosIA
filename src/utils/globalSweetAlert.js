//Estos son las alertas personalizadas, solo consumirlas en los componentes
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Aplica estilos personalizados a los botones y texto
const applyStyles = () => {
  const confirmBtn = Swal.getConfirmButton();
  const cancelBtn = Swal.getCancelButton();
  const title = Swal.getTitle();
  const content = Swal.getHtmlContainer();

  if (confirmBtn) {
    // Botón primario (relleno rojo)
    confirmBtn.style.backgroundColor = '#d33';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.padding = '8px 20px';
    confirmBtn.style.fontSize = '1rem';
    confirmBtn.style.borderRadius = '5px';
    confirmBtn.style.cursor = 'pointer';
  }

  if (cancelBtn) {
    // Botón secundario (solo contorno gris)
    cancelBtn.style.backgroundColor = 'transparent';
    cancelBtn.style.color = '#555';
    cancelBtn.style.border = '2px solid #ccc';
    cancelBtn.style.padding = '8px 20px';
    cancelBtn.style.fontSize = '1rem';
    cancelBtn.style.borderRadius = '5px';
    cancelBtn.style.marginLeft = '10px';
    cancelBtn.style.cursor = 'pointer';
  }

  if (title) {
    title.style.fontSize = '1.3rem';
    title.style.fontWeight = 'bold';
  }

  if (content) {
    content.style.fontSize = '1rem';
    content.style.color = '#444';
  }
};

// Alerta de éxito
export const showSuccessAlert = (title, text) => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: title || 'Operación realizada con éxito',
    text: text || '',
    showConfirmButton: false,
    timer: 1500,
    didOpen: applyStyles,
  });
};

// Alerta de error
export const showErrorAlert = (title, text) => {
  Swal.fire({
    icon: 'error',
    title: title || 'Algo salió mal',
    text: text || 'Por favor, intenta nuevamente.',
    didOpen: applyStyles,
  });
};

// Alerta de confirmación
export const showConfirmationAlert = (title, text) => {
  return Swal.fire({
    title: title || '¿Estás seguro?',
    text: text || 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    didOpen: applyStyles,
  });
};

// Alerta personalizada
export const showCustomAlert = (icon, title, text) => {
  return Swal.fire({
    icon: icon || 'info',
    title: title || 'Alerta',
    text: text || '',
    didOpen: applyStyles,
  });
};
