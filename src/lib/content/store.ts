import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const STORAGE_DIR = path.join(process.cwd(), "storage");

export async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf8")) as T;
}

export async function readJsonOr<T>(file: string, fallback: T): Promise<T> {
  try {
    return await readJson<T>(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function replaceFile(file: string, contents: string) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, contents, "utf8");
  try {
    await fs.rename(tmp, file);
  } catch (error) {
    // Windows refuses to rename over a file another process has open (editors, dev watchers).
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EPERM" && code !== "EBUSY") throw error;
    await fs.copyFile(tmp, file);
    await fs.unlink(tmp);
  }
}

// Writes are serialized so two saves can't interleave and corrupt a file.
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

export function writeJson(file: string, data: unknown): Promise<void> {
  return enqueue(() => replaceFile(file, JSON.stringify(data, null, 2) + "\n"));
}

/** Read-modify-write inside the queue, so concurrent updates don't drop each other's changes. */
export function updateJson<T>(file: string, fallback: T, update: (current: T) => T | Promise<T>): Promise<T> {
  return enqueue(async () => {
    const next = await update(await readJsonOr(file, fallback));
    await replaceFile(file, JSON.stringify(next, null, 2) + "\n");
    return next;
  });
}
