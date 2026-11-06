# CV Match API

Backend do MVP de matching entre currículos e vagas. Requer Node.js 20 ou superior.

## Instalação e execução

```bash
cd backend
npm install
npm run build
npm start
```

Durante o desenvolvimento, use `npm run dev`. A API sobe em `http://localhost:3001` por padrão. Os scripts disponíveis são `dev`, `build`, `start` e `test`.

Variáveis opcionais: `PORT` altera a porta; `CORS_ORIGIN` altera a origem permitida pelo CORS (por padrão, `http://localhost:5173`).

## Endpoints

```bash
curl http://localhost:3001/

curl -X POST http://localhost:3001/api/match \
  -H "Content-Type: application/json" \
  -d '{"cv":"Experiência com Python, AWS e Docker.","job":{"jobId":"job-001","requiredSkills":["Python","AWS","Docker","Kubernetes","Terraform"]}}'

curl http://localhost:3001/api/match/report/<matchId>
```

O POST retorna `201` e gera `matchId` e `candidateId` com `crypto.randomUUID()`. O relatório é salvo em um `Map` em memória e, portanto, é perdido ao reiniciar o processo. Erros de validação e erros inesperados usam `{ "error": string }`; JSON inválido retorna `400` com `JSON inválido.`.

## Decisões técnicas e limites

O contrato de `JobInput` em `src/types.ts` é provisório porque o arquivo fornecido em `/data/job_description.json` é um exemplo de resposta, não uma vaga. Campos extras da vaga são aceitos e ignorados. O `matchId` foi adicionado à resposta para identificar o relatório, e o `candidateId` é gerado pelo servidor porque não existe na entrada.

O motor é determinístico, sem LLM ou chamadas externas. O texto é convertido para minúsculas, sem acentos e com espaços colapsados. Cada skill é procurada como termo completo com regex escapada, inclusive skills com pontuação. O arquivo `src/services/aliases.ts` mantém aliases pequenos e explícitos: `Node.js`/`nodejs`/`node`, `PostgreSQL`/`postgres`, `Kubernetes`/`k8s` e `JavaScript`/`js`. Aliases apenas ampliam a detecção de uma skill já solicitada.

Skills repetidas são deduplicadas ignorando caixa, preservando a primeira grafia e a ordem da vaga. O score é `Math.round((matchedSkills.length / totalRequiredSkills) * 100)`. Insights usam as faixas: 80 ou mais = aderência forte; 50 a 79 = aderência parcial; abaixo de 50 = aderência baixa. As perguntas geram até 3 perguntas para skills faltantes e até 2 exemplos práticos para skills encontradas.

O método não mede senioridade, tempo de experiência, proficiência, contexto de uso ou equivalência semântica entre skills; ele apenas verifica menções textuais e aliases documentados.

## Testes

`npm test` cobre normalização, limites de termos, aliases, score, insights, perguntas, validação e rotas. Também usa os três CVs reais de `/data` sem modificá-los.
