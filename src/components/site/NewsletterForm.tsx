"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/lib/actions/forms";
import { initialFormState } from "@/lib/actions/form-state";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialFormState);

  return (
    <div className="w-full lg:w-auto max-w-md z-10">
      <form
        action={action}
        className="newsletter-form bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-1.5 flex items-center gap-2"
      >
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <input
          type="email"
          name="email"
          required
          aria-label="Email address"
          placeholder="Enter your email address"
          className="flex-1 min-w-0 bg-transparent px-4 py-3 text-xs text-white placeholder-white/50 outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-velnora-gold-luxury hover:bg-white disabled:opacity-60 text-[#051124] px-6 py-3.5 rounded-xl text-xs font-bold tracking-[1.5px] uppercase transition flex items-center gap-2 whitespace-nowrap shadow-md"
        >
          {pending ? "Sending" : "Subscribe"} <i className="fa-solid fa-arrow-right text-[10px]" />
        </button>
      </form>
      {state.message && (
        <p
          role="status"
          className={`mt-3 text-xs text-center lg:text-left ${state.status === "success" ? "text-velnora-gold-soft" : "text-red-300"}`}
        >
          {state.errors?.email?.[0] ?? state.message}
        </p>
      )}
    </div>
  );
}
