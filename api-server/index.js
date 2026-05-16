import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: process.env.ENV_PATH || '../.env.local' })

const app = express()
app.use(cors())
app.use(express.json())

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Supabase URL or SUPABASE_SERVICE_ROLE_KEY missing in environment')
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

function hashPass(p) {
  let h = 0
  for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0 }
  return 'H' + Math.abs(h).toString(36) + p.length
}

function checkPass(plain, hash) { return hashPass(plain) === hash }

async function getCounters() {
  const { data, error } = await supabaseAdmin.from('counters').select('*').eq('key', 'default').single()
  if (error) return { nextId: 8, nextLogId: 2, nextAvisoId: 2, nextCupomId: 1 }
  return data
}

async function incCounter(field) {
  const counters = await getCounters()
  const currentValue = counters[field]
  await supabaseAdmin.from('counters').update({ [field]: currentValue + 1, updated_at: new Date().toISOString() }).eq('key', 'default')
  return currentValue
}

async function addLog(type, icon, color, msg) {
  try {
    const id = await incCounter('nextLogId')
    await supabaseAdmin.from('logs').insert({ id, type, icon, color, msg, time: new Date().toISOString() })

    const { count, error: countError } = await supabaseAdmin.from('logs').select('*', { count: 'exact', head: true })
    if (!countError && count && count > 500) {
      const { data: oldest } = await supabaseAdmin.from('logs').select('id').order('id', { ascending: true }).limit(count - 500)
      if (oldest && oldest.length) {
        const ids = oldest.map(o => o.id)
        await supabaseAdmin.from('logs').delete().in('id', ids)
      }
    }
  } catch (err) {
    console.error('addLog error', err)
  }
}

// Auth: login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const { data: staff, error } = await supabaseAdmin.from('staffs').select('*').ilike('username', username).single()
    if (error || !staff || !checkPass(password, staff.senha)) return res.status(401).json({ error: 'Usuário ou senha inválidos' })

    await supabaseAdmin.from('staffs').update({ online: true, ultimoAcesso: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', staff.id)
    await addLog('login', 'LogIn', 'blue', `<strong>${staff.nome}</strong> entrou no painel`)

    const { senha, ...safe } = staff
    return res.json({ staff: safe })
  } catch (e) { return res.status(500).json({ error: e.message }) }
})

// Auth: logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { userId } = req.body
    const { data: staff } = await supabaseAdmin.from('staffs').select('*').eq('id', userId).single()
    if (staff) {
      await supabaseAdmin.from('staffs').update({ online: false, updated_at: new Date().toISOString() }).eq('id', userId)
      await addLog('login', 'LogOut', 'red', `<strong>${staff.nome}</strong> saiu do painel`)
    }
    return res.json({ ok: true })
  } catch (e) { return res.status(500).json({ error: e.message }) }
})

// Staffs: list and create
app.get('/api/staffs', async (req, res) => {
  try {
    const { data: staffs, error } = await supabaseAdmin.from('staffs').select('*')
    if (error) throw error
    const safe = (staffs || []).map(({ senha, ...s }) => s)
    res.json(safe)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/staffs', async (req, res) => {
  try {
    const body = req.body
    const { nome, username, senha, cargo, setor, carga, perm, cupom, pct, entrada, atorNome, idRp } = body
    if (!nome || !username || !senha || !cargo || !cupom) return res.status(400).json({ error: 'Campos obrigatórios faltando' })

    const { data: exists } = await supabaseAdmin.from('staffs').select('id').ilike('username', username).single()
    if (exists) return res.status(409).json({ error: 'Username já em uso' })

    const id = await incCounter('nextId')
    const novo = {
      id,
      nome,
      username,
      senha: hashPass(senha),
      cargo,
      setor: setor || ['Suporte'],
      carga: Number(carga) || 20,
      perm: perm || 'staff',
      cupom: (cupom || '').toUpperCase(),
      pct: Number(pct) || 10,
      online: false,
      foto: '',
      entrada: entrada || new Date().toISOString().slice(0, 10),
      ultimaPromo: entrada || new Date().toISOString().slice(0, 10),
      ultimoAcesso: null,
      usos: 0,
      valorGerado: 0,
      comissaoTotal: 0,
      idRp: idRp ? Number(idRp) : null,
    }
    const { error: insertError } = await supabaseAdmin.from('staffs').insert(novo)
    if (insertError) throw insertError
    await addLog('add', 'UserPlus', 'green', `<strong>${atorNome}</strong> adicionou <strong>${nome}</strong>`)
    const { senha: _, ...safe } = novo
    res.status(201).json(safe)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Staff operations by id
app.put('/api/staffs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const updates = req.body
    if (updates.senha) updates.senha = hashPass(updates.senha)
    updates.updated_at = new Date().toISOString()
    const { error } = await supabaseAdmin.from('staffs').update(updates).eq('id', id)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/staffs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { error } = await supabaseAdmin.from('staffs').delete().eq('id', id)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/staffs/:id/promover', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { novoCargo, promotorNome } = req.body
    const { data: staff } = await supabaseAdmin.from('staffs').select('*').eq('id', id).single()
    if (!staff) return res.status(404).json({ error: 'Staff não encontrado' })
    const { error: updErr } = await supabaseAdmin.from('staffs').update({ cargo: novoCargo, updated_at: new Date().toISOString() }).eq('id', id)
    if (updErr) throw updErr
    const promo = { id: await incCounter('nextId'), staff_id: id, staff_nome: staff.nome, cargo_anterior: staff.cargo, cargo_novo: novoCargo, promotor_nome: promotorNome, data: new Date().toISOString() }
    await supabaseAdmin.from('promovidos').insert(promo)
    await addLog('promote', 'Award', 'green', `<strong>${promotorNome}</strong> promoveu <strong>${staff.nome}</strong> para ${novoCargo}`)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Cupons
app.get('/api/cupons', async (req, res) => {
  try {
    const { data: history, error: historyError } = await supabaseAdmin.from('cupons').select('*')
    const { data: promovidos, error: promovError } = await supabaseAdmin.from('promovidos').select('*')
    if (historyError || promovError) throw historyError || promovError
    res.json({ history: history || [], promovidos: promovidos || [] })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/cupons', async (req, res) => {
  try {
    const { cupom, usadoPor, valor } = req.body
    const { data: staff, error: staffError } = await supabaseAdmin.from('staffs').select('*').eq('cupom', (cupom||'').toUpperCase()).single()
    if (staffError || !staff) return res.status(404).json({ error: 'Cupom não encontrado' })
    const uso = { cupom: (cupom||'').toUpperCase(), staff_id: staff.id, staff_nome: staff.nome, usadoPor, valor: Number(valor), data: new Date().toISOString() }
    const { error: insertError } = await supabaseAdmin.from('cupons').insert(uso)
    if (insertError) throw insertError
    const novoValor = Number(staff.valorGerado) + Number(valor)
    const novaComissao = novoValor * (Number(staff.pct) / 100)
    const { error: updateError } = await supabaseAdmin.from('staffs').update({ usos: (staff.usos||0) + 1, valorGerado: novoValor, comissaoTotal: novaComissao, updated_at: new Date().toISOString() }).eq('id', staff.id)
    if (updateError) throw updateError
    res.status(201).json(uso)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Cupons reset (reset monthly values)
app.post('/api/cupons/reset', async (req, res) => {
  try {
    const { atorNome } = req.body
    const { error: deleteError } = await supabaseAdmin.from('cupons').delete().neq('id', 0)
    if (deleteError) throw deleteError

    const { error: updateError } = await supabaseAdmin.from('staffs').update({ usos: 0, valorGerado: 0, comissaoTotal: 0, updated_at: new Date().toISOString() }).neq('id', 0)
    if (updateError) throw updateError

    await addLog('reset', 'RefreshCw', 'red', `<strong>${atorNome}</strong> resetou todos os valores de cupons do mês`)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Cupons webhook (external integration)
app.post('/api/cupons/webhook', async (req, res) => {
  try {
    const { cupom, usadoPor, valorCompra } = req.body
    if (!cupom || !valorCompra) return res.status(400).json({ error: 'Campos obrigatórios: cupom, valorCompra' })

    const { data: staff, error: staffError } = await supabaseAdmin.from('staffs').select('*').eq('cupom', cupom.toUpperCase()).single()
    if (staffError || !staff) return res.status(404).json({ error: 'Cupom não encontrado' })

    const comissao = Number(valorCompra) * (staff.pct / 100)
    const uso = { cupom: cupom.toUpperCase(), staff_id: staff.id, staff_nome: staff.nome, usadoPor: usadoPor || 'Anônimo', valor: Number(valorCompra), data: new Date().toISOString() }
    const { error: insertError } = await supabaseAdmin.from('cupons').insert(uso)
    if (insertError) throw insertError

    const { error: updateError } = await supabaseAdmin.from('staffs').update({ usos: (staff.usos||0) + 1, valorGerado: (staff.valorGerado||0) + Number(valorCompra), comissaoTotal: (staff.comissaoTotal||0) + comissao, updated_at: new Date().toISOString() }).eq('id', staff.id)
    if (updateError) throw updateError

    await addLog('cupom', 'Ticket', 'amber', `Cupom <strong>${cupom.toUpperCase()}</strong> usado · R$ ${Number(valorCompra).toFixed(2)} · Comissão: R$ ${comissao.toFixed(2)} para <strong>${staff.nome}</strong>`)

    res.json({ ok: true, staff: staff.nome, cupom: cupom.toUpperCase(), valorCompra: Number(valorCompra), porcentagem: staff.pct, comissao })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Avisos
app.get('/api/avisos', async (req, res) => {
  try { const { data, error } = await supabaseAdmin.from('avisos').select('*'); if (error) throw error; res.json(data) } catch (e) { res.status(500).json({ error: e.message }) }
})
app.post('/api/avisos', async (req, res) => {
  try { const aviso = req.body; aviso.id = await incCounter('nextAvisoId'); aviso.created_at = new Date().toISOString(); const { error } = await supabaseAdmin.from('avisos').insert(aviso); if (error) throw error; res.status(201).json(aviso) } catch (e) { res.status(500).json({ error: e.message }) }
})
app.delete('/api/avisos/:id', async (req, res) => {
  try { const id = Number(req.params.id); const { error } = await supabaseAdmin.from('avisos').delete().eq('id', id); if (error) throw error; res.json({ ok: true }) } catch (e) { res.status(500).json({ error: e.message }) }
})

// Logs
app.get('/api/logs', async (req, res) => {
  try { const { data, error } = await supabaseAdmin.from('logs').select('*'); if (error) throw error; res.json(data) } catch (e) { res.status(500).json({ error: e.message }) }
})
app.delete('/api/logs', async (req, res) => {
  try { const { error } = await supabaseAdmin.from('logs').delete().neq('id', 0); if (error) throw error; res.json({ ok: true }) } catch (e) { res.status(500).json({ error: e.message }) }
})

// Seed
app.get('/api/seed', async (req, res) => {
  try {
    await supabaseAdmin.from('cupons').delete().neq('id', 0)
    await supabaseAdmin.from('promovidos').delete().neq('id', 0)
    await supabaseAdmin.from('avisos').delete().neq('id', 0)
    await supabaseAdmin.from('logs').delete().neq('id', 0)
    await supabaseAdmin.from('staffs').delete().neq('id', 0)

    const hash = (p) => hashPass(p)
    const mes = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().slice(0,10) }

    const staffs = [
      { id:1, nome:'Bruno', username:'bruno', senha:hash('bruno123'), cargo:'CEO', setor:['Administração'], carga:30, perm:'admin', cupom:'BRUNO2024', pct:15, online:false, foto:'', entrada:mes(8), ultimaPromo:mes(2), ultimoAcesso:new Date().toISOString(), usos:0, valorGerado:0, comissaoTotal:0, idRp:null },
      { id:2, nome:'Souza', username:'souza', senha:hash('souza123'), cargo:'Administrador', setor:['Administração'], carga:25, perm:'admin', cupom:'SOUZA10', pct:10, entrada:mes(7), ultimaPromo:mes(3), ultimoAcesso:null, usos:0, valorGerado:0, comissaoTotal:0, idRp:null },
      { id:3, nome:'Veio', username:'veio', senha:hash('veio123'), cargo:'Administrador', setor:['Administração'], carga:20, perm:'admin', cupom:'VEIO15', pct:15, entrada:mes(6), ultimaPromo:mes(4), ultimoAcesso:null, usos:0, valorGerado:0, comissaoTotal:0, idRp:null },
      { id:4, nome:'Folha', username:'folha', senha:hash('folha123'), cargo:'Diretor', setor:['Administração'], carga:22, perm:'admin', cupom:'FOLHA20', pct:20, entrada:mes(5), ultimaPromo:mes(1), ultimoAcesso:null, usos:0, valorGerado:0, comissaoTotal:0, idRp:null },
      { id:5, nome:'Leo', username:'leo', senha:hash('leo123'), cargo:'Administrador', setor:['Administração'], carga:18, perm:'admin', cupom:'LEO10', pct:10, entrada:mes(4), ultimaPromo:mes(2), ultimoAcesso:null, usos:0, valorGerado:0, comissaoTotal:0, idRp:null },
      { id:6, nome:'Roxy', username:'roxy', senha:hash('roxy123'), cargo:'Administrador', setor:['Administração'], carga:20, perm:'admin', cupom:'ROXY10', pct:10, entrada:mes(3), ultimaPromo:mes(1), ultimoAcesso:null, usos:0, valorGerado:0, comissaoTotal:0, idRp:null },
      { id:7, nome:'Theo', username:'theo', senha:hash('theo123'), cargo:'Moderador', setor:['Suporte'], carga:15, perm:'staff', cupom:'THEO5', pct:5, entrada:mes(2), ultimaPromo:mes(1), ultimoAcesso:null, usos:0, valorGerado:0, comissaoTotal:0, idRp:null }
    ]

    const { error: staffsError } = await supabaseAdmin.from('staffs').insert(staffs)
    if (staffsError) throw staffsError

    const { error: avisosError } = await supabaseAdmin.from('avisos').insert({ id:1, tipo:'info', msg:'Bem-vindos ao novo painel!', autor:'Sistema', data:new Date().toISOString() })
    if (avisosError) throw avisosError

    const { error: logsError } = await supabaseAdmin.from('logs').insert({ id:1, type:'login', icon:'LogIn', color:'blue', msg:'<strong>Sistema</strong> inicializado', time:new Date().toISOString() })
    if (logsError) throw logsError

    const { error: countersError } = await supabaseAdmin.from('counters').update({ nextId:8, nextLogId:2, nextAvisoId:2, nextCupomId:1, updated_at:new Date().toISOString() }).eq('key','default')
    if (countersError) throw countersError

    res.json({ ok: true, msg: 'Banco inicializado!' })
  } catch (e) { console.error('seed error', e); res.status(500).json({ error: e.message }) }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`))
