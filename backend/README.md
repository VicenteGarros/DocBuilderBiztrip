# DocBuilder — Backend

API REST para o DocBuilder com autenticação JWT, CRUD de propostas e gestão de usuários com RBAC (USER, GERENTE, MASTER).

## Stack

- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT (access + refresh tokens em cookies httpOnly)
- bcrypt para hash de senhas
- Zod para validação de entrada

## Setup

### 1. Subir o PostgreSQL

**Opção A — Docker (recomendado):**

```bash
docker compose up -d
```

**Opção B — Homebrew:**

```bash
brew install postgresql@16
brew services start postgresql@16
createdb docbuilder
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite .env se necessário
```

### 3. Instalar dependências e rodar migrations

```bash
npm install
npx prisma migrate dev --name init
```

### 4. Rodar o seed (cria o primeiro usuário MASTER)

```bash
npm run seed
```

As credenciais do MASTER vêm das variáveis de ambiente definidas no `.env`:

```
SEED_MASTER_EMAIL=master@docbuilder.com
SEED_MASTER_PASSWORD=Master@123
SEED_MASTER_NAME=Master Admin
```

O seed é idempotente — pode rodar várias vezes sem duplicar.

### 5. Iniciar o servidor

```bash
npm run dev
```

O servidor sobe em `http://localhost:3001`.

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `DATABASE_URL` | URL de conexão com PostgreSQL | `postgresql://postgres:postgres@localhost:5432/docbuilder` |
| `JWT_SECRET` | Chave secreta para assinar JWTs | *(obrigatório)* |
| `JWT_ACCESS_EXPIRES_IN` | Duração do access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Duração do refresh token | `7d` |
| `COOKIE_DOMAIN` | Domínio do cookie | `localhost` |
| `COOKIE_SECURE` | Cookie secure flag | `false` |
| `FRONTEND_URL` | Origem do frontend (CORS) | `http://localhost:5173` |
| `PORT` | Porta do servidor | `3001` |
| `SEED_MASTER_EMAIL` | Email do MASTER inicial | `master@docbuilder.com` |
| `SEED_MASTER_PASSWORD` | Senha do MASTER inicial | `Master@123` |
| `SEED_MASTER_NAME` | Nome do MASTER inicial | `Master Admin` |

## Endpoints

### Auth

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Registrar novo usuário (sempre role USER) |
| POST | `/auth/login` | Login, retorna cookies httpOnly |
| POST | `/auth/refresh` | Renovar access token via refresh token |
| POST | `/auth/logout` | Logout, limpa cookies |
| GET | `/auth/me` | Retorna dados do usuário logado |

### Propostas (qualquer usuário autenticado)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/proposals` | Listar propostas do usuário logado |
| GET | `/proposals/:id` | Obter proposta (só se for do usuário) |
| POST | `/proposals` | Criar nova proposta |
| PUT | `/proposals/:id` | Atualizar proposta |
| DELETE | `/proposals/:id` | Excluir proposta |

### Admin — Propostas (apenas MASTER)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/admin/proposals` | Listar propostas de todos os usuários |

### Admin — Usuários (MASTER e GERENTE)

| Método | Rota | Descrição | Restrições |
|---|---|---|---|
| GET | `/admin/users` | Listar usuários | — |
| POST | `/admin/users` | Criar usuário | GERENTE só cria USER |
| PUT | `/admin/users/:id` | Editar usuário | GERENTE só edita USER |
| PUT | `/admin/users/:id/role` | Alterar papel | **Só MASTER** |
| DELETE | `/admin/users/:id` | Excluir usuário | GERENTE só exclui USER; MASTER não pode se auto-excluir se for o último |

## Exemplos de teste (curl)

```bash
# Registrar
curl -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"João","email":"joao@teste.com","password":"123456"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"master@docbuilder.com","password":"Master@123"}' \
  -c cookies.txt

# Ver perfil
curl http://localhost:3001/auth/me -b cookies.txt

# Criar proposta
curl -X POST http://localhost:3001/proposals \
  -H 'Content-Type: application/json' \
  -d '{"title":"Minha proposta","formData":{"secao":"viagens"}}' \
  -b cookies.txt

# Listar propostas
curl http://localhost:3001/proposals -b cookies.txt

# Listar todos os usuários (admin)
curl http://localhost:3001/admin/users -b cookies.txt
```
