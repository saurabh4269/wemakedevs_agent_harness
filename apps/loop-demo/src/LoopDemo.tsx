import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CAPTIONS, END_SECONDS, TITLE_SECONDS, ZOOMS, type Zoom } from "./beats";
import { LowerThird } from "./LowerThird";
import { MacDesktop } from "./MacDesktop";
import { SafariFrame } from "./SafariFrame";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["500", "600"],
  ignoreTooManyRequestsWarning: true,
});

export type LoopDemoProps = {
  screenSrc: string;
  wallpaperSrc: string;
  voiceoverSrc: string;
  screenStartSec: number;
  screenDurationSec: number;
};

export const LoopDemo = ({
  screenSrc,
  wallpaperSrc,
  voiceoverSrc,
  screenStartSec,
  screenDurationSec,
}: LoopDemoProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const titleFrames = TITLE_SECONDS * fps;
  const endStart = durationInFrames - END_SECONDS * fps;

  const titleOpacity = interpolate(frame, [0, 18, titleFrames - 18, titleFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const screenOpacity = interpolate(frame, [titleFrames - 12, titleFrames + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const endOpacity = interpolate(frame, [endStart, endStart + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const word = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 90 },
  });

  const screenT = Math.max(0, t - TITLE_SECONDS);
  const zoom = activeZoom(screenT);
  const { scale, tx, ty } = zoomTransform(screenT, zoom);

  const pad = 56;
  const showScreen = frame >= titleFrames - 12 && frame < endStart + 8;

  return (
    <AbsoluteFill style={{ background: "#0b0b0c" }}>
      <MacDesktop wallpaperSrc={wallpaperSrc} />

      {showScreen ? (
        <AbsoluteFill
          style={{
            opacity: screenOpacity * (1 - endOpacity * 0.85),
            padding: `${pad + 8}px ${pad + 48}px ${pad + 28}px`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
              transformOrigin: "center center",
            }}
          >
            <SafariFrame url="loop.heisenbug.in">
              <OffthreadVideo
                src={staticFile(screenSrc)}
                startFrom={Math.round(screenStartSec * fps)}
                endAt={Math.round((screenStartSec + screenDurationSec) * fps)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 38%",
                }}
                muted
              />
            </SafariFrame>
          </div>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        style={{
          opacity: titleOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            fontFamily,
        }}
      >
        <div style={{ textAlign: "center", transform: `translateY(${(1 - word) * 18}px)` }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.78)",
              marginBottom: 14,
              fontWeight: 600,
            }}
          >
            INCIDENT RESPONDER
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 650,
              color: "#f5f5f7",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            LOOP
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 22,
              color: "rgba(255,255,255,0.84)",
              fontWeight: 450,
            }}
          >
            Three looks. A sandbox patch. A person on the write.
          </div>
        </div>
      </AbsoluteFill>

      {frame >= titleFrames && frame < endStart ? (
        <LowerThird
          captions={CAPTIONS.map((c) => ({
            ...c,
            startSec: c.startSec + TITLE_SECONDS,
            endSec: c.endSec + TITLE_SECONDS,
          }))}
        />
      ) : null}

      <AbsoluteFill
        style={{
          opacity: endOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(12,10,8,0.28)",
          fontFamily:
            fontFamily,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 980 }}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 560,
              color: "#f5f5f7",
              lineHeight: 1.3,
            }}
          >
            Three independent looks.
            <br />
            A sandbox patch.
            <br />
            A human on the PR.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 18,
              color: "rgba(255,255,255,0.72)",
              letterSpacing: 0.4,
            }}
          >
            loop.heisenbug.in · never merge · never prod-deploy
          </div>
        </div>
      </AbsoluteFill>

      <Audio src={staticFile(voiceoverSrc)} />
    </AbsoluteFill>
  );
};

const activeZoom = (t: number): Zoom | null => {
  return [...ZOOMS].reverse().find((z) => t >= z.startSec && t < z.endSec) ?? null;
};

const zoomTransform = (t: number, zoom: Zoom | null): { scale: number; tx: number; ty: number } => {
  if (!zoom) {
    return { scale: 1, tx: 0, ty: 0 };
  }
  const fade = Math.min(0.45, Math.max(0.12, (zoom.endSec - zoom.startSec) / 4));
  const innerStart = zoom.startSec + fade;
  const innerEnd = zoom.endSec - fade;
  if (!(innerStart < innerEnd)) {
    return { scale: zoom.scale, tx: zoom.x, ty: zoom.y };
  }
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return {
    scale: interpolate(t, [zoom.startSec, innerStart, innerEnd, zoom.endSec], [1, zoom.scale, zoom.scale, 1], clamp),
    tx: interpolate(t, [zoom.startSec, innerStart, innerEnd, zoom.endSec], [0, zoom.x, zoom.x, 0], clamp),
    ty: interpolate(t, [zoom.startSec, innerStart, innerEnd, zoom.endSec], [0, zoom.y, zoom.y, 0], clamp),
  };
};
