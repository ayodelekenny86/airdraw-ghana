import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getStore } from '@netlify/blobs'

interface Entry {
  id: string
  ticketNumber: number
  name: string
  phone: string
  method: string
  status: string
  enteredAt: string
  paymentRef?: string | null
}

export const APIRoute = createAPIFileRoute('/api/draw-winner')({
  POST: async ({ request }) => {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { adminKey } = body as { adminKey?: string }
    const requiredKey = process.env.ADMIN_KEY

    if (requiredKey && adminKey !== requiredKey) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const store = getStore('raffle-entries')
      const { blobs } = await store.list({ prefix: 'entry/' })

      const allEntries = (
        await Promise.all(blobs.map((blob) => store.get(blob.key, { type: 'json' })))
      ).filter(Boolean) as Entry[]

      const confirmed = allEntries.filter((e) => e.status === 'confirmed')

      if (confirmed.length === 0) {
        return Response.json({ error: 'No confirmed entries to draw from' }, { status: 400 })
      }

      const winner = confirmed[Math.floor(Math.random() * confirmed.length)]
      const drawnAt = new Date().toISOString()

      // Record draw in history
      const drawStore = getStore('raffle-draws')
      await drawStore.setJSON(`draw/${Date.now()}`, {
        winner,
        drawnAt,
        totalEntries: confirmed.length,
      })

      return Response.json({
        winner,
        drawnAt,
        totalEntries: confirmed.length,
      })
    } catch (err) {
      console.error('Draw winner failed:', err)
      return Response.json({ error: 'Draw failed. Please try again.' }, { status: 500 })
    }
  },
})
