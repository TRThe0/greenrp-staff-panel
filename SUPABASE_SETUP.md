# GreenRP Staff Panel - Supabase Setup Guide

## 📋 Descrição

Painel de gerenciamento de staff para GreenRP com banco de dados Supabase (PostgreSQL).

## 🚀 Configuração Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Project Name**: greenrp-panel
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
5. Clique em "Create new project" e aguarde (pode levar alguns minutos)

### 2. Executar SQL Schema

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo [database.sql](database.sql)
4. Clique em **RUN** e aguarde a execução

### 3. Configurar Variáveis de Ambiente

1. Copie `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. No Supabase Dashboard, vá para **Project Settings** → **API**

3. Copie os valores:
   - `NEXT_PUBLIC_SUPABASE_URL`: Copie de "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Copie de "anon public"
   - `SUPABASE_SERVICE_ROLE_KEY`: Copie de "service_role" (mantenha em segredo!)

4. Cole no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Inicializar Banco de Dados

```bash
npm run dev
```

Acesse `http://localhost:3000/api/seed` para popular o banco com dados de teste.

### 6. Fazer Login

Use as credenciais de teste:
- **Username**: `bruno`
- **Password**: `bruno123`

## 🔐 Configuração de Segurança

### Row Level Security (RLS)

Para ativar RLS no Supabase (recomendado em produção):

1. No **SQL Editor**, execute:

```sql
-- Enable RLS
ALTER TABLE staffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE promovidos ENABLE ROW LEVEL SECURITY;

-- Create policies here if needed
```

### Variáveis de Ambiente em Produção

- Nunca envie `SUPABASE_SERVICE_ROLE_KEY` para o cliente
- Use apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no frontend
- Mantenha `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor (.env local)

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Constrói para produção
npm start        # Inicia servidor de produção
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Staff
- `GET /api/staffs` - Listar todos
- `POST /api/staffs` - Criar novo
- `PUT /api/staffs/[id]` - Atualizar
- `DELETE /api/staffs/[id]` - Deletar
- `POST /api/staffs/[id]/promover` - Promover staff

### Cupons
- `GET /api/cupons` - Histórico de cupons
- `POST /api/cupons` - Usar cupom
- `POST /api/cupons/webhook` - Webhook para integrações
- `POST /api/cupons/reset` - Resetar cupons do mês

### Avisos
- `GET /api/avisos` - Listar avisos
- `POST /api/avisos` - Criar aviso
- `DELETE /api/avisos` - Deletar aviso

### Logs
- `GET /api/logs` - Listar logs
- `DELETE /api/logs` - Limpar logs

### Utilitários
- `GET /api/seed` - Popular banco com dados de teste

## 🐛 Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL não definido"

Certifique-se de que:
- O arquivo `.env.local` existe
- As variáveis estão definidas corretamente
- Reinicie o servidor (`npm run dev`)

### Erro: "Conexão recusada"

- Verifique se o projeto Supabase está criado e ativo
- Verifique as credenciais no `.env.local`
- Verifique sua conexão de internet

### Erro: "Unauthorized"

- Verifique se está usando a chave correta
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` é para o cliente
- `SUPABASE_SERVICE_ROLE_KEY` é apenas para o servidor

## 📖 Estrutura de Dados

### Tabelas Principais

#### `staffs` - Funcionários
- `id`: ID único
- `nome`: Nome do funcionário
- `username`: Username para login
- `senha`: Senha hash
- `cargo`: Cargo (CEO, Administrador, etc)
- `setor`: Array de setores
- `cupom`: Código de cupom único
- `pct`: Percentual de comissão
- `usos`: Total de cupons usados
- `valorGerado`: Total gerado em vendas
- `comissaoTotal`: Total de comissão

#### `cupons` - Histórico de Cupons
- `id`: ID único
- `cupom`: Código do cupom usado
- `staff_id`: Referência ao funcionário
- `usadoPor`: Identificação de quem usou
- `valor`: Valor da transação
- `data`: Data/hora da transação

#### `avisos` - Notificações
- `id`: ID único
- `tipo`: Tipo (info, warning, success, error)
- `msg`: Mensagem
- `autor`: Quem criou
- `data`: Data/hora de criação

#### `logs` - Atividades
- `id`: ID único
- `type`: Tipo de atividade
- `icon`: Ícone Lucide
- `color`: Cor da badge
- `msg`: Mensagem com HTML permitido
- `time`: Data/hora

#### `promovidos` - Histórico de Promoções
- `id`: ID único
- `staff_id`: Referência ao funcionário
- `cargo_anterior`: Cargo anterior
- `cargo_novo`: Novo cargo
- `promotor_nome`: Quem fez a promoção
- `data`: Data/hora

## 🤝 Contribuindo

Este é um projeto privado. Para contribuições, contate o admin.

## 📝 Licença

Propriedade privada de GreenRP.

---

**Versão**: 1.0.0  
**Última atualização**: 2026-05-12
