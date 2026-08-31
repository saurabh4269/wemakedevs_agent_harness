export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type Caption = {
  startSec: number;
  endSec: number;
  kicker: string;
  line: string;
};

/**
 * Spoken beats. Written like a person walking a friend through the product —
 * not a trailer voice. Timestamps come from generate-voiceover.ts.
 */
export const VOICEOVER_BEATS: { id: string; text: string }[] = [
  {
    id: "open",
    text: "Hey — so checkout conversion dropped about nineteen percent since Friday afternoon, desktop Chrome. LOOP is our incident responder. One TrueForge agent. Chat is the UI.",
  },
  {
    id: "looks",
    text: "You just paste that signal. LOOP doesn't go hunting by itself. It spins up three looks — analytics, logs, and deploys — each with a different question. Watch Agent Steps. Analytics gives you the metric, the funnel step, the segment. Logs give you the error, the file, the timestamp, the count. Deploys pin the service, the time it shipped, that catalog v-three rollout Friday afternoon.",
  },
  {
    id: "fixtures",
    text: "Quick honest bit. Those warehouse answers are fixtures. We say that out loud. The pause, the Daytona sandbox, and the three named looks are real.",
  },
  {
    id: "sandbox",
    text: "Independence holds, so this is a Type A break. Catalog got renamed, and the enterprise alias was still pointing at a plan that doesn't exist anymore. Daytona snapshot is empty — that's normal. LOOP clones the public harness, then patches checkout so enterprise aliases enterprise-annual-v-three.",
  },
  {
    id: "pause",
    text: "Then the write. LOOP opens a draft PR, merge off. Allow and Deny just sit there in Agent Steps. We don't click. Writes wait for a person. LOOP never merges. LOOP never deploys prod.",
  },
  {
    id: "lesson",
    text: "Refresh... and the pause is still there. A human owns the write. Three looks, a sandbox patch, a person on the PR. That's LOOP.",
  },
];

/** Steering for gpt-4o-mini-tts. Keep this in git so the VO is reproducible. */
export const VOICEOVER_INSTRUCTIONS = `Voice: young adult male founder, warm, close-mic, like a Loom walkthrough to a friend.
Accent: natural international English with a light Indian cadence. Do not put on a British narrator or American radio announcer.
Delivery: conversational, slightly smiling, thinking out loud. Short breaths between thoughts. Not a movie trailer. Not a documentary.
Pace: unhurried, everyday talking speed. Emphasize product words the way a person would, not in all-caps.
If this clip is one section of a longer demo, continue the same energy — don't restart like a new take.`;

export const CAPTIONS: Caption[] = [
  {
    startSec: 0.2,
    endSec: 10.9,
    kicker: "INCIDENT",
    line: "Checkout conversion dropped ~19% on desktop Chrome",
  },
  {
    startSec: 10.9,
    endSec: 35.5,
    kicker: "THREE LOOKS",
    line: "analytics · logs · deploys — root does not self-investigate",
  },
  {
    startSec: 35.5,
    endSec: 44.7,
    kicker: "HONEST",
    line: "Warehouse + GitHub are fixtures. Pause, sandbox, looks are real.",
  },
  {
    startSec: 44.7,
    endSec: 63.5,
    kicker: "TYPE A",
    line: "Clone the harness. Patch enterprise → enterprise-annual-v3",
  },
  {
    startSec: 63.5,
    endSec: 75.1,
    kicker: "WRITES WAIT",
    line: "open_draft_pr · merge false · do not click Approve",
  },
  {
    startSec: 75.1,
    endSec: 83.0,
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
  { startSec: 0, endSec: 10.9, scale: 1, x: 0, y: 0 },
  { startSec: 10.9, endSec: 35.5, scale: 1.08, x: 16, y: -8 },
  { startSec: 35.5, endSec: 44.7, scale: 1.04, x: 0, y: 4 },
  { startSec: 44.7, endSec: 63.5, scale: 1.1, x: -10, y: 12 },
  { startSec: 63.5, endSec: 75.1, scale: 1.12, x: 8, y: 16 },
  { startSec: 75.1, endSec: 83.0, scale: 1.02, x: 0, y: 0 },
];

export const TITLE_SECONDS = 4.5;
export const END_SECONDS = 5.5;
/** Skip the opening linger on the pause; land on the prompt. */
export const DEFAULT_SCREEN_START_SEC = 14;
/** Trim the post-refresh sidebar linger. */
export const DEFAULT_SCREEN_SECONDS = 83;

export const compositionSeconds = (): number =>
  TITLE_SECONDS + DEFAULT_SCREEN_SECONDS + END_SECONDS;
