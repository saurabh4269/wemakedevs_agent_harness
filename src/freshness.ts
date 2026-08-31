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
