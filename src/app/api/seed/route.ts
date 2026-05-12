import { NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'

function hashPass(p: string): string {
  let h = 0
  for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0 }
  return 'H' + Math.abs(h).toString(36) + p.length
}

const mes = (n: number) => {
  const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().slice(0, 10)
}

export async function GET() {
  try {
    const db = await getDB()
    await db.collection('staffs').deleteMany({})
    await db.collection('cupons').deleteMany({})
    await db.collection('avisos').deleteMany({})
    await db.collection('logs').deleteMany({})
    await db.collection('promovidos').deleteMany({})
    await db.collection('config').deleteMany({})

    await db.collection('staffs').insertMany([
      {id:1,nome:'Bruno',username:'bruno',senha:hashPass('bruno123'),cargo:'CEO',setor:['Administração'],carga:30,perm:'admin',cupom:'BRUNO2024',pct:15,online:false,foto:'',entrada:mes(8),ultimaPromo:mes(2),ultimoAcesso:new Date().toISOString(),usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
      {id:2,nome:'Souza',username:'souza',senha:hashPass('souza123'),cargo:'Administrador',setor:['Administração'],carga:25,perm:'admin',cupom:'SOUZA10',pct:10,online:false,foto:'',entrada:mes(7),ultimaPromo:mes(3),ultimoAcesso:null,usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
      {id:3,nome:'Veio',username:'veio',senha:hashPass('veio123'),cargo:'Administrador',setor:['Administração'],carga:20,perm:'admin',cupom:'VEIO15',pct:15,online:false,foto:'',entrada:mes(6),ultimaPromo:mes(4),ultimoAcesso:null,usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
      {id:4,nome:'Folha',username:'folha',senha:hashPass('folha123'),cargo:'Diretor',setor:['Administração'],carga:22,perm:'admin',cupom:'FOLHA20',pct:20,online:false,foto:'',entrada:mes(5),ultimaPromo:mes(1),ultimoAcesso:null,usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
      {id:5,nome:'Leo',username:'leo',senha:hashPass('leo123'),cargo:'Administrador',setor:['Administração'],carga:18,perm:'admin',cupom:'LEO10',pct:10,online:false,foto:'',entrada:mes(4),ultimaPromo:mes(2),ultimoAcesso:null,usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
      {id:6,nome:'Roxy',username:'roxy',senha:hashPass('roxy123'),cargo:'Administrador',setor:['Administração'],carga:20,perm:'admin',cupom:'ROXY10',pct:10,online:false,foto:'',entrada:mes(3),ultimaPromo:mes(1),ultimoAcesso:null,usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
      {id:7,nome:'Theo',username:'theo',senha:hashPass('theo123'),cargo:'Moderador',setor:['Suporte'],carga:15,perm:'staff',cupom:'THEO5',pct:5,online:false,foto:'',entrada:mes(2),ultimaPromo:mes(1),ultimoAcesso:null,usos:0,valorGerado:0,comissaoTotal:0,idRp:null},
    ])
    await db.collection('avisos').insertOne({id:1,tipo:'info',msg:'Bem-vindos ao novo painel!',autor:'Sistema',data:new Date().toISOString()})
    await db.collection('logs').insertOne({id:1,type:'login',icon:'LogIn',color:'blue',msg:'<strong>Sistema</strong> inicializado',time:new Date().toISOString()})
    await db.collection('config').insertOne({key:'counters',nextId:8,nextLogId:2,nextAvisoId:2,nextCupomId:1})

    return NextResponse.json({ ok: true, msg: 'Banco inicializado!' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
