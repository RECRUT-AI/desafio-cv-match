interface ScoreDisplayProps {
  score: number;
}

function scoreStyle(score: number) {
  if (score >= 80)
    return {
      label: "Aderência forte",
      text: "text-emerald-800",
      bar: "bg-emerald-600",
      track: "bg-emerald-100",
      pill: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  if (score >= 50)
    return {
      label: "Aderência parcial",
      text: "text-amber-800",
      bar: "bg-amber-500",
      track: "bg-amber-100",
      pill: "bg-amber-50 text-amber-800 border-amber-200",
    };
  return {
    label: "Aderência baixa",
    text: "text-rose-800",
    bar: "bg-rose-600",
    track: "bg-rose-100",
    pill: "bg-rose-50 text-rose-800 border-rose-200",
  };
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const style = scoreStyle(score);
  return (
    <section
      aria-label={`Compatibilidade de ${score} por cento`}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Compatibilidade
          </p>
          <p
            className={`mt-2 tabular-nums text-5xl font-bold tracking-tight ${style.text}`}
          >
            {score}
            <span className="text-2xl">%</span>
          </p>
        </div>
        <p
          className={`rounded-full border px-3 py-1.5 text-right text-xs font-bold ${style.pill}`}
        >
          {style.label}
        </p>
      </div>
      <div className={`mt-6 h-3 w-full rounded-full ${style.track}`}>
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Aderência aos requisitos informados na vaga.
      </p>
    </section>
  );
}
