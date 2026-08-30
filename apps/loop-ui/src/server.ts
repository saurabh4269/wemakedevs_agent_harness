export const DEFAULT_TRUEFORGE_URL = "http://localhost:8790";
export const HOSTED_TRUEFORGE_URL = "https://loop.thexplorers.xyz";

export function resolveTrueForgeBaseUrl(): string {
  const configured = import.meta.env.VITE_TRUEFORGE_URL;
  if (configured !== undefined && configured.length > 0) {
    return configured.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "/";
  }
  return HOSTED_TRUEFORGE_URL;
}

export function trueForgeServer(): {
  type: "trueforge";
  baseUrl: string;
  token?: string;
} {
  const token = import.meta.env.VITE_TRUEFORGE_TOKEN;
  return {
    type: "trueforge",
    baseUrl: resolveTrueForgeBaseUrl(),
    ...(token ? { token } : {}),
  };
}
