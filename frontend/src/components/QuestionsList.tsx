export function QuestionsList({ questions }: { questions?: string[] }) {
  if (!questions?.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">
        Perguntas sugeridas
      </h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    </section>
  );
}
