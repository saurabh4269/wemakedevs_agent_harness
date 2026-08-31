import { AbsoluteFill, Img, staticFile } from "remotion";

type Props = {
  wallpaperSrc: string;
};

export const MacDesktop = ({ wallpaperSrc }: Props) => {
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(wallpaperSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(1.05) contrast(1.02)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,12,0.22) 0%, rgba(20,16,12,0.05) 18%, rgba(20,16,12,0.08) 82%, rgba(20,16,12,0.28) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          background: "rgba(28, 24, 20, 0.42)",
          backdropFilter: "blur(18px)",
          color: "rgba(255,255,255,0.92)",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, SF Pro Text, sans-serif",
          fontSize: 13,
          letterSpacing: 0.2,
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}></span>
          <span style={{ fontWeight: 600 }}>Safari</span>
          <span style={{ opacity: 0.85 }}>File</span>
          <span style={{ opacity: 0.85 }}>Edit</span>
          <span style={{ opacity: 0.85 }}>View</span>
        </div>
        <span style={{ opacity: 0.9 }}>loop.heisenbug.in</span>
      </div>
    </AbsoluteFill>
  );
};
