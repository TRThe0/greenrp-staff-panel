import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE } from '../lib/api'

export default function Dashboard() {
  const [staffs, setStaffs] = useState([])
  const [cupons, setCupons] = useState([])
  const [avisos, setAvisos] = useState([])

  useEffect(()=>{load()},[])
  async function load(){
    const [s,c,a] = await Promise.all([
      fetch(`${API_BASE}/api/staffs`).then(r=>r.json()),
      fetch(`${API_BASE}/api/cupons`).then(r=>r.json()),
      fetch(`${API_BASE}/api/avisos`).then(r=>r.json())
    ])
    setStaffs(s||[])
    setCupons(c?.history||[])
    setAvisos(a||[])
  }

  return (
    <Layout page="dashboard">
      <div style={{color:'#f0f4f8'}}>Dashboard
        <div>Staffs: {staffs.length}</div>
        <div>Cupons: {cupons.length}</div>
        <div>Avisos: {avisos.length}</div>
      </div>
    </Layout>
  )
}
