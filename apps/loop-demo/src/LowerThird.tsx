import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "./beats";

type Props = {
  captions: Caption[];
};

export const LowerThird = ({ captions }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const caption = captions.find((c) => t >= c.startSec && t < c.endSec);
  if (!caption) {
    return null;
  }
  const local = t - caption.startSec;
  const opacity = interpolate(local, [0, 0.35, caption.endSec - caption.startSec - 0.3, caption.endSec - caption.startSec], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 0.4], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 56,
          opacity,
          transform: `translateY(${y}px)`,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2.4,
            fontWeight: 600,
            color: "#0071e3",
            marginBottom: 6,
          }}
        >
          {caption.kicker}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 560,
            color: "#1d1d1f",
            background: "rgba(245,245,247,0.88)",
            backdropFilter: "blur(16px)",
            padding: "12px 18px",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            maxWidth: 920,
            lineHeight: 1.25,
          }}
        >
          {caption.line}
        </div>
      </div>
    </AbsoluteFill>
  );
};
