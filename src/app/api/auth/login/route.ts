import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { addLog } from '@/lib/db'
import { checkPass } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const db = await getDB()
    const staff = await db.collection('staffs').findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
    if (!staff || !checkPass(password, staff.senha))
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 })
    await db.collection('staffs').updateOne({ id: staff.id }, { $set: { online: true, ultimoAcesso: new Date().toISOString() } })
    await addLog('login', 'LogIn', 'blue', `<strong>${staff.nome}</strong> entrou no painel`)
    const { senha: _, _id, ...safe } = staff
    return NextResponse.json({ staff: safe })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
