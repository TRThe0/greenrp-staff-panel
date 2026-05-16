import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addLog, incCounter } from '@/lib/db-supabase'

export async function GET() {
  try {
    const { data: avisos, error } = await supabaseAdmin
      .from('avisos')
      .select('*')
      .order('id', { ascending: false })

    if (error) throw error

    return NextResponse.json(avisos || [])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tipo, msg, autor } = await req.json()

    const id = await incCounter('nextAvisoId')
    const aviso = {
      id,
      tipo,
      msg,
      autor,
      data: new Date().toISOString(),
    }

    const { error: insertError } = await supabaseAdmin.from('avisos').insert(aviso)

    if (insertError) throw insertError

    await addLog('aviso', 'Bell', 'amber', `<strong>${autor}</strong> publicou um aviso`)

    return NextResponse.json(aviso, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    const { error } = await supabaseAdmin.from('avisos').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
