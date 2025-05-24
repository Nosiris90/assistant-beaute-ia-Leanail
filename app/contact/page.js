"use client"

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi en cours...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('✅ Merci pour votre message, nous vous contacterons bientôt.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus(`❌ Erreur : ${result.error}`);
      }
    } catch (err) {
      console.error('Erreur envoi formulaire:', err);
      setStatus('❌ Une erreur est survenue.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#FF69B4' }}>Contact Leanail</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Votre prénom" value={formData.name} onChange={handleChange} required style={inputStyle} />
        <input name="email" placeholder="Votre email" value={formData.email} onChange={handleChange} required type="email" style={inputStyle} />
        <input name="phone" placeholder="Votre téléphone" value={formData.phone} onChange={handleChange} style={inputStyle} />
        <textarea name="message" placeholder="Votre message" value={formData.message} onChange={handleChange} rows="4" style={inputStyle} />
        <button type="submit" style={{ ...inputStyle, background: '#FFC0CB', fontWeight: 'bold', color: '#000' }}>Envoyer</button>
      </form>
      {status && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid #ccc'
};
