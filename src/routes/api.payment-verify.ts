import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getStore } from '@netlify/blobs'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export const APIRoute = createAPIFileRoute('/api/payment-verify')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const reference = url.searchParams.get('reference') || url.searchParams.get('trxref')

    if (!reference) {
      return Response.redirect(`${url.origin}/play?error=no-reference`)
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET_KEY) {
      return Response.redirect(`${url.origin}/play?error=payment-failed`)
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const verifyData = (await verifyRes.json()) as {
      status: boolean
      data?: { status: string; metadata?: { name?: string; phone?: string } }
    }

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return Response.redirect(`${url.origin}/play?error=payment-failed`)
    }

    // Retrieve pending entry data
    const pendingStore = getStore({ name: 'payment-pending', consistency: 'strong' })
    const pending = (await pendingStore.get(reference, { type: 'json' })) as Record<string, string> | null

    if (!pending) {
      return Response.redirect(`${url.origin}/play?error=entry-not-found`)
    }

    // Create confirmed entry
    const entriesStore = getStore({ name: 'raffle-entries', consistency: 'strong' })
    const counter = (await entriesStore.get('counter', { type: 'json' })) as number | null
    const ticketNumber = (counter ?? 0) + 1
    await entriesStore.setJSON('counter', ticketNumber)

    const id = generateId()
    await entriesStore.setJSON(`entry/${id}`, {
      id,
      ticketNumber,
      name: pending.name,
      phone: pending.phone,
      method: 'web',
      status: 'confirmed',
      enteredAt: new Date().toISOString(),
      paymentRef: reference,
    })

    // Clean up pending record
    await pendingStore.delete(reference)

    return Response.redirect(`${url.origin}/play?success=1&ticket=${ticketNumber}`)
  },
})
