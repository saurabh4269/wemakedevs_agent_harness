import { Composition } from "remotion";
import {
  DEFAULT_SCREEN_SECONDS,
  DEFAULT_SCREEN_START_SEC,
  END_SECONDS,
  FPS,
  HEIGHT,
  TITLE_SECONDS,
  WIDTH,
} from "./beats";
import { LoopDemo } from "./LoopDemo";

export const RemotionRoot = () => {
  const screenDurationSec = Number(process.env.LOOP_SCREEN_SECONDS ?? DEFAULT_SCREEN_SECONDS);
  const screenStartSec = Number(process.env.LOOP_SCREEN_START ?? DEFAULT_SCREEN_START_SEC);
  const durationInFrames = Math.round((TITLE_SECONDS + screenDurationSec + END_SECONDS) * FPS);

  return (
    <Composition
      id="LoopDemo"
      component={LoopDemo}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{
        screenSrc: "screen.mp4",
        wallpaperSrc: "macos-wallpaper.png",
        voiceoverSrc: "voiceover.mp3",
        screenStartSec,
        screenDurationSec,
      }}
    />
  );
};
