# Green RP — Staff Panel

Painel administrativo moderno para gerenciamento de staff de servidor GreenRP, desenvolvido com Next.js 14 e banco de dados PostgreSQL via Supabase.

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- Supabase (grátis em supabase.com)

### 1. Clonar/Abrir Projeto
```bash
# Abrir a pasta no VSCode
# Ou navegar até a pasta via terminal
cd greenrp-staff-panel/greenrp
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Supabase
- Seguir [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para criar projeto e variáveis
- Copiar `.env.example` → `.env.local` e preencher com credenciais

### 4. Iniciar Servidor
```bash
npm run dev
```
- Acesse: http://localhost:3000
- Login automático para `/api/seed` para popular BD com dados de teste

## 📚 Documentação

- **Vite scaffold**: veja `vite-app/README.md` para um esqueleto inicial de cliente Vite (portar componentes)

## 👥 Usuários de Teste

| Usuário | Senha      | Cargo          | Permissão |
|---------|------------|----------------|-----------|
| bruno   | bruno123   | CEO            | Admin     |
| souza   | souza123   | Administrador  | Admin     |
| veio    | veio123    | Administrador  | Admin     |
| folha   | folha123   | Diretor        | Admin     |
| leo     | leo123     | Administrador  | Admin     |
| roxy    | roxy123    | Administrador  | Admin     |
| theo    | theo123    | Moderador      | Staff     |

## ✨ Features

- ✅ **Autenticação** - Sistema de login com sesssão persistente
- ✅ **Gestão de Staff** - CRUD completo de funcionários
- ✅ **Cupons** - Sistema de cupons com comissões automáticas
- ✅ **Webhook** - Integração com sistemas externos
- ✅ **Avisos** - Notificações do sistema
- ✅ **Logs** - Auditoria de atividades
- ✅ **Promoções** - Histórico de promoções de cargo
- ✅ **TypeScript** - Tipagem completa
- ✅ **Tailwind CSS** - Interface moderna e responsiva
- ✅ **Supabase** - Banco de dados confiável e escalável

## 🏗️ Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 3.4.1
- **UI Icons**: Lucide React
- **Auth**: Session-based + Cookie

## 📂 Estrutura

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Login/Logout
│   │   ├── staffs/       # CRUD Staff
│   │   ├── cupons/       # Cupons
│   │   ├── avisos/       # Avisos
│   │   └── logs/         # Logs
│   ├── login/            # Login page
│   ├── dashboard/        # Dashboard
│   └── [pages]/          # Outras páginas
├── components/           # React Components
├── lib/
│   ├── supabase.ts       # Cliente Supabase
│   ├── auth.tsx          # Auth Context
│   └── utils.ts          # Utilitários
└── public/               # Arquivos estáticos
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Staff
- `GET /api/staffs` - Listar
- `POST /api/staffs` - Criar
- `PUT /api/staffs/[id]` - Atualizar
- `DELETE /api/staffs/[id]` - Deletar
- `POST /api/staffs/[id]/promover` - Promover

### Cupons
- `GET /api/cupons` - Histórico
- `POST /api/cupons` - Usar cupom
- `POST /api/cupons/webhook` - Webhook
- `POST /api/cupons/reset` - Resetar

### Avisos
- `GET /api/avisos` - Listar
- `POST /api/avisos` - Criar
- `DELETE /api/avisos` - Deletar

### Logs
- `GET /api/logs` - Listar
- `DELETE /api/logs` - Limpar

[Mais exemplos em API_EXAMPLES.md](API_EXAMPLES.md)

## ⚙️ Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Veja [.env.example](.env.example) para mais info.

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# 1. Push para GitHub
git push origin main

# 2. Conectar ao Vercel (vercel.com)
# 3. Adicionar environment variables
# 4. Deploy automático
```

### Self-hosted

```bash
npm run build
npm start
```

## 🛠️ Scripts

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Constrói para produção
npm start        # Inicia servidor de produção
```

## 📖 Aprender Mais

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### "SUPABASE_URL não definido"
- Verificar `.env.local` existe
- Verificar variáveis preenchidas
- Reiniciar servidor

### "Conexão recusada"
- Verificar credenciais Supabase
- Verificar internet
- Verificar projeto Supabase ativo

### "Unauthorized"
- Verificar chaves no `.env.local`
- Verificar permissões no Supabase
- Verificar RLS policies

[Mais em SUPABASE_SETUP.md](SUPABASE_SETUP.md#troubleshooting)

## 🤝 Contribuindo

Este é um projeto privado. Contribuições devem ser aprovadas pelo admin.

## 📄 Licença

Propriedade privada de GreenRP. Todos os direitos reservados.

---

**Versão**: 1.0.0  
**Status**: ✅ Em Produção  
**Última atualização**: 2026-05-12

**Precisa de ajuda?**
- Leia [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- Leia [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
- Veja [API_EXAMPLES.md](API_EXAMPLES.md)
