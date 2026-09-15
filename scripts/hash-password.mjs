import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 10) {
  console.error('Usage: npm run admin:hash -- "a password of at least 10 characters"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log("Put this line in .env.local (or your host's environment settings):\n");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`);
