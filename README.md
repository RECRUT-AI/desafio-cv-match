# Desafio Técnico: Match de Candidatos

## Contexto
Desenvolver um MVP de um sistema de matching entre candidatos e vagas para plataforma de recrutamento automatizado. O sistema deve analisar currículos de candidatos e determinar o quão adequados eles são para uma vaga específica.

## Requisitos Funcionais

1. **Backend API** com os seguintes endpoints:
   - `POST /api/match` - Recebe um CV (texto) e uma vaga (JSON) e retorna um score de compatibilidade
   - `GET /api/match/report/:id` - Retorna detalhes da análise de match

2. **Frontend** com:
   - Tela para upload de CVs (texto simples)
   - Dashboard mostrando resultados do matching com:
     - Score de compatibilidade (0-100)
     - Skills correspondentes destacadas
     - Skills faltantes
   - Opcionalmente incluir um resumo com insights sobre o candidato e sugestões de perguntas para entrevista

## Requisitos Técnicos

### Obrigatórios
- **Backend**: Node.js (Express/Fastify) ou Python (FastAPI/Flask)
- **Frontend**: React
- **Banco de Dados**: pode usar in-memory para o MVP
- **Documentação**: README com instruções de setup e execução
- **AI DevTools**: uso de ferramentas como Cursor, Windsurf, Claude Code, Codex, Lovable

### Desejáveis
- Testes unitários para lógica crítica

## Materiais Fornecidos
- 3 exemplos de CVs em formato Markdown
- 1 Job Description em formato JSON estruturado
- Estrutura sugerida de resposta da API (pode ser adaptada)

```json
{
  "candidateId": "string",
  "jobId": "string",
  "overallScore": 85,
  "matchedSkills": ["Python", "AWS", "Docker"],
  "missingSkills": ["Kubernetes", "Terraform"],
  "insights": "string",
  "suggestedQuestions": ["array de strings (opcional)"]
}
```

## Critérios de Avaliação
- Qualidade do Código
- Funcionalidade
- Uso de IA

## Entrega

1. **Código fonte** em repositório Git (GitHub, GitLab, etc)

2. **README** incluindo:
   - Instruções de instalação e execução
   - Decisões técnicas e trade-offs

3. **Uso de IA DevTools**
   - Logs dos prompts e screenshots
   - Comentários sobre:
     1. Como você usou ferramentas de IA no desenvolvimento?
     2. Onde a IA ajudou mais e onde você preferiu código manual?

---

## Instalação e execução

Requer Node.js 20 ou superior. Rode o backend primeiro e o frontend depois, em dois terminais.

```bash
# Terminal 1: backend (http://localhost:3001)
cd backend
npm install
npm run dev

# Terminal 2: frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Para rodar os testes e o build, use `npm test` e `npm run build` dentro de cada pasta. O frontend usa `VITE_API_URL` (veja `frontend/.env.example`) se o backend estiver em outra porta, e o backend usa `PORT` e `CORS_ORIGIN`.

Detalhes de cada parte: [`backend/README.md`](./backend/README.md) e [`frontend/README.md`](./frontend/README.md).

## Decisões técnicas e trade-offs

- **Backend:** Node.js, Express e TypeScript, com dados em memória (`Map`). O match é feito por regras, sem LLM e sem chamadas externas: o score é a proporção de skills exigidas encontradas no currículo.
- **Frontend:** React, TypeScript, Vite e Tailwind CSS, com `fetch` e estado local.
- **Vaga provisória:** `data/job_description.json` traz um exemplo de resposta da API, não uma vaga. O formato de entrada da vaga (`jobId` e `requiredSkills`) é provisório e deve ser trocado quando existir uma vaga real.
- **Adaptação da resposta:** foi adicionado o campo `matchId`, usado em `GET /api/match/report/:id`.

O registro completo de decisões, trade-offs e validação está em [`docs/ai-devtools/README.md`](./docs/ai-devtools/README.md).

## Uso de AI DevTools

Os prompts utilizados estão em [`docs/ai-devtools/prompts/`](./docs/ai-devtools/prompts/), os screenshots em [`docs/screenshots/`](./docs/screenshots/) e os comentários sobre como a IA foi usada em [`docs/ai-devtools/README.md`](./docs/ai-devtools/README.md).