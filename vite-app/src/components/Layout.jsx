import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
  { id: 'staffs', label: 'Staffs', icon: '👥', href: '/staffs' },
  { id: 'cupons', label: 'Cupons', icon: '🎫', href: '/cupons' },
  { id: 'logs', label: 'Logs', icon: '📋', href: '/logs' },
  { id: 'avisos', label: 'Avisos', icon: '📢', href: '/avisos' },
]

export default function Layout({ children, page }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [online, setOnline] = useState(0)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('grp_session')
    if (!s) { navigate('/login'); return }
    setSession(JSON.parse(s))
    const u = localStorage.getItem('grp_user'); if (u) setUser(JSON.parse(u))
    fetch(`${API_BASE}/api/staffs`).then(r => r.json()).then((d) => setOnline((d || []).filter(s => s.online).length)).catch(() => {})
    const chk = () => setMobile(window.innerWidth < 900)
    chk(); window.addEventListener('resize', chk); return () => window.removeEventListener('resize', chk)
  }, [navigate])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: session?.userId }) })
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: session?.userId }) })
    localStorage.removeItem('grp_session'); localStorage.removeItem('grp_user'); sessionStorage.removeItem('grp_session')
    navigate('/login')
  }

  const isAdmin = session?.perm === 'admin'
  const navItems = isAdmin ? NAV : NAV.filter(n => n.id !== 'logs')

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080c10' }}>
      {open && mobile && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />}
      <aside style={{ width: 260, minWidth: 260, background: '#0d1218', borderRight: '1px solid #1e2d3d', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto', position: mobile ? 'fixed' : 'relative', zIndex: 100, transform: mobile && !open ? 'translateX(-100%)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid #1e2d3d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#00e676,#00c853)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: '#080c10', flexShrink: 0 }}>G</div>
            <div><div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700, color: '#f0f4f8' }}>Green RP</div><div style={{ fontSize: 11, color: '#6b7f93' }}>Staff Panel</div></div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#6b7f93', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '8px 12px 4px', marginBottom: 4 }}>Menu</div>
          {navItems.map(n => (
            <div key={n.id} onClick={() => { navigate(n.href); setOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, color: page === n.id ? '#00e676' : '#a8b8c8', background: page === n.id ? 'rgba(0,230,118,0.12)' : 'transparent', cursor: 'pointer', marginBottom: 2, fontSize: 14, transition: 'all 0.18s', borderLeft: page === n.id ? '3px solid #00e676' : '3px solid transparent' }}>
              <span>{n.icon}</span>{n.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1e2d3d', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#00e676', flexShrink: 0 }}>{user?.nome?.charAt(0) || '?'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.nome || '—'}</div>
            <div style={{ fontSize: 11, color: '#6b7f93' }}>{user?.cargo || '—'}</div>
          </div>
          <button onClick={logout} title="Sair" style={{ background: 'none', border: 'none', color: '#6b7f93', cursor: 'pointer', fontSize: 18, padding: 4 }} onMouseEnter={e => (e.currentTarget.style.color = '#ff4757')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7f93')}>→</button>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 60, background: '#0d1218', borderBottom: '1px solid #1e2d3d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#a8b8c8', fontSize: 20, cursor: 'pointer', padding: 6, borderRadius: 8 }}>☰</button>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700, color: '#f0f4f8' }}>{NAV.find(n => n.id === page)?.label || page}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 99, padding: '5px 12px', fontSize: 12, fontWeight: 500, color: '#00e676' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', display: 'inline-block' }}></span>{online} online
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}
