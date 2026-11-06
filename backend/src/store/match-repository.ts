import type { MatchResult } from "../types.js";

export interface MatchRepository {
  save(result: MatchResult): void;
  findById(id: string): MatchResult | undefined;
}

export class InMemoryMatchRepository implements MatchRepository {
  private readonly matches = new Map<string, MatchResult>();

  save(result: MatchResult): void {
    this.matches.set(result.matchId, result);
  }

  findById(id: string): MatchResult | undefined {
    return this.matches.get(id);
  }
}
