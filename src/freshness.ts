export type DeployFreshness = {
  stillTrue: boolean;
  currentCommit?: string;
  currentPlanCatalog?: string;
};

/**
 * Lethe-shaped gate: do not open a PR if the deploy SHA / plan catalog
 * in the brief no longer matches what deploys just returned.
 */
export function briefStillTrue(freshness: DeployFreshness | undefined): boolean {
  return freshness?.stillTrue === true;
}

export function freshnessFromUnknown(value: unknown): DeployFreshness | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const rec = value as Record<string, unknown>;
  const raw = rec.stillTrue ?? rec.still_true;
  if (raw !== true && raw !== false) {
    return undefined;
  }
  const commit = rec.currentCommit ?? rec.current_commit;
  const catalog = rec.currentPlanCatalog ?? rec.current_plan_catalog;
  return {
    stillTrue: raw === true,
    currentCommit: typeof commit === "string" ? commit : undefined,
    currentPlanCatalog: typeof catalog === "string" ? catalog : undefined,
  };
}

export function mayOpenDraftPr(input: {
  storyFreshness: unknown;
  claimedStillTrue?: boolean;
}): { ok: boolean; error?: string } {
  const freshness = freshnessFromUnknown(input.storyFreshness);
  if (!briefStillTrue(freshness)) {
    return {
      ok: false,
      error: "stale brief: deploys.still_true is false. Refuse a write.",
    };
  }
  if (input.claimedStillTrue === false) {
    return {
      ok: false,
      error: "stale brief: still_true was false. Refuse a write.",
    };
  }
  return { ok: true };
}
