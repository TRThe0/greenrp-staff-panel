import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: history, error: historyError } = await supabaseAdmin
      .from('cupons')
      .select('*')

    const { data: promovidos, error: promovError } = await supabaseAdmin
      .from('promovidos')
      .select('*')

    if (historyError || promovError) throw historyError || promovError

    return NextResponse.json({ history: history || [], promovidos: promovidos || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cupom, usadoPor, valor } = await req.json()

    const { data: staff, error: staffError } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('cupom', cupom.toUpperCase())
      .single()

    if (staffError || !staff) return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 })

    const uso = {
      cupom: cupom.toUpperCase(),
      staff_id: staff.id,
      staff_nome: staff.nome,
      usadoPor,
      valor: Number(valor),
      data: new Date().toISOString(),
    }

    const { error: insertError } = await supabaseAdmin.from('cupons').insert(uso)

    if (insertError) throw insertError

    const novoValor = staff.valorGerado + Number(valor)
    const novaComissao = novoValor * (staff.pct / 100)

    const { error: updateError } = await supabaseAdmin
      .from('staffs')
      .update({
        usos: staff.usos + 1,
        valorGerado: novoValor,
        comissaoTotal: novaComissao,
        updated_at: new Date().toISOString(),
      })
      .eq('id', staff.id)

    if (updateError) throw updateError

    return NextResponse.json(uso, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
