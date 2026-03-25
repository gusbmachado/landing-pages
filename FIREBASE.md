# Deploy no Firebase Hosting + Functions

Esta landing usa:
- **Firebase Hosting** para o site estático
- **Firebase Functions** para o endpoint `/api/vakinha` (scraping)

## Estrutura usada
- `firebase.json`: rewrite de `/api/**` para a function `api`
- `functions/index.js`: implementação da API da Vakinha
- `functions/package.json`: dependências da function

## 1) Instalar Firebase CLI
```bash
npm i -g firebase-tools
```

## 2) Login
```bash
firebase login
```

## 3) Inicializar Firebase no projeto (primeira vez)
Se o projeto ainda não estiver inicializado, rode:

```bash
firebase init
```

Selecione:
- `Functions`
- `Hosting`

Sugestão de respostas durante o `init`:
- Use existing project: selecione seu projeto Firebase
- Hosting public directory: `.`
- Configure as single-page app (rewrite all urls to /index.html): `No`
- Set up automatic builds and deploys with GitHub: `No` (opcional)
- Language Functions: `JavaScript`

Observação: este repositório já possui `firebase.json` e `.firebaserc` configurados.

## 4) Conferir projeto ativo
```bash
firebase use
```

Para trocar projeto:
```bash
firebase use --add
```

## 5) Instalar dependências das Functions
```bash
npm --prefix functions install
```

## 6) Rodar local (emuladores)
```bash
firebase emulators:start --only hosting,functions
```

Com isso, a API estará disponível via rewrite em `/api/vakinha`.

## 7) Deploy em produção
```bash
firebase deploy --only functions,hosting
```

## Endpoint suportado
- `POST /api/vakinha` com body JSON:
```json
{ "url": "https://www.vakinha.com.br/vaquinha/..." }
```
- `GET /api/vakinha?url=...`

## Observações
- O scraping depende da estrutura HTML da Vakinha; mudanças no site podem exigir ajuste no parser.
- `server.js` pode continuar para testes locais fora do Firebase, mas em produção o backend é a Function `api`.
