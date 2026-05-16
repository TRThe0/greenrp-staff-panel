# 🚀 Deployment Guide

Guia completo para deploy do painel em produção.

---

## 🎯 Opções de Deployment

### 1. **Vercel** (Recomendado - Easiest)
### 2. **Netlify**
### 3. **AWS**
### 4. **Google Cloud**
### 5. **Self-hosted (VPS)**

---

## ✅ PRÉ-REQUISITOS PARA QUALQUER DEPLOYMENT

```
[ ] npm run build sem erros
[ ] npm run start funciona localmente
[ ] .env variáveis confirmadas
[ ] Supabase project pronto
[ ] database.sql executado
[ ] Domínio comprado (opcional)
[ ] SSL certificate ready (se self-hosted)
```

---

## 🟢 OPÇÃO 1: VERCEL (Recomendado)

### Passo 1: Preparar Repositório Git

```bash
# Inicializar git (se não estiver)
git init

# Adicionar remote (substitua URL)
git remote add origin https://github.com/seu-usuario/greenrp-panel.git

# Commit inicial
git add .
git commit -m "Initial commit: Supabase migration"

# Push
git push origin main
```

### Passo 2: Conectar ao Vercel

1. Acessar [vercel.com](https://vercel.com)
2. Fazer login com GitHub
3. Clicar "New Project"
4. Selecionar repositório
5. Clicar "Import"

### Passo 3: Configurar Environment Variables

Na tela de configuração do Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Passo 4: Deploy

1. Clicar "Deploy"
2. Aguardar conclusão (~2-3 min)
3. Acessar URL fornecida

### Passo 5: Verificar

```bash
# Seu site estará em:
# https://greenrp-panel-xxxxx.vercel.app

# Testar endpoints:
curl https://greenrp-panel-xxxxx.vercel.app/api/staffs
```

### Vantagens
- ✅ Deploy automático com cada push
- ✅ Escalamento automático
- ✅ Free tier generoso
- ✅ Custom domain fácil
- ✅ Analytics integrado

### Deploy Automático
De agora em diante, cada push automáticamente faz deploy:
```bash
git add .
git commit -m "Feature: add new feature"
git push origin main
# Vercel faz deploy automaticamente!
```

---

## 🟠 OPÇÃO 2: NETLIFY

### Passo 1: Preparar Projeto

```bash
# Instalar Netlify CLI (opcional)
npm install -g netlify-cli
```

### Passo 2: Conectar

1. Acessar [netlify.com](https://netlify.com)
2. Fazer login com GitHub
3. Clicar "New site from Git"
4. Selecionar repositório
5. Clicar "Deploy"

### Passo 3: Environment Variables

1. Site settings → Build & deploy → Environment
2. Adicionar variáveis
3. Redeploy

### Passo 4: Custom Domain

1. Domain settings → Add custom domain
2. Configurar DNS

---

## 🟡 OPÇÃO 3: AWS

### Opções no AWS

1. **Elastic Beanstalk** (Easiest)
2. **EC2** (Full Control)
3. **ECS** (Docker)
4. **App Runner** (Managed)

### Elastic Beanstalk (Recomendado)

```bash
# 1. Instalar EB CLI
pip install awsebcli --upgrade --user

# 2. Inicializar
eb init -p node.js-18 greenrp-panel

# 3. Criar environment
eb create greenrp-panel-prod

# 4. Deploy
eb deploy

# 5. Abrir
eb open
```

### Configurar Environment Variables

```bash
eb setenv NEXT_PUBLIC_SUPABASE_URL=... \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 🔵 OPÇÃO 4: GOOGLE CLOUD

### Google Cloud Run

```bash
# 1. Instalar Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# 2. Inicializar
gcloud init

# 3. Deploy
gcloud run deploy greenrp-panel \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🟣 OPÇÃO 5: SELF-HOSTED (VPS)

### Requisitos

- VPS (ex: DigitalOcean, Linode, Hetzner)
- Node.js 18+
- PostgreSQL ou acesso Supabase
- Nginx/Apache para reverse proxy
- SSL certificate (Let's Encrypt grátis)

### Step-by-Step

#### 1. Conectar ao Servidor

```bash
ssh root@seu-servidor-ip
```

#### 2. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. Clonar Repositório

```bash
cd /var/www
git clone https://github.com/seu-usuario/greenrp-panel.git
cd greenrp-panel/greenrp
```

#### 4. Instalar Dependências

```bash
npm install --production
```

#### 5. Configurar .env

```bash
nano .env.local
# Adicionar variáveis
# Ctrl + X, Y, Enter para salvar
```

#### 6. Build

```bash
npm run build
```

#### 7. Instalar PM2 (Process Manager)

```bash
npm install -g pm2
```

#### 8. Iniciar App

```bash
pm2 start npm --name "greenrp-panel" -- start
pm2 startup
pm2 save
```

#### 9. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/greenrp
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/greenrp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 10. SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

#### 11. Verificar

```bash
# Seu site estará em:
# https://seu-dominio.com
```

### Atualizações (Self-hosted)

```bash
cd /var/www/greenrp-panel/greenrp
git pull origin main
npm install --production
npm run build
pm2 restart greenrp-panel
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automático)

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 Monitoramento Post-Deploy

### 1. Verificar Saúde da Aplicação

```bash
curl https://seu-site.com/api/staffs
# Deve retornar 200 com dados
```

### 2. Verificar Logs

**Vercel**: Dashboard → Deployments → Logs
**Self-hosted**: `pm2 logs greenrp-panel`

### 3. Monitorar Performance

- Vercel: Built-in analytics
- Self-hosted: Google Analytics + Sentry

### 4. Alertas

Configure alertas para:
- ❌ Erro 5xx
- ⚠️ Response time > 2s
- 📉 Memory > 80%

---

## 🔐 Segurança em Produção

### Checklist

- [ ] `NODE_ENV=production`
- [ ] HTTPS obrigatório
- [ ] Variáveis de ambiente seguras
- [ ] Rate limiting ativado
- [ ] CORS configurado
- [ ] Headers de segurança
- [ ] Audit logging
- [ ] Backups automáticos
- [ ] 2FA nos admins
- [ ] Monitoring ativo

### Headers de Segurança

```javascript
// next.config.js adicionar
const headers = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]
```

---

## 💰 Estimativa de Custos

| Serviço | Tier | Custo | Notas |
|---------|------|-------|-------|
| Vercel | Free | $0 | Até 100GB/mês |
| Vercel | Pro | $20/mês | Ilimitado |
| Supabase | Free | $0 | Até 500MB DB |
| Supabase | Pro | $25/mês | 8GB DB + features |
| Domínio | .com | ~$12/ano | GoDaddy, Namecheap |
| Total | Free | $0 | Ótimo para MVP |
| Total | Pro | $45/mês | Produção enterprise |

---

## 🎯 Deployment Checklist

Antes de fazer deploy:

```
Code:
  [ ] npm run build sucesso
  [ ] npm run start funciona
  [ ] Sem warnings/errors TypeScript
  [ ] Todas as variáveis .env usadas

Database:
  [ ] Supabase project criado
  [ ] database.sql executado
  [ ] Todos os índices criados
  [ ] Seed data populado

Environment:
  [ ] NEXT_PUBLIC_SUPABASE_URL correto
  [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY correto
  [ ] SUPABASE_SERVICE_ROLE_KEY seguro

Testing:
  [ ] Login funciona
  [ ] API endpoints respondem
  [ ] Banco de dados conecta
  [ ] Erros 500 investigados

Performance:
  [ ] Build size < 500MB
  [ ] First Contentful Paint < 2s
  [ ] Lighthouse score > 90

Security:
  [ ] Secrets não expostos
  [ ] HTTPS ativado
  [ ] CORS configurado
  [ ] Headers de segurança

Documentation:
  [ ] README atualizado
  [ ] .env.example correto
  [ ] Deployment docs pronto
  [ ] Runbook preparado
```

---

## 📝 Exemplo: Deploy em Vercel

```bash
# 1. Prepare código
git add .
git commit -m "Ready for production"

# 2. Push para GitHub
git push origin main

# 3. Vercel detecta e faz deploy automaticamente
# Seu site estará pronto em ~2 min

# 4. Testar
curl https://greenrp-panel-xxxxx.vercel.app/api/staffs
# ✅ Sucesso!
```

---

## 🆘 Troubleshooting Deploy

### App não inicia
1. Verificar logs: `pm2 logs`
2. Verificar .env preenchido
3. Verificar Supabase online
4. Verificar Node.js version

### 500 Internal Server Error
1. Verificar variáveis de ambiente
2. Verificar banco de dados
3. Verificar permissões no Supabase
4. Verificar logs da API

### Dados não aparecem
1. Verificar seed foi executado
2. Verificar conectividade Supabase
3. Verificar queries no Supabase Dashboard
4. Verificar firewall/CORS

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [AWS Docs](https://docs.aws.amazon.com)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/learn/foundations/how-nextjs-works/deployment)

---

**Data**: 2026-05-12  
**Versão**: 1.0.0  
**Recomendação**: Use Vercel para começar

---

## 🐳 Docker + docker-compose (Self-hosted / Dev)

Arquivos incluídos no repositório:

- `api-server/Dockerfile` — imagem para o servidor Express (API)
- `vite-app/Dockerfile` — imagem para construir e servir o client Vite
- `docker-compose.yml` — orquestra `api` e `web`

Exemplo de uso local (recomendado para testes):

```bash
# Defina as variáveis de ambiente necessárias no seu shell
export SUPABASE_SERVICE_ROLE_KEY="..."
export NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="anonkey"
export VITE_API_BASE="http://localhost:4000"

docker-compose build
docker-compose up
```

O `web` será servido em `http://localhost:5173` (via `serve` no container) e a API em `http://localhost:4000`.

Observação: não inclua chaves sensíveis no `docker-compose.yml`; prefira variáveis de ambiente do host, arquivos `.env` ou secrets do provedor.

---

## 🧰 PM2 (Process Manager) para Self-hosted

O projeto traz `api-server/ecosystem.config.js` para uso com `pm2`.

Exemplo de uso no servidor:

```bash
# Instalar pm2 globalmente
npm install -g pm2

# Entrar na pasta do api
cd api-server

# Instalar dependências
npm install --production

# Iniciar via pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Para logs:

```bash
pm2 logs greenrp-api
```

