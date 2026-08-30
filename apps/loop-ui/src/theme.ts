type LoopTheme = {
  preset: "chatgpt";
  mode: "light";
  brand: { mode: "icon-title"; name: string };
  tokens: Record<string, string>;
};

export const loopTheme: LoopTheme = {
  preset: "chatgpt",
  mode: "light",
  brand: { mode: "icon-title", name: "LOOP" },
  tokens: {
    primaryBg: "#f5f5f7",
    sidebarBg: "#ffffff",
    topbarBg: "#ffffff",
    secondaryBg: "#f5f5f7",
    cardBg: "#ffffff",
    textPrimary: "#1d1d1f",
    textSecondary: "#6e6e73",
    border: "#d2d2d7",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    primaryButtonBg: "#0071e3",
    primaryButtonHover: "#0077ed",
    primaryButtonText: "#ffffff",
    userMessageBg: "#0071e3",
    userMessageText: "#ffffff",
    assistantMessageBg: "transparent",
    assistantMessageText: "#1d1d1f",
    inputBoxBg: "#ffffff",
    inputBorder: "#d2d2d7",
    warningBg: "#fff4e5",
    warningText: "#9a6700",
    successBg: "#e4f8e6",
    successText: "#1b7f2a",
    focusRing: "#0071e3",
    radius: "12px",
    composerRadius: "16px",
  },
};
