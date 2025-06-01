// 🌸 /app/api/save-sheet/route.js
export async function POST(req) {
  const { userInfo, answers, result } = await req.json()
  const res = await fetch('https://sheetdb.io/api/v1/YOUR_SHEETDB_API', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [{ ...userInfo, ...answers, result }] })
  })
  return new Response(JSON.stringify(await res.json()), { status: 200 })
}
