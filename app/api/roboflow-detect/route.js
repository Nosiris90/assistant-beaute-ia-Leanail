// app/api/roboflow-detect/route.js
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file"); // Récupère l'image

  if (!file) {
    return new Response(JSON.stringify({ error: "Aucune image fournie" }), { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer]);

  const roboflowAPIKey = process.env.ROBOFLOW_API_KEY;
  const roboflowModelURL = 'https://detect.roboflow.com/ton-modele-roboflow/1?api_key=' + roboflowAPIKey;

  try {
    const response = await fetch(roboflowModelURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: blob
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Erreur API Roboflow:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
