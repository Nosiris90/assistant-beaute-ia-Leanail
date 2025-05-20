"use client";
import { useState } from "react";
import "../public/styles/chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages([...messages, { type: "user", text: userMsg }]);
    setInput("");

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: [userMsg] }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { type: "bot", text: data.recommendation }]);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Fermer" : "Assistant Leanail"}
      </button>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={chatbot-msg ${msg.type}}>
                {msg.text}
              </div>
            ))}
          </div>
          <input
            className="chatbot-input"
            type="text"
            value={input}
            placeholder="Pose ta question beauté..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>
      )}
    </div>
  );
}