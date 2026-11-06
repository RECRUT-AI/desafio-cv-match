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

## Instruções de instalação e execução

Em um terminal, inicie o backend primeiro:

```bash
cd backend
npm install
npm run dev
```

Em outro terminal, inicie o frontend:

```bash
cd frontend
npm install
npm run dev
```

O backend fica em `http://localhost:3001` e o frontend em `http://localhost:5173`.

## Decisões técnicas e trade-offs

O backend usa Node.js, Express, TypeScript strict, motor determinístico e armazenamento em memória com `Map`; os relatórios são perdidos ao reiniciar. O frontend usa React + TypeScript, Vite, Tailwind CSS, `fetch` nativo e estado local com `useState`. Após criar uma análise, o frontend consulta o relatório pelo `matchId` para consumir os dois endpoints definidos. A vaga permanece provisória e editável em JSON na tela.

## Uso de AI DevTools

A ser preenchido pelo autor: logs de prompts, screenshots e comentários.
