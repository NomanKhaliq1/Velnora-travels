"use server";

import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { allowRequest, clearRequests } from "@/lib/auth/rate-limit";
import { clientIp, createSession, deleteSession, requireAdmin, verifyPassword } from "@/lib/auth/session";
import { authConfigured } from "@/lib/auth/token";
import {
  deleteCollectionItem,
  isCollectionKey,
  isImageInUse,
  isPageKey,
  isSingletonKey,
  savePageContent,
  saveCollectionItem,
  saveSingleton,
  type SaveResult,
} from "@/lib/content/mutations";
import { deleteSubmission, setSubmissionRead } from "@/lib/submissions";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import type { FormState } from "./form-state";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!authConfigured()) {
    return { status: "error", message: "Admin login isn't configured yet. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET." };
  }

  const key = `login:${await clientIp()}`;
  if (!allowRequest(key, 5, 15 * 60 * 1000)) {
    return { status: "error", message: "Too many attempts. Please wait 15 minutes and try again." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  // Always hash, even for a wrong email, so response time doesn't reveal which part was wrong.
  const passwordOk = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!passwordOk || email !== process.env.ADMIN_EMAIL?.trim().toLowerCase()) {
    return { status: "error", message: "That email and password don't match." };
  }

  clearRequests(key);
  await createSession(email);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

async function guarded(run: () => Promise<SaveResult>): Promise<SaveResult> {
  await requireAdmin();
  try {
    const result = await run();
    if (result.ok) revalidatePath("/", "layout");
    return result;
  } catch (error) {
    console.error("Admin save failed", error);
    return { ok: false, message: "Something went wrong while saving. Check the server logs.", issues: [] };
  }
}

const invalid = (message: string): SaveResult => ({ ok: false, message, issues: [] });

export async function saveCollectionItemAction(collection: string, originalSlug: string | null, item: unknown) {
  return guarded(async () => {
    if (!isCollectionKey(collection)) return invalid("Unknown collection.");
    if (originalSlug !== null && typeof originalSlug !== "string") return invalid("Invalid item.");
    return saveCollectionItem(collection, originalSlug, item);
  });
}

export async function deleteCollectionItemAction(collection: string, slug: string) {
  return guarded(async () => {
    if (!isCollectionKey(collection) || typeof slug !== "string") return invalid("Unknown item.");
    return deleteCollectionItem(collection, slug);
  });
}

export async function saveSingletonAction(key: string, value: unknown) {
  return guarded(async () => (isSingletonKey(key) ? saveSingleton(key, value) : invalid("Unknown settings section.")));
}

export async function savePageAction(key: string, value: unknown) {
  return guarded(async () => (isPageKey(key) ? savePageContent(key, value) : invalid("Unknown page.")));
}

export type UploadResult = { ok: true; url: string } | { ok: false; message: string };

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose an image to upload." };
  try {
    const url = await saveUpload(file);
    revalidatePath("/admin/media");
    return { ok: true, url };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Upload failed." };
  }
}

export async function deleteUploadAction(name: string) {
  return guarded(async () => {
    const safeName = path.basename(String(name));
    if (await isImageInUse(`/uploads/${safeName}`)) {
      return invalid("This image is still used on the site. Replace it wherever it appears, then delete it.");
    }
    await deleteUpload(safeName);
    return { ok: true, message: "Image deleted." };
  });
}

export async function setSubmissionReadAction(id: string, read: boolean) {
  await requireAdmin();
  await setSubmissionRead(String(id), Boolean(read));
  revalidatePath("/admin", "layout");
}

export async function deleteSubmissionAction(id: string) {
  await requireAdmin();
  await deleteSubmission(String(id));
  revalidatePath("/admin", "layout");
}
