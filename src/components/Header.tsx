import { Link } from '@tanstack/react-router'
import { Radio } from 'lucide-react'

export function Header() {
  return (
    <header
      style={{
        background: 'rgba(8, 6, 19, 0.92)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio size={18} color="#0a0800" strokeWidth={2.5} />
          </div>
          <span className="font-display" style={{ fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
            RADIO <span style={{ color: 'var(--gold-light)' }}>RAFFLE</span>{' '}
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>GH</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'color 0.2s',
            }}
          >
            Home
          </Link>
          <Link
            to="/play"
            style={{
              color: '#0a0800',
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
              textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '7px 18px',
              borderRadius: '6px',
            }}
          >
            Play Now
          </Link>
        </nav>
      </div>
    </header>
  )
}
