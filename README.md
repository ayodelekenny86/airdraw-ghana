# Radio Raffle GH

An online radio raffle platform where players can enter a live draw for **GHS 10 per ticket**, via the web or USSD from any mobile phone. There is no limit on how many times a player can enter — more tickets mean more chances to win.

## Features

- **Web Play** — Enter the draw online with name, phone, and secure payment via Paystack (GHS 10).
- **USSD Play** — Dial `*713*1#` from any Ghanaian mobile network to enter without internet. Payment via mobile money.
- **Unlimited Entries** — Players can enter as many times as they like.
- **Admin Dashboard** — Password-protected panel to view all entries, see stats, and draw a random winner.
- **Persistent Storage** — All entries stored in Netlify Blobs (no external database required).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (React 19 + TanStack Router v1) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS variables |
| Storage | Netlify Blobs |
| Payment | Paystack (GHS) |
| USSD Gateway | Africa's Talking (compatible format) |
| Deployment | Netlify |
| Language | TypeScript 5.7 (strict mode) |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PAYSTACK_SECRET_KEY` | Optional | Paystack secret key for live payments. If absent, runs in **demo mode** (no payment required). |
| `PAYSTACK_PUBLIC_KEY` | Optional | Paystack public key (for frontend if needed). |
| `ADMIN_KEY` | Optional | Password to access `/admin`. If absent, any value is accepted (demo mode). |

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/play` | Web entry form |
| `/admin` | Admin dashboard (draw winner, view entries) |
| `POST /api/ussd` | USSD handler (Africa's Talking format) |
| `POST /api/payment` | Initialize Paystack payment |
| `GET /api/payment-verify` | Paystack callback — verifies payment & confirms entry |
| `GET /api/entries` | List all entries (admin key required) |
| `POST /api/entries` | Create entry directly (demo mode / internal) |
| `POST /api/draw-winner` | Draw random winner (admin key required) |

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts on [http://localhost:3000](http://localhost:3000).

For Netlify features (Blobs, etc.) locally, use the Netlify CLI:

```bash
netlify dev
```

This starts at [http://localhost:8888](http://localhost:8888) with full Netlify emulation.

## USSD Integration

The `/api/ussd` endpoint is compatible with **Africa's Talking** USSD gateway. Configure your Africa's Talking USSD service code to POST to `https://your-site.netlify.app/api/ussd` with the standard fields: `sessionId`, `serviceCode`, `phoneNumber`, `text`.

The sample USSD code shown in the UI is `*713*1#` — replace this with your registered short code.

## Payment Integration

Set `PAYSTACK_SECRET_KEY` in Netlify environment variables to enable live Paystack payments. Without this key, the app runs in **demo mode** where payments are bypassed and entries are created immediately for testing.

To configure on Netlify: **Site settings → Environment variables → Add variable**.
