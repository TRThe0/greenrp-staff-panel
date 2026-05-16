import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog } from '@/lib/db-supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    const { data: staff, error } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && staff) {
      await supabaseAdmin
        .from('staffs')
        .update({ online: false, updated_at: new Date().toISOString() })
        .eq('id', userId)

      await addLog('login', 'LogOut', 'red', `<strong>${staff.nome}</strong> saiu do painel`)
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
