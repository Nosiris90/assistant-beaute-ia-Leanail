// /app/questions.js

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
      { label: "Striés verticalement", value: 'stries' },
      { label: "Ongles fins / qui poussent lentement", value: 'fins' },
      { label: "Non", value: 'non_structurel' },
    ]
  },
  {
    key: 'infectieux',
    text: "Q2. Avez-vous remarqué un problème de type infectieux ou pathologique ?",
    icon: "🦠",
    options: [
      { label: "Mycose / champignons", value: 'mycose' },
      { label: "Ongles verdâtres (infection bactérienne)", value: 'bacterie' },
      { label: "Ongles incarnés", value: 'incarnes' },
      { label: "Décollement de l’ongle", value: 'decollement' },
      { label: "Psoriasis unguéal ou eczéma", value: 'psoriasis' },
      { label: "Ligne de Beau", value: 'beau' },
      { label: "Non", value: 'non_infectieux' },
    ]
  },
  {
    key: 'esthetique',
    text: "Q3. Vos ongles présentent-ils un souci esthétique ?",
    icon: "🎨",
    options: [
      { label: "Jaunis / ternes", value: 'jaunis' },
      { label: "Taches blanches", value: 'blanches' },
      { label: "Coloration inégale", value: 'taches' },
      { label: "Ongles courts / rongés", value: 'ronges' },
      { label: "Déformés (cuillère, bombés…)", value: 'deformes' },
      { label: "Non", value: 'non_esthetique' },
    ]
  },
  {
    key: 'habitudes',
    text: "Q4. Vos habitudes ou votre environnement affectent-ils vos ongles ?",
    icon: "☠️",
    options: [
      { label: "Rongement (onychophagie)", value: 'rongement' },
      { label: "Grattage / arrachement cuticules", value: 'grattage' },
      { label: "Contact excessif avec l’eau/détergents", value: 'eau' },
      { label: "Utilisation excessive d’acétone", value: 'acetone' },
      { label: "Poses fréquentes de faux ongles", value: 'faux_ongles' },
      { label: "Non", value: 'non_habitudes' },
    ]
  },
  {
    key: 'autres',
    text: "Q5. Avez-vous remarqué des signes inhabituels ?",
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
