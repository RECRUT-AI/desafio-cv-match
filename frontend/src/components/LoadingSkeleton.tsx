export function LoadingSkeleton() {
  return (
    <section
      aria-label="Carregando análise"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
    >
      <p className="text-sm font-semibold text-slate-700">
        Analisando currículo...
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Aguarde enquanto preparamos o resultado.
      </p>
    </section>
  );
}
