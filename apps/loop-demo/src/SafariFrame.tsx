import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  url?: string;
};

/** Screen Studio floating window: traffic lights, rounded chrome, drop shadow. */
export const SafariFrame = ({
  children,
  url = "https://loop.heisenbug.in",
}: Props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 16,
        overflow: "hidden",
        background: "#f5f5f7",
        boxShadow:
          "0 40px 90px rgba(0,0,0,0.38), 0 8px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.18)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 46,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(236,236,239,0.96) 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          <span style={dot("#ff5f57")} />
          <span style={dot("#febc2e")} />
          <span style={dot("#28c840")} />
        </div>
        <div
          style={{
            flex: 1,
            height: 26,
            borderRadius: 8,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, SF Pro Text, sans-serif",
            fontSize: 12.5,
            color: "#6e6e73",
            letterSpacing: 0.1,
          }}
        >
          {url}
        </div>
        <div style={{ width: 52 }} />
      </div>
      <div style={{ flex: 1, overflow: "hidden", background: "#fff" }}>
        {children}
      </div>
    </div>
  );
};

const dot = (background: string): CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: 99,
  background,
  boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
});
