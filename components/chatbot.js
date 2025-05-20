'use client';
import React, { useState } from 'react';
import '../public/styles/chatbot.css';

const Chatbot = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [input] }),
    });

    const data = await res.json();
    setMessages([...newMessages, { from: 'bot', text: data.recommendation || 'Une erreur est survenue' }]);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setShow(!show)}>
        {show ? 'Fermer' : 'Assistant Beauté'}
      </button>
      {show && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={chatbot-msg ${msg.from}}>
                {msg.text}
              </div>
            ))}
          </div>
          <input
            className="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Posez votre question..."
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;