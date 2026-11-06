import type { MatchResult } from "../types";
import { RefreshIcon } from "./Icons";
import { InsightsPanel } from "./InsightsPanel";
import { QuestionsList } from "./QuestionsList";
import { ScoreDisplay } from "./ScoreDisplay";
import { SkillList } from "./SkillList";

export function ResultDashboard({
  result,
  onNewAnalysis,
}: {
  result: MatchResult;
  onNewAnalysis: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
            Análise concluída
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Resultado do matching
          </h2>
        </div>
        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <RefreshIcon />
          Nova análise
        </button>
      </div>
      <div className="grid min-w-0 gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <ScoreDisplay score={result.overallScore} />
        <div className="min-w-0 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SkillList
              title="Skills correspondentes"
              skills={result.matchedSkills}
              tone="matched"
            />
            <SkillList
              title="Skills faltantes"
              skills={result.missingSkills}
              tone="missing"
            />
          </div>
          <InsightsPanel text={result.insights} />
          <QuestionsList questions={result.suggestedQuestions} />
        </div>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Detalhes da análise
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Candidate ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs leading-5 text-slate-600">
              {result.candidateId}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Job ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs leading-5 text-slate-600">
              {result.jobId}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Match ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs leading-5 text-slate-600">
              {result.matchId}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
