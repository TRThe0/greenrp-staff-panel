import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('logs')
      .select('*')
      .order('id', { ascending: false })

    if (error) throw error

    return NextResponse.json(logs || [])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { error } = await supabaseAdmin.from('logs').delete().neq('id', 0)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
