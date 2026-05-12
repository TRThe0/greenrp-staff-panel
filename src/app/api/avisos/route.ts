import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog, incCounter } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDB()
    const avisos = await db.collection('avisos').find({}).sort({ id: -1 }).toArray()
    return NextResponse.json(avisos.map(({ _id, ...a }: any) => a))
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { tipo, msg, autor } = await req.json()
    const db = await getDB()
    const id = await incCounter('nextAvisoId')
    const aviso = { id, tipo, msg, autor, data: new Date().toISOString() }
    await db.collection('avisos').insertOne(aviso)
    await addLog('aviso', 'Bell', 'amber', `<strong>${autor}</strong> publicou um aviso`)
    return NextResponse.json(aviso, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const db = await getDB()
    await db.collection('avisos').deleteOne({ id })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
