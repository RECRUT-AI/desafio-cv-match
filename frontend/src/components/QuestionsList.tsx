import { CheckIcon } from "./Icons";

export function QuestionsList({ questions }: { questions?: string[] }) {
  if (!questions?.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <CheckIcon />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-800">
            Perguntas sugeridas
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Pontos para aprofundar na entrevista
          </p>
        </div>
      </div>
      <ol className="mt-5 grid gap-3">
        {questions.map((question, index) => (
          <li
            key={question}
            className="flex min-w-0 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-sm leading-6 text-slate-700"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {index + 1}
            </span>
            <span className="break-words">{question}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
