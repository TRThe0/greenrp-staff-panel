import { NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDB()
    const logs = await db.collection('logs').find({}).sort({ id: -1 }).toArray()
    return NextResponse.json(logs.map(({ _id, ...l }: any) => l))
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE() {
  try {
    const db = await getDB()
    await db.collection('logs').deleteMany({})
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
