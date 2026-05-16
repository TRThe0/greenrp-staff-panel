import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog } from '@/lib/db-supabase'
import { checkPass } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const { data: staff, error } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .ilike('username', username)
      .single()

    if (error || !staff || !checkPass(password, staff.senha))
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })

    // Update online status and last access
    await supabaseAdmin
      .from('staffs')
      .update({
        online: true,
        ultimoAcesso: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', staff.id)

    await addLog('login', 'LogIn', 'blue', `<strong>${staff.nome}</strong> entrou no painel`)

    const { senha: _, ...safe } = staff
    return NextResponse.json({ staff: safe })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

