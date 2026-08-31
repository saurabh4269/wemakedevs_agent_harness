import { useEffect, useState } from "react";
import { loadLoopStatus } from "./session-events";
import { EMPTY_STATUS, STATUS_LABELS, type LoopStatus, type StatusPhase } from "./status";

const PHASE_BY_LABEL: Record<(typeof STATUS_LABELS)[number], StatusPhase> = {
  Doing: "doing",
  Waiting: "waiting",
  Did: "did",
};

export function StatusRail({
  snapshot,
  sessionId,
  loadStatus = loadLoopStatus,
}: {
  snapshot?: LoopStatus;
  sessionId?: string;
  loadStatus?: (sessionId?: string) => Promise<LoopStatus>;
}) {
  const [live, setLive] = useState<LoopStatus>(snapshot ?? EMPTY_STATUS);

  useEffect(() => {
    if (snapshot) {
      setLive(snapshot);
      return;
    }
    let cancelled = false;
    let generation = 0;
    const tick = async () => {
      const gen = ++generation;
      const next = await loadStatus(sessionId);
      if (!cancelled && gen === generation) {
        setLive(next);
      }
    };
    void tick();
    const id = window.setInterval(() => {
      void tick();
    }, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [loadStatus, sessionId, snapshot]);

  const view = snapshot ?? live;
  const details: Record<(typeof STATUS_LABELS)[number], string> = {
    Doing: view.doing,
    Waiting: view.waiting,
    Did: view.did,
  };

  return (
    <section className="loop-rail" aria-label="LOOP status">
      <p className="loop-rail-kicker">Agent loop</p>
      <h1>LOOP</h1>
      <p className="loop-rail-hint">Watch Waiting — that is the pause before any write.</p>
      <p className="loop-rail-honest">Warehouse and GitHub are fixtures. The pause and sandbox are real.</p>
      {view.phase === "error" ? (
        <p className="loop-rail-error" role="alert">
          {view.error || "Could not load LOOP status"}
        </p>
      ) : (
        <ol>
          {STATUS_LABELS.map((label) => {
            const active = view.phase === PHASE_BY_LABEL[label];
            return (
              <li key={label} data-active={active ? "true" : "false"}>
                <span className="loop-rail-label">{label}</span>
                <span className="loop-rail-detail">{details[label]}</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
