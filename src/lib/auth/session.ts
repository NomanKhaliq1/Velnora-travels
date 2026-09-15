import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { siteUrl } from "@/lib/site-url";
import { SESSION_COOKIE, SESSION_HOURS, signSessionToken, verifySessionToken } from "./token";

function scryptAsync(password: string, salt: Buffer, length: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, length, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

/** Hashes look like scrypt:<salt>:<hash>, both base64url. See scripts/hash-password.mjs. */
export async function verifyPassword(password: string, stored: string | undefined) {
  const [scheme, salt, hash] = (stored ?? "").split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createSession(email: string) {
  const token = await signSessionToken(email);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    // A Secure cookie would never be stored when the site runs on plain http (local `next start`).
    secure: siteUrl().startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const getAdminSession = cache(async () => {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
});

/** Call at the top of every admin page and admin Server Action. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}
