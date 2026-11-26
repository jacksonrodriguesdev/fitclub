# Deploy da FITCLUBUY na Hostinger

App **Node.js 22** (TanStack Start), código no GitHub `jacksonrodriguesdev/fitclub` (branch `main`).
O catálogo (JSON + fotos) **não** está no Git: vai como `.zip` para uma pasta fora do app.

## 1. Banco de dados `fitclub`

1. hPanel → **Bancos de dados → MySQL** → criar banco `fitclub` e um usuário (a Hostinger
   coloca um prefixo, ex.: `u123456789_fitclub`). Anote banco, usuário e senha.
2. **phpMyAdmin** do banco → **Importar** → `fitclub_estrutura.sql` (cria as tabelas, vazias).

## 2. Catálogo (fotos e produtos)

1. **Gerenciador de arquivos** → crie `/home/SEU_USUARIO/fitclub-catalogo` (fora da pasta do app,
   para não ser apagada a cada deploy).
2. Envie para lá os arquivos `catalogo-parte-*.zip` e extraia cada um **nessa pasta**.
   No final devem existir:
   - `fitclub-catalogo/live/produtos.json` (+ `kits.json`, `marcas.json`, `cotacao.json`, `fotos/`)
   - `fitclub-catalogo/lupo/produtos_agrupados.json` (+ `fotos/`)
3. Apague os `.zip` depois de extrair.

Para gerar o pacote de novo no PC: `node Desktop/live/deploy/ferramentas/montar_catalogo.cjs`
e depois `node Desktop/live/deploy/ferramentas/zipar.cjs`.

## 3. App Node.js

hPanel → **Websites** → adicionar site Node.js → importar do **GitHub** (`fitclub`, branch `main`).

| Campo | Valor |
|---|---|
| Versão do Node | 22.x |
| Instalação | `npm install` |
| Build | `npm run build` |
| Início | `npm start` (arquivo de entrada `.output/server/index.mjs`) |

### Variáveis de ambiente

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `mysql://USUARIO:SENHA@localhost:3306/u123456789_fitclub` (caracteres especiais da senha codificados: `@` → `%40`) |
| `JWT_SECRET` | texto aleatório de 64+ caracteres (`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`) |
| `CATALOGO_DIR` | `/home/SEU_USUARIO/fitclub-catalogo/live` |
| `CATALOGO_LUPO_DIR` | `/home/SEU_USUARIO/fitclub-catalogo/lupo` |
| `UPLOADS_DIR` | `/home/SEU_USUARIO/fitclub-uploads` |
| `VITE_SITE_URL` | `https://SEU-DOMINIO` (entra no build: refaça o deploy se mudar) |
| `NODE_ENV` | `production` |

## 4. Depois de publicar

- Home mostra produtos LIVE! e LUPO com fotos; `/c/lupo`, `/c/calzas?linea=live` funcionam.
- Crie sua conta em `/cadastro` e torne-a admin no phpMyAdmin:
  `UPDATE users SET role = 'ADMIN' WHERE email = 'SEU_EMAIL';`
- Envie `https://SEU-DOMINIO/sitemap.xml` no Google Search Console.

## Atualizar o catálogo

Rode de novo os scripts de extração (`baixar_live.cjs`, `baixar_kits.cjs`, `baixar_lupo.cjs`),
gere o pacote e envie só os JSON (e as fotos novas). O site relê os JSON sozinho quando mudam.
