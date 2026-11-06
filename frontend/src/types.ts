/** Formato provisório, alinhado ao contrato atual do backend. */
export interface JobInput {
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
  suggestedQuestions?: string[];
}
