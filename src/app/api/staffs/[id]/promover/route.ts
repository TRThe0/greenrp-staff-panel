import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog } from '@/lib/db-supabase'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { novoCargo, novoSetor, atorNome } = await req.json()

    const { data: staff, error: staffError } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('id', id)
      .single()

    if (staffError || !staff) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    const antigo = staff.cargo

    const { error: updateError } = await supabaseAdmin
      .from('staffs')
      .update({
        cargo: novoCargo,
        setor: novoSetor,
        ultimaPromo: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) throw updateError

    const { error: insertError } = await supabaseAdmin.from('promovidos').insert({
      staff_id: id,
      staff_nome: staff.nome,
      cargo_anterior: antigo,
      cargo_novo: novoCargo,
      promotor_nome: atorNome,
      data: new Date().toISOString(),
    })

    if (insertError) throw insertError

    await addLog('promo', 'ArrowUp', 'purple', `<strong>${atorNome}</strong> promoveu <strong>${staff.nome}</strong>: ${antigo} → ${novoCargo}`)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
