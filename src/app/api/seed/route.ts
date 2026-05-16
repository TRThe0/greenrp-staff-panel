import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPass } from '@/lib/utils'

const mes = (n: number) => {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d.toISOString().slice(0, 10)
}

export async function GET() {
  try {
    // Delete existing data
    await supabaseAdmin.from('cupons').delete().neq('id', 0)
    await supabaseAdmin.from('promovidos').delete().neq('id', 0)
    await supabaseAdmin.from('avisos').delete().neq('id', 0)
    await supabaseAdmin.from('logs').delete().neq('id', 0)
    await supabaseAdmin.from('staffs').delete().neq('id', 0)

    // Insert staffs
    const { error: staffsError } = await supabaseAdmin.from('staffs').insert([
      {
        id: 1,
        nome: 'Bruno',
        username: 'bruno',
        senha: hashPass('bruno123'),
        cargo: 'CEO',
        setor: ['Administração'],
        carga: 30,
        perm: 'admin',
        cupom: 'BRUNO2024',
        pct: 15,
        online: false,
        foto: '',
        entrada: mes(8),
        ultimaPromo: mes(2),
        ultimoAcesso: new Date().toISOString(),
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
      {
        id: 2,
        nome: 'Souza',
        username: 'souza',
        senha: hashPass('souza123'),
        cargo: 'Administrador',
        setor: ['Administração'],
        carga: 25,
        perm: 'admin',
        cupom: 'SOUZA10',
        pct: 10,
        online: false,
        foto: '',
        entrada: mes(7),
        ultimaPromo: mes(3),
        ultimoAcesso: null,
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
      {
        id: 3,
        nome: 'Veio',
        username: 'veio',
        senha: hashPass('veio123'),
        cargo: 'Administrador',
        setor: ['Administração'],
        carga: 20,
        perm: 'admin',
        cupom: 'VEIO15',
        pct: 15,
        online: false,
        foto: '',
        entrada: mes(6),
        ultimaPromo: mes(4),
        ultimoAcesso: null,
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
      {
        id: 4,
        nome: 'Folha',
        username: 'folha',
        senha: hashPass('folha123'),
        cargo: 'Diretor',
        setor: ['Administração'],
        carga: 22,
        perm: 'admin',
        cupom: 'FOLHA20',
        pct: 20,
        online: false,
        foto: '',
        entrada: mes(5),
        ultimaPromo: mes(1),
        ultimoAcesso: null,
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
      {
        id: 5,
        nome: 'Leo',
        username: 'leo',
        senha: hashPass('leo123'),
        cargo: 'Administrador',
        setor: ['Administração'],
        carga: 18,
        perm: 'admin',
        cupom: 'LEO10',
        pct: 10,
        online: false,
        foto: '',
        entrada: mes(4),
        ultimaPromo: mes(2),
        ultimoAcesso: null,
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
      {
        id: 6,
        nome: 'Roxy',
        username: 'roxy',
        senha: hashPass('roxy123'),
        cargo: 'Administrador',
        setor: ['Administração'],
        carga: 20,
        perm: 'admin',
        cupom: 'ROXY10',
        pct: 10,
        online: false,
        foto: '',
        entrada: mes(3),
        ultimaPromo: mes(1),
        ultimoAcesso: null,
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
      {
        id: 7,
        nome: 'Theo',
        username: 'theo',
        senha: hashPass('theo123'),
        cargo: 'Moderador',
        setor: ['Suporte'],
        carga: 15,
        perm: 'staff',
        cupom: 'THEO5',
        pct: 5,
        online: false,
        foto: '',
        entrada: mes(2),
        ultimaPromo: mes(1),
        ultimoAcesso: null,
        usos: 0,
        valorGerado: 0,
        comissaoTotal: 0,
        idRp: null,
      },
    ])

    if (staffsError) throw staffsError

    // Insert avisos
    const { error: avisosError } = await supabaseAdmin.from('avisos').insert({
      id: 1,
      tipo: 'info',
      msg: 'Bem-vindos ao novo painel!',
      autor: 'Sistema',
      data: new Date().toISOString(),
    })

    if (avisosError) throw avisosError

    // Insert logs
    const { error: logsError } = await supabaseAdmin.from('logs').insert({
      id: 1,
      type: 'login',
      icon: 'LogIn',
      color: 'blue',
      msg: '<strong>Sistema</strong> inicializado',
      time: new Date().toISOString(),
    })

    if (logsError) throw logsError

    // Reset counters
    const { error: countersError } = await supabaseAdmin
      .from('counters')
      .update({
        nextId: 8,
        nextLogId: 2,
        nextAvisoId: 2,
        nextCupomId: 1,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'default')

    if (countersError) throw countersError

    return NextResponse.json({ ok: true, msg: 'Banco inicializado!' })
  } catch (e: any) {
    console.error('Seed error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
