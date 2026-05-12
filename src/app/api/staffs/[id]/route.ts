import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog } from '@/lib/db'
import { hashPass } from '@/lib/utils'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    const db = await getDB()
    const old = await db.collection('staffs').findOne({ id })
    if (!old) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    const update: any = { nome: body.nome||old.nome, username: body.username||old.username, cargo: body.cargo||old.cargo, setor: body.setor||old.setor, carga: body.carga!==undefined?Number(body.carga):old.carga, perm: body.perm||old.perm, cupom: body.cupom?body.cupom.toUpperCase():old.cupom, pct: body.pct!==undefined?Number(body.pct):old.pct, entrada: body.entrada||old.entrada, idRp: body.idRp!==undefined?(body.idRp?Number(body.idRp):null):old.idRp }
    if (body.senha) update.senha = hashPass(body.senha)
    await db.collection('staffs').updateOne({ id }, { $set: update })
    await addLog('edit', 'Pen', 'amber', `<strong>${body.atorNome}</strong> editou <strong>${update.nome}</strong>`)
    const updated = await db.collection('staffs').findOne({ id })
    const { senha: _, _id, ...safe } = updated as any
    return NextResponse.json(safe)
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { atorNome } = await req.json()
    const db = await getDB()
    const staff = await db.collection('staffs').findOne({ id })
    if (!staff) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    await db.collection('staffs').deleteOne({ id })
    await addLog('remove', 'UserMinus', 'red', `<strong>${atorNome}</strong> removeu <strong>${staff.nome}</strong>`)
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
