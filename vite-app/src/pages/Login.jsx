import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handle() {
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      if (!res.ok) { const e = await res.json(); setError(e.error || 'Erro'); return }
      const { staff } = await res.json()
      const session = { userId: staff.id, exp: Date.now() + 1000 * 60 * 60 * 8, perm: staff.perm, nome: staff.nome }
      localStorage.setItem('grp_session', JSON.stringify(session))
      localStorage.setItem('grp_user', JSON.stringify(staff))
      navigate('/dashboard')
    } catch (e) { setError('Falha de conexão') }
  }

  return (
    <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'#080c10'}}>
      <div style={{width:420,background:'#111820',padding:28,borderRadius:12}}>
        <h2 style={{color:'#f0f4f8',marginBottom:12}}>Entrar</h2>
        {error && <div style={{color:'#ff4757',marginBottom:8}}>{error}</div>}
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Usuário" style={{width:'100%',padding:10,marginBottom:8}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" type="password" style={{width:'100%',padding:10,marginBottom:12}}/>
        <button onClick={handle} style={{width:'100%',padding:12,background:'#00e676',borderRadius:8}}>Entrar</button>
      </div>
    </div>
  )
}
