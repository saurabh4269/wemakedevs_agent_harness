export const SOURCE_NAMES = ["analytics", "logs", "deploys"] as const;
export type SourceName = (typeof SOURCE_NAMES)[number];

export type SourceReport = {
  source: SourceName;
  evidenceId?: string;
  uniqueFacts: string[];
  summary: string;
};

export type IndependenceResult = {
  independent: boolean;
  reason: string;
  overlap: number;
  uniqueEvidenceIds: string[];
};

const STOP = new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "because",
  "broke",
  "broken",
  "drop",
  "dropped",
  "conversion",
  "checkout",
  "source",
]);

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9._-]+/)
      .filter((token) => token.length > 2 && !STOP.has(token)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) {
    return 1;
  }
  let inter = 0;
  for (const item of a) {
    if (b.has(item)) {
      inter += 1;
    }
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 1 : inter / union;
}

function hasAllSources(reports: SourceReport[]): boolean {
  const seen = new Set(reports.map((report) => report.source));
  return SOURCE_NAMES.every((name) => seen.has(name));
}

/**
 * TrueForge LOOP refuses a root cause unless analytics, logs, and deploys
 * each contribute independent evidence — not three restatements of one query.
 */
export function assessThreeSourceIndependence(reports: SourceReport[]): IndependenceResult {
  if (reports.length !== 3 || !hasAllSources(reports)) {
    return {
      independent: false,
      reason:
        "Refuse a root cause: investigation needs three independent sources (analytics, logs, deploy timeline), not one query restated three times.",
      overlap: 1,
      uniqueEvidenceIds: [],
    };
  }

  const evidenceIds = reports
    .map((report) => report.evidenceId?.trim())
    .filter((id): id is string => Boolean(id));
  const uniqueEvidenceIds = [...new Set(evidenceIds)];

  const tokenSets = reports.map((report) =>
    tokens([report.summary, ...report.uniqueFacts].join(" ")),
  );
  const first = tokenSets[0] ?? new Set<string>();
  const second = tokenSets[1] ?? new Set<string>();
  const third = tokenSets[2] ?? new Set<string>();
  const overlap =
    (jaccard(first, second) + jaccard(first, third) + jaccard(second, third)) / 3;

  const factSets = reports.map(
    (report) => new Set(report.uniqueFacts.map((fact) => fact.trim().toLowerCase()).filter(Boolean)),
  );
  const distinctFactCount = new Set(factSets.flatMap((set) => [...set])).size;
  const minFacts = Math.min(...factSets.map((set) => set.size));

  const idsIndependent = uniqueEvidenceIds.length === 3;
  const factsIndependent = distinctFactCount >= 6 && minFacts >= 2;
  const lexicalIndependent = overlap <= 0.45;

  if (idsIndependent && factsIndependent && lexicalIndependent) {
    return {
      independent: true,
      reason: "Analytics, logs, and deploys each add evidence the others do not.",
      overlap,
      uniqueEvidenceIds,
    };
  }

  return {
    independent: false,
    reason:
      "Refuse a root cause: analytics, logs, and deploys collapsed into restatements of one query. Spawn three subagents with distinct questions, or stop.",
    overlap,
    uniqueEvidenceIds,
  };
}
