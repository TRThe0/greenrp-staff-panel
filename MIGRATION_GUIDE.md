# Migration Guide: MongoDB → Supabase

## Resumo das Mudanças

Este guia descreve as mudanças realizadas para migrar o banco de dados de **MongoDB para Supabase (PostgreSQL)**.

---

## 📁 Arquivos Criados

### 1. `database.sql`
Schema SQL completo para Supabase com todas as tabelas, índices e dados iniciais.

### 2. `src/lib/supabase.ts`
Cliente Supabase com tipagem TypeScript completa.

**Uso:**
```typescript
import { supabase, supabaseAdmin } from '@/lib/supabase'

// No cliente
const { data, error } = await supabase.from('staffs').select('*')

// No servidor
const { data, error } = await supabaseAdmin.from('staffs').select('*')
```

### 3. `src/lib/db-supabase.ts`
Funções de banco de dados adaptadas para Supabase (substitui `db.ts` e `db-mongodb.ts`).

**Funções principais:**
- `getCounters()` - Obter contadores
- `incCounter(field)` - Incrementar contador
- `addLog(type, icon, color, msg)` - Adicionar log
- `findStaffByUsername(username)` - Buscar staff
- `updateStaffOnline(id, online)` - Atualizar status online
- `updateStaffComissions(id, usos, valorGerado, pct)` - Atualizar comissões

### 4. `.env.example`
Variáveis de ambiente necessárias atualizadas para Supabase.

---

## 🔄 Arquivos Modificados

### API Routes

#### `/api/auth/login/route.ts`
```typescript
// Antes: getDB() → MongoDB
// Depois: supabaseAdmin.from('staffs').select()
```

#### `/api/auth/logout/route.ts`
```typescript
// Antes: db.collection('staffs').updateOne()
// Depois: supabaseAdmin.from('staffs').update()
```

#### `/api/staffs/route.ts`
```typescript
// Antes: db.collection('staffs').find().toArray()
// Depois: supabaseAdmin.from('staffs').select('*')
```

#### `/api/staffs/[id]/route.ts`
```typescript
// PUT - Atualizar staff
// DELETE - Deletar staff
// Ambos migrados para Supabase
```

#### `/api/staffs/[id]/promover/route.ts`
```typescript
// Agora usa:
// - supabaseAdmin.from('staffs').update()
// - supabaseAdmin.from('promovidos').insert()
```

#### `/api/cupons/route.ts`
```typescript
// GET - Listar cupons e promovidos
// POST - Usar cupom
// Migrado para Supabase com cálculo correto de comissões
```

#### `/api/cupons/reset/route.ts`
```typescript
// Resetar todos os cupons e valores do mês
// Antes: deleteMany() e updateMany()
// Depois: delete().neq() e update().neq()
```

#### `/api/cupons/webhook/route.ts`
```typescript
// Webhook para integrações externas
// Agora com suporte completo a Supabase
```

#### `/api/avisos/route.ts`
```typescript
// GET, POST, DELETE de avisos
// Migrado para Supabase
```

#### `/api/logs/route.ts`
```typescript
// GET e DELETE de logs
// Migrado para Supabase
```

#### `/api/seed/route.ts`
```typescript
// Remover função hashPass local
// Usar hashPass do lib/utils.ts
// Usar supabaseAdmin para todas as operações
```

### Frontend

#### `src/lib/auth.tsx`
```typescript
// Antes: Lógica local com DB.get/DB.set
// Depois: Chamadas HTTP à API com fetch

// Mudanças principais:
// - login() agora é async
// - logout() agora é async
// - Adicionado isLoading state
// - Sessão validada via HTTP em vez de estar local

export interface Staff {
  id: number
  nome: string
  username: string
  cargo: string
  // ... outros campos
}
```

#### `src/lib/utils.ts`
```typescript
// Adicionado hashPass e checkPass (não modificado)
// Continuam funcionando igual
```

---

## 🔐 Diferenças SQL vs MongoDB

| Operação | MongoDB | PostgreSQL (Supabase) |
|----------|---------|----------------------|
| Criar | `insertOne()` | `insert()` |
| Listar | `find().toArray()` | `select('*')` |
| Filtrar | `findOne({field: value})` | `select('*').eq('field', value).single()` |
| Atualizar | `updateOne({id}, {$set: {}})` | `update({}).eq('id', value)` |
| Deletar | `deleteOne({id})` | `delete().eq('id', value)` |
| Incrementar | `{$inc: {field: 1}}` | Buscar, incrementar, atualizar |
| Case-insensitive | `$regex` | `ilike()` |

---

## 📦 Dependências Adicionadas

```json
{
  "@supabase/supabase-js": "^2.38.0"
}
```

### Instalar:
```bash
npm install @supabase/supabase-js
```

---

## 🚀 Passo a Passo para Migração

### 1. Preparação
```bash
# Clonar/atualizar repositório
git pull origin main

# Instalar dependências
npm install
```

### 2. Criar Projeto Supabase
Seguir [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### 3. Executar Schema SQL
- Copiar conteúdo de `database.sql`
- Colar no Supabase SQL Editor
- Executar

### 4. Configurar Variáveis de Ambiente
```bash
# Copiar template
cp .env.example .env.local

# Preencher com credenciais do Supabase
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### 5. Testar Conexão
```bash
npm run dev

# Acessar http://localhost:3000/api/seed
# Isso irá popular o banco com dados de teste
```

### 6. Verificar Dados
- Ir para Supabase Dashboard
- Verificar se as tabelas foram criadas
- Verificar se os dados foram inseridos

### 7. Testar Aplicação
- Acessar http://localhost:3000/login
- Tentar login com `bruno` / `bruno123`
- Verificar se funciona normalmente

---

## 🔍 Verificação Pós-Migração

### Checklist

- [ ] Todas as tabelas criadas no Supabase
- [ ] Schema.sql sem erros
- [ ] .env.local preenchido corretamente
- [ ] `npm install` executado
- [ ] Servidor iniciado sem erros
- [ ] /api/seed executado com sucesso
- [ ] Login funcionando
- [ ] Listar staffs funcionando
- [ ] Criar staff funcionando
- [ ] Atualizar staff funcionando
- [ ] Promover staff funcionando
- [ ] Deletar staff funcionando
- [ ] Usar cupom funcionando
- [ ] Avisos funcionando
- [ ] Logs funcionando

---

## 🆘 Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL não definido"

**Solução:**
1. Verificar se .env.local existe
2. Verificar se variáveis estão definidas
3. Reiniciar servidor: `npm run dev`

### Erro: "Falha de conexão ao Supabase"

**Solução:**
1. Verificar URL e chaves no .env.local
2. Verificar se o projeto Supabase está ativo
3. Verificar conexão de internet
4. Testar URL diretamente no navegador

### Erro: "Unauthorized" em operações

**Solução:**
1. Verificar se está usando corretamente:
   - `supabase` (client-side com ANON_KEY)
   - `supabaseAdmin` (server-side com SERVICE_ROLE_KEY)
2. Verificar se tem permissão para a tabela
3. Verificar RLS policies se habilitado

### Erro: "Tipo de dado incompatível"

**Solução:**
1. Verificar tipagem em TypeScript
2. Verificar tipos de coluna no Supabase
3. Converter valores antes de inserir

---

## 📊 Estrutura de Dados Comparada

### staffs
```typescript
// MongoDB
{
  _id: ObjectId,
  id: Number,
  nome: String,
  ...
}

// PostgreSQL (Supabase)
{
  id: BIGSERIAL (PRIMARY KEY),
  nome: TEXT NOT NULL,
  ...
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
}
```

### Mudanças Principais

1. **IDs**: MongoDB usa `_id` ObjectId, Supabase usa BIGSERIAL
2. **Arrays**: MongoDB nativo, Supabase usa `TEXT[]`
3. **Timestamps**: Adicionados `created_at` e `updated_at`
4. **Índices**: PostgreSQL com índices para performance

---

## 🔄 Rollback (Se Necessário)

Caso precise voltar para MongoDB:

```bash
# Checkout de versão anterior
git checkout HEAD~1

# Ou fazer checkout de branch MongoDB
git checkout mongodb-backup

# Reinstalar dependências
npm install

# Restaurar .env.local com MongoDB URI
# Reiniciar servidor
npm run dev
```

---

## 📝 Notas Importantes

1. **Supabase é PostgreSQL** - Pode migrar para qualquer banco PostgreSQL
2. **Tipagem TypeScript** - Database type está em `supabase.ts`
3. **Service Role Key** - Nunca expor em cliente
4. **RLS Policies** - Considerar ativar em produção
5. **Backups** - Supabase fornece backups automáticos

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase JavaScript Library](https://supabase.com/docs/reference/javascript/introduction)
- [API Examples](API_EXAMPLES.md)

---

**Data de Migração**: 2026-05-12  
**Versão Anterior**: MongoDB  
**Versão Atual**: Supabase PostgreSQL
