// API Usage Examples - GreenRP Staff Panel

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

// Login
async function login() {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'bruno',
      password: 'bruno123',
    }),
  })
  const { staff } = await response.json()
  console.log('Staff:', staff)
}

// Logout
async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 1 }),
  })
  console.log('Logout:', await response.json())
}

// ============================================================================
// STAFFS
// ============================================================================

// Listar todos os staffs
async function listStaffs() {
  const response = await fetch('/api/staffs')
  const staffs = await response.json()
  console.log('Staffs:', staffs)
}

// Criar novo staff
async function createStaff() {
  const response = await fetch('/api/staffs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Novo Staff',
      username: 'novostaff',
      senha: 'senha123',
      cargo: 'Moderador',
      setor: ['Suporte'],
      carga: 15,
      perm: 'staff',
      cupom: 'NOVO20',
      pct: 20,
      entrada: '2026-05-12',
      atorNome: 'bruno',
    }),
  })
  const staff = await response.json()
  console.log('Created:', staff)
}

// Atualizar staff
async function updateStaff(id: number) {
  const response = await fetch(`/api/staffs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Nome Atualizado',
      cargo: 'Diretor',
      pct: 25,
      atorNome: 'bruno',
    }),
  })
  const staff = await response.json()
  console.log('Updated:', staff)
}

// Promover staff
async function promoteStaff(id: number) {
  const response = await fetch(`/api/staffs/${id}/promover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      novoCargo: 'Administrador',
      novoSetor: ['Administração'],
      atorNome: 'bruno',
    }),
  })
  console.log('Promoted:', await response.json())
}

// Deletar staff
async function deleteStaff(id: number) {
  const response = await fetch(`/api/staffs/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ atorNome: 'bruno' }),
  })
  console.log('Deleted:', await response.json())
}

// ============================================================================
// CUPONS
// ============================================================================

// Listar cupons e promoções
async function listCupons() {
  const response = await fetch('/api/cupons')
  const { history, promovidos } = await response.json()
  console.log('History:', history)
  console.log('Promovidos:', promovidos)
}

// Usar cupom (manual)
async function useCoupon() {
  const response = await fetch('/api/cupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cupom: 'BRUNO2024',
      usadoPor: 'Cliente Teste',
      valor: 100.0,
    }),
  })
  const uso = await response.json()
  console.log('Cupom usado:', uso)
}

// Webhook - Usar cupom (integração externa)
async function webhookCoupon() {
  const response = await fetch('/api/cupons/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cupom: 'BRUNO2024',
      usadoPor: 'Loja Integrada',
      valorCompra: 250.5,
    }),
  })
  const result = await response.json()
  console.log('Comissão calculada:', result.comissao)
}

// Resetar cupons do mês
async function resetCoupons() {
  const response = await fetch('/api/cupons/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ atorNome: 'bruno' }),
  })
  console.log('Reset:', await response.json())
}

// ============================================================================
// AVISOS
// ============================================================================

// Listar avisos
async function listAvisos() {
  const response = await fetch('/api/avisos')
  const avisos = await response.json()
  console.log('Avisos:', avisos)
}

// Criar aviso
async function createAviso() {
  const response = await fetch('/api/avisos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo: 'info',
      msg: 'Bem-vindo ao painel!',
      autor: 'Sistema',
    }),
  })
  const aviso = await response.json()
  console.log('Aviso criado:', aviso)
}

// Deletar aviso
async function deleteAviso(id: number) {
  const response = await fetch('/api/avisos', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  console.log('Deletado:', await response.json())
}

// ============================================================================
// LOGS
// ============================================================================

// Listar logs
async function listLogs() {
  const response = await fetch('/api/logs')
  const logs = await response.json()
  console.log('Logs:', logs)
}

// Limpar logs
async function clearLogs() {
  const response = await fetch('/api/logs', {
    method: 'DELETE',
  })
  console.log('Limpo:', await response.json())
}

// ============================================================================
// SEED/INICIALIZAÇÃO
// ============================================================================

// Popular banco com dados de teste
async function seedDatabase() {
  const response = await fetch('/api/seed')
  console.log('Seed:', await response.json())
}

// ============================================================================
// REACT/HOOKS - Exemplos de Uso
// ============================================================================

import { useAuth } from '@/lib/auth'

export function DashboardExample() {
  const { user, login, logout, isLoading } = useAuth()

  const handleLogin = async () => {
    const success = await login('bruno', 'bruno123', true)
    if (success) {
      console.log('Login bem-sucedido!')
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return (
      <button onClick={handleLogin}>
        Fazer Login
      </button>
    )
  }

  return (
    <div>
      <h1>Bem-vindo, {user.nome}!</h1>
      <p>Cargo: {user.cargo}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}
