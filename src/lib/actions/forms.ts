"use server";

import { z } from "zod";
import { allowRequest } from "@/lib/auth/rate-limit";
import { clientIp } from "@/lib/auth/session";
import { addSubmission, type SubmissionType } from "@/lib/submissions";
import type { FormState } from "./form-state";

const field = (max = 200) => z.string().trim().max(max, "That's longer than we can accept");
const optional = (max = 200) => field(max).optional().default("");

const inquirySchema = z.object({
  name: field().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: field(40).min(6, "Please enter a phone number we can reach you on"),
  referral: optional(),
  destination: field().min(2, "Tell us where you'd like to go"),
  trip_type: field().min(1, "Choose a travel type"),
  dates: optional(),
  travelers: optional(20),
  budget: optional(),
  purpose: optional(),
  accommodation: optional(),
  occasion: optional(),
  package: optional(),
  message: field(4000).min(10, "Tell us a little more about your trip (at least 10 characters)"),
});

const contactSchema = z.object({
  name: field().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: optional(40),
  planning: optional(),
  message: field(4000).min(10, "Please write at least 10 characters"),
});

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

function formFields(formData: FormData) {
  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) fields[key] = value;
  }
  return fields;
}

function withoutEmpty(data: Record<string, string>) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== ""));
}

async function handle<S extends z.ZodType<Record<string, string>>>(
  type: SubmissionType,
  schema: S,
  formData: FormData,
  successMessage: string,
): Promise<FormState> {
  const fields = formFields(formData);

  // Hidden honeypot field: people never see it, bots tend to fill it in.
  if (fields.company) return { status: "success", message: successMessage };

  if (!allowRequest(`${type}:${await clientIp()}`, 5, 10 * 60 * 1000)) {
    return { status: "error", message: "Too many submissions from your connection. Please try again in a few minutes." };
  }

  const parsed = schema.safeParse(fields);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>,
    };
  }

  try {
    await addSubmission(type, withoutEmpty(parsed.data));
  } catch (error) {
    console.error(`Could not save ${type} submission`, error);
    return { status: "error", message: "Something went wrong on our side. Please try again, or email us directly." };
  }

  return { status: "success", message: successMessage };
}

export async function submitInquiry(_prev: FormState, formData: FormData) {
  return handle("inquiry", inquirySchema, formData, "Thank you. Your inquiry has been received and an advisor will be in touch soon.");
}

export async function submitContact(_prev: FormState, formData: FormData) {
  return handle("contact", contactSchema, formData, "Thank you. Your message has been received.");
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData) {
  return handle("newsletter", newsletterSchema, formData, "You're on the list. Thanks for subscribing.");
}
