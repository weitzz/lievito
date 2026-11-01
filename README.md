# Lievito — Pizzeria Artigianale

Aplicação de e-commerce para uma pizzaria artesanal italiana. O projeto reúne um cardápio personalizável, carrinho persistente, autenticação de clientes, acompanhamento de pedidos e checkout com Stripe.

## Telas

As capturas abaixo foram feitas na versão atual do projeto, em desktop. O carrinho e a personalização aparecem como painéis sobre o cardápio.

### Página inicial

<p align="center"><img src="docs/screenshots/home.png" width="100%" alt="Página inicial da Lievito" /></p>

### Cardápio

<p align="center"><img src="docs/screenshots/cardapio.png" width="100%" alt="Cardápio com filtros e pizzas" /></p>

### Personalização da pizza

<p align="center"><img src="docs/screenshots/personalizacao.png" width="100%" alt="Personalização de tamanho, borda e ingredientes" /></p>

### Carrinho

<p align="center"><img src="docs/screenshots/carrinho.png" width="100%" alt="Carrinho com subtotal, entrega e total" /></p>

### Acompanhamento de pedidos

<p align="center"><img src="docs/screenshots/pedidos.png" width="100%" alt="Página de acompanhamento de pedidos" /></p>

## Funcionalidades

- Busca de pizzas por nome e filtros por categoria, opção vegetariana e faixa de preço.
- Ordenação por menor preço, maior preço e popularidade. Os filtros são aplicados no servidor com Prisma.
- Personalização do tamanho, tipo de borda, ingredientes extras e ingredientes removidos, com preço atualizado na tela.
- Carrinho com alteração de quantidades, exclusão de itens, limpeza, subtotal, frete e valor mínimo para entrega.
- Persistência do carrinho no navegador e indicador de itens no cabeçalho.
- Cadastro e login de clientes.
- Checkout com Stripe e atualização do status do pedido via webhook.
- Página para acompanhar o histórico e as etapas dos pedidos.

## Tecnologias

- Next.js 15 e React 19 com TypeScript
- Tailwind CSS 4 e componentes Radix UI
- Prisma ORM e PostgreSQL
- Zustand para o estado do carrinho
- Stripe para pagamento
- Zod para validação de dados

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Docker com Docker Compose
- Chaves de teste da Stripe para experimentar o checkout

### Instalação

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/weitzz/tw-pizza.git
   cd tw-pizza
   ```

2. Instale as dependências e crie o arquivo local de ambiente:

   ```bash
   npm install
   cp example.env .env
   ```

3. Preencha o `.env` com os dados locais. O arquivo `.env` não deve ser enviado ao Git:

   ```dotenv
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pizzariaDB?schema=public"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_sua_chave_secreta"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sua_chave_publicavel"
   STRIPE_WEBHOOK_KEY="whsec_seu_segredo_de_webhook"
   ```

4. Inicie o PostgreSQL, aplique as migrations e carregue as pizzas de exemplo:

   ```bash
   docker compose up -d postgres
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Acesse [http://localhost:3000](http://localhost:3000).

### Webhook local da Stripe

Para receber atualizações de pagamento durante o desenvolvimento, instale a Stripe CLI e encaminhe os eventos para a aplicação:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Configure `STRIPE_WEBHOOK_KEY` com o segredo (`whsec_...`) exibido pela CLI.

## Rotas principais

| Rota | Descrição |
| --- | --- |
| `/` | Página inicial, cardápio e filtros |
| `/pedidos` | Histórico e acompanhamento de pedidos do cliente autenticado |
| `/success?session_id=...` | Confirmação de pagamento após o checkout |

## Comandos úteis

```bash
npm run dev       # servidor de desenvolvimento
npm run lint      # análise estática
npx prisma studio # interface local para consultar o banco
```
