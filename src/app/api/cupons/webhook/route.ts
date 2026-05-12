import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { cupom, usadoPor, valorCompra } = await req.json()
    if (!cupom || !valorCompra)
      return NextResponse.json({ error: 'Campos obrigatórios: cupom, valorCompra' }, { status: 400 })
    const db = await getDB()
    const staff = await db.collection('staffs').findOne({ cupom: cupom.toUpperCase() })
    if (!staff) return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 })
    const comissao = Number(valorCompra) * (staff.pct / 100)
    const uso = { id: Date.now(), cupom: cupom.toUpperCase(), staff: staff.nome, usadoPor: usadoPor||'Anônimo', valor: Number(valorCompra), comissao, data: new Date().toISOString() }
    await db.collection('cupons').insertOne(uso)
    await db.collection('staffs').updateOne({ id: staff.id }, { $inc: { usos: 1, valorGerado: Number(valorCompra), comissaoTotal: comissao } })
    await addLog('cupom', 'Ticket', 'amber', `Cupom <strong>${cupom.toUpperCase()}</strong> usado · R$ ${Number(valorCompra).toFixed(2)} · Comissão: R$ ${comissao.toFixed(2)} para <strong>${staff.nome}</strong>`)
    return NextResponse.json({ ok: true, staff: staff.nome, cupom: cupom.toUpperCase(), valorCompra: Number(valorCompra), porcentagem: staff.pct, comissao })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
