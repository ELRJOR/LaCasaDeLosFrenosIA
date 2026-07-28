const BASE_URL = 'https://lacasadelosfrenos-api.onrender.com';
const ADMIN_URL = `${BASE_URL}/admin`;

const API_URL = `${BASE_URL}/productos`;
const CATEGORIAS_URL = `${BASE_URL}/categorias`;
const CLIENTES_URL = `${BASE_URL}/clientes`;
const PEDIDOS_URL = `${BASE_URL}/pedidos`;

const jsonHeaders = { "Content-Type": "application/json" };

let refreshPromise = null;

const tryRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${ADMIN_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      refreshPromise = null;
    });
  }
  const res = await refreshPromise;
  return res.ok;
};

const authFetch = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : { ...jsonHeaders, ...(options.headers || {}) };

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status !== 401) return res;

  const refreshed = await tryRefresh();

  if (!refreshed) {
    window.location.href = "/loginAdmin";
    throw new Error("Sesión expirada");
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
};

// ─── PRODUCTOS ───────────────────────────────────────────────────────────────

export const fetchProductos = async () => {
    try {
        const response = await authFetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener productos');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function crearProducto(producto) {
    try {
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('descripcion', producto.descripcion);
        formData.append('imagen', producto.imagen);
        formData.append('stock', producto.stock);
        formData.append('categoria_id', producto.categoria_id);
        formData.append('medidas', JSON.stringify(producto.medidas));
        formData.append('caracteristicas', JSON.stringify(producto.caracteristicas));

        const res = await authFetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || 'Error al crear producto');
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function actualizarProducto(id, producto) {
    try {
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('descripcion', producto.descripcion);
        formData.append('stock', producto.stock);
        formData.append('categoria_id', producto.categoria_id);
        if (producto.imagen) {
            formData.append('imagen', producto.imagen);
        }
        formData.append('medidas', JSON.stringify(producto.medidas));
        formData.append('caracteristicas', JSON.stringify(producto.caracteristicas));

        const res = await authFetch(`${API_URL}/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || 'Error al actualizar producto');
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function eliminarProducto(id) {
    try {
        const res = await authFetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || 'Error al eliminar producto');
        }

        return await res.json();
    } catch (error) {
        console.error('Error en la función eliminarProducto:', error);
        throw error;
    }
}

export async function obtenerProductoPorId(id) {
    try {
        const res = await authFetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Error al obtener el producto');
        return await res.json();
    } catch (error) {
        console.error('Error en obtenerProductoPorId:', error);
        throw error;
    }
}

// ─── CATEGORÍAS ──────────────────────────────────────────────────────────────

export const obtenerCategorias = async () => {
    try {
        const res = await authFetch(CATEGORIAS_URL);
        if (!res.ok) throw new Error('Error al obtener categorías');
        return await res.json();
    } catch (error) {
        console.error('Error en la función obtenerCategorias:', error);
        throw error;
    }
}

export async function obtenerCategoriaPorId(id) {
    try {
        const res = await authFetch(`${CATEGORIAS_URL}/${id}`);
        if (!res.ok) throw new Error(`Error al obtener la categoría con ID: ${id}`);
        return await res.json();
    } catch (error) {
        console.error(`Error en la función obtenerCategoriaPorId (ID: ${id}):`, error);
        throw error;
    }
}

export async function crearCategoria(nombre) {
    try {
        const res = await authFetch(CATEGORIAS_URL, {
            method: 'POST',
            body: JSON.stringify({ nombre }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || 'Error al crear categoría');
        }

        return await res.json();
    } catch (error) {
        console.error('Error en la función crearCategoria:', error);
        throw error;
    }
}

export async function actualizarCategoria(id, nombre) {
    try {
        const res = await authFetch(`${CATEGORIAS_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nombre }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || 'Error al actualizar categoría');
        }

        return await res.json();
    } catch (error) {
        console.error(`Error en la función actualizarCategoria (ID: ${id}):`, error);
        throw error;
    }
}

export async function eliminarCategoria(id) {
    try {
        const res = await authFetch(`${CATEGORIAS_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || 'Error al eliminar categoría');
        }

        return await res.json();
    } catch (error) {
        console.error(`Error en la función eliminarCategoria (ID: ${id}):`, error);
        throw error;
    }
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export const loginAdmin = async (credentials) => {
    try {
        const response = await fetch(`${ADMIN_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Credenciales incorrectas');
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error(error.message || 'Error al configurar la solicitud');
        }
    }
};

export const registrarMecanico = async (datos) => {
    try {
        const response = await fetch(`${ADMIN_URL}/registro-mecanico`, {
            method: 'POST',
            credentials: 'include', // ← agregado, faltaba
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al registrar');
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error(error.message || 'Error al configurar la solicitud');
        }
    }
};

// ─── CLIENTES ────────────────────────────────────────────────────────────────

export async function obtenerClientes() {
    try {
        const res = await authFetch(CLIENTES_URL);
        if (!res.ok) throw new Error('Error al obtener los clientes');
        return await res.json();
    } catch (error) {
        console.error('Error en obtenerClientes:', error);
        throw error;
    }
}

export async function obtenerClientePorId(id) {
    try {
        const res = await authFetch(`${CLIENTES_URL}/${id}`);
        if (!res.ok) throw new Error('Error al obtener el cliente');
        return await res.json();
    } catch (error) {
        console.error(`Error en obtenerClientePorId (ID: ${id}):`, error);
        throw error;
    }
}

export async function crearCliente(cliente) {
    try {
        const res = await authFetch(CLIENTES_URL, {
            method: 'POST',
            body: JSON.stringify(cliente)
        });

        if (!res.ok) throw new Error('Error al crear cliente');
        return await res.json();
    } catch (error) {
        console.error('Error en crearCliente:', error);
        throw error;
    }
}

export async function actualizarCliente(id, cliente) {
    try {
        const res = await authFetch(`${CLIENTES_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cliente)
        });

        if (!res.ok) throw new Error('Error al actualizar cliente');
        return await res.json();
    } catch (error) {
        console.error(`Error en actualizarCliente (ID: ${id}):`, error);
        throw error;
    }
}

export async function eliminarCliente(id) {
    try {
        const res = await authFetch(`${CLIENTES_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar cliente');
        return await res.json();
    } catch (error) {
        console.error(`Error en eliminarCliente (ID: ${id}):`, error);
        throw error;
    }
}

// ─── PEDIDOS ─────────────────────────────────────────────────────────────────

export async function crearPedido({ cliente_id, observaciones, productos, fecha, estado }) {
    try {
        const body = { cliente_id, observaciones, productos };
        if (fecha) body.fecha = fecha;
        if (estado) body.estado = estado;

        const res = await authFetch(PEDIDOS_URL, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al crear el pedido');
        }

        return await res.json();
    } catch (error) {
        console.error('Error en crearPedido:', error);
        throw error;
    }
}

export async function actualizarPedido(id, { cliente_id, productos, fecha, estado, observaciones }) {
    if (!id) throw new Error('ID del pedido es obligatorio');
    if (!cliente_id) throw new Error('El cliente_id es obligatorio');
    if (!Array.isArray(productos) || productos.length === 0) throw new Error('Debes enviar al menos un producto');

    const body = { cliente_id, productos, fecha, estado, observaciones };

    try {
        const response = await authFetch(`${PEDIDOS_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error desconocido al actualizar el pedido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en actualizarPedido (API):', error.message || error);
        throw error;
    }
}

export async function obtenerPedidos() {
    try {
        const res = await authFetch(PEDIDOS_URL);
        if (!res.ok) throw new Error('Error al obtener pedidos');
        return await res.json();
    } catch (error) {
        console.error('Error en obtenerPedidos:', error);
        throw error;
    }
}

export async function obtenerPedidoPorId(id) {
    try {
        const res = await authFetch(`${PEDIDOS_URL}/${id}`);
        if (!res.ok) throw new Error('Error al obtener el pedido');
        return await res.json();
    } catch (error) {
        console.error(`Error en obtenerPedidoPorId (ID: ${id}):`, error);
        throw error;
    }
}

export async function eliminarPedido(id) {
    try {
        const res = await authFetch(`${PEDIDOS_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar pedido');
        return await res.json();
    } catch (error) {
        console.error(`Error en eliminarPedido (ID: ${id}):`, error);
        throw error;
    }
}

// ─── CITAS ───────────────────────────────────────────────────────────────────

export const mostrarCitas = async () => {
    try {
        const response = await authFetch(`${BASE_URL}/citas`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al mostrar');
        }
        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error(error.message || 'Error al configurar la solicitud');
        }
    }
};