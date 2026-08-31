export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type Caption = {
  startSec: number;
  endSec: number;
  kicker: string;
  line: string;
};

/** Spoken beats. Timestamps are rewritten after TTS by generate-voiceover.ts. */
export const VOICEOVER_BEATS: { id: string; text: string }[] = [
  {
    id: "open",
    text: "Checkout conversion dropped about nineteen percent since Friday afternoon on desktop Chrome. LOOP is an incident responder. One TrueForge agent. Chat is the UI.",
  },
  {
    id: "looks",
    text: "Paste that signal. LOOP does not investigate itself. It spawns three one-level looks with distinct questions: analytics, logs, and deploys. Watch Agent Steps. Analytics returns the metric, the funnel step, the segment. Logs name the error, the code path, the timestamp, the count. Deploys pin the service, the release time, the catalog v-three rollout that afternoon.",
  },
  {
    id: "fixtures",
    text: "Those warehouse answers are labeled fixtures. We say that out loud. The TrueForge pause, the Daytona sandbox, and the three named looks are real.",
  },
  {
    id: "sandbox",
    text: "Independence holds. This is a Type A break. The catalog rename left the enterprise alias pointing at a plan that no longer exists. In Daytona the snapshot is empty. Empty cwd is the normal case. LOOP clones the public harness, then patches checkout so enterprise aliases enterprise-annual-v-three.",
  },
  {
    id: "pause",
    text: "Then the write. LOOP opens a draft pull request with merge off. Approve and Deny sit in Agent Steps. We do not click. Writes wait for a human. LOOP never merges. LOOP never deploys production.",
  },
  {
    id: "lesson",
    text: "Refresh. The pause is still there. A person owns the write. Three independent looks. A sandbox patch. A human on the PR. That is LOOP.",
  },
];

export const CAPTIONS: Caption[] = [
  {
    startSec: 0.3,
    endSec: 10.7,
    kicker: "INCIDENT",
    line: "Checkout conversion dropped ~19% on desktop Chrome",
  },
  {
    startSec: 11.2,
    endSec: 34.2,
    kicker: "THREE LOOKS",
    line: "analytics · logs · deploys — root does not self-investigate",
  },
  {
    startSec: 34.8,
    endSec: 44.0,
    kicker: "HONEST",
    line: "Warehouse + GitHub are fixtures. Pause, sandbox, looks are real.",
  },
  {
    startSec: 44.5,
    endSec: 63.5,
    kicker: "TYPE A",
    line: "Clone the harness. Patch enterprise → enterprise-annual-v3",
  },
  {
    startSec: 64.1,
    endSec: 76.2,
    kicker: "WRITES WAIT",
    line: "open_draft_pr · merge false · do not click Approve",
  },
  {
    startSec: 76.8,
    endSec: 86.0,
    kicker: "LESSON",
    line: "Three looks. A sandbox patch. A person on the PR.",
  },
];

/** Screen Studio-style zoom windows, seconds into the screen clip. */
export type Zoom = {
  startSec: number;
  endSec: number;
  scale: number;
  x: number;
  y: number;
};

export const ZOOMS: Zoom[] = [
  { startSec: 0, endSec: 10.7, scale: 1, x: 0, y: 0 },
  { startSec: 11.2, endSec: 34.2, scale: 1.08, x: 16, y: -8 },
  { startSec: 34.8, endSec: 44.0, scale: 1.04, x: 0, y: 4 },
  { startSec: 44.5, endSec: 63.5, scale: 1.1, x: -10, y: 12 },
  { startSec: 64.1, endSec: 76.2, scale: 1.12, x: 8, y: 16 },
  { startSec: 76.8, endSec: 101.4, scale: 1.02, x: 0, y: 0 },
];

export const TITLE_SECONDS = 4.5;
export const END_SECONDS = 5.5;
/** Skip the opening linger on the pause; land on the prompt. */
export const DEFAULT_SCREEN_START_SEC = 14;
/** Trim the post-refresh sidebar linger. */
export const DEFAULT_SCREEN_SECONDS = 83;

export const compositionSeconds = (): number =>
  TITLE_SECONDS + DEFAULT_SCREEN_SECONDS + END_SECONDS;
