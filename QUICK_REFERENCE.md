# ⚡ Quick Reference - GreenRP Staff Panel

## 🚀 Setup em 5 Minutos

### 1. Criar Projeto Supabase
```
1. Ir para supabase.com
2. Criar novo projeto
3. Aguardar ~3-5 minutos
4. Copiar URL e chaves
```

### 2. Configurar Projeto
```bash
# Clonar/abrir pasta
cd greenrp-staff-panel/greenrp

# Copiar .env
cp .env.example .env.local

# Editar .env.local e adicionar:
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Executar SQL
```
1. Supabase Dashboard → SQL Editor
2. New Query
3. Copiar conteúdo de database.sql
4. RUN
```

### 4. Instalar & Rodar
```bash
npm install
npm run dev
# Ir para http://localhost:3000/api/seed
# Depois acessar http://localhost:3000
```

### 5. Fazer Login
```
Username: bruno
Password: bruno123
```

---

## 📖 Documentos Importantes

| Documento | Quando Usar |
|-----------|-------------|
| [README.md](README.md) | Visão geral do projeto |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Setup detalhado |
| [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) | Entender arquitetura |
| [API_EXAMPLES.md](API_EXAMPLES.md) | Usar a API |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Entender mudanças |

---

## 🔑 Variáveis de Ambiente

```env
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Onde encontrar:**
1. Supabase Dashboard
2. Project Settings → API
3. Copiar valores respectivos

---

## 🌐 API Endpoints

### Auth
```bash
POST /api/auth/login
{ "username": "bruno", "password": "bruno123" }

POST /api/auth/logout
{ "userId": 1 }
```

### Staff
```bash
GET  /api/staffs                    # Listar
POST /api/staffs                    # Criar
PUT  /api/staffs/1                  # Atualizar
DELETE /api/staffs/1                # Deletar
POST /api/staffs/1/promover         # Promover
```

### Cupons
```bash
GET  /api/cupons                    # Listar
POST /api/cupons                    # Usar
POST /api/cupons/webhook            # Webhook
POST /api/cupons/reset              # Resetar
```

### Avisos
```bash
GET    /api/avisos                  # Listar
POST   /api/avisos                  # Criar
DELETE /api/avisos                  # Deletar
```

### Logs
```bash
GET    /api/logs                    # Listar
DELETE /api/logs                    # Limpar
```

### Utilitários
```bash
GET /api/seed                       # Seed database
```

[Mais em API_EXAMPLES.md](API_EXAMPLES.md)

---

## 🎯 Casos de Uso Comuns

### 1. Criar Novo Staff
```bash
curl -X POST http://localhost:3000/api/staffs \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "username": "joao",
    "senha": "senha123",
    "cargo": "Moderador",
    "cupom": "JOAO20",
    "pct": 20,
    "atorNome": "bruno"
  }'
```

### 2. Usar Cupom
```bash
curl -X POST http://localhost:3000/api/cupons \
  -H "Content-Type: application/json" \
  -d '{
    "cupom": "BRUNO2024",
    "usadoPor": "Cliente X",
    "valor": 100.50
  }'
```

### 3. Promover Staff
```bash
curl -X POST http://localhost:3000/api/staffs/1/promover \
  -H "Content-Type: application/json" \
  -d '{
    "novoCargo": "Administrador",
    "novoSetor": ["Administração"],
    "atorNome": "bruno"
  }'
```

### 4. Integração Webhook (Externa)
```bash
curl -X POST http://localhost:3000/api/cupons/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "cupom": "BRUNO2024",
    "usadoPor": "Loja Integrada",
    "valorCompra": 500.00
  }'
```

---

## 🏗️ Estrutura de Pastas

```
src/
├── app/
│   ├── api/              # Rotas API
│   ├── login/            # Login page
│   ├── dashboard/        # Dashboard
│   ├── staffs/           # Staffs page
│   ├── cupons/           # Cupons page
│   ├── avisos/           # Avisos page
│   ├── logs/             # Logs page
│   └── config/           # Config page
├── components/
│   ├── Layout.tsx        # Layout wrapper
│   └── Modal.tsx         # Modal component
└── lib/
    ├── supabase.ts       # Supabase client
    ├── db-supabase.ts    # DB functions
    ├── auth.tsx          # Auth context
    └── utils.ts          # Utils
```

---

## 🔐 Segurança Básica

### Não Fazer
```typescript
// ❌ Nunca exponha SUPABASE_SERVICE_ROLE_KEY
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY  // Públicamente

// ❌ Não armazene passwords em localStorage
localStorage.setItem('password', password)

// ❌ Não confie 100% em dados do cliente
const user = request.body.user  // Validar sempre
```

### Fazer
```typescript
// ✅ Use chaves corretas por contexto
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // OK
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY      // Servidor only

// ✅ Armazene apenas tokens/sessions
localStorage.setItem('session', JSON.stringify({userId, exp}))

// ✅ Sempre valide dados de entrada
if (!nombre || !username) return error()
```

---

## 🚨 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "URL não definida" | Verificar `.env.local` |
| "Unauthorized" | Verificar chaves no `.env.local` |
| "Conexão recusada" | Verificar Supabase ativo |
| "Username em uso" | Escolher outro username |
| "Cupom não encontrado" | Verificar cupom existe |
| "Servidor não inicia" | Deletar `node_modules`, `npm install` |

---

## 📊 Dados de Teste

### Staffs Pré-configurados
```
bruno   / bruno123   / CEO
souza   / souza123   / Administrador
veio    / veio123    / Administrador
folha   / folha123   / Diretor
leo     / leo123     / Administrador
roxy    / roxy123    / Administrador
theo    / theo123    / Moderador
```

### Cupons de Teste
```
BRUNO2024   (Bruno 15%)
SOUZA10     (Souza 10%)
VEIO15      (Veio 15%)
FOLHA20     (Folha 20%)
LEO10       (Leo 10%)
ROXY10      (Roxy 10%)
THEO5       (Theo 5%)
```

---

## 📱 React Hooks

### useAuth()
```typescript
import { useAuth } from '@/lib/auth'

const { user, login, logout, isLoading } = useAuth()

// user: Staff | null
// login(username, password, remember): Promise<boolean>
// logout(): Promise<void>
// isLoading: boolean
```

---

## 🌐 HTTP Methods

```
GET     - Ler dados
POST    - Criar dados
PUT     - Atualizar dados
DELETE  - Deletar dados
```

---

## 💾 Supabase Dashboard

### URLs Úteis
```
Project: https://app.supabase.com/projects
Editor: Dashboard → SQL Editor
Tables: Dashboard → Tables
API: Dashboard → Project Settings → API
Logs: Dashboard → Logs
```

---

## 📦 Scripts NPM

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Build para produção
npm start        # Rodar build (produção)
npm install      # Instalar dependências
```

---

## 🔄 Workflow Típico de Desenvolvimento

```
1. Edit código
2. Save file (hot reload automático)
3. Testar no navegador
4. Verificar console de erros
5. Commit quando pronto
```

---

## 🎓 Aprender Mais

```bash
# Documentação do projeto
cat README.md                  # Visão geral
cat SUPABASE_SETUP.md         # Setup Supabase
cat TECHNICAL_DOCS.md         # Arquitetura
cat API_EXAMPLES.md           # Exemplos API

# Documentação oficial
https://nextjs.org            # Next.js
https://supabase.com/docs     # Supabase
https://www.typescriptlang.org/docs  # TypeScript
```

---

## ✅ Pré-Deploy Checklist

```
[ ] npm install funcionando
[ ] npm run build sem erros
[ ] .env.local preenchido
[ ] Supabase project ativo
[ ] database.sql executado
[ ] /api/seed respondendo 200
[ ] Login funcionando
[ ] Staff list funcionando
[ ] Cupom webhook funcionando
```

---

## 🚀 Deploy Rápido (Vercel)

```bash
# 1. Push para GitHub
git add .
git commit -m "Deploy Supabase"
git push origin main

# 2. Vercel (interface web)
# → New Project → Import Git Repo
# → Add Environment Variables
# → Deploy

# 3. Pronto! 🎉
```

---

## 📞 Ajuda Rápida

| Preciso de... | Vejo... |
|---------------|---------|
| Setup Supabase | [SUPABASE_SETUP.md](SUPABASE_SETUP.md) |
| Exemplos de API | [API_EXAMPLES.md](API_EXAMPLES.md) |
| Arquitetura | [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) |
| Migração | [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) |
| Geral | [README.md](README.md) |

---

**Última atualização**: 2026-05-12  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para usar
