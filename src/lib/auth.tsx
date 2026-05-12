'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DB, Staff, checkPass, addLog, seedIfNeeded } from './db'

interface AuthCtx {
  user: Staff | null
  login: (username: string, password: string, remember: boolean) => boolean
  logout: () => void
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => false, logout: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Staff | null>(null)

  useEffect(() => {
    seedIfNeeded()
    const raw = localStorage.getItem('grp_session') || sessionStorage.getItem('grp_session')
    if (raw) {
      try {
        const { userId, exp } = JSON.parse(raw)
        if (exp > Date.now()) {
          const staffs: Staff[] = DB.get('staffs', [])
          const found = staffs.find(s => s.id === userId)
          if (found) setUser(found)
        }
      } catch { }
    }
  }, [])

  function login(username: string, password: string, remember: boolean): boolean {
    const staffs: Staff[] = DB.get('staffs', [])
    const found = staffs.find(s => s.username.toLowerCase() === username.toLowerCase())
    if (!found || !checkPass(password, found.senha)) return false

    const session = { userId: found.id, exp: Date.now() + 3600000 * 8 }
    if (remember) localStorage.setItem('grp_session', JSON.stringify(session))
    else sessionStorage.setItem('grp_session', JSON.stringify(session))

    const idx = staffs.findIndex(s => s.id === found.id)
    staffs[idx].online = true
    staffs[idx].ultimoAcesso = new Date().toISOString()
    DB.set('staffs', staffs)
    addLog('login', 'login', 'blue', `<strong>${found.nome}</strong> entrou no painel`)
    setUser({ ...found, online: true })
    return true
  }

  function logout() {
    if (user) {
      const staffs: Staff[] = DB.get('staffs', [])
      const idx = staffs.findIndex(s => s.id === user.id)
      if (idx > -1) { staffs[idx].online = false; DB.set('staffs', staffs) }
      addLog('login', 'log-out', 'red', `<strong>${user.nome}</strong> saiu do painel`)
    }
    localStorage.removeItem('grp_session')
    sessionStorage.removeItem('grp_session')
    setUser(null)
    window.location.href = '/login'
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
