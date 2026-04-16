import { createFileRoute, Link } from '@tanstack/react-router'
import { Radio, Smartphone, Globe, Trophy, ChevronRight, Ticket } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 100px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(200,137,10,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          {/* ON AIR badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              borderRadius: '20px',
              padding: '6px 16px',
              marginBottom: '32px',
            }}
          >
            <span
              className="on-air-dot"
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'block' }}
            />
            <span
              className="font-condensed"
              style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', color: '#f87171', textTransform: 'uppercase' }}
            >
              Live Raffle Running
            </span>
          </div>

          <h1
            className="font-display animate-float-up"
            style={{ fontSize: 'clamp(56px, 10vw, 110px)', lineHeight: 0.9, marginBottom: '24px', color: 'var(--text-primary)' }}
          >
            GHANA'S{' '}
            <span className="text-gold-gradient">#1</span>
            <br />
            RADIO RAFFLE
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-muted)',
              maxWidth: '520px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            Enter the live radio draw for just{' '}
            <strong style={{ color: 'var(--gold-light)' }}>GHS 10</strong>. Play as many
            times as you want — via web or USSD from any phone. Winners announced live on air!
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/play" style={{ textDecoration: 'none' }}>
              <button
                className="btn-gold animate-glow-pulse"
                style={{ padding: '16px 40px', fontSize: '17px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Ticket size={20} />
                Enter Now — GHS 10
              </button>
            </Link>
            <a href="#how-to-play" style={{ textDecoration: 'none' }}>
              <button
                className="btn-outline"
                style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '10px' }}
              >
                How It Works
              </button>
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '56px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
              maxWidth: '480px',
              margin: '56px auto 0',
            }}
          >
            {[
              { label: 'Entry Fee', value: 'GHS 10' },
              { label: 'Play Methods', value: '2 Ways' },
              { label: 'Entries', value: 'Unlimited' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  padding: '18px 12px',
                  textAlign: 'center',
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="font-display text-gold" style={{ fontSize: '26px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 0',
        }}
      >
        <div className="ticker-wrap">
          <div className="ticker-content font-condensed" style={{ fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {Array(6).fill(null).map((_, i) => (
              <span key={i} style={{ marginRight: '60px' }}>
                <span style={{ color: 'var(--gold-light)' }}>RADIO RAFFLE GH</span>
                {' '}·{' '}Dial <strong style={{ color: 'var(--text-primary)' }}>*713*1#</strong> to enter via USSD
                {' '}·{' '}Entry fee: <strong style={{ color: 'var(--gold-light)' }}>GHS 10</strong>
                {' '}·{' '}Win big — play from any network{' '}·{' '}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How To Play */}
      <section id="how-to-play" style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p className="font-condensed" style={{ color: 'var(--gold-light)', letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '13px', marginBottom: '12px' }}>
            Two ways to play
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 60px)', margin: 0 }}>
            HOW TO ENTER
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Web Card */}
          <div className="card-gold" style={{ padding: '36px 32px' }}>
            <div
              style={{
                width: '52px', height: '52px',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <Globe size={26} color="#0a0800" strokeWidth={2} />
            </div>
            <h3 className="font-display" style={{ fontSize: '30px', marginBottom: '16px', color: 'var(--text-primary)' }}>
              VIA WEB
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Visit this site on any device',
                'Click "Enter Now" button',
                'Fill in your name & phone number',
                'Pay GHS 10 securely online',
                'Get your ticket number instantly',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span
                    className="font-condensed"
                    style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'rgba(200,137,10,0.2)', border: '1px solid var(--border-gold)',
                      color: 'var(--gold-light)', fontSize: '12px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
            <Link to="/play" style={{ textDecoration: 'none', display: 'block', marginTop: '28px' }}>
              <button className="btn-gold" style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Enter via Web <ChevronRight size={16} />
              </button>
            </Link>
          </div>

          {/* USSD Card */}
          <div className="card" style={{ padding: '36px 32px' }}>
            <div
              style={{
                width: '52px', height: '52px',
                background: 'rgba(22, 163, 74, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <Smartphone size={26} color="var(--green-light)" strokeWidth={2} />
            </div>
            <h3 className="font-display" style={{ fontSize: '30px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              VIA USSD
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              No internet needed. Works on any mobile phone on any network.
            </p>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Dial this code
              </p>
              <p className="font-display" style={{ fontSize: '42px', color: 'var(--green-light)', letterSpacing: '0.06em', margin: 0 }}>
                *713*1#
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Available on all Ghanaian networks
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Dial *713*1# from your phone',
                'Select "1" to Enter Raffle',
                'Enter your name',
                'Confirm — GHS 10 charged to mobile money',
                'Receive your ticket number by SMS',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span
                    className="font-condensed"
                    style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                      color: 'var(--green-light)', fontSize: '12px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Play */}
      <section style={{ padding: '60px 24px 80px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', textAlign: 'center', marginBottom: '48px' }}>
            WHY RADIO RAFFLE GH?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🎵', title: 'Live on Air', desc: 'Winners announced live on our partner radio stations.' },
              { icon: '🔒', title: 'Secure & Fair', desc: 'Transparent random draws. Every ticket has equal chance.' },
              { icon: '📱', title: 'Any Phone', desc: 'Play from a smartphone, feature phone, or the web.' },
              { icon: '♾️', title: 'No Limits', desc: 'Enter as many times as you want. More tickets, more chances.' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h4 className="font-condensed" style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <div className="radio-wave-ring" style={{ width: '80px', height: '80px', top: 0, left: 0 }} />
              <div className="radio-wave-ring" style={{ width: '80px', height: '80px', top: 0, left: 0 }} />
              <div className="radio-wave-ring" style={{ width: '80px', height: '80px', top: 0, left: 0 }} />
              <div
                style={{
                  position: 'absolute', inset: '15px',
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Radio size={22} color="#0a0800" />
              </div>
            </div>
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(36px, 7vw, 64px)', marginBottom: '16px' }}>
            READY TO WIN?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '32px' }}>
            Join thousands of players across Ghana. One ticket could change everything.
          </p>
          <Link to="/play" style={{ textDecoration: 'none' }}>
            <button
              className="btn-gold animate-glow-pulse"
              style={{ padding: '18px 48px', fontSize: '18px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
              <Trophy size={20} />
              Enter the Draw — GHS 10
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '28px 24px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '13px',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <span className="font-condensed" style={{ letterSpacing: '0.08em' }}>RADIO RAFFLE GH</span>
          {' · '}
          <a href="/admin" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Admin</a>
        </div>
        <div>&copy; {new Date().getFullYear()} Radio Raffle GH. All rights reserved. Play responsibly.</div>
      </footer>
    </div>
  )
}
