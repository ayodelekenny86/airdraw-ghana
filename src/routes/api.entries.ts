import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getStore } from '@netlify/blobs'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export const APIRoute = createAPIFileRoute('/api/entries')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const adminKey = url.searchParams.get('adminKey') ?? ''
    const requiredKey = process.env.ADMIN_KEY

    // If ADMIN_KEY is set, enforce it; otherwise allow any value (demo mode)
    if (requiredKey && adminKey !== requiredKey) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const store = getStore('raffle-entries')
      const { blobs } = await store.list({ prefix: 'entry/' })

      const entries = (
        await Promise.all(blobs.map((blob) => store.get(blob.key, { type: 'json' })))
      ).filter(Boolean)

      const sorted = (entries as Record<string, unknown>[]).sort(
        (a, b) =>
          new Date(b.enteredAt as string).getTime() -
          new Date(a.enteredAt as string).getTime()
      )

      return Response.json({ entries: sorted, total: sorted.length })
    } catch (err) {
      console.error('Failed to list entries:', err)
      return Response.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }
  },

  POST: async ({ request }) => {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, phone, paymentRef } = body as {
      name?: string
      phone?: string
      paymentRef?: string
    }

    if (!name?.trim() || !phone?.trim()) {
      return Response.json({ error: 'name and phone are required' }, { status: 400 })
    }

    try {
      const store = getStore({ name: 'raffle-entries', consistency: 'strong' })
      const counter = (await store.get('counter', { type: 'json' })) as number | null
      const ticketNumber = (counter ?? 0) + 1
      await store.setJSON('counter', ticketNumber)

      const id = generateId()
      const entry = {
        id,
        ticketNumber,
        name: name.trim(),
        phone: phone.trim(),
        method: 'web',
        status: 'confirmed',
        enteredAt: new Date().toISOString(),
        paymentRef: paymentRef ?? null,
      }

      await store.setJSON(`entry/${id}`, entry)
      return Response.json({ entry }, { status: 201 })
    } catch (err) {
      console.error('Failed to create entry:', err)
      return Response.json({ error: 'Failed to create entry' }, { status: 500 })
    }
  },
})
