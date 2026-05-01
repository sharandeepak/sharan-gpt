import "server-only";

import { createHash, createHmac } from "node:crypto";

export const ADMIN_COOKIE_NAME = "admin_session";

export function getAdminSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit && explicit.length > 0) return explicit;
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(password).digest("hex");
}

export function makeAdminToken(password: string, secret: string): string {
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function verifyAdminToken(
  token: string,
  password: string,
  secret: string
): boolean {
  if (!token || !password) return false;
  const expected = makeAdminToken(password, secret);
  if (expected.length !== token.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}
