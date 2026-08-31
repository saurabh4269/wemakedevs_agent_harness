import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

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

const copyIfMissing = async (from: string, to: string): Promise<void> => {
  if (existsSync(to)) {
    return;
  }
  if (!existsSync(from)) {
    throw new Error(`missing ${from}`);
  }
  await copyFile(from, to);
};

const main = async (): Promise<void> => {
  await mkdir(publicDir, { recursive: true });
  await copyIfMissing(
    "/usr/share/backgrounds/macos-wallpaper.png",
    path.join(publicDir, "macos-wallpaper.png"),
  );
  const raw =
    process.env.LOOP_SCREEN_RAW ??
    "/opt/cursor/artifacts/loop_mac_wallpaper_floating_browser_qualify_walk.mp4";
  const dest = path.join(publicDir, "screen.mp4");
  const source = existsSync(path.join(publicDir, "screen_raw.mp4"))
    ? path.join(publicDir, "screen_raw.mp4")
    : raw;
  if (!existsSync(source)) {
    process.stderr.write("screen capture missing — record the floating-window walk first\n");
    return;
  }
  // Crop Linux Chrome tabs/toolbar (Finish update) so Remotion can use Safari chrome.
  await run("ffmpeg", [
    "-y",
    "-i",
    source,
    "-vf",
    "crop=1276:728:322:198,fps=30,scale=1920:1096",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "fast",
    "-an",
    dest,
  ]);
};

main().catch((err: unknown) => {
  process.stderr.write(err instanceof Error ? err.message : "prepare failed");
  process.stderr.write("\n");
  process.exit(1);
});
