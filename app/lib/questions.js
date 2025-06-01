// 📚 Structure centralisée des questions Leanail
const questions = [
  {
    key: 'structurel',
    text: "Q1. Rencontrez-vous des problèmes structurels ou de fragilité des ongles ?",
    icon: "🧱",
    options: [
      { label: "Cassants", value: 'cassants' },
      { label: "Mous / flexibles", value: 'mous' },
      { label: "Secs / déshydratés", value: 'secs' },
      { label: "Dédoublés", value: 'dedoubles' },
      { label: "Striés", value: 'stries' },
      { label: "Fins / pousse lente", value: 'fins' },
      { label: "Non", value: 'non_structurel' },
    ]
  },
  {
    key: 'infectieux',
    text: "Q2. Avez-vous remarqué un problème de type infectieux ou pathologique ?",
    icon: "🦠",
    options: [
      { label: "Mycose", value: 'mycose' },
      { label: "Bactérienne", value: 'bacterie' },
      { label: "Incarnés", value: 'incarnes' },
      { label: "Décollement", value: 'decollement' },
      { label: "Psoriasis", value: 'psoriasis' },
      { label: "Ligne de Beau", value: 'beau' },
      { label: "Non", value: 'non_infectieux' },
    ]
  },
  {
    key: 'esthetique',
    text: "Q3. Vos ongles présentent-ils un souci esthétique ?",
    icon: "🎨",
    options: [
      { label: "Jaunis", value: 'jaunis' },
      { label: "Taches blanches", value: 'blanches' },
      { label: "Coloration", value: 'taches' },
      { label: "Courts / rongés", value: 'ronges' },
      { label: "Déformés", value: 'deformes' },
      { label: "Non", value: 'non_esthetique' },
    ]
  },
  {
    key: 'habitudes',
    text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
    icon: "☠️",
    options: [
      { label: "Rongement", value: 'rongement' },
      { label: "Grattage", value: 'grattage' },
      { label: "Contact eau/détergents", value: 'eau' },
      { label: "Acétone", value: 'acetone' },
      { label: "Faux ongles", value: 'faux_ongles' },
      { label: "Non", value: 'non_habitudes' },
    ]
  },
  {
    key: 'autres',
    text: "Q5. Avez-vous remarqué des signes inhabituels liés à votre santé ?",
    icon: "⚠️",
    options: [
      { label: "Bleutés", value: 'bleutes' },
      { label: "Pâles", value: 'pales' },
      { label: "Stries noires", value: 'stries_noires' },
      { label: "Non", value: 'non_autres' },
    ]
  }
];

export default questions;
