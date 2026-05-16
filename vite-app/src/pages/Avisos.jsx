import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE } from '../lib/api'

export default function Avisos() {
  const [avisos, setAvisos] = useState([])
  const [form, setForm] = useState({ tipo: 'info', msg: '' })
  useEffect(()=>{fetch(`${API_BASE}/api/avisos`).then(r=>r.json()).then(d=>setAvisos(d||[])).catch(()=>{})},[])
  async function save(){ await fetch(`${API_BASE}/api/avisos`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({tipo:'info',msg:''}); const r=await fetch(`${API_BASE}/api/avisos`); setAvisos(await r.json()) }
  return (
    <Layout page="avisos">
      <div style={{color:'#f0f4f8'}}>
        <h3>Avisos</h3>
        <div>
          <select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}><option value="info">Info</option><option value="warn">Warn</option><option value="danger">Danger</option></select>
          <input value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} placeholder="Mensagem" />
          <button onClick={save}>Publicar</button>
        </div>
        <ul>{avisos.map(a=> <li key={a.id}>{a.msg} — {a.autor}</li>)}</ul>
      </div>
    </Layout>
  )
}
