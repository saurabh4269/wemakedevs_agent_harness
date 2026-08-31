import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VOICEOVER_BEATS } from "../src/beats";

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

const run = (cmd: string, args: string[]): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${cmd} exited ${code}`));
    });
  });

const speak = async (key: string, text: string, dest: string): Promise<void> => {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      voice: "fable",
      speed: 0.97,
      input: text,
    }),
  });
  if (!res.ok) {
    throw new Error(`tts ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
};

const main = async (): Promise<void> => {
  const key = await loadKey();
  await mkdir(tmpDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  const parts: { id: string; file: string; duration: number }[] = [];
  let cursor = 0.35;
  const timeline: { id: string; startSec: number; endSec: number }[] = [];

  for (const beat of VOICEOVER_BEATS) {
    const file = path.join(tmpDir, `${beat.id}.mp3`);
    await speak(key, beat.text, file);
    const duration = await ffprobeDuration(file);
    parts.push({ id: beat.id, file, duration });
    timeline.push({ id: beat.id, startSec: cursor, endSec: cursor + duration });
    cursor += duration + 0.55;
  }

  const wavs: string[] = [];
  const silence = path.join(tmpDir, "silence.wav");
  await run("ffmpeg", [
    "-y",
    "-f",
    "lavfi",
    "-i",
    "anullsrc=r=24000:cl=mono",
    "-t",
    "0.55",
    silence,
  ]);
  wavs.push(silence);
  for (const part of parts) {
    const wav = path.join(tmpDir, `${part.id}.wav`);
    await run("ffmpeg", ["-y", "-i", part.file, "-ar", "24000", "-ac", "1", wav]);
    wavs.push(wav, silence);
  }
  const listPath = path.join(tmpDir, "concat.txt");
  await writeFile(
    listPath,
    wavs.map((f) => `file '${f}'`).join("\n") + "\n",
  );

  const outMp3 = path.join(publicDir, "voiceover.mp3");
  await run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listPath,
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    outMp3,
  ]);
  const total = await ffprobeDuration(outMp3);
  await writeFile(
    path.join(publicDir, "voiceover.json"),
    `${JSON.stringify({ total, timeline }, null, 2)}\n`,
  );
  process.stdout.write(`voiceover ${total.toFixed(2)}s\n`);
};

main().catch((err: unknown) => {
  process.stderr.write(err instanceof Error ? err.message : "tts failed");
  process.stderr.write("\n");
  process.exit(1);
});
