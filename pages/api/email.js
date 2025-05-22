// /pages/api/email.js
export default async function handler(req, res) {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    // Simulation d'envoi (à remplacer par Resend, SendGrid, ou nodemailer + SMTP)
    console.log('📧 Envoi email simulé vers :', to);
    console.log('📨 Sujet :', subject);
    console.log('✉️ Contenu :', message);

    // Simuler une réponse OK
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur email :', err);
    res.status(500).json({ error: 'Échec de l’envoi de l’email.' });
  }
}
