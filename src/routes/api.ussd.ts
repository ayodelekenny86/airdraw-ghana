import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getStore } from '@netlify/blobs'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

async function getNextTicketNumber(): Promise<number> {
  const store = getStore({ name: 'raffle-entries', consistency: 'strong' })
  const counter = (await store.get('counter', { type: 'json' })) as number | null
  const next = (counter ?? 0) + 1
  await store.setJSON('counter', next)
  return next
}

async function createEntry(name: string, phone: string): Promise<{ id: string; ticketNumber: number }> {
  const store = getStore({ name: 'raffle-entries', consistency: 'strong' })
  const ticketNumber = await getNextTicketNumber()
  const id = generateId()
  await store.setJSON(`entry/${id}`, {
    id,
    ticketNumber,
    name,
    phone,
    method: 'ussd',
    status: 'confirmed',
    enteredAt: new Date().toISOString(),
  })
  return { id, ticketNumber }
}

async function getEntryCountForPhone(phone: string): Promise<number> {
  const store = getStore('raffle-entries')
  const { blobs } = await store.list({ prefix: 'entry/' })
  let count = 0
  for (const blob of blobs) {
    const entry = (await store.get(blob.key, { type: 'json' })) as Record<string, unknown> | null
    if (entry?.phone === phone && entry?.status === 'confirmed') {
      count++
    }
  }
  return count
}

export const APIRoute = createAPIFileRoute('/api/ussd')({
  POST: async ({ request }) => {
    const contentType = request.headers.get('content-type') || ''
    let text = ''
    let phoneNumber = ''

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as Record<string, string>
      text = body.text ?? ''
      phoneNumber = body.phoneNumber ?? ''
    } else {
      const formData = await request.formData()
      text = (formData.get('text') as string) ?? ''
      phoneNumber = (formData.get('phoneNumber') as string) ?? ''
    }

    // Split accumulated USSD inputs
    const parts = text.split('*').filter((p) => p !== '')
    let response: string

    if (parts.length === 0) {
      response = `CON Welcome to Radio Raffle GH!
Ghana's #1 Radio Draw
Entry fee: GHS 10

1. Enter Raffle
2. My Tickets
0. Exit`
    } else if (parts[0] === '1' && parts.length === 1) {
      response = `CON Enter your full name:`
    } else if (parts[0] === '1' && parts.length === 2) {
      const name = parts[1]
      response = `CON Hi ${name}!

GHS 10 will be charged to
your mobile money (${phoneNumber}).

1. Yes - Confirm Entry
2. No - Cancel`
    } else if (parts[0] === '1' && parts.length >= 3) {
      if (parts[2] === '1') {
        const name = parts[1]
        try {
          const { ticketNumber } = await createEntry(name, phoneNumber)
          response = `END You're in the draw!

Ticket #${ticketNumber}
Name: ${name}
GHS 10 charged to ${phoneNumber}

Tune in to Radio Raffle GH
for the live draw. Good luck!`
        } catch {
          response = `END Sorry, an error occurred.
Please try again by dialing *713*1#`
        }
      } else {
        response = `END Entry cancelled.
No charge made.

Dial *713*1# to try again.`
      }
    } else if (parts[0] === '2') {
      try {
        const count = await getEntryCountForPhone(phoneNumber)
        if (count === 0) {
          response = `END You have no tickets yet.
Dial *713*1# to enter!
Entry fee: GHS 10 per ticket.`
        } else {
          response = `END Your tickets: ${count} entr${count === 1 ? 'y' : 'ies'}

Tune in to Radio Raffle GH
for the live draw!
Good luck!`
        }
      } catch {
        response = `END Unable to check tickets.
Please try again later.`
      }
    } else if (parts[0] === '0') {
      response = `END Thank you for using Radio Raffle GH!
Dial *713*1# to play anytime.`
    } else {
      response = `CON Invalid option.

1. Enter Raffle
2. My Tickets
0. Exit`
    }

    return new Response(response, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  },
})
