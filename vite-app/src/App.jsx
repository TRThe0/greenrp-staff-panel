import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Staffs from './pages/Staffs'
import Cupons from './pages/Cupons'
import Avisos from './pages/Avisos'
import Logs from './pages/Logs'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/staffs" element={<Staffs/>} />
      <Route path="/cupons" element={<Cupons/>} />
      <Route path="/avisos" element={<Avisos/>} />
      <Route path="/logs" element={<Logs/>} />
      <Route path="/" element={<Login/>} />
    </Routes>
  )
}
