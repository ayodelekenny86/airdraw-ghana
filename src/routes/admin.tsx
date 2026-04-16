import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Trophy, Ticket, Users, RefreshCw, Loader, Lock, ChevronDown, ChevronUp } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

interface Entry {
  id: string
  ticketNumber: number
  name: string
  phone: string
  method: 'web' | 'ussd'
  status: string
  enteredAt: string
  paymentRef?: string
}

interface DrawResult {
  winner: Entry
  drawnAt: string
  totalEntries: number
}

function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [drawLoading, setDrawLoading] = useState(false)
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null)
  const [drawError, setDrawError] = useState('')
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/entries?adminKey=${encodeURIComponent(adminKey)}`)
      const data = await res.json()
      if (!res.ok) {
        setAuthError(data.error || 'Invalid admin key.')
        return
      }
      setEntries(data.entries || [])
      setAuthenticated(true)
    } catch {
      setAuthError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshEntries() {
    setLoading(true)
    try {
      const res = await fetch(`/api/entries?adminKey=${encodeURIComponent(adminKey)}`)
      const data = await res.json()
      if (res.ok) setEntries(data.entries || [])
    } finally {
      setLoading(false)
    }
  }

  async function drawWinner() {
    if (!confirm('Draw a winner from all confirmed entries? This cannot be undone.')) return
    setDrawError('')
    setDrawLoading(true)
    try {
      const res = await fetch('/api/draw-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDrawError(data.error || 'Failed to draw winner.')
        return
      }
      setDrawResult(data)
    } catch {
      setDrawError('Network error. Please try again.')
    } finally {
      setDrawLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="card" style={{ maxWidth: '380px', width: '100%', padding: '40px 36px' }}>
          <div
            style={{
              width: '52px', height: '52px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <Lock size={24} color="var(--text-muted)" />
          </div>
          <h1 className="font-display" style={{ fontSize: '28px', marginBottom: '8px' }}>ADMIN PANEL</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
            Enter your admin key to access the dashboard.
          </p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <input
                className="input-field"
                type="password"
                placeholder="Admin key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>
            {authError && (
              <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{authError}</p>
            )}
            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {loading ? <Loader size={16} className="animate-spin-slow" /> : <Lock size={16} />}
              Access Dashboard
            </button>
          </form>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '16px', textAlign: 'center' }}>
            Set ADMIN_KEY environment variable to secure this page.
            <br />If not set, any key will work (demo mode).
          </p>
        </div>
      </div>
    )
  }

  const totalRevenue = entries.filter((e) => e.status === 'confirmed').length * 10

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '36px', margin: 0 }}>ADMIN DASHBOARD</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0' }}>Radio Raffle GH</p>
          </div>
          <button
            className="btn-outline"
            onClick={refreshEntries}
            disabled={loading}
            style={{ padding: '9px 18px', fontSize: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin-slow' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Entries', value: entries.length, icon: <Ticket size={18} color="var(--gold-light)" /> },
            { label: 'Confirmed', value: entries.filter((e) => e.status === 'confirmed').length, icon: <Users size={18} color="var(--green-light)" /> },
            { label: 'Web Entries', value: entries.filter((e) => e.method === 'web').length, icon: <span style={{ fontSize: '16px' }}>🌐</span> },
            { label: 'USSD Entries', value: entries.filter((e) => e.method === 'ussd').length, icon: <span style={{ fontSize: '16px' }}>📱</span> },
            { label: 'Revenue (GHS)', value: totalRevenue.toLocaleString(), icon: <span style={{ fontSize: '16px' }}>💰</span> },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>{stat.icon}</div>
              <div className="font-display text-gold" style={{ fontSize: '30px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Draw Winner */}
        <div className="card-gold" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: '24px', margin: '0 0 4px' }}>DRAW A WINNER</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                Randomly selects one confirmed entry as the winner.
              </p>
            </div>
            <button
              className="btn-gold animate-glow-pulse"
              onClick={drawWinner}
              disabled={drawLoading || entries.filter((e) => e.status === 'confirmed').length === 0}
              style={{ padding: '13px 28px', fontSize: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
            >
              {drawLoading ? <Loader size={16} className="animate-spin-slow" /> : <Trophy size={16} />}
              Draw Winner
            </button>
          </div>

          {drawError && (
            <p style={{ color: '#f87171', fontSize: '14px', marginTop: '16px' }}>{drawError}</p>
          )}

          {drawResult && (
            <div
              style={{
                marginTop: '24px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <p className="font-condensed" style={{ color: 'var(--green-light)', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Winner Selected!
              </p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 2px' }}>Name</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{drawResult.winner.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 2px' }}>Ticket #</p>
                  <p className="font-display text-gold-gradient" style={{ fontSize: '24px', margin: 0 }}>#{drawResult.winner.ticketNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 2px' }}>Phone</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{drawResult.winner.phone}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '0 0 2px' }}>From pool of</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{drawResult.totalEntries} entries</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 className="font-condensed" style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              All Entries ({entries.length})
            </h3>
          </div>

          {entries.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Ticket size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>No entries yet.</p>
            </div>
          ) : (
            <div>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                >
                  <div
                    style={{
                      padding: '14px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span className="font-display text-gold" style={{ fontSize: '22px', minWidth: '56px' }}>
                      #{entry.ticketNumber}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '15px', flex: 1, minWidth: '120px' }}>{entry.name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '110px' }}>{entry.phone}</span>
                    <span
                      className="font-condensed"
                      style={{
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '4px',
                        background: entry.method === 'web' ? 'rgba(200,137,10,0.15)' : 'rgba(34,197,94,0.12)',
                        color: entry.method === 'web' ? 'var(--gold-light)' : 'var(--green-light)',
                        border: `1px solid ${entry.method === 'web' ? 'var(--border-gold)' : 'rgba(34,197,94,0.25)'}`,
                      }}
                    >
                      {entry.method}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', minWidth: '100px' }}>
                      {new Date(entry.enteredAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {expandedEntry === entry.id ? <ChevronUp size={14} color="var(--text-dim)" /> : <ChevronDown size={14} color="var(--text-dim)" />}
                  </div>
                  {expandedEntry === entry.id && (
                    <div style={{ padding: '0 24px 16px 96px', fontSize: '13px', color: 'var(--text-dim)' }}>
                      <span>ID: {entry.id}</span>
                      {entry.paymentRef && <span style={{ marginLeft: '16px' }}>Payment Ref: {entry.paymentRef}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
