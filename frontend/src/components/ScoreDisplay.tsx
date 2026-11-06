interface ScoreDisplayProps {
  score: number;
}

function scoreStyle(score: number) {
  if (score >= 80)
    return {
      label: "Aderência forte",
      text: "text-emerald-700",
      bar: "bg-emerald-500",
      track: "bg-emerald-100",
    };
  if (score >= 50)
    return {
      label: "Aderência parcial",
      text: "text-amber-700",
      bar: "bg-amber-500",
      track: "bg-amber-100",
    };
  return {
    label: "Aderência baixa",
    text: "text-red-700",
    bar: "bg-red-500",
    track: "bg-red-100",
  };
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const style = scoreStyle(score);
  return (
    <section
      aria-label="Score de compatibilidade"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Compatibilidade
          </p>
          <p className={`mt-2 text-5xl font-black ${style.text}`}>
            {score}
            <span className="text-2xl">%</span>
          </p>
        </div>
        <p className={`text-right text-sm font-bold ${style.text}`}>
          {style.label}
        </p>
      </div>
      <div className={`mt-5 h-3 overflow-hidden rounded-full ${style.track}`}>
        <div
          className={`h-full rounded-full ${style.bar} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </section>
  );
}
