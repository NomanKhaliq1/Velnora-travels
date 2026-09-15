import { SignJWT, jwtVerify } from "jose";

// Kept free of next/headers and server-only so proxy.ts can import it too.

export const SESSION_COOKIE = "velnora_admin";
export const SESSION_HOURS = 8;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  return secret && secret.length >= 32 ? new TextEncoder().encode(secret) : null;
}

export function authConfigured() {
  return Boolean(secretKey() && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH);
}

export async function signSessionToken(email: string) {
  const key = secretKey();
  if (!key) throw new Error("SESSION_SECRET is missing or shorter than 32 characters");
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(key);
}

export async function verifySessionToken(token: string | undefined) {
  const key = secretKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}
