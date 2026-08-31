import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VOICEOVER_BEATS, VOICEOVER_INSTRUCTIONS } from "../src/beats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const tmpDir = path.join(root, "tmp", "tts");

const loadKey = async (): Promise<string> => {
  const envPath = path.resolve(root, "../../.env");
  const text = await readFile(envPath, "utf8");
  for (const line of text.split("\n")) {
    if (line.startsWith("OPENAI_API_KEY=")) {
      const value = line.slice("OPENAI_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
      if (value.length > 20) {
        return value;
      }
    }
  }
  throw new Error("OPENAI_API_KEY missing");
};

const ffprobeDuration = (file: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const child = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      file,
    ]);
    let out = "";
    child.stdout.on("data", (d: Buffer) => {
      out += d.toString();
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe ${code}`));
        return;
      }
      resolve(Number(out.trim()));
    });
  });

type SpeakOpts = {
  key: string;
  text: string;
  dest: string;
  model: string;
  voice: string;
  instructions?: string;
};

const speak = async ({ key, text, dest, model, voice, instructions }: SpeakOpts): Promise<void> => {
  const body: Record<string, unknown> = {
    model,
    voice,
    input: text,
    response_format: "mp3",
  };
  if (instructions) {
    body.instructions = instructions;
  }
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`tts ${res.status} ${errText.slice(0, 240)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
};

const speakWithFallback = async (key: string, text: string, dest: string): Promise<void> => {
  const attempts: Omit<SpeakOpts, "key" | "text" | "dest">[] = [
    { model: "gpt-4o-mini-tts", voice: "cedar", instructions: VOICEOVER_INSTRUCTIONS },
    { model: "gpt-4o-mini-tts", voice: "ash", instructions: VOICEOVER_INSTRUCTIONS },
    { model: "tts-1-hd", voice: "echo" },
  ];
  let last = "tts failed";
  for (const attempt of attempts) {
    try {
      await speak({ key, text, dest, ...attempt });
      process.stdout.write(`tts ${attempt.model} ${attempt.voice}\n`);
      return;
    } catch (err) {
      last = err instanceof Error ? err.message : "tts failed";
      process.stderr.write(`${last}\n`);
    }
  }
  throw new Error(last);
};

const main = async (): Promise<void> => {
  const key = await loadKey();
  await mkdir(tmpDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  // One continuous take — concatenating clips makes the VO restart energy each beat.
  const script = VOICEOVER_BEATS.map((b) => b.text).join("\n\n");
  const outMp3 = path.join(publicDir, "voiceover.mp3");
  await speakWithFallback(key, script, outMp3);
  const total = await ffprobeDuration(outMp3);

  const charTotal = VOICEOVER_BEATS.reduce((n, b) => n + b.text.length, 0);
  let cursor = 0.2;
  const timeline: { id: string; startSec: number; endSec: number }[] = [];
  for (const beat of VOICEOVER_BEATS) {
    const share = beat.text.length / charTotal;
    const dur = total * share;
    timeline.push({ id: beat.id, startSec: cursor, endSec: cursor + dur });
    cursor += dur;
  }

  await writeFile(
    path.join(publicDir, "voiceover.json"),
    `${JSON.stringify({ total, timeline, model: "gpt-4o-mini-tts", voice: "cedar" }, null, 2)}\n`,
  );
  process.stdout.write(`voiceover ${total.toFixed(2)}s\n`);
};

main().catch((err: unknown) => {
  process.stderr.write(err instanceof Error ? err.message : "tts failed");
  process.stderr.write("\n");
  process.exit(1);
});
