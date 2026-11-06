## Papel e objetivo

Você é um engenheiro de software sênior. Desenvolva **apenas o backend** de um MVP de matching entre candidatos e vagas (plataforma de recrutamento automatizado). O backend recebe o texto de um currículo (CV) e uma vaga (JSON) e retorna um score de compatibilidade de 0 a 100, skills correspondentes, skills faltantes, insights e perguntas sugeridas para entrevista. O frontend (React) será desenvolvido depois, em outro prompt, e consumirá exatamente o contrato definido abaixo.

## Leitura obrigatória antes de codar

1. `README.md` na raiz do repositório (enunciado do desafio). **Não edite, não apague e não sobrescreva esse arquivo.**
2. Pasta `/data` (raiz do repositório): `job_description.json` e os 3 CVs de exemplo (`candidate_cv_maria_silva.md`, `candidate_cv_joao_santos.md`, `candidate_cv_ana_ferreira.md`). **Não modifique nenhum arquivo de `/data`.**

> ⚠️ **Divergência conhecida:** `data/job_description.json` NÃO contém uma vaga. Ele contém o mesmo exemplo de _resposta_ da API do README. Por isso o formato da vaga de entrada abaixo é **PROVISÓRIO** e deve ficar isolado em um único arquivo (`src/types.ts`) para ser trocado facilmente quando a vaga real existir. Trate `data/job_description.json` apenas como referência do formato de **resposta**.

## Regras gerais (não negociáveis)

- Não invente funcionalidades, endpoints ou tecnologias além do que está neste prompt e no README. Se algo estiver ausente ou divergente, **não improvise em silêncio**: aplique a decisão registrada aqui e liste o ponto na seção "Pontos de atenção" do seu relatório final.
- Escopo: somente backend. Não crie nada de frontend.
- Respostas e mensagens de erro da API em português (pt-BR).

## Stack obrigatória

- Node.js (>= 20) + **Express** + **TypeScript** (modo `strict`).
- Banco de dados **em memória** (ex.: `Map`), sem banco externo e sem ORM.
- **Sem LLM e sem API externa em runtime.** O motor de match é determinístico (regras + templates), sem necessidade de chave de API.
- Estrutura: **`package.json` dentro da pasta `backend/`** (não crie `package.json` na raiz).
- Dependências permitidas: `express`, `cors`, `typescript`, `tsx` (dev), `vitest`, `supertest` e os `@types/*` correspondentes. Qualquer outra dependência precisa de justificativa no README do backend.

## Estrutura esperada

```
/data                      (já existe — somente leitura)
/backend
  package.json
  tsconfig.json
  README.md
  src/
    index.ts               (sobe o servidor; PORT via env, padrão 3001)
    app.ts                 (createApp() — exportado para testes)
    types.ts               (contratos: MatchRequest, JobInput [PROVISÓRIO], MatchResult)
    routes/                (roteadores)
    services/              (extração de skills, cálculo do score, insights/perguntas)
    store/                 (repositório em memória)
  tests/
```

Scripts em `backend/package.json`: `dev`, `build`, `start`, `test`.

## Contrato da API (CONGELADO — o frontend usará exatamente isto)

### `GET /`

Retorna `200` com JSON informativo sobre a API:

```json
{
  "name": "CV Match API",
  "message": "API de matching entre currículos e vagas. Envie um CV e uma vaga para POST /api/match e consulte a análise em GET /api/match/report/:id.",
  "endpoints": [
    { "method": "GET", "path": "/", "description": "Informações sobre a API" },
    { "method": "POST", "path": "/api/match", "description": "Calcula a compatibilidade entre um CV e uma vaga" },
    { "method": "GET", "path": "/api/match/report/:id", "description": "Retorna os detalhes de uma análise de match" }
  ]
}
```

### `POST /api/match`

Request (`Content-Type: application/json`):

```json
{
  "cv": "texto simples/markdown do currículo",
  "job": {
    "jobId": "job-001",
    "requiredSkills": ["Python", "AWS", "Docker", "Kubernetes", "Terraform"]
  }
}
```

- O formato de `job` é **PROVISÓRIO** (ver divergência acima). Campos extras em `job` devem ser aceitos e ignorados.
- Validação → `400` com `{ "error": "<mensagem em pt-BR>" }` quando: `cv` ausente/não-string/vazio; `job` ausente; `job.jobId` ausente/vazio; `job.requiredSkills` ausente, não-array, vazio ou com itens que não sejam strings.
- Sucesso → `201` com o corpo abaixo.

Response (README, **adaptada** apenas com o campo `matchId`, conforme permitido: "pode ser adaptada"):

```json
{
  "matchId": "uuid",
  "candidateId": "uuid",
  "jobId": "job-001",
  "overallScore": 40,
  "matchedSkills": ["AWS", "Docker"],
  "missingSkills": ["Python", "Kubernetes", "Terraform"],
  "insights": "string",
  "suggestedQuestions": ["string", "string"]
}
```

- `matchId` e `candidateId` são gerados no servidor com `crypto.randomUUID()` (o README não define de onde vem o `candidateId`; a entrada não o traz).
- `jobId` vem de `job.jobId`.
- `overallScore`: inteiro de 0 a 100.
- `matchedSkills` / `missingSkills`: usam a grafia que veio em `job.requiredSkills`, na mesma ordem.

### `GET /api/match/report/:id`

- `:id` = `matchId`.
- `200` com o **mesmo objeto** retornado pelo POST (a análise completa salva em memória).
- `404` com `{ "error": "Análise não encontrada." }` se o id não existir.

### Erros inesperados

`500` com `{ "error": "Erro interno do servidor." }` (middleware de erro). JSON inválido no body → `400` com `{ "error": "JSON inválido." }`.

## Lógica de match (determinística)

1. **Normalização**: minúsculas, remoção de acentos, espaços colapsados.
2. **Detecção de skill no CV**: para cada item de `requiredSkills`, verifique se aparece no texto do CV como termo completo (limites de palavra), de forma case-insensitive e sem acento. Trate corretamente skills com caracteres especiais (ex.: `C++`, `C#`, `.NET`, `Node.js`) e evite falsos positivos por substring (ex.: `Go` não pode casar com `Google`, `Java` não pode casar com `JavaScript`).
3. **Aliases**: mantenha um pequeno mapa de aliases em arquivo próprio e documente no README (ex.: `Node.js` ↔ `nodejs`/`node`, `PostgreSQL` ↔ `postgres`, `Kubernetes` ↔ `k8s`, `JavaScript` ↔ `js`). Não invente skills; aliases só ampliam a detecção de skills já pedidas pela vaga.
4. **Deduplicação**: itens repetidos em `requiredSkills` (ignorando caixa) contam uma única vez.
5. **Score**: `overallScore = Math.round((matchedSkills.length / totalRequiredSkills) * 100)`.
6. **Insights** (string em pt-BR, por template): faixa ≥ 80 = aderência forte; 50–79 = aderência parcial; < 50 = aderência baixa. Cite quantas das skills exigidas foram encontradas e liste as faltantes.
7. **suggestedQuestions** (por template, no máximo 5): até 3 perguntas sobre skills faltantes ("O currículo não menciona X. Qual sua experiência ou familiaridade com X?") e até 2 pedindo um exemplo prático de skills correspondentes. Se não houver nada a perguntar, retorne array vazio.
8. Documente no README do backend a fórmula, as faixas e os limites do método (ex.: não mede senioridade nem nível de proficiência).

## Outros requisitos

- `GET /` implementado como descrito (exigência adicional do projeto).
- CORS habilitado com `cors` para permitir o frontend em desenvolvimento (`http://localhost:5173`, configurável por env `CORS_ORIGIN`).
- `express.json({ limit: "1mb" })`.
- Armazenamento: `Map<string, MatchResult>` atrás de uma pequena interface de repositório (para facilitar troca futura); dados perdem-se ao reiniciar (documentar).
- Código limpo: separação rota → serviço → store, funções puras testáveis, sem `any`.

## Testes unitários (desejável pelo README — implemente)

Use Vitest (+ Supertest para rotas). Cubra no mínimo:

- Normalização e detecção de skills (acentos, caixa, limites de palavra, `C++`/`.NET`, `Go` vs `Google`, `Java` vs `JavaScript`).
- Cálculo do score, incluindo deduplicação e arredondamento.
- Geração de insights e perguntas (limites e faixas).
- Rotas: `GET /`, `POST /api/match` (201 e cada caso de 400), `GET /api/match/report/:id` (200 e 404).
- **Testes com os CVs reais de `/data`** (leia os arquivos com `fs` a partir de `../data`) usando a vaga do contrato (`requiredSkills`: Python, AWS, Docker, Kubernetes, Terraform). Resultados esperados:
    - Maria Silva → score **100**, todas encontradas.
    - João Pedro Santos → score **40**; matched = AWS, Docker; missing = Python, Kubernetes, Terraform.
    - Ana Carolina Ferreira → score **20**; matched = Python; missing = AWS, Docker, Kubernetes, Terraform. Se algum resultado divergir, investigue no CV antes de ajustar o teste e relate no final.

## README do backend (`backend/README.md`)

Instalação, scripts, variáveis de ambiente (`PORT`, `CORS_ORIGIN`), exemplos `curl` dos 3 endpoints, decisões técnicas e trade-offs (armazenamento em memória, motor determinístico, formato provisório da vaga). **Não crie seção de "Uso de AI DevTools" com logs inventados.**

## Critérios de aceite (rode e confirme antes de finalizar)

1. `cd backend && npm install && npm run build && npm test` passam sem erros.
2. `npm run dev` sobe em `http://localhost:3001`.
3. `curl http://localhost:3001/` retorna o JSON informativo.
4. `POST /api/match` com cada CV de `/data` (enviando o texto no campo `cv`) retorna os scores esperados acima e `GET /api/match/report/<matchId>` devolve o mesmo objeto.
5. Nenhum arquivo de `/data` nem o `README.md` da raiz foi alterado.

## Relatório final (formato)

1. Arquivos criados (lista curta).
2. Como rodar (3–5 linhas).
3. **Pontos de atenção**: divergências/ausências encontradas e o que foi decidido (obrigatoriamente: vaga provisória, `matchId` adicionado, `candidateId` gerado no servidor, código 201, formato de erro `{ "error": string }`, aliases, limiares de insights).
4. Resultado dos testes.