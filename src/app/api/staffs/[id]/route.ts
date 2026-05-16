import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog } from '@/lib/db-supabase'
import { hashPass } from '@/lib/utils'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()

    const { data: old, error: oldError } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('id', id)
      .single()

    if (oldError || !old) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    const update: any = {
      nome: body.nome || old.nome,
      username: body.username || old.username,
      cargo: body.cargo || old.cargo,
      setor: body.setor || old.setor,
      carga: body.carga !== undefined ? Number(body.carga) : old.carga,
      perm: body.perm || old.perm,
      cupom: body.cupom ? body.cupom.toUpperCase() : old.cupom,
      pct: body.pct !== undefined ? Number(body.pct) : old.pct,
      entrada: body.entrada || old.entrada,
      idRp: body.idRp !== undefined ? (body.idRp ? Number(body.idRp) : null) : old.idRp,
      updated_at: new Date().toISOString(),
    }

    if (body.senha) update.senha = hashPass(body.senha)

    const { error: updateError } = await supabaseAdmin
      .from('staffs')
      .update(update)
      .eq('id', id)

    if (updateError) throw updateError

    await addLog('edit', 'Pen', 'amber', `<strong>${body.atorNome}</strong> editou <strong>${update.nome}</strong>`)

    const { data: updated, error: fetchError } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !updated) throw fetchError

    const { senha: _, ...safe } = updated
    return NextResponse.json(safe)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { atorNome } = await req.json()

    const { data: staff, error: staffError } = await supabaseAdmin
      .from('staffs')
      .select('*')
      .eq('id', id)
      .single()

    if (staffError || !staff) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    const { error: deleteError } = await supabaseAdmin.from('staffs').delete().eq('id', id)

    if (deleteError) throw deleteError

    await addLog('remove', 'UserMinus', 'red', `<strong>${atorNome}</strong> removeu <strong>${staff.nome}</strong>`)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
