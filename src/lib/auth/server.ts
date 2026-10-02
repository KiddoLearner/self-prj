import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl) {
  throw new Error("Missing NEON_AUTH_BASE_URL");
}

if (!cookieSecret) {
  throw new Error("Missing NEON_AUTH_COOKIE_SECRET");
}

if (cookieSecret.length < 32) {
  throw new Error("NEON_AUTH_COOKIE_SECRET must be at least 32 characters");
}

export const server = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
  },
});