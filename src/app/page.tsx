'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const s = localStorage.getItem('grp_session') || sessionStorage.getItem('grp_session')
    router.replace(s ? '/dashboard' : '/login')
  }, [router])
  return (
    <div style={{minHeight:'100vh',background:'#080c10',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,#00e676,#00c853)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#080c10',fontFamily:'Syne,sans-serif'}}>G</div>
    </div>
  )
}
