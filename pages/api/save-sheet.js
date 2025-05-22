// /pages/api/save-sheet.js
export default async function handler(req, res) {
  const { userInfo, answers, result } = req.body;

  if (!userInfo || !answers || !result) {
    return res.status(400).json({ error: 'Données incomplètes.' });
  }

  try {
    // Simulation d'enregistrement (à remplacer par Google Sheets API)
    console.log('📥 Enregistrement Google Sheet :');
    console.log('👤 Utilisateur :', userInfo);
    console.log('🧠 Réponses :', answers);
    console.log('✅ Résultat :', result);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur Google Sheets :', err);
    res.status(500).json({ error: 'Échec de l’enregistrement.' });
  }
}
