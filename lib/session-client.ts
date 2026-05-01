export const SESSION_STORAGE_KEY = "resume-bot.sessionId";

function fallbackUuid(): string {
  // RFC4122 v4-ish fallback for environments without crypto.randomUUID.
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

function newUuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof (crypto as Crypto).randomUUID === "function"
  ) {
    return (crypto as Crypto).randomUUID();
  }
  return fallbackUuid();
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // Defensive: this helper is client-only. Return a transient id rather
    // than throwing so SSR pre-hydration accidental imports don't crash.
    return newUuid();
  }
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && existing.length > 0) return existing;
    const fresh = newUuid();
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return newUuid();
  }
}
