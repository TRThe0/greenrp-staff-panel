import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDB()
    const history = await db.collection('cupons').find({}).toArray()
    const promovidos = await db.collection('promovidos').find({}).toArray()
    return NextResponse.json({ history: history.map(({_id,...h}:any)=>h), promovidos: promovidos.map(({_id,...p}:any)=>p) })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { cupom, usadoPor, valor } = await req.json()
    const db = await getDB()
    const staff = await db.collection('staffs').findOne({ cupom: cupom.toUpperCase() })
    if (!staff) return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 })
    const uso = { id: Date.now(), cupom: cupom.toUpperCase(), staff: staff.nome, usadoPor, valor: Number(valor), data: new Date().toISOString() }
    await db.collection('cupons').insertOne(uso)
    await db.collection('staffs').updateOne({ id: staff.id }, { $inc: { usos: 1, valorGerado: Number(valor), comissaoTotal: Number(valor)*(staff.pct/100) } })
    return NextResponse.json(uso, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
