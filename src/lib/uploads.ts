import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { STORAGE_DIR } from "@/lib/content/store";

export const UPLOAD_DIR = path.join(STORAGE_DIR, "uploads");
export const UPLOAD_URL_PREFIX = "/uploads/";
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const IMAGE_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

// Checks the file's first bytes so a renamed non-image can't be uploaded.
function looksLikeImage(bytes: Uint8Array) {
  const hex = Buffer.from(bytes.slice(0, 12)).toString("hex");
  const ascii = Buffer.from(bytes.slice(0, 12)).toString("latin1");
  return (
    hex.startsWith("ffd8ff") ||
    hex.startsWith("89504e47") ||
    ascii.startsWith("GIF8") ||
    (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") ||
    ascii.slice(4, 12).startsWith("ftypavi")
  );
}

export async function saveUpload(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (!IMAGE_TYPES[ext]) throw new Error("Only JPG, PNG, WebP, AVIF or GIF images can be uploaded.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Images must be 8 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeImage(bytes)) throw new Error("That file doesn't look like a valid image.");

  const base = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "image";
  const name = `${base}-${Date.now().toString(36)}${randomBytes(3).toString("hex")}${ext}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return `${UPLOAD_URL_PREFIX}${name}`;
}

export async function listUploads() {
  try {
    const names = await fs.readdir(UPLOAD_DIR);
    const entries = await Promise.all(
      names
        .filter((n) => IMAGE_TYPES[path.extname(n).toLowerCase()])
        .map(async (n) => ({ name: n, url: `${UPLOAD_URL_PREFIX}${n}`, stat: await fs.stat(path.join(UPLOAD_DIR, n)) })),
    );
    return entries
      .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)
      .map((e) => ({ name: e.name, url: e.url, size: e.stat.size, uploadedAt: e.stat.mtime.toISOString() }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function deleteUpload(name: string) {
  const file = path.join(UPLOAD_DIR, path.basename(name));
  await fs.unlink(file);
}
