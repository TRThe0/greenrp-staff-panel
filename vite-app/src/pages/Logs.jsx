import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE } from '../lib/api'

export default function Logs() {
  const [logs, setLogs] = useState([])
  useEffect(()=>{fetch(`${API_BASE}/api/logs`).then(r=>r.json()).then(d=>setLogs(d||[])).catch(()=>{})},[])
  async function clear(){ if(!confirm('Limpar logs?')) return; await fetch(`${API_BASE}/api/logs`,{method:'DELETE'}); setLogs([]) }
  return (
    <Layout page="logs">
      <div style={{color:'#f0f4f8'}}>
        <h3>Logs</h3>
        <button onClick={clear}>Limpar</button>
        <ul>{logs.map((l,i)=>(<li key={i} dangerouslySetInnerHTML={{__html: l.msg}}/>))}</ul>
      </div>
    </Layout>
  )
}
