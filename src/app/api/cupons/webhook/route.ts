import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog } from '@/lib/db-supabase'

export async function POST(req: NextRequest) {
  try {
    const { cupom, usadoPor, valorCompra } = await req.json()
    if (!cupom || !valorCompra)
      return NextResponse.json({ error: 'Campos obrigatórios: cupom, valorCompra' }, { status: 400 })

    const { data: staff, error: staffError } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('cupom', cupom.toUpperCase())
      .single()

    if (staffError || !staff) return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 })

    const comissao = Number(valorCompra) * (staff.pct / 100)

    const uso = {
      cupom: cupom.toUpperCase(),
      staff_id: staff.id,
      staff_nome: staff.nome,
      usadoPor: usadoPor || 'Anônimo',
      valor: Number(valorCompra),
      data: new Date().toISOString(),
    }

    const { error: insertError } = await supabaseAdmin.from('cupons').insert(uso)

    if (insertError) throw insertError

    const { error: updateError } = await supabaseAdmin
      .from('staffs')
      .update({
        usos: staff.usos + 1,
        valorGerado: staff.valorGerado + Number(valorCompra),
        comissaoTotal: staff.comissaoTotal + comissao,
        updated_at: new Date().toISOString(),
      })
      .eq('id', staff.id)

    if (updateError) throw updateError

    await addLog(
      'cupom',
      'Ticket',
      'amber',
      `Cupom <strong>${cupom.toUpperCase()}</strong> usado · R$ ${Number(valorCompra).toFixed(2)} · Comissão: R$ ${comissao.toFixed(2)} para <strong>${staff.nome}</strong>`
    )

    return NextResponse.json({
      ok: true,
      staff: staff.nome,
      cupom: cupom.toUpperCase(),
      valorCompra: Number(valorCompra),
      porcentagem: staff.pct,
      comissao,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
