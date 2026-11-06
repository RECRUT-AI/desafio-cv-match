import type { MatchResult } from "../types";
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
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Análise concluída
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Resultado do matching
          </h2>
        </div>
        <button
          type="button"
          onClick={onNewAnalysis}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Nova análise
        </button>
      </div>
      <ScoreDisplay score={result.overallScore} />
      <div className="grid gap-5 md:grid-cols-2">
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
      <dl className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-3">
        <div>
          <dt className="font-bold uppercase tracking-wide">Candidate ID</dt>
          <dd className="mt-1 break-all">{result.candidateId}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-wide">Job ID</dt>
          <dd className="mt-1 break-all">{result.jobId}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-wide">Match ID</dt>
          <dd className="mt-1 break-all">{result.matchId}</dd>
        </div>
      </dl>
    </div>
  );
}
