const BASE_URL = "https://lacasadelosfrenos-api.onrender.com";
const CONVERSATIONS_URL = `${BASE_URL}/conversations`;

const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

// ─── CONVERSACIONES ───────────────────────────────────────────────────────────

export const obtenerConversaciones = async () => {
  const res = await fetch(CONVERSATIONS_URL, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Error al obtener conversaciones");
  return res.json();
};

export const crearConversacion = async (titulo = "Nueva consulta") => {
  const res = await fetch(CONVERSATIONS_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ titulo })
  });
  if (!res.ok) throw new Error("Error al crear conversación");
  return res.json();
};

export const renombrarConversacion = async (id, titulo) => {
  const res = await fetch(`${CONVERSATIONS_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ titulo })
  });
  if (!res.ok) throw new Error("Error al renombrar conversación");
  return res.json();
};

// ─── MENSAJES ─────────────────────────────────────────────────────────────────

export const obtenerMensajes = async (conversationId) => {
  const res = await fetch(`${CONVERSATIONS_URL}/${conversationId}/messages`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Error al obtener mensajes");
  return res.json();
};

export const enviarMensaje = async (conversationId, content, onToken, onDone) => {
  const res = await fetch(`${CONVERSATIONS_URL}/${conversationId}/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error("Error al enviar mensaje");

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer    = "";

  const processLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    // Quitar el prefijo "data: " del formato SSE
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
      // Procesar lo que quede en el buffer
      if (buffer.trim()) processLine(buffer);
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop(); // Guardar línea incompleta

    for (const line of lines) {
      processLine(line);
    }
  }

  // Fallback: si onDone nunca se llamó, llamarlo ahora
  onDone?.([]);
};
