// ==============================
// ✅ /app/api/roboflow-detect/route.js
// ==============================

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { imageUrl } = await req.json()

    const response = await fetch(
      `https://serverless.roboflow.com/infer/workflows/${process.env.ROBOFLOW_WORKSPACE}/${process.env.ROBOFLOW_WORKFLOW_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: process.env.ROBOFLOW_API_KEY,
          inputs: {
            image: { type: 'url', value: imageUrl },
          },
        }),
      }
    )

    const data = await response.json()

    if (data.error) throw new Error(data.error)

    return NextResponse.json({ result: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
