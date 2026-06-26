


// Base URL para la API
const BASE_URL = 'https://lacasadelosfrenos-api.onrender.com';

// Rutas completas
const API_URL = `${BASE_URL}/productos`;
const CATEGORIAS_URL = `${BASE_URL}/categorias`;
const ADMIN_URL = `${BASE_URL}/admin`;
const CLIENTES_URL = `${BASE_URL}/clientes`;
const PEDIDOS_URL = `${BASE_URL}/pedidos`;



export const fetchProductos = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Crear producto
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

        const res = await fetch(`${API_URL}`, {
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

// Actualizar producto
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

        const res = await fetch(`${API_URL}/${id}`, {
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

// Eliminar producto
export async function eliminarProducto(id) {
    try {
        console.log(`Intentando eliminar el producto con ID: ${id}`);

        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        console.log(`Respuesta del servidor: ${res.status} - ${res.statusText}`);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            console.error(`Error al eliminar producto: ${errorData.error || 'Error desconocido'}`);
            throw new Error(errorData.error || 'Error al eliminar producto');
        }

        const responseData = await res.json();
        console.log('Producto eliminado exitosamente:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la función eliminarProducto:', error);
        throw error;
    }
}

export async function obtenerProductoPorId(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            throw new Error('Error al obtener el producto');
        }
        return await res.json();
    } catch (error) {
        console.error('Error en obtenerProductoPorId:', error);
        throw error;
    }
}

export const obtenerCategorias = async () => {
    try {
        const res = await fetch(CATEGORIAS_URL);
        if (!res.ok) {
            throw new Error('Error al obtener categorías');
        }

        const categorias = await res.json();
        console.log('Categorías obtenidas:', categorias);
        return categorias;
    } catch (error) {
        console.error('Error en la función obtenerCategorias:', error);
        throw error;
    }
}

export async function obtenerCategoriaPorId(id) {
    try {
        const res = await fetch(`${CATEGORIAS_URL}/${id}`);
        if (!res.ok) {
            throw new Error(`Error al obtener la categoría con ID: ${id}`);
        }

        const categoria = await res.json();
        console.log('Categoría obtenida:', categoria);
        return categoria;
    } catch (error) {
        console.error(`Error en la función obtenerCategoriaPorId (ID: ${id}):`, error);
        throw error;
    }
}


// Crear categoría
export async function crearCategoria(nombre) {
    try {
        const res = await fetch(CATEGORIAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            console.error(`Error al crear categoría: ${errorData.error || 'Error desconocido'}`);
            throw new Error(errorData.error || 'Error al crear categoría');
        }

        const responseData = await res.json();
        console.log('Categoría creada exitosamente:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error en la función crearCategoria:', error);
        throw error;
    }
}

export async function actualizarCategoria(id, nombre) {
    try {
        const res = await fetch(`${CATEGORIAS_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            console.error(`Error al actualizar la categoría con ID: ${id} - ${errorData.error || 'Error desconocido'}`);
            throw new Error(errorData.error || 'Error al actualizar categoría');
        }

        const responseData = await res.json();
        console.log('Categoría actualizada exitosamente:', responseData);
        return responseData;
    } catch (error) {
        console.error(`Error en la función actualizarCategoria (ID: ${id}):`, error);
        throw error;
    }
}

export async function eliminarCategoria(id) {
    try {
        const res = await fetch(`${CATEGORIAS_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            console.error(`Error al eliminar categoría con ID: ${id} - ${errorData.error || 'Error desconocido'}`);
            throw new Error(errorData.error || 'Error al eliminar categoría');
        }

        const responseData = await res.json();
        console.log('Categoría eliminada exitosamente:', responseData);
        return responseData;
    } catch (error) {
        console.error(`Error en la función eliminarCategoria (ID: ${id}):`, error);
        throw error;
    }

}


//Rutas de administradores

export const loginAdmin = async (credentials) => {
    try {
        const response = await fetch(`${ADMIN_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        // Si el código de respuesta no está en el rango 200–299
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Credenciales incorrectas');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        if (error.name === 'TypeError') {
            // Error de red o servidor no respondió
            throw new Error('No se recibió respuesta del servidor');
        } else {
            // Otro tipo de error (como el lanzado arriba)
            throw new Error(error.message || 'Error al configurar la solicitud');
        }
    }
};
 //Rutas de clientes
 export async function obtenerClientes() {
    try {
        const res = await fetch(CLIENTES_URL);
        if (!res.ok) throw new Error('Error al obtener los clientes');
        return await res.json();
    } catch (error) {
        console.error('Error en obtenerClientes:', error);
        throw error;
    }
}

export async function obtenerClientePorId(id) {
    try {
        const res = await fetch(`${CLIENTES_URL}/${id}`);
        if (!res.ok) throw new Error('Error al obtener el cliente');
        return await res.json();
    } catch (error) {
        console.error(`Error en obtenerClientePorId (ID: ${id}):`, error);
        throw error;
    }
}

export async function crearCliente(cliente) {
    try {
        const res = await fetch(CLIENTES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        const res = await fetch(`${CLIENTES_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
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
        const res = await fetch(`${CLIENTES_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar cliente');
        return await res.json();
    } catch (error) {
        console.error(`Error en eliminarCliente (ID: ${id}):`, error);
        throw error;
    }
}



//Rutas de pedidos
export async function crearPedido({ cliente_id, observaciones, productos, fecha, estado }) {
    try {
        const body = { cliente_id, observaciones, productos };
        if (fecha) body.fecha = fecha;
        if (estado) body.estado = estado;

        const res = await fetch(PEDIDOS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
    console.log('🟡 [actualizarPedido] llamada iniciada');
    console.log('🧾 ID del pedido a actualizar:', id);

    // Validación básica
    if (!id) {
        console.error('❌ ID del pedido no proporcionado');
        throw new Error('ID del pedido es obligatorio');
    }

    if (!cliente_id) {
        console.error('❌ cliente_id faltante');
        throw new Error('El cliente_id es obligatorio');
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        console.error('❌ Productos no válidos o vacíos:', productos);
        throw new Error('Debes enviar al menos un producto');
    }

    // Construcción del body completo, sin condicionales
    const body = {
        cliente_id,
        productos,
        fecha,
        estado,
        observaciones
    };

    const url = `${PEDIDOS_URL}/${id}`;


    console.log('🌐 URL usada en fetch:', url);
    console.log('📦 Datos enviados al backend (payload completo):', JSON.stringify(body, null, 2));

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        console.log('📬 Status de respuesta del backend:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Error recibido del servidor:', errorData);
            throw new Error(errorData.error || 'Error desconocido al actualizar el pedido');
        }

        const data = await response.json();
        console.log('✅ Pedido actualizado correctamente. Respuesta final del backend:', data);
        return data;

    } catch (error) {
        console.error('💥 Error en actualizarPedido (API):', error.message || error);
        throw error;
    }
}



export async function obtenerPedidos() {
    try {
        const res = await fetch(PEDIDOS_URL);
        if (!res.ok) throw new Error('Error al obtener pedidos');
        return await res.json();
    } catch (error) {
        console.error('Error en obtenerPedidos:', error);
        throw error;
    }
}

export async function obtenerPedidoPorId(id) {
    try {
        const res = await fetch(`${PEDIDOS_URL}/${id}`);
        if (!res.ok) throw new Error('Error al obtener el pedido');
        return await res.json();
    } catch (error) {
        console.error(`Error en obtenerPedidoPorId (ID: ${id}):`, error);
        throw error;
    }
}

export async function eliminarPedido(id) {
    try {
        const res = await fetch(`${PEDIDOS_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar pedido');
        return await res.json();
    } catch (error) {
        console.error(`Error en eliminarPedido (ID: ${id}):`, error);
        throw error;
    }
}

