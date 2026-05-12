'use client'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import { formatDate, getSession } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const SETORES = ['Ilegal','Legal','Policia','Denuncia','Kids','SS','Evento','Criadores','Administração','Suporte']
const SC: Record<string,string> = {
  Ilegal:       '#ff4757', // vermelho
  Legal:        '#2ed573', // verde claro
  Policia:      '#1e90ff', // azul royal
  Denuncia:     '#ff6348', // laranja-vermelho
  Kids:         '#ff6eb4', // rosa
  SS:           '#eccc68', // dourado
  Evento:       '#4facfe', // azul celeste
  Criadores:    '#b388ff', // roxo
  Administração:'#ffa502', // âmbar
  Suporte:      '#00e676', // verde neon
}

function SetorBadge({ setor }: { setor: string | string[] }) {
  const list = Array.isArray(setor) ? setor : [setor]
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
      {list.map(s => (
        <span key={s} style={{display:'inline-flex',padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:600,color:SC[s]||'#a8b8c8',background:(SC[s]||'#888')+'22',border:`1px solid ${(SC[s]||'#888')}33`,whiteSpace:'nowrap'}}>{s}</span>
      ))}
    </div>
  )
}

function SetorCheckboxes({ value, onChange }: { value: string[], onChange: (v: string[]) => void }) {
  function toggle(s: string) {
    if (value.includes(s)) onChange(value.filter(x => x !== s))
    else onChange([...value, s])
  }
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:4}}>
      {SETORES.map(s => {
        const selected = value.includes(s)
        return (
          <button key={s} type="button" onClick={() => toggle(s)} style={{padding:'6px 14px',borderRadius:99,fontSize:12,fontWeight:600,cursor:'pointer',transition:'all 0.15s',border:`1px solid ${selected ? SC[s] : '#1e2d3d'}`,background:selected ? SC[s]+'22' : '#111820',color:selected ? SC[s] : '#6b7f93'}}>
            {s}
          </button>
        )
      })}
    </div>
  )
}

export default function StaffsPage() {
  const router = useRouter()
  const [staffs, setStaffs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [setor, setSetor] = useState('')
  const [status, setStatus] = useState('')
  const [modal, setModal] = useState(false)
  const [modalPromo, setModalPromo] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [promovendo, setPromovendo] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [promoForm, setPromoForm] = useState<any>({})
  const [session, setSession] = useState<any>(null)
  const [confirmId, setConfirmId] = useState<number|null>(null)

  useEffect(() => {
    const s = getSession(); if (!s){router.replace('/login');return}
    setSession(s); load()
  }, [router])

  async function load() { const r = await fetch('/api/staffs'); setStaffs(await r.json()) }
  const isAdmin = session?.perm==='admin'

  // Normaliza setor para array
  const getSetores = (s: any): string[] => {
    if (!s.setor) return []
    return Array.isArray(s.setor) ? s.setor : [s.setor]
  }

  const filtered = staffs.filter(s=>{
    const q=search.toLowerCase()
    const setores = getSetores(s)
    return (
      (!q||s.nome.toLowerCase().includes(q)||s.cargo.toLowerCase().includes(q)||s.cupom.toLowerCase().includes(q)) &&
      (!setor || setores.includes(setor)) &&
      (!status||(status==='online'&&s.online)||(status==='offline'&&!s.online))
    )
  })

  function openAdd(){
    setEditing(null)
    setForm({carga:20,pct:10,setores:['Suporte'],perm:'staff',entrada:new Date().toISOString().slice(0,10)})
    setModal(true)
  }
  function openEdit(s:any){
    setEditing(s)
    setForm({...s, senha:'', setores: Array.isArray(s.setor) ? s.setor : [s.setor]})
    setModal(true)
  }
  function openPromo(s:any){
    setPromovendo(s)
    setPromoForm({cargo:s.cargo, setores: Array.isArray(s.setor) ? s.setor : [s.setor]})
    setModalPromo(true)
  }

  async function save(){
    const payload = { ...form, setor: form.setores || ['Suporte'], atorNome: session?.nome }
    await fetch(editing?`/api/staffs/${editing.id}`:'/api/staffs',{
      method:editing?'PUT':'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    setModal(false); load()
  }

  async function remover(id:number){
    await fetch(`/api/staffs/${id}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({atorNome:session?.nome})})
    setConfirmId(null); load()
  }

  async function promover(){
    await fetch(`/api/staffs/${promovendo.id}/promover`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({novoCargo:promoForm.cargo, novoSetor: promoForm.setores || ['Suporte'], atorNome:session?.nome})
    })
    setModalPromo(false); load()
  }

  const inp:any={width:'100%',background:'#111820',border:'1px solid #1e2d3d',borderRadius:8,padding:'10px 14px',color:'#f0f4f8',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'DM Sans,sans-serif'}
  const sf=(k:string)=>(e:any)=>setForm((f:any)=>({...f,[k]:e.target.value}))

  return (
    <Layout page="staffs">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div><div style={{fontFamily:'Syne,sans-serif',fontSize:18,fontWeight:700,color:'#f0f4f8'}}>Lista de Staffs</div><div style={{fontSize:13,color:'#6b7f93',marginTop:2}}>{filtered.length} de {staffs.length} staffs</div></div>
        {isAdmin&&<button onClick={openAdd} style={{padding:'9px 18px',border:'none',borderRadius:8,background:'linear-gradient(135deg,#00e676,#00c853)',color:'#080c10',fontSize:13,fontWeight:700,cursor:'pointer'}}>+ Adicionar Staff</button>}
      </div>

      <div style={{background:'#111820',border:'1px solid #1e2d3d',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'flex',gap:10,padding:'14px 18px',borderBottom:'1px solid #1e2d3d',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'#161f2a',border:'1px solid #1e2d3d',borderRadius:8,padding:'8px 12px',flex:1,minWidth:180}}>
            <span style={{color:'#6b7f93'}}>🔍</span>
            <input type="text" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{background:'none',border:'none',outline:'none',color:'#f0f4f8',fontSize:13,width:'100%',fontFamily:'DM Sans,sans-serif'}}/>
          </div>
          <select value={setor} onChange={e=>setSetor(e.target.value)} style={{...inp,width:'auto',padding:'8px 28px 8px 12px',color:'#a8b8c8'}}>
            <option value="">Todos Setores</option>{SETORES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{...inp,width:'auto',padding:'8px 28px 8px 12px',color:'#a8b8c8'}}>
            <option value="">Todos Status</option><option value="online">Online</option><option value="offline">Offline</option>
          </select>
        </div>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#161f2a'}}>{['Staff','Cargo','Setor(es)','Status','ID RP','Carga','Cupom','Entrada','Última Promoção','Ações'].map(h=><th key={h} style={{padding:'12px 18px',textAlign:'left',fontSize:11,fontWeight:600,color:'#6b7f93',letterSpacing:'0.8px',textTransform:'uppercase',borderBottom:'1px solid #1e2d3d',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
            <tbody>
              {!filtered.length&&<tr><td colSpan={8} style={{textAlign:'center',padding:50,color:'#6b7f93',fontSize:14}}>Nenhum staff encontrado</td></tr>}
              {filtered.map(s=>(
                <tr key={s.id} style={{borderBottom:'1px solid #1e2d3d',transition:'background 0.15s'}} onMouseEnter={e=>(e.currentTarget.style.background='#161f2a')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{padding:'14px 18px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:36,height:36,borderRadius:10,background:'rgba(0,230,118,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#00e676',flexShrink:0}}>{s.nome.charAt(0)}</div>
                      <div><div style={{fontSize:14,fontWeight:600,color:'#f0f4f8'}}>{s.nome}</div><div style={{fontSize:11,color:'#6b7f93'}}>@{s.username}</div></div>
                    </div>
                  </td>
                  <td style={{padding:'14px 18px',fontSize:13,fontWeight:500,color:'#f0f4f8'}}>{s.cargo}</td>
                  <td style={{padding:'14px 18px'}}><SetorBadge setor={s.setor}/></td>
                  <td style={{padding:'14px 18px'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:600,color:s.online?'#00e676':'#a8b8c8',background:s.online?'rgba(0,230,118,0.12)':'rgba(255,255,255,0.05)',border:`1px solid ${s.online?'rgba(0,230,118,0.2)':'#1e2d3d'}`}}>
                      <span style={{width:6,height:6,borderRadius:'50%',background:s.online?'#00e676':'#6b7f93',display:'inline-block'}}></span>{s.online?'Online':'Offline'}
                    </span>
                  </td>
                  <td style={{padding:'14px 18px'}}>
                    <span style={{fontFamily:'monospace',fontSize:13,fontWeight:700,color:'#4facfe',background:'rgba(79,172,254,0.1)',border:'1px solid rgba(79,172,254,0.2)',borderRadius:6,padding:'3px 10px'}}>
                      {s.idRp || <span style={{color:'#3a4a5a',fontWeight:400,fontFamily:'DM Sans,sans-serif',fontSize:12}}>—</span>}
                    </span>
                  </td>
                  <td style={{padding:'14px 18px',fontSize:13,color:'#f0f4f8'}}>{s.carga}h/sem</td>
                  <td style={{padding:'14px 18px'}}><span style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:'#ffa502'}}>{s.cupom}</span><span style={{fontSize:11,color:'#6b7f93',marginLeft:6}}>{s.pct}%</span></td>
                  <td style={{padding:'14px 18px',fontSize:13,color:'#a8b8c8'}}>{formatDate(s.entrada)}</td>
                  <td style={{padding:'14px 18px',fontSize:13,color:'#b388ff',fontWeight:500}}>{formatDate(s.ultimaPromo)||'—'}</td>
                  <td style={{padding:'14px 18px'}}><div style={{display:'flex',gap:6}}>
                    {isAdmin&&<>
                      <button onClick={()=>openPromo(s)} style={{width:30,height:30,borderRadius:8,background:'rgba(0,230,118,0.1)',border:'1px solid rgba(0,230,118,0.2)',color:'#00e676',cursor:'pointer',fontSize:13}}>⬆</button>
                      <button onClick={()=>openEdit(s)} style={{width:30,height:30,borderRadius:8,background:'#1a2535',border:'1px solid #1e2d3d',color:'#a8b8c8',cursor:'pointer',fontSize:13}}>✏</button>
                      <button onClick={()=>setConfirmId(s.id)} style={{width:30,height:30,borderRadius:8,background:'rgba(255,71,87,0.1)',border:'1px solid rgba(255,71,87,0.2)',color:'#ff4757',cursor:'pointer',fontSize:13}}>🗑</button>
                    </>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD/EDIT */}
      <Modal open={modal} title={editing?'Editar Staff':'Adicionar Staff'} onClose={()=>setModal(false)} onConfirm={save} confirmLabel="Salvar">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div style={{gridColumn:'1/-1'}}><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Nome</label><input style={inp} value={form.nome||''} onChange={sf('nome')} placeholder="Nome do staff"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Usuário</label><input style={inp} value={form.username||''} onChange={sf('username')} placeholder="usuario"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Senha{editing?' (vazio=manter)':''}</label><input style={inp} type="password" value={form.senha||''} onChange={sf('senha')} placeholder="••••••••"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Cargo</label><input style={inp} value={form.cargo||''} onChange={sf('cargo')} placeholder="Ex: Moderador"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Permissão</label><select style={inp} value={form.perm||''} onChange={sf('perm')}><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
          <div style={{gridColumn:'1/-1'}}>
            <label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Setores <span style={{color:'#4facfe'}}>(selecione um ou mais)</span></label>
            <SetorCheckboxes value={form.setores||[]} onChange={v=>setForm((f:any)=>({...f,setores:v}))}/>
          </div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Carga (h/sem)</label><input style={inp} type="number" value={form.carga||''} onChange={sf('carga')} placeholder="20"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>ID do RP</label><input style={inp} type="number" value={form.idRp||''} onChange={sf('idRp')} placeholder="Ex: 4821"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>% Cupom</label><input style={inp} type="number" value={form.pct||''} onChange={sf('pct')} placeholder="10"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Cupom</label><input style={inp} value={form.cupom||''} onChange={e=>setForm((f:any)=>({...f,cupom:e.target.value.toUpperCase()}))} placeholder="STAFFCODE"/></div>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Entrada</label><input style={inp} type="date" value={form.entrada||''} onChange={sf('entrada')}/></div>
        </div>
      </Modal>

      {/* MODAL PROMOÇÃO */}
      <Modal open={modalPromo} title={`Promover ${promovendo?.nome||''}`} onClose={()=>setModalPromo(false)} onConfirm={promover} confirmLabel="Promover">
        <div style={{display:'grid',gap:14}}>
          <div><label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Novo Cargo</label><input style={inp} value={promoForm.cargo||''} onChange={e=>setPromoForm((f:any)=>({...f,cargo:e.target.value}))} placeholder="Novo cargo"/></div>
          <div>
            <label style={{fontSize:12,color:'#6b7f93',display:'block',marginBottom:6}}>Setores <span style={{color:'#4facfe'}}>(selecione um ou mais)</span></label>
            <SetorCheckboxes value={promoForm.setores||[]} onChange={v=>setPromoForm((f:any)=>({...f,setores:v}))}/>
          </div>
        </div>
      </Modal>

      {/* CONFIRM REMOVE */}
      <Modal open={confirmId!==null} title="Remover Staff?" onClose={()=>setConfirmId(null)} onConfirm={()=>confirmId&&remover(confirmId)} confirmLabel="Remover" danger>
        <p style={{fontSize:14,color:'#a8b8c8',textAlign:'center',padding:'8px 0'}}>Esta ação não pode ser desfeita.</p>
      </Modal>
    </Layout>
  )
}
