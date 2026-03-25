# Benevita Landing Page

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=black)
![Firebase Functions](https://img.shields.io/badge/Firebase-Functions-FFCA28?logo=firebase&logoColor=black)
![Node 20](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)

![Banner do Projeto de Extensão](assets/images/banner.png)

Landing page de campanha solidária desenvolvida para o projeto de extensão **Benevita + FAMEU**, com foco em arrecadação transparente para apoio à Cozinha Comunitária Parceiras do bem MANÁ (Uberlândia/MG).

## Visão Geral

Este repositório combina:
- **Frontend estático** (landing page responsiva e personalizável);
- **Backend de integração** com endpoint `/api/vakinha` para leitura de progresso da campanha;
- **Deploy com Firebase Hosting + Firebase Functions**.

A estrutura foi pensada para ser reutilizada como **template de campanhas sociais**, mantendo visual, seções institucionais e fluxo de doação via PIX.

## Principais Recursos

- Apresentação completa da campanha (causa, equipe, impacto e transparência);
- Modal de doação com geração de QR Code PIX;
- Relógio regressivo em estilo flip clock;
- Atualização de dados da campanha via API (`/api/vakinha`);
- Contato por e-mail e WhatsApp;
- Estrutura modular de JavaScript e CSS para facilitar manutenção e reuso.

## Stack Técnica

- HTML5 + CSS3 + JavaScript (ES Modules)
- Lucide Icons
- QRCode.js
- Node.js (scraping local)
- Firebase Hosting
- Firebase Functions (Node 20)
- Axios + Cheerio (coleta/parsing)

## Estrutura do Projeto

```text
.
├── assets/
│   ├── images/
│   ├── js/
│   │   ├── main.js
│   │   └── modules/
│   └── styles/
│       ├── style.css
│       ├── modal.css
│       └── clock.css
├── functions/
│   ├── index.js
│   └── package.json
├── index.html
├── firebase.json
├── .firebaserc
├── server.js
└── FIREBASE.md
```

## Executando Localmente

### Opção 1: Backend local com Node (sem emulador Firebase)

```bash
npm install
npm start
```

Servidor local em `http://localhost:3000`.

### Opção 2: Firebase Emulators (recomendado para ambiente final)

```bash
npm --prefix functions install
firebase emulators:start --only hosting,functions
```

## Deploy (Hosting + Functions)

```bash
firebase deploy --only functions,hosting
```

Detalhes completos em: [FIREBASE.md](FIREBASE.md)

## Template Reutilizável para Novas Campanhas

Para adaptar este template para outra campanha:

1. Troque identidade visual:
- `assets/images/logo.png`, `assets/images/logo.ico`, `assets/images/banner.png`.

2. Atualize conteúdo institucional:
- textos e seções em `index.html`.

3. Ajuste dados de doação:
- URL da campanha, meta e chave PIX nos módulos JS.

4. Ajuste endpoint de progresso:
- parser da Function em `functions/index.js` (caso a origem de dados mude).

5. Revise SEO e credibilidade:
- título, descrição, links oficiais e seção de transparência.

## Como Customizar Em 10 Minutos

1. Clone e instale:
```bash
git clone <repo>
cd landing-pages
npm install
npm --prefix functions install
```

2. Atualize identidade visual:
- Substitua `assets/images/logo.png`, `assets/images/logo.ico` e `assets/images/banner.png`.

3. Troque os textos e links da campanha:
- Edite `index.html` (causa, valores, contatos e CTAs).

4. Configure os dados de arrecadação:
- Ajuste URL da campanha, meta e chave PIX nos módulos JS.

5. Teste local:
```bash
firebase emulators:start --only hosting,functions
```

6. Publique:
```bash
firebase deploy --only functions,hosting
```

## Boas Práticas para Campanhas Afins

- Explique claramente o destino dos recursos;
- Mantenha indicadores de progresso atualizados;
- Inclua referência institucional e canais oficiais;
- Use linguagem simples, objetiva e verificável;
- Publique prestação de contas após a campanha.

## Licença

Este projeto está licenciado sob a **MIT License**.

Consulte: [LICENSE](LICENSE)
