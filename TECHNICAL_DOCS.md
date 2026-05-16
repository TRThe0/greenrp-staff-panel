# GreenRP Staff Panel - Documentação Técnica

## 🏗️ Arquitetura

### Stack Tecnológico

- **Framework**: Next.js 14.2.3 (React 18)
- **Linguagem**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Lucide React
- **Auth**: Custom Session-based

### Estrutura de Diretórios

```
src/
├── app/
│   ├── api/              # API Routes (Next.js)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── logout/
│   │   ├── staffs/       # CRUD de funcionários
│   │   ├── cupons/       # Gestão de cupons
│   │   ├── avisos/       # Notificações
│   │   ├── logs/         # Atividades
│   │   └── seed/         # Inicialização DB
│   ├── login/            # Página de login
│   ├── dashboard/        # Dashboard principal
│   ├── staffs/           # Gestão de staff
│   ├── cupons/           # Histórico de cupons
│   ├── avisos/           # Avisos
│   ├── logs/             # Logs
│   ├── config/           # Configurações
│   ├── layout.tsx        # Layout global
│   ├── page.tsx          # Home
│   └── globals.css       # Estilos globais
├── components/
│   ├── Layout.tsx        # Wrapper de layout
│   └── Modal.tsx         # Modal reutilizável
└── lib/
    ├── supabase.ts       # Cliente Supabase
    ├── db-supabase.ts    # Funções DB
    ├── auth.tsx          # Context de autenticação
    └── utils.ts          # Utilitários (hash, datas)
```

---

## 🔐 Autenticação

### Flow

1. **Login**
   - Usuário entra `username` e `password`
   - POST `/api/auth/login`
   - API valida credenciais
   - Retorna `staff` data (sem senha)
   - Frontend armazena session em `localStorage` ou `sessionStorage`
   - Session contém: `userId`, `exp`, `perm`, `nome`

2. **Verificação de Sessão**
   - Na inicialização, `AuthProvider` verifica `localStorage`/`sessionStorage`
   - Se válida e não expirada, restaura user
   - Se expirada, limpa storage

3. **Logout**
   - POST `/api/auth/logout` com userId
   - API atualiza `online: false`
   - Frontend limpa storage
   - Redireciona para `/login`

### Context Hook

```typescript
const { user, login, logout, isLoading } = useAuth()

// user: Staff | null
// login(username, password, remember): Promise<boolean>
// logout(): Promise<void>
// isLoading: boolean
```

---

## 💾 Banco de Dados

### Tabelas

#### `staffs`
```sql
- id (BIGSERIAL PRIMARY KEY)
- nome, username, senha
- cargo, setor (TEXT[])
- carga, perm (admin|staff)
- cupom (UNIQUE), pct
- online, foto, entrada
- ultimaPromo, ultimoAcesso (TIMESTAMP)
- usos, valorGerado, comissaoTotal
- idRp (nullable)
- created_at, updated_at (TIMESTAMP)
```

#### `cupons`
```sql
- id (BIGSERIAL PRIMARY KEY)
- cupom, staff_id, staff_nome
- usadoPor, valor
- data (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### `avisos`
```sql
- id (BIGSERIAL PRIMARY KEY)
- tipo (info|warning|success|error)
- msg, autor
- data (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### `logs`
```sql
- id (BIGSERIAL PRIMARY KEY)
- type, icon, color, msg
- time (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### `promovidos`
```sql
- id (BIGSERIAL PRIMARY KEY)
- staff_id, staff_nome
- cargo_anterior, cargo_novo
- promotor_nome
- data (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### `counters`
```sql
- key (TEXT PRIMARY KEY)
- nextId, nextLogId, nextAvisoId, nextCupomId (BIGINT)
- updated_at (TIMESTAMP)
```

### Índices para Performance

```sql
idx_staffs_username (LOWER(username))
idx_staffs_cupom (UPPER(cupom))
idx_cupons_data (data DESC)
idx_avisos_data (data DESC)
idx_logs_data (time DESC)
idx_promovidos_data (data DESC)
```

---

## 🌐 API Endpoints

### Padrão de Resposta

```typescript
// Sucesso (2xx)
{
  // dados ou { ok: true }
}

// Erro (4xx, 5xx)
{
  error: "Descrição do erro"
}
```

### Endpoints

#### Auth
- `POST /api/auth/login` → `{ staff: Staff }`
- `POST /api/auth/logout` → `{ ok: true }`

#### Staffs
- `GET /api/staffs` → `Staff[]`
- `POST /api/staffs` → `Staff` (criado)
- `PUT /api/staffs/[id]` → `Staff` (atualizado)
- `DELETE /api/staffs/[id]` → `{ ok: true }`
- `POST /api/staffs/[id]/promover` → `{ ok: true }`

#### Cupons
- `GET /api/cupons` → `{ history: Cupom[], promovidos: Promovido[] }`
- `POST /api/cupons` → `Cupom` (criado)
- `POST /api/cupons/webhook` → `{ ok: true, staff, cupom, comissao }`
- `POST /api/cupons/reset` → `{ ok: true }`

#### Avisos
- `GET /api/avisos` → `Aviso[]`
- `POST /api/avisos` → `Aviso` (criado)
- `DELETE /api/avisos` → `{ ok: true }`

#### Logs
- `GET /api/logs` → `Log[]`
- `DELETE /api/logs` → `{ ok: true }`

#### Utilitários
- `GET /api/seed` → `{ ok: true, msg: "..." }`

---

## 🔄 Fluxo de Dados

### Criar Staff

```
Frontend Form
    ↓
POST /api/staffs
    ↓
Validar dados
    ↓
Verificar username único
    ↓
Gerar ID via incCounter
    ↓
Hash senha (hashPass)
    ↓
INSERT em staffs
    ↓
INSERT log
    ↓
Retornar staff (sem senha)
    ↓
Frontend atualiza lista
```

### Usar Cupom (Webhook)

```
Integração Externa
    ↓
POST /api/cupons/webhook
    ↓
{cupom, usadoPor, valorCompra}
    ↓
Buscar staff por cupom
    ↓
Calcular comissão = valor * (pct/100)
    ↓
INSERT em cupons
    ↓
UPDATE staffs (usos, valorGerado, comissaoTotal)
    ↓
INSERT log com detalhes
    ↓
Retornar {ok, staff, cupom, comissao}
```

---

## 🛡️ Validações

### Autenticação
- Username/password obrigatórios
- Username único (case-insensitive)
- Senha hash verificada

### Staff
- Nome, username, senha, cargo, cupom obrigatórios
- Username único
- Carga entre 0-100
- Percentual entre 0-100

### Cupom
- Cupom deve existir
- Valor numérico e positivo
- UsadoPor optional (padrão: "Anônimo")

---

## 🎨 Frontend Components

### Layout
```typescript
<AuthProvider>
  <Layout>
    <Navbar />
    <Sidebar />
    <main>{children}</main>
  </Layout>
</AuthProvider>
```

### Protected Routes
- Todas as páginas exceto `/login` requerem autenticação
- Verificar `user` do `useAuth()`
- Redirecionar para `/login` se não autenticado

---

## 📊 Tipos TypeScript

```typescript
interface Staff {
  id: number
  nome: string
  username: string
  cargo: string
  setor: string[]
  carga: number
  perm: 'admin' | 'staff'
  cupom: string
  pct: number
  online: boolean
  foto: string
  entrada: string
  ultimaPromo: string | null
  ultimoAcesso: string | null
  usos: number
  valorGerado: number
  comissaoTotal: number
  idRp: number | null
}

interface Cupom {
  id: number
  cupom: string
  staff_id: number
  staff_nome: string
  usadoPor: string
  valor: number
  data: string
}

interface Aviso {
  id: number
  tipo: 'info' | 'warning' | 'success' | 'error'
  msg: string
  autor: string
  data: string
}

interface Log {
  id: number
  type: string
  icon: string
  color: string
  msg: string
  time: string
}

interface Promovido {
  id: number
  staff_id: number
  staff_nome: string
  cargo_anterior: string
  cargo_novo: string
  promotor_nome: string
  data: string
}
```

---

## ⚙️ Configuração Supabase

### Variáveis Obrigatórias

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Clientes

```typescript
// Cliente (público)
import { supabase } from '@/lib/supabase'
// Usar em: Validações de entrada, queries rápidas

// Admin (servidor apenas)
import { supabaseAdmin } from '@/lib/supabase'
// Usar em: API routes, operações administrativas
```

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# 1. Push para GitHub
git push origin main

# 2. Conectar ao Vercel
# vercel.com → New Project → Import Git Repo

# 3. Adicionar Environment Variables
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY

# 4. Deploy automático em cada push
```

### Self-hosted (Node.js)

```bash
npm run build
npm run start
```

---

## 🔧 Development

### Iniciar Servidor
```bash
npm run dev
# http://localhost:3000
```

### Build
```bash
npm run build
```

### Lint
```bash
# Adicionar ESLint se necessário
npm install -D eslint
```

---

## 📝 Convenções

### Nomes de Arquivos
- Componentes: PascalCase (`Layout.tsx`)
- Utils/Hooks: camelCase (`auth.tsx`, `utils.ts`)
- Rotas API: kebab-case (`/api/auth/login`)

### TypeScript
- Sempre tipar props de componentes
- Usar `interface` para tipos públicos
- Usar `type` para tipos internos

### Commits Git
```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
refactor: refatorar código existente
test: adicionar testes
```

---

## 📚 Referências

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**Versão**: 1.0.0  
**Framework**: Next.js 14 + Supabase  
**Atualizado**: 2026-05-12
