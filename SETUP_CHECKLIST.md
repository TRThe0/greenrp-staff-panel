# ⚙️ Setup Checklist Final

Use este checklist para garantir que tudo está pronto para usar o painel.

## 🔴 PRÉ-REQUISITOS

- [ ] Node.js 18+ instalado (`node -v`)
- [ ] npm instalado (`npm -v`)
- [ ] Git instalado (`git -v`)
- [ ] Conta Supabase (grátis em supabase.com)
- [ ] Editor de código (VSCode recomendado)

## 🟠 FASE 1: SUPABASE

- [ ] Criar conta em supabase.com
- [ ] Criar novo projeto Supabase
- [ ] Aguardar projeto ser criado (3-5 min)
- [ ] Ir para Project Settings → API
- [ ] Copiar `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copiar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copiar `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Ir para SQL Editor
- [ ] Criar nova query
- [ ] Copiar conteúdo de `database.sql`
- [ ] Colar no SQL Editor do Supabase
- [ ] Clicar em RUN (aguarde conclusão)
- [ ] Verificar se todas as tabelas foram criadas
- [ ] Ir para Tables e validar:
  - [ ] staffs (7 registros)
  - [ ] cupons (vazio)
  - [ ] avisos (1 registro)
  - [ ] logs (1 registro)
  - [ ] promovidos (vazio)
  - [ ] counters (1 registro)

## 🟡 FASE 2: PROJETO LOCAL

### Clone/Preparação
- [ ] Abrir VSCode
- [ ] Abrir terminal (Ctrl + `)
- [ ] Navegar para pasta do projeto
- [ ] Comando: `cd greenrp-staff-panel/greenrp`

### Configuração
- [ ] Copiar `.env.example` → `.env.local`
- [ ] Abrir `.env.local`
- [ ] Preencher `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Preencher `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Preencher `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Salvar arquivo

### Dependências
- [ ] Executar: `npm install`
- [ ] Aguardar conclusão
- [ ] Verificar se não há erros

## 🟢 FASE 3: VALIDAÇÃO

### Servidor de Desenvolvimento
- [ ] Executar: `npm run dev`
- [ ] Aguardar "ready - started server on"
- [ ] Abrir navegador: `http://localhost:3000`

### Teste de Conexão
- [ ] Abrir new tab: `http://localhost:3000/api/seed`
- [ ] Deverá retornar: `{"ok":true,"msg":"Banco inicializado!"}`
- [ ] Fechar tab de seed
- [ ] Voltar para `http://localhost:3000`

### Login Test
- [ ] Username: `bruno`
- [ ] Password: `bruno123`
- [ ] Clicar em Login
- [ ] Deverá redirecionar para dashboard
- [ ] Verificar nome "Bruno" no painel
- [ ] Verificar cargo "CEO"

### Funcionalidades Básicas
- [ ] Menu → Staffs → Verificar 7 funcionários
- [ ] Menu → Avisos → Verificar 1 aviso
- [ ] Menu → Logs → Verificar logs de entrada
- [ ] Menu → Cupons → Verificar cupons vazios
- [ ] Menu → Config → Verificar página

## 🔵 FASE 4: TESTES DE API

Abrir outro terminal (Terminal → New Terminal)

### Test 1: Listar Staffs
```bash
curl http://localhost:3000/api/staffs
```
- [ ] Deverá retornar array com 7 staffs

### Test 2: Criar Aviso
```bash
curl -X POST http://localhost:3000/api/avisos \
  -H "Content-Type: application/json" \
  -d '{"tipo":"info","msg":"Teste API","autor":"Test"}'
```
- [ ] Deverá retornar novo aviso com ID

### Test 3: Listar Avisos
```bash
curl http://localhost:3000/api/avisos
```
- [ ] Deverá retornar 2 avisos (inicial + novo)

### Test 4: Webhook Cupom
```bash
curl -X POST http://localhost:3000/api/cupons/webhook \
  -H "Content-Type: application/json" \
  -d '{"cupom":"BRUNO2024","usadoPor":"Test","valorCompra":100}'
```
- [ ] Deverá retornar sucesso com comissão calculada

## 🟣 FASE 5: PÓS-SETUP

### Clean Up
- [ ] Fechar terminal de teste
- [ ] Manter `npm run dev` rodando
- [ ] Deletar aviso de teste se desejar

### Próximos Passos
- [ ] Ler README.md para visão geral
- [ ] Ler QUICK_REFERENCE.md para referência rápida
- [ ] Explorar API_EXAMPLES.md para exemplos
- [ ] Ler TECHNICAL_DOCS.md para entender arquitetura

### Git (Opcional)
- [ ] Criar commit: `git add .`
- [ ] Commit: `git commit -m "Setup Supabase"`
- [ ] Push: `git push origin main`

## ⚪ FASE 6: TROUBLESHOOTING

Se algo der errado, verificar:

### Erro ao instalar dependências
- [ ] `npm cache clean --force`
- [ ] `rm -rf node_modules`
- [ ] `npm install`

### Erro de conexão Supabase
- [ ] Verificar `.env.local` existe
- [ ] Verificar variáveis estão preenchidas
- [ ] Verificar projeto Supabase ativo
- [ ] Verificar internet conectada

### Erro ao fazer login
- [ ] Confirmar seed foi executado (`/api/seed`)
- [ ] Confirmar database.sql rodou completo
- [ ] Confirmar table `staffs` tem 7 registros

### Servidor não inicia
- [ ] Verificar porta 3000 não está em uso
- [ ] `npm run build` para validar TypeScript
- [ ] Verificar erros no console

### API retorna erro 500
- [ ] Verificar console do servidor
- [ ] Verificar `.env.local` preenchido
- [ ] Verificar Supabase online
- [ ] Verificar dados enviados (formato JSON)

## 📋 VALIDAÇÃO FINAL

Marque quando tudo estiver pronto:

```
Login e Autenticação:
  [ ] Login funciona
  [ ] Logout funciona
  [ ] Sessão persiste
  [ ] Proteção de rotas funciona

CRUD de Staff:
  [ ] Listar staffs
  [ ] Criar staff
  [ ] Editar staff
  [ ] Deletar staff
  [ ] Promover staff

Sistema de Cupons:
  [ ] Listar histórico
  [ ] Usar cupom
  [ ] Webhook funciona
  [ ] Reset funciona

Avisos e Logs:
  [ ] Criar aviso
  [ ] Deletar aviso
  [ ] Ver logs
  [ ] Limpar logs

API Endpoints:
  [ ] Todas rotas GET funcionam
  [ ] Todas rotas POST funcionam
  [ ] Todas rotas PUT funcionam
  [ ] Todas rotas DELETE funcionam

Banco de Dados:
  [ ] Conecta ao Supabase
  [ ] Queries funcionam rápido
  [ ] Dados persistem
  [ ] Seed funciona

Documentação:
  [ ] README.md lido
  [ ] QUICK_REFERENCE.md lido
  [ ] TECHNICAL_DOCS.md consultado
  [ ] API_EXAMPLES.md revisado
```

## ✅ STATUS FINAL

Quando tudo está pronto:

```
┌─────────────────────────────────┐
│  ✅ SETUP COMPLETO!             │
│                                 │
│  Projeto pronto para:           │
│  • Desenvolvimento              │
│  • Staging                      │
│  • Produção                     │
│                                 │
│  Próximos passos:               │
│  1. Ler documentação             │
│  2. Explorar funcionalidades    │
│  3. Customizar conforme needed  │
│  4. Deploy                      │
└─────────────────────────────────┘
```

## 🆘 PRECISA DE AJUDA?

1. **Setup Supabase**: Leia [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. **Referência Rápida**: Leia [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. **Exemplos API**: Leia [API_EXAMPLES.md](API_EXAMPLES.md)
4. **Arquitetura**: Leia [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
5. **Migração**: Leia [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

**Tempo estimado para completar este checklist**: 30-45 minutos

**Data de Checklist**: _______________

**Status**: [ ] Completo  [ ] Em Progresso  [ ] Pendente

**Assinatura/Data**: _______________
