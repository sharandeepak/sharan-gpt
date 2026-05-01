export const MAX_INPUT_LENGTH = 1500;

const INJECTION_MARKERS: RegExp[] = [
  /<\s*\/?\s*system\s*>/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  /###\s*Instruction\s*:/gi,
  /\[\s*\/?\s*INST\s*\]/gi,
];

const ROLE_PREFIX = /^\s*(?:system|assistant)\s*:\s*/gim;
const IGNORE_PREVIOUS_LINE = /^[ \t]*ignore\s+previous\s+instructions.*$/gim;

export function stripPromptInjection(text: string): string {
  let out = text;

  for (const marker of INJECTION_MARKERS) {
    out = out.replace(marker, "");
  }

  // Remove "ignore previous instructions" style lines.
  out = out.replace(IGNORE_PREVIOUS_LINE, "");

  // Strip role-spoofing prefixes at the start of lines.
  out = out.replace(ROLE_PREFIX, "");

  // Collapse repeated blank lines that may result.
  out = out.replace(/\n{3,}/g, "\n\n").trim();

  return out;
}

export function sanitizeUserInput(
  raw: string
):
  | { ok: true; value: string }
  | { ok: false; reason: string } {
  if (typeof raw !== "string") {
    return { ok: false, reason: "Input must be a string." };
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: false, reason: "Message cannot be empty." };
  }

  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      ok: false,
      reason: `Message exceeds ${MAX_INPUT_LENGTH} characters.`,
    };
  }

  const cleaned = stripPromptInjection(trimmed);
  if (cleaned.length === 0) {
    return { ok: false, reason: "Message contained no usable content." };
  }

  return { ok: true, value: cleaned };
}
