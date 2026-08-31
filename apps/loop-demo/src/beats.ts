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
 * Spoken beats. Screen-share English, not pitch-deck English.
 * Point at what's on screen. No slogans. No internal skill names.
 */
export const VOICEOVER_BEATS: { id: string; text: string }[] = [
  {
    id: "open",
    text: "Okay so — checkout conversion dropped about nineteen percent since Friday afternoon, desktop Chrome. That's what we're looking at. LOOP is one TrueForge agent. You just talk to it in chat.",
  },
  {
    id: "looks",
    text: "I paste that in. It doesn't go query everything itself. It kicks off three threads — analytics, logs, and deploys. You can see them under Agent Steps. Analytics is the funnel, desktop Chrome, since Friday. Logs are what's actually erroring, in which file. Deploys are what shipped that afternoon. So you're not getting the same sentence three times.",
  },
  {
    id: "fixtures",
    text: "The warehouse numbers — those are fixtures. I want to be straight about that. The pause you're about to see, the sandbox, these three threads — that's real.",
  },
  {
    id: "sandbox",
    text: "What broke is pretty small. They renamed the catalog and the enterprise alias was still pointing at the old plan id. Sandbox starts empty, so it clones the repo, opens checkout.ts, and points enterprise at enterprise-annual-v-three.",
  },
  {
    id: "pause",
    text: "Then it tries to open a draft PR. Merge is off. And it just stops. Allow and Deny are sitting there. I'm not clicking them. Someone has to hit Allow. It never merges. It never deploys prod.",
  },
  {
    id: "lesson",
    text: "If I refresh... still there. Same pause. So that's the whole thing — three threads, a patch in the sandbox, and a human on the PR.",
  },
];

/** Steering for gpt-4o-mini-tts. */
export const VOICEOVER_INSTRUCTIONS = `You are a young male founder screen-sharing with a teammate, not presenting on a stage.
Accent: natural Indian English. Relaxed. Do not sound American-radio or British-narrator.
Delivery: like a Loom. Think out loud. Shrink the ends of sentences. Tiny pauses where a person would breathe.
Do NOT sound like marketing copy. Do NOT punch every noun. Do NOT smile-voice or movie-trailer.
Pace: talking speed, a little messy is good. Contractions. "gonna" energy even if the text says "going to".
This is one continuous take. Don't restart energy between paragraphs.`;

export const CAPTIONS: Caption[] = [
  {
    startSec: 0.2,
    endSec: 11.1,
    kicker: "THE DROP",
    line: "Checkout conversion, Friday, desktop Chrome",
  },
  {
    startSec: 11.1,
    endSec: 31.4,
    kicker: "AGENT STEPS",
    line: "analytics, logs, deploys — three different questions",
  },
  {
    startSec: 31.4,
    endSec: 40.5,
    kicker: "NOTE",
    line: "Warehouse numbers are fixtures. Pause and sandbox are real.",
  },
  {
    startSec: 40.5,
    endSec: 53.9,
    kicker: "THE FIX",
    line: "Clone the repo. Point enterprise at enterprise-annual-v3",
  },
  {
    startSec: 53.9,
    endSec: 64.9,
    kicker: "IT STOPS",
    line: "Draft PR, merge off. Not clicking Allow.",
  },
  {
    startSec: 64.9,
    endSec: 72.3,
    kicker: "STILL THERE",
    line: "Refresh. Same pause. A person owns the write.",
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
  { startSec: 0, endSec: 11.1, scale: 1, x: 0, y: 0 },
  { startSec: 11.1, endSec: 31.4, scale: 1.08, x: 16, y: -8 },
  { startSec: 31.4, endSec: 40.5, scale: 1.04, x: 0, y: 4 },
  { startSec: 40.5, endSec: 53.9, scale: 1.1, x: -10, y: 12 },
  { startSec: 53.9, endSec: 64.9, scale: 1.12, x: 8, y: 16 },
  { startSec: 64.9, endSec: 83.0, scale: 1.02, x: 0, y: 0 },
];

export const TITLE_SECONDS = 4.5;
export const END_SECONDS = 5.5;
/** Skip the opening linger on the pause; land on the prompt. */
export const DEFAULT_SCREEN_START_SEC = 14;
/** Trim the post-refresh sidebar linger. */
export const DEFAULT_SCREEN_SECONDS = 83;

export const compositionSeconds = (): number =>
  TITLE_SECONDS + DEFAULT_SCREEN_SECONDS + END_SECONDS;
