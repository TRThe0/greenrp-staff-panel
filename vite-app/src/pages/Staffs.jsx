import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE } from '../lib/api'

export default function Staffs() {
  const [staffs, setStaffs] = useState([])
  useEffect(()=>{fetch(`${API_BASE}/api/staffs`).then(r=>r.json()).then(d=>setStaffs(d||[])).catch(()=>{})},[])
  return (
    <Layout page="staffs">
      <div style={{color:'#f0f4f8'}}>
        <h3>Staffs</h3>
        <ul>
          {staffs.map(s=> <li key={s.id}>{s.nome} — {s.cargo} ({s.username})</li>)}
        </ul>
      </div>
    </Layout>
  )
}
