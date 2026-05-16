import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog } from '@/lib/db-supabase'

export async function POST(req: NextRequest) {
  try {
    const { atorNome } = await req.json()

    const { error: deleteError } = await supabaseAdmin.from('cupons').delete().neq('id', 0)

    if (deleteError) throw deleteError

    const { error: updateError } = await supabaseAdmin
      .from('staffs')
      .update({ usos: 0, valorGerado: 0, comissaoTotal: 0, updated_at: new Date().toISOString() })
      .neq('id', 0)

    if (updateError) throw updateError

    await addLog('reset', 'RefreshCw', 'red', `<strong>${atorNome}</strong> resetou todos os valores de cupons do mês`)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
