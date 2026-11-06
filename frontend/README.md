# CV Match Frontend

Frontend React + TypeScript do MVP de matching. O contrato da vaga é provisório e aparece no textarea para edição.

## Instalação e execução

```bash
cd frontend
npm install
npm run dev
```

O Vite abre em `http://localhost:5173`. Configure `VITE_API_URL` em `.env` se o backend não estiver em `http://localhost:3001`; o arquivo `.env.example` contém o valor padrão. Para validar, use `npm run build`, `npm test` e `npm run preview`.

Para rodar junto com o backend, inicie primeiro `cd backend && npm run dev` (porta 3001) e depois, em outro terminal, `cd frontend && npm run dev` (porta 5173). O backend já habilita CORS para essa origem.

## Decisões técnicas e trade-offs

- React com TypeScript foi escolhido para manter tipagem explícita do contrato e reduzir erros de integração.
- Vite foi escolhido como bundler por ter configuração pequena e desenvolvimento rápido.
- Tailwind CSS é usado para toda a estilização, sem biblioteca de componentes, gráficos ou roteamento.
- A comunicação usa `fetch` nativo. O POST é seguido pelo GET do relatório usando o `matchId`, conforme o fluxo exigido.
- O estado fica somente em `useState`; não há persistência, histórico ou autenticação.
- O formato provisório da vaga é mantido em `src/types.ts` e a constante de exemplo em `src/components/UploadForm.tsx`.
- A barra de score usa as mesmas faixas do backend: forte (80+), parcial (50–79) e baixa (<50).
