import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Para operações do servidor que precisam de privilégios
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export type Database = {
  public: {
    Tables: {
      staffs: {
        Row: {
          id: number
          nome: string
          username: string
          senha: string
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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['staffs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['staffs']['Insert']>
      }
      cupons: {
        Row: {
          id: number
          cupom: string
          staff_id: number | null
          staff_nome: string
          usadoPor: string
          valor: number
          data: string
          created_at: string
        }
      }
      avisos: {
        Row: {
          id: number
          tipo: 'info' | 'warning' | 'success' | 'error'
          msg: string
          autor: string
          data: string
          created_at: string
        }
      }
      logs: {
        Row: {
          id: number
          type: string
          icon: string
          color: string
          msg: string
          time: string
          created_at: string
        }
      }
      promovidos: {
        Row: {
          id: number
          staff_id: number | null
          staff_nome: string
          cargo_anterior: string
          cargo_novo: string
          promotor_nome: string
          data: string
          created_at: string
        }
      }
      counters: {
        Row: {
          key: string
          nextId: number
          nextLogId: number
          nextAvisoId: number
          nextCupomId: number
          updated_at: string
        }
      }
    }
  }
}
