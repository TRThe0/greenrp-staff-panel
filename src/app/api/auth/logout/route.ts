import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    const db = await getDB()
    const staff = await db.collection('staffs').findOne({ id: userId })
    if (staff) {
      await db.collection('staffs').updateOne({ id: userId }, { $set: { online: false } })
      await addLog('login', 'LogOut', 'red', `<strong>${staff.nome}</strong> saiu do painel`)
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
