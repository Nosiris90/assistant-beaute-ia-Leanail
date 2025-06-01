import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "Aucune image fournie." }, { status: 400 });
    }

    // Cloudinary Upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const cloudinaryForm = new FormData();
    cloudinaryForm.append('file', new Blob([buffer]));
    cloudinaryForm.append('upload_preset', uploadPreset);

    const cloudRes = await fetch(cloudinaryUrl, { method: 'POST', body: cloudinaryForm });
    const cloudData = await cloudRes.json();

    if (!cloudData.secure_url) {
      return NextResponse.json({ error: "Échec de l'upload Cloudinary." }, { status: 500 });
    }

    // Roboflow Inference
    const roboflowApiKey = process.env.ROBOFLOW_API_KEY;
    const roboflowWorkflowUrl = `https://detect.roboflow.com/leanail-diagnostic-ongles/2?api_key=${roboflowApiKey}`;

    const roboflowRes = await fetch(roboflowWorkflowUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: cloudData.secure_url })
    });

    const roboflowResult = await roboflowRes.json();
    if (!roboflowRes.ok) {
      return NextResponse.json({ error: "Erreur Roboflow.", detail: roboflowResult }, { status: 500 });
    }

    return NextResponse.json({ predictions: roboflowResult.predictions || roboflowResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'analyse Roboflow.", message: error.message }, { status: 500 });
  }
}
