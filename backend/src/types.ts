export interface JobInput {
  /** formato provisório: será substituído quando o contrato real de vaga existir. */
  jobId: string;
  requiredSkills: string[];
  [key: string]: unknown;
}

export interface MatchRequest {
  cv: string;
  job: JobInput;
}

export interface MatchResult {
  matchId: string;
  candidateId: string;
  jobId: string;
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  insights: string;
  suggestedQuestions: string[];
}
