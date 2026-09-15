import "server-only";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { STORAGE_DIR, readJsonOr, updateJson } from "@/lib/content/store";

export type SubmissionType = "inquiry" | "contact" | "newsletter";

export type Submission = {
  id: string;
  type: SubmissionType;
  createdAt: string;
  read: boolean;
  fields: Record<string, string>;
};

const FILE = path.join(STORAGE_DIR, "submissions.json");

export function listSubmissions() {
  return readJsonOr<Submission[]>(FILE, []);
}

export async function addSubmission(type: SubmissionType, fields: Record<string, string>) {
  let added = true;
  await updateJson<Submission[]>(FILE, [], (all) => {
    if (type === "newsletter" && all.some((s) => s.type === "newsletter" && s.fields.email === fields.email)) {
      added = false;
      return all;
    }
    const entry: Submission = { id: randomUUID(), type, createdAt: new Date().toISOString(), read: false, fields };
    return [entry, ...all];
  });
  return added;
}

export function setSubmissionRead(id: string, read: boolean) {
  return updateJson<Submission[]>(FILE, [], (all) => all.map((s) => (s.id === id ? { ...s, read } : s)));
}

export function deleteSubmission(id: string) {
  return updateJson<Submission[]>(FILE, [], (all) => all.filter((s) => s.id !== id));
}
