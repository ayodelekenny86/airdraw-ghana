import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getStore } from '@netlify/blobs'

export const APIRoute = createAPIFileRoute('/api/payment')({
  POST: async ({ request }) => {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, phone, email } = body as {
      name?: string
      phone?: string
      email?: string
    }

    if (!name?.trim() || !phone?.trim()) {
      return Response.json({ error: 'name and phone are required' }, { status: 400 })
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    // Demo mode: no payment key configured
    if (!PAYSTACK_SECRET_KEY) {
      return Response.json({ demoMode: true })
    }

    const reference = `RRG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Store pending entry data keyed by Paystack reference
    const pendingStore = getStore({ name: 'payment-pending', consistency: 'strong' })
    await pendingStore.setJSON(reference, { name: name.trim(), phone: phone.trim(), email: email?.trim() ?? '' })

    const origin = new URL(request.url).origin

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email?.trim() || `${phone.trim().replace(/\D/g, '')}@radioraffle.gh`,
        amount: 1000, // 10 GHS = 1000 pesewas
        currency: 'GHS',
        reference,
        callback_url: `${origin}/api/payment-verify`,
        metadata: {
          name: name.trim(),
          phone: phone.trim(),
          custom_fields: [
            { display_name: 'Player Name', variable_name: 'name', value: name.trim() },
            { display_name: 'Phone Number', variable_name: 'phone', value: phone.trim() },
          ],
        },
      }),
    })

    const data = (await paystackRes.json()) as { status: boolean; data?: { authorization_url: string } }

    if (!data.status || !data.data?.authorization_url) {
      return Response.json({ error: 'Payment initialization failed. Please try again.' }, { status: 502 })
    }

    return Response.json({ authorizationUrl: data.data.authorization_url, reference })
  },
})
