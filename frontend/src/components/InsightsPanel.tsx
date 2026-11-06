import { SparkIcon } from "./Icons";

export function InsightsPanel({ text }: { text: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 border-l-4 border-l-indigo-600 bg-indigo-50 p-5 sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600">
          <SparkIcon />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-indigo-950">
            Insights
          </h3>
          <p className="mt-3 break-words text-sm leading-7 text-slate-700">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
