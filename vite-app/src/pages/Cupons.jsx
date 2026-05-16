import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE } from '../lib/api'

export default function Cupons() {
  const [history, setHistory] = useState([])
  useEffect(()=>{fetch(`${API_BASE}/api/cupons`).then(r=>r.json()).then(d=>setHistory(d.history||[])).catch(()=>{})},[])
  const webhookUrl = `${API_BASE.replace(/\/api\/?$/, '')}/api/cupons/webhook`
  return (
    <Layout page="cupons">
      <div style={{color:'#f0f4f8'}}>
        <h3>Cupons</h3>
        <div>Webhook: <code style={{color:'#00e676'}}>{webhookUrl}</code></div>
        <ul>{history.map((h,i)=>(<li key={i}>{h.cupom} — {h.usadoPor} — R$ {h.valor}</li>))}</ul>
      </div>
    </Layout>
  )
}
