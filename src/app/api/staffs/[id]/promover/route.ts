import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { novoCargo, novoSetor, atorNome } = await req.json()
    const db = await getDB()
    const staff = await db.collection('staffs').findOne({ id })
    if (!staff) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    const antigo = staff.cargo
    await db.collection('staffs').updateOne({ id }, { $set: { cargo: novoCargo, setor: novoSetor, ultimaPromo: new Date().toISOString().slice(0,10) } })
    await db.collection('promovidos').insertOne({ staffId: id, nome: staff.nome, de: antigo, para: novoCargo, data: new Date().toISOString() })
    await addLog('promo', 'ArrowUp', 'purple', `<strong>${atorNome}</strong> promoveu <strong>${staff.nome}</strong>: ${antigo} → ${novoCargo}`)
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
