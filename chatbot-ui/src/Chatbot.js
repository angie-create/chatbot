import React, { useState } from "react";
//import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionId = "test-session-001";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    /* try {
      const res = await axios.post("http://localhost:3000", {
        sessionId,
        userInput: currentInput,
      });

      const botReply = res.data?.response || "Error en la respuesta del bot";
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "bot", text: "Ocurrió un error." }]);
    } finally {
      setLoading(false);
    } */

    //const handleSubmit = async (e) => {
    //e.preventDefault();

    try {
      const response = await fetch("https://api.trigger.dev/api/v1/tasks/chatBot/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer tr_dev_nrS8cQ6LrmI9xqMeAz6l",
        },
        body: JSON.stringify({
          "payload": {
            "sessionId": sessionId,
            "userInput": currentInput
          }
        }),
      });
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.status}`);
      }
      const data = await response.json();
      console.log("Resuesta de Trigger.dev: ", typeof data, data);
      const botReply = data?.response || "No se recibió una respuesta válida.";
      setMessages((prev)=>[...prev, { from: "bot", text: botReply }]);
    } catch (error) {
        console.log("Error al contactar Trigger.dev: ", error);
        setMessages((prev) => [...prev, { from: "bot", text: "Ocurrió un error al obtener la respuesta." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Chatbot</h2>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16, border: "1px solid #ccc", padding: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left", marginBottom: 8 }}>
            <strong>{msg.from === "user" ? "Tú" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
        {loading && <p>Bot está escribiendo...</p>}
      </div>
      <input
        style={{ width: "80%", padding: 8 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Escribe algo..."
      />
      <button style={{ padding: 8, marginLeft: 8 }} onClick={sendMessage}>
        Enviar
      </button>
    </div>
  );
};

export default Chatbot;
