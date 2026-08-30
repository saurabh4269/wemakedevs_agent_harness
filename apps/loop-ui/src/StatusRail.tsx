import { useEffect, useState } from "react";
import { loadLoopStatus } from "./session-events";
import { EMPTY_STATUS, STATUS_LABELS, type LoopStatus, type StatusPhase } from "./status";

const PHASE_BY_LABEL: Record<(typeof STATUS_LABELS)[number], StatusPhase> = {
  Doing: "doing",
  Waiting: "waiting",
  Did: "did",
};

export function StatusRail({ snapshot }: { snapshot?: LoopStatus }) {
  const [live, setLive] = useState<LoopStatus>(snapshot ?? EMPTY_STATUS);

  useEffect(() => {
    if (snapshot) {
      setLive(snapshot);
      return;
    }
    let cancelled = false;
    const tick = async () => {
      const next = await loadLoopStatus();
      if (!cancelled) {
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
  }, [snapshot]);

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
    </section>
  );
}
