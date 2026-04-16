import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Ticket, CheckCircle, AlertCircle, Loader } from 'lucide-react'

type SearchParams = {
  success?: string
  ticket?: string
  error?: string
}

export const Route = createFileRoute('/play')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    success: search.success as string | undefined,
    ticket: search.ticket as string | undefined,
    error: search.error as string | undefined,
  }),
  component: PlayPage,
})

function PlayPage() {
  const { success, ticket, error } = useSearch({ from: '/play' })
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const errorMessages: Record<string, string> = {
    'payment-failed': 'Payment was not completed. Please try again.',
    'no-reference': 'Payment reference missing. Please try again.',
    'entry-not-found': 'Entry data not found. Please contact support.',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (!name.trim()) return setFormError('Please enter your full name.')
    if (!phone.trim()) return setFormError('Please enter your phone number.')
    if (phone.replace(/\D/g, '').length < 9) return setFormError('Please enter a valid phone number.')

    setLoading(true)
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || 'Something went wrong. Please try again.')
        return
      }

      if (data.demoMode) {
        // No payment configured — create entry directly
        const entryRes = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), phone: phone.trim(), paymentRef: 'DEMO-' + Date.now() }),
        })
        const entryData = await entryRes.json()
        if (entryRes.ok) {
          window.location.href = `/play?success=1&ticket=${entryData.entry.ticketNumber}`
        } else {
          setFormError(entryData.error || 'Failed to create entry.')
        }
        return
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      }
    } catch {
      setFormError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success === '1') {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="card-gold animate-float-up" style={{ maxWidth: '460px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <div
            style={{
              width: '72px', height: '72px',
              background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle size={36} color="var(--green-light)" />
          </div>
          <h2 className="font-display" style={{ fontSize: '40px', color: 'var(--text-primary)', marginBottom: '12px' }}>
            YOU'RE IN!
          </h2>
          {ticket && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '12px',
                padding: '20px',
                margin: '24px 0',
              }}
            >
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Your Ticket Number
              </p>
              <p className="font-display text-gold-gradient" style={{ fontSize: '52px', margin: 0 }}>
                #{ticket}
              </p>
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
            Your entry is confirmed! Tune in to Radio Raffle GH for the live draw announcement. Good luck!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn-gold"
              onClick={() => window.location.href = '/play'}
              style={{ padding: '13px', fontSize: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Ticket size={16} />
              Enter Again
            </button>
            <button
              className="btn-outline"
              onClick={() => window.location.href = '/'}
              style={{ padding: '12px', fontSize: '14px', borderRadius: '8px' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', padding: '60px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '44px', height: '44px',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ticket size={22} color="#0a0800" />
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: '28px', margin: 0 }}>ENTER THE DRAW</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Web entry — GHS 10 per ticket</p>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(200,137,10,0.08)',
              border: '1px solid var(--border-gold)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              color: 'var(--gold-light)',
            }}
          >
            No limits — enter as many times as you want for more chances to win!
          </div>
        </div>

        {/* Error from redirect */}
        {error && (
          <div
            style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '14px', color: '#f87171' }}>
              {errorMessages[error] || 'An error occurred. Please try again.'}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Full Name *
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. Kofi Mensah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Phone Number *
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="e.g. 0244123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
              />
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px' }}>
                Used for winner notification
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Email Address (optional)
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="e.g. kofi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {formError && (
              <div
                style={{
                  background: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <AlertCircle size={16} color="#f87171" />
                <span style={{ fontSize: '13px', color: '#f87171' }}>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ padding: '15px', fontSize: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin-slow" />
                  Processing...
                </>
              ) : (
                <>
                  <Ticket size={18} />
                  Pay GHS 10 & Enter
                </>
              )}
            </button>
          </div>

          <div
            style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'var(--text-dim)',
            }}
          >
            <span>Secure payment via Paystack</span>
            <span>·</span>
            <span>GHS 10 per entry</span>
          </div>
        </form>

        {/* USSD alternative */}
        <div
          className="card"
          style={{ padding: '20px 24px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{ fontSize: '24px' }}>📱</div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              No internet? Dial <span style={{ color: 'var(--green-light)' }}>*713*1#</span>
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Enter via USSD from any phone — GHS 10 via mobile money
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
