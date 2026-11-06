# CV Match: decisões técnicas e uso de IA

MVP que compara o currículo de um candidato com uma vaga e calcula o quanto eles combinam. É formado por um **backend** (Node.js, Express, TypeScript) e um **frontend** (React, TypeScript, Vite, Tailwind CSS).

## Como funciona

1. Na tela, você envia o currículo (`.md` ou `.txt`) e informa a vaga em JSON.
2. O frontend chama `POST /api/match`.
3. Em seguida, chama `GET /api/match/report/:id` com o `matchId` recebido.
4. O dashboard mostra score, skills encontradas, skills faltantes, insights e perguntas para entrevista.

Os dados ficam só na memória do backend: ao reiniciá-lo, as análises somem.

## Como o score é calculado

O cálculo é feito por regras, sem IA em tempo de execução e sem chamadas externas.

```text
score = arredondar(skills encontradas / skills exigidas × 100)
```

| Score | Resultado |
| --- | --- |
| 80 a 100 | Aderência forte |
| 50 a 79 | Aderência parcial |
| 0 a 49 | Aderência baixa |

Uma skill conta como encontrada se aparece no currículo como palavra completa, sem diferenciar maiúsculas, minúsculas e acentos. Alguns apelidos são aceitos, como `k8s` para Kubernetes, `postgres` para PostgreSQL e `nodejs` para Node.js. Eles só ajudam a achar skills que a vaga já pediu e nunca criam skills novas.

**Limite do método:** ele não mede senioridade, nível de domínio nem tecnologias equivalentes.

## Decisões e trade-offs

| Decisão | Vantagem | Custo |
| --- | --- | --- |
| Dados em memória (`Map`) | Simples e rápido de rodar | Perde tudo ao reiniciar |
| Match por regras | Resultado previsível, testável e sem custo de API | Não entende contexto nem sinônimos fora da lista |
| `fetch` e estado local no React | Poucas dependências | Sem cache nem histórico |
| TypeScript no frontend | Menos erros de integração com a API | Configuração extra |
| Estilo só com Tailwind padrão e visual estático | Leve e estável | Menos recursos visuais |

## Pontos de atenção

1. **A vaga é provisória.** O arquivo `data/job_description.json` traz um exemplo de resposta da API, não uma vaga. Por isso a vaga usa um formato mínimo (`jobId` e `requiredSkills`), definido em um único arquivo de tipos para facilitar a troca.
2. **Adaptações na API:** foi adicionado o campo `matchId` (o enunciado permite adaptar a resposta). O `candidateId` é gerado pelo servidor. O `POST` responde `201`, e os erros seguem o formato `{ "error": "mensagem" }`.
3. **CORS:** o backend aceita por padrão `http://localhost:5173`. Se abrir o frontend por `127.0.0.1`, defina `CORS_ORIGIN` no backend ou use `localhost` nos dois.
4. **Screenshots e prompts:** a pasta `docs/screenshots` e os arquivos em `docs/ai-devtools/prompts/` são placeholders. Nada foi inventado.

## Uso de AI DevTools

- **Claude:** gerou os prompts de backend e frontend a partir do enunciado.
- **Codex:** implementou, revisou e validou o código.

| Etapa | O que a IA fez |
| --- | --- |
| Leitura inicial | Analisou o README e os arquivos de `/data` e apontou que a vaga estava ausente |
| Backend | Ajudou a separar tipos, rotas, serviços, aliases e store |
| Testes | Gerou e revisou casos unitários e de integração |
| Frontend | Criou o formulário, a integração com a API e o dashboard |
| Revisão visual | Simplificou o layout e removeu efeitos que poderiam travar a tela |

A IA não dispensou a conferência manual: os currículos reais de `/data` foram usados para validar os resultados.

## Validação

- Backend: build e 26 testes passando.
- Frontend: build e 7 testes passando.
- Sem overflow horizontal em 375, 768 e 1280 px.
- Resultados com os CVs de exemplo: **Maria 100, João 40, Ana 20**.

## Onde está o código

- Backend: [`backend/README.md`](../../backend/README.md), [`routes/match.ts`](../../backend/src/routes/match.ts), [`services/matching.ts`](../../backend/src/services/matching.ts), [`store/matchRepository.ts`](../../backend/src/store/matchRepository.ts)
- Frontend: [`frontend/README.md`](../../frontend/README.md), [`services/api.ts`](../../frontend/src/services/api.ts), [`UploadForm.tsx`](../../frontend/src/components/UploadForm.tsx), [`ResultDashboard.tsx`](../../frontend/src/components/ResultDashboard.tsx)