import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog, incCounter } from '@/lib/db'
import { hashPass } from '@/lib/utils'

export async function GET() {
  try {
    const db = await getDB()
    const staffs = await db.collection('staffs').find({}).toArray()
    return NextResponse.json(staffs.map(({ senha, _id, ...s }: any) => s))
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, username, senha, cargo, setor, carga, perm, cupom, pct, entrada, atorNome, idRp } = body
    if (!nome || !username || !senha || !cargo || !cupom)
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    const db = await getDB()
    const existe = await db.collection('staffs').findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
    if (existe) return NextResponse.json({ error: 'Username já em uso' }, { status: 409 })
    const id = await incCounter('nextId')
    const novo = { id, nome, username, senha: hashPass(senha), cargo, setor: setor||['Suporte'], carga: Number(carga)||20, perm: perm||'staff', cupom: cupom.toUpperCase(), pct: Number(pct)||10, online: false, foto: '', entrada: entrada||new Date().toISOString().slice(0,10), ultimaPromo: entrada||new Date().toISOString().slice(0,10), ultimoAcesso: null, usos: 0, valorGerado: 0, comissaoTotal: 0, idRp: idRp?Number(idRp):null }
    await db.collection('staffs').insertOne(novo)
    await addLog('add', 'UserPlus', 'green', `<strong>${atorNome}</strong> adicionou <strong>${nome}</strong>`)
    const { senha: _, ...safe } = novo
    return NextResponse.json(safe, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
