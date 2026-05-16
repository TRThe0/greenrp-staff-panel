'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { API_BASE } from '@/lib/api'

export interface Staff {
  id: number
  nome: string
  username: string
  cargo: string
  setor: string[]
  carga: number
  perm: 'admin' | 'staff'
  cupom: string
  pct: number
  online: boolean
  foto: string
  entrada: string
  ultimaPromo: string | null
  ultimoAcesso: string | null
  usos: number
  valorGerado: number
  comissaoTotal: number
  idRp: number | null
}

interface AuthCtx {
  user: Staff | null
  login: (username: string, password: string, remember: boolean) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const Ctx = createContext<AuthCtx>({ user: null, login: async () => false, logout: async () => {}, isLoading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Staff | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore session on mount
    const raw = localStorage.getItem('grp_session') || sessionStorage.getItem('grp_session')
    if (raw) {
      try {
        const { userId, exp } = JSON.parse(raw)
        if (exp > Date.now()) {
          // Fetch user data from API
          fetch(`${API_BASE}/api/staffs`)
            .then((res) => res.json())
            .then((staffs: Staff[]) => {
              const found = staffs.find((s) => s.id === userId)
              if (found) setUser(found)
            })
            .catch((err) => console.error('Error restoring session:', err))
        } else {
          localStorage.removeItem('grp_session')
          sessionStorage.removeItem('grp_session')
        }
      } catch (err) {
        console.error('Error parsing session:', err)
      }
    }
    setIsLoading(false)
  }, [])

  async function login(username: string, password: string, remember: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Login error:', error.error)
        return false
      }

      const { staff } = await response.json()

      const session = { userId: staff.id, exp: Date.now() + 3600000 * 8, perm: staff.perm, nome: staff.nome }
      if (remember) localStorage.setItem('grp_session', JSON.stringify(session))
      else sessionStorage.setItem('grp_session', JSON.stringify(session))

      setUser(staff)
      return true
    } catch (err) {
      console.error('Login error:', err)
      return false
    }
  }

  async function logout() {
    if (user) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })
      } catch (err) {
        console.error('Logout error:', err)
      }
    }
    localStorage.removeItem('grp_session')
    sessionStorage.removeItem('grp_session')
    setUser(null)
    window.location.href = '/login'
  }

  return <Ctx.Provider value={{ user, login, logout, isLoading }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
