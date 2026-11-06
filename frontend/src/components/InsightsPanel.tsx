export function InsightsPanel({ text }: { text: string }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <h3 className="text-base font-bold text-slate-900">Insights</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{text}</p>
    </section>
  );
}
