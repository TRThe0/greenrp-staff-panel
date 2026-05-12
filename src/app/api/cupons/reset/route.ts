import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { atorNome } = await req.json()
    const db = await getDB()
    await db.collection('cupons').deleteMany({})
    await db.collection('staffs').updateMany({}, { $set: { usos: 0, valorGerado: 0, comissaoTotal: 0 } })
    await addLog('reset', 'RefreshCw', 'red', `<strong>${atorNome}</strong> resetou todos os valores de cupons do mês`)
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
