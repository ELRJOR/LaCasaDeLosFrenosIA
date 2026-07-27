const BASE_URL = "https://lacasadelosfrenos-api.onrender.com";
const ADMIN_URL = `${BASE_URL}/admin`;
const CONVERSATIONS_URL = `${BASE_URL}/conversations`;

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
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { ...jsonHeaders, ...(options.headers || {}) },
  });

  if (res.status !== 401) return res;

  const refreshed = await tryRefresh();

  if (!refreshed) {
    window.location.href = "/loginAdmin";
    throw new Error("Sesión expirada");
  }

  // Reintenta la request original una sola vez con la cookie renovada
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: { ...jsonHeaders, ...(options.headers || {}) },
  });
};

// ─── CONVERSACIONES ───────────────────────────────────────────────────────────

export const obtenerConversaciones = async () => {
  const res = await authFetch(CONVERSATIONS_URL);
  if (!res.ok) throw new Error("Error al obtener conversaciones");
  return res.json();
};

export const crearConversacion = async (titulo = "Nueva consulta") => {
  const res = await authFetch(CONVERSATIONS_URL, {
    method: "POST",
    body: JSON.stringify({ titulo }),
  });
  if (!res.ok) throw new Error("Error al crear conversación");
  return res.json();
};

export const renombrarConversacion = async (id, titulo) => {
  const res = await authFetch(`${CONVERSATIONS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ titulo }),
  });
  if (!res.ok) throw new Error("Error al renombrar conversación");
  return res.json();
};

export const eliminarConversacion = async (id) => {
  const res = await authFetch(`${CONVERSATIONS_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar conversación");
  return res.json().catch(() => ({}));
};

// ─── MENSAJES ─────────────────────────────────────────────────────────────────

export const obtenerMensajes = async (conversationId) => {
  const res = await authFetch(`${CONVERSATIONS_URL}/${conversationId}/messages`);
  if (!res.ok) throw new Error("Error al obtener mensajes");
  return res.json();
};

export const enviarMensaje = async (conversationId, content, onToken, onDone) => {
  const res = await authFetch(`${CONVERSATIONS_URL}/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Error al enviar mensaje");

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer    = "";

  const processLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const jsonStr = trimmed.startsWith("data: ") ? trimmed.slice(6) : trimmed;
    try {
      const event = JSON.parse(jsonStr);
      if (event.type === "token" && event.content) {
        onToken?.(event.content);
      } else if (event.type === "done") {
        onDone?.(event.sources ?? []);
      }
    } catch {
      // No es JSON válido, ignorar
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (buffer.trim()) processLine(buffer);
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      processLine(line);
    }
  }

  onDone?.([]);
};