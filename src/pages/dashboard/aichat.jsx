import { useState, useRef, useEffect } from "react";
import {
  IoAdd,
  IoSend,
  IoSparkles,
  IoChatbubbleEllipses,
  IoMic,
  IoMicOff
} from "react-icons/io5";
import {
  obtenerConversaciones,
  crearConversacion,
  renombrarConversacion,
  obtenerMensajes,
  enviarMensaje
} from "../../services/aiService";

export default function AIChat() {

  const [message, setMessage]           = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat]     = useState(null);
  const [messages, setMessages]         = useState([]);
  const [isListening, setIsListening]   = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef   = useRef("");
  const isSendingRef    = useRef(false);
  const messagesEndRef = useRef(null);

  // ── 1. Cargar conversaciones al montar ───────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerConversaciones();
        // data es un array; ajusta el campo según tu API (id, titulo, etc.)
        const chats = Array.isArray(data) ? data : [];
        setConversations(chats);
        if (chats.length > 0) setActiveChat(chats[0].id);
      } catch (e) {
        console.error("Error cargando conversaciones:", e);
      } finally {
        setLoadingChats(false);
      }
    };
    cargar();
  }, []);

  // ── 2. Cargar mensajes cuando cambia la conversación activa ─────────────
  useEffect(() => {
    if (!activeChat) return;
    // No recargar mensajes si estamos en medio de un envío (evita el doble mensaje)
    if (isSendingRef.current) return;

    const cargarMensajes = async () => {
      setLoadingMsgs(true);
      setMessages([]);
      try {
        const data = await obtenerMensajes(activeChat);
        // data es un array de { role/sender, content }
        // normaliza el campo de rol según tu API
        const msgs = Array.isArray(data) ? data.map(m => ({
          role: m.role ?? m.sender ?? (m.is_bot ? "assistant" : "user"),
          content: m.content ?? m.message ?? ""
        })) : [];

        // Si la conversación está vacía, mostramos el saludo inicial
        if (msgs.length === 0) {
          setMessages([{
            role: "assistant",
            content: "Hola, soy el Asistente Técnico Automotriz de La Casa de los Frenos. ¿Qué problema presenta el vehículo?"
          }]);
        } else {
          setMessages(msgs);
        }
      } catch (e) {
        console.error("Error cargando mensajes:", e);
        setMessages([{
          role: "assistant",
          content: "Hola, soy el Asistente Técnico Automotriz de La Casa de los Frenos. ¿Qué problema presenta el vehículo?"
        }]);
      } finally {
        setLoadingMsgs(false);
      }
    };

    cargarMensajes();
  }, [activeChat]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── 3. Crear nueva conversación ──────────────────────────────────────────
  const createNewChat = () => {
    // Creamos un chat temporal local; la API se llama cuando el usuario envíe su primer mensaje
    const tempId = `temp-${Date.now()}`;
    const newChat = { id: tempId, titulo: "Nueva consulta", isTemp: true };
    setConversations(prev => [newChat, ...prev]);
    setActiveChat(tempId);
    setMessages([{
      role: "assistant",
      content: "Hola, soy el Asistente Técnico Automotriz de La Casa de los Frenos. ¿Qué problema presenta el vehículo?"
    }]);
  };

  // ── 4. Voz (Web Speech API) ─────────────────────────────────────────────
  const toggleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join("");
      transcriptRef.current = transcript;
      setMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      transcriptRef.current = "";
    };

    recognition.onend = () => {
      setIsListening(false);
      const text = transcriptRef.current.trim();
      transcriptRef.current = "";
      if (text) sendMessageWithText(text);
    };

    recognition.start();
  };

  // ── 5. Enviar mensaje ────────────────────────────────────────────────────
  const sendMessageWithText = async (text) => {
    if (!text.trim() || isLoading || !activeChat) return;

    const userText = text;
    setMessage("");
    isSendingRef.current = true;
    setIsLoading(true);

    // Mostrar mensaje del usuario de inmediato
    setMessages(prev => [...prev, { role: "user", content: userText }]);

    // Si el chat es temporal (aún no existe en la API), crearlo ahora con el título del primer mensaje
    let conversationId = activeChat;
    const currentConv = conversations.find(c => c.id === activeChat);
    if (currentConv?.isTemp) {
      const nuevoTitulo = userText.substring(0, 40);
      try {
        const data = await crearConversacion(nuevoTitulo);
        conversationId = data.id;
        setConversations(prev =>
          prev.map(c => c.id === activeChat
            ? { id: data.id, titulo: nuevoTitulo, isTemp: false }
            : c
          )
        );
        setActiveChat(data.id);
      } catch (e) {
        console.error("Error creando conversación:", e);
        setIsLoading(false);
        return;
      }
    }

    try {
      let isFirstToken = true;
      await enviarMensaje(
        conversationId,
        userText,
        // onToken: en el primer token crear la burbuja, luego acumular
        (token) => {
          if (isFirstToken) {
            isFirstToken = false;
            setIsLoading(false); // Ocultar el indicador de "pensando" al primer token
            setMessages(prev => [...prev, { role: "assistant", content: token }]);
          } else {
            setMessages(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = {
                ...last,
                content: last.content + token
              };
              return updated;
            });
          }
        },
        // onDone: el stream terminó
        () => {
          isSendingRef.current = false;
          setIsLoading(false);
        }
      );
    } catch (e) {
      console.error("Error enviando mensaje:", e);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ No pude conectarme con el servidor. Verifica que el servicio esté activo e inténtalo de nuevo."
        };
        return updated;
      });
      isSendingRef.current = false;
      setIsLoading(false);
    }
  };

  const sendMessage = () => sendMessageWithText(message);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm overflow-hidden flex">

      {/* SIDEBAR */}
      <div className="w-80 bg-gray-900 text-white flex flex-col">

        <div className="p-4 border-b border-gray-800">
          <button
            onClick={createNewChat}
            className="w-full bg-[#7FA82C] hover:bg-[#6e9325] transition p-3 rounded-xl flex items-center justify-center gap-2 font-bold"
          >
            <IoAdd size={20} />
            Nueva Consulta
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 px-2">
            Casos recientes
          </p>

          {loadingChats ? (
            <div className="flex flex-col gap-2 px-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-gray-500 px-2">
              No hay conversaciones. Crea una nueva.
            </p>
          ) : (
            conversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-3 rounded-xl cursor-pointer mb-2 transition ${
                  activeChat === chat.id ? "bg-[#7FA82C]" : "hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IoChatbubbleEllipses />
                  <span className="text-sm truncate">
                    {chat.titulo || "Sin título"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-800 p-4">
          <div className="text-xs text-gray-500">Especializado en:</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-gray-800 px-2 py-1 rounded-lg text-xs">Balatas</span>
            <span className="bg-gray-800 px-2 py-1 rounded-lg text-xs">Discos</span>
            <span className="bg-gray-800 px-2 py-1 rounded-lg text-xs">ABS</span>
            <span className="bg-gray-800 px-2 py-1 rounded-lg text-xs">Suspensión</span>
          </div>
        </div>

      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* HEADER */}
        <div className="bg-white border-b">
          <div className="h-20 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#7FA82C] p-3 rounded-xl text-white shadow-md">
                <IoSparkles size={22} />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">
                  🔧 Asistente Técnico Automotriz
                </h1>
                <p className="text-sm text-gray-500">
                  Diagnóstico de fallas, compatibilidades y refacciones
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MENSAJES */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">

            {loadingMsgs ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`h-14 bg-gray-200 rounded-3xl animate-pulse ${
                      i % 2 === 0 ? "w-2/3 ml-auto" : "w-3/4"
                    }`}
                  />
                ))}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-6 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl px-5 py-4 rounded-3xl ${
                      msg.role === "user"
                        ? "bg-[#7FA82C] text-white"
                        : "bg-white border shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="text-xs font-bold text-[#7FA82C] mb-2 uppercase tracking-wider">
                        🔧 Asistente Técnico
                      </div>
                    )}
                    <p className={msg.role === "user" ? "text-white" : "text-gray-900"}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Indicador de escritura */}
            {isLoading && (
              <div className="flex mb-6 justify-start">
                <div className="bg-white border shadow-sm px-5 py-4 rounded-3xl">
                  <div className="text-xs font-bold text-[#7FA82C] mb-2 uppercase tracking-wider">
                    🔧 Asistente Técnico
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="bg-white border-t p-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border rounded-2xl p-3 shadow-sm bg-white">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ color: "#111827", background: "transparent" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Describe una falla o consulta una refacción..."
                className="flex-1 outline-none bg-transparent"
                disabled={isLoading || !activeChat}
              />
              {/* Botón micrófono */}
              <button
                onClick={toggleVoice}
                disabled={isLoading || !activeChat}
                title={isListening ? "Detener grabación" : "Hablar"}
                className={`p-3 rounded-xl transition ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : isLoading || !activeChat
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isListening ? <IoMicOff size={18} /> : <IoMic size={18} />}
              </button>

              {/* Botón enviar */}
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim() || !activeChat}
                className={`text-white p-3 rounded-xl transition ${
                  isLoading || !message.trim() || !activeChat
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#7FA82C] hover:bg-[#6e9325]"
                }`}
              >
                <IoSend size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
