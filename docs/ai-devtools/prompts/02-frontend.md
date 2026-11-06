## Papel e objetivo

Você é um engenheiro de software sênior. O backend deste MVP de matching entre candidatos e vagas **já está pronto** na pasta `backend/` (Node.js + Express + TypeScript). Desenvolva **apenas o frontend** em `frontend/`, consumindo a API existente exatamente como definida abaixo. Não altere o backend; se algo nele impedir a integração, **não conserte em silêncio** — descreva o problema no relatório final.

## Leitura obrigatória antes de codar

1. `README.md` na raiz (enunciado do desafio). Não o sobrescreva (ver seção "README" abaixo).
2. `backend/src/types.ts`, as rotas em `backend/src/routes/` e `backend/README.md`: confirme que o contrato abaixo corresponde ao que foi implementado. **Se houver qualquer diferença, pare, relate e siga o código real do backend**, registrando a diferença em "Pontos de atenção".
3. Pasta `/data`: os 3 CVs de exemplo (`candidate_cv_*.md`) servem para teste manual (o usuário os enviará pela tela de upload). **Não copie arquivos de `/data` para dentro do frontend e não os modifique.** `data/job_description.json` contém o exemplo de _resposta_ da API, não uma vaga.

> ⚠️ **Divergência conhecida:** o README prevê uma "Job Description em JSON estruturado", mas ela não existe em `/data`. O formato de `job` abaixo é **PROVISÓRIO**. Isole-o em um único lugar (`src/types.ts` e a constante do exemplo) para facilitar a troca.

## Regras gerais (não negociáveis)

- Não invente funcionalidades, endpoints ou tecnologias além do que está neste prompt e no README. Ausências/divergências: aplique a decisão registrada aqui e liste em "Pontos de atenção".
- Escopo: somente frontend. Textos da interface em português (pt-BR).

## Stack obrigatória

- **React** (exigido pelo README) com **TypeScript** (mesma linguagem do backend; o README não exige TS — registrar como decisão).
- **Tailwind CSS** para toda a estilização (sem CSS-in-JS e sem bibliotecas de componentes).
- Bundler: **Vite** (o README não define; registrar como decisão).
- **Sem** react-router, Redux/Zustand, axios, bibliotecas de UI ou de gráficos. Use `fetch` nativo e estado local do React (`useState`).
- Testes (desejável): Vitest + React Testing Library.
- `package.json` dentro de `frontend/`.

## Contrato da API (idêntico ao do backend — não altere)

Base URL: `import.meta.env.VITE_API_URL`, padrão `http://localhost:3001` (criar `frontend/.env.example`).

### `POST /api/match`

Request JSON:

```json
{
  "cv": "texto do currículo",
  "job": {
    "jobId": "job-001",
    "requiredSkills": ["Python", "AWS", "Docker", "Kubernetes", "Terraform"]
  }
}
```

Resposta `201`:

```json
{
  "matchId": "uuid",
  "candidateId": "uuid",
  "jobId": "job-001",
  "overallScore": 40,
  "matchedSkills": ["AWS", "Docker"],
  "missingSkills": ["Python", "Kubernetes", "Terraform"],
  "insights": "string",
  "suggestedQuestions": ["string"]
}
```

### `GET /api/match/report/:id`

`:id` = `matchId`. `200` com o mesmo objeto acima; `404` com `{ "error": "Análise não encontrada." }`.

### Erros

`400`/`404`/`500` retornam `{ "error": "mensagem em pt-BR" }`. Exiba essa mensagem ao usuário. Se a API estiver inacessível, mostre uma mensagem clara de falha de conexão.

## Estrutura esperada

```
/frontend
  package.json  vite.config.ts  tailwind/postcss config  tsconfig*.json
  .env.example  README.md  index.html
  src/
    main.tsx  App.tsx  index.css (diretivas do Tailwind)
    types.ts            (MatchRequest, JobInput [PROVISÓRIO], MatchResult)
    services/api.ts     (createMatch, getReport — fetch + tratamento de erro)
    components/         (UploadForm, ScoreDisplay, SkillList, InsightsPanel, QuestionsList, etc.)
```

Scripts: `dev`, `build`, `preview`, `test`.

## Funcionalidades (somente estas — conforme o README)

### 1) Tela de upload / envio

- Upload de **CV em texto simples** (`input type="file"` aceitando `.md` e `.txt`; leia com `FileReader`/`file.text()`). O texto carregado aparece em uma `textarea` (permite também colar/editar).
- **Campo de vaga (JSON)**: `textarea` pré-preenchida com o exemplo provisório do contrato (`jobId: "job-001"`, skills: Python, AWS, Docker, Kubernetes, Terraform), editável.
- Validação no cliente antes de enviar: CV não vazio; JSON da vaga válido, com `jobId` (string não vazia) e `requiredSkills` (array não vazio de strings). Mostre erros de validação junto ao campo.
- Botão "Analisar compatibilidade" com estado de carregamento (desabilitado durante a requisição).

### 2) Dashboard de resultados

Após o `POST /api/match` bem-sucedido, chame `GET /api/match/report/:matchId` e renderize o resultado a partir do report (assim os dois endpoints do README são consumidos). Exiba:

- **Score de compatibilidade (0–100)** em destaque, com indicador visual feito só com Tailwind/SVG simples (barra ou anel de progresso) e cor por faixa (≥ 80 forte, 50–79 parcial, < 50 baixa — mesmas faixas do backend).
- **Skills correspondentes** (`matchedSkills`) como badges destacadas (verde).
- **Skills faltantes** (`missingSkills`) como badges em cor de alerta (vermelho/âmbar), com estado vazio amigável quando a lista estiver vazia ("Nenhuma skill faltante").
- **Insights** (`insights`) em um painel de resumo.
- **Perguntas sugeridas para entrevista** (`suggestedQuestions`) em lista — exibir apenas se o array existir e não estiver vazio (o campo é opcional no README).
- Identificadores `candidateId`, `jobId` e `matchId` em texto discreto.
- Botão "Nova análise" que volta ao formulário limpando o resultado.

### Estados e qualidade

- Estados de carregamento, erro (API/validação) e vazio tratados.
- Layout responsivo (mobile-first) e acessível: `label` associado aos campos, foco visível, contraste adequado, `aria-live` para erros, badges com texto (não só cor).
- Componentes pequenos e tipados; sem `any`.

## Fora de escopo (não implementar)

Autenticação, histórico/lista de análises, comparação entre candidatos, persistência no navegador, exportação, i18n, rotas/páginas extras, gráficos além do indicador de score, novos endpoints no backend.

## Testes (desejável)

Vitest + React Testing Library cobrindo: validação do formulário (CV vazio, JSON inválido, campos ausentes); renderização do dashboard (score, badges matched/missing, estado vazio de missing, ocultar perguntas quando ausentes); `services/api.ts` com `fetch` mockado (sucesso, 400 com `error`, falha de rede).

## README

- **Não sobrescreva o `README.md` da raiz.** Crie `frontend/README.md` (setup, scripts, `VITE_API_URL`, como rodar junto com o backend, decisões técnicas e trade-offs).
- **Acrescente ao final** do `README.md` da raiz (mantendo todo o conteúdo original) as seções: "Instruções de instalação e execução" (backend primeiro, depois frontend, com portas) e "Decisões técnicas e trade-offs" (resumo do backend + frontend).
- Inclua também a seção "Uso de AI DevTools" **somente com um placeholder** (ex.: "A ser preenchido pelo autor: logs de prompts, screenshots e comentários"). **Não invente logs, screenshots ou comentários.**

## Critérios de aceite (rode e confirme antes de finalizar)

1. Com o backend rodando (`cd backend && npm run dev`), `cd frontend && npm install && npm run build && npm test` passam sem erros.
2. `npm run dev` no frontend abre em `http://localhost:5173` e se comunica com o backend (CORS já habilitado nele).
3. Fluxo manual com cada CV de `/data` e a vaga padrão do formulário. Resultados esperados:
    - `candidate_cv_maria_silva.md` → **100**, nenhuma skill faltante.
    - `candidate_cv_joao_santos.md` → **40**; correspondentes: AWS, Docker; faltantes: Python, Kubernetes, Terraform.
    - `candidate_cv_ana_ferreira.md` → **20**; correspondente: Python; faltantes: AWS, Docker, Kubernetes, Terraform.
4. Erros tratados: CV vazio, JSON de vaga inválido, backend desligado, `matchId` inexistente.
5. Nenhum arquivo de `/data` e nada em `backend/` foi alterado.

## Relatório final (formato)

1. Arquivos criados (lista curta).
2. Como rodar backend + frontend (3–5 linhas).
3. **Pontos de atenção**: divergências entre este prompt e o backend real; decisões não cobertas pelo README (TypeScript, Vite, GET do report após o POST, vaga provisória via textarea, faixas de cor).
4. Resultado do build e dos testes.