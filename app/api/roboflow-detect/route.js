import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) {
      return new Response(JSON.stringify({ error: 'Aucune image reçue.' }), { status: 400 })
    }

    // Conversion en buffer
    const buffer = await file.arrayBuffer()
    const blob = new Blob([buffer])

    // Upload vers Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'leanail_uploads' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(Buffer.from(buffer))
    })

    const imageUrl = uploadResult.secure_url

    // Appel API Roboflow
    const roboflowUrl = `https://detect.roboflow.com/leanail-diagnostic-ongles/2?api_key=${process.env.ROBOFLOW_API_KEY}`
    const response = await fetch(roboflowUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageUrl })
    })
    const roboflowResult = await response.json()

    return new Response(JSON.stringify({ cloudinary: imageUrl, roboflow: roboflowResult }), { status: 200 })
  } catch (error) {
    console.error('Erreur Roboflow:', error)
    return new Response(JSON.stringify({ error: error.message || 'Erreur inconnue' }), { status: 500 })
  }
}
