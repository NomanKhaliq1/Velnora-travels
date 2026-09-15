"use client";

import { type FormEvent, startTransition, useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/lib/actions/forms";
import { initialFormState } from "@/lib/actions/form-state";
import { FieldError } from "@/components/ui/FieldError";

const inputClass =
  "w-full min-h-[56px] rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-velnora-charcoal placeholder-slate-400 outline-none focus:border-velnora-gold-luxury focus:ring-4 focus:ring-velnora-gold-luxury/5 transition";

export function ContactForm({ planningOptions, privacyNote }: { planningOptions: string[]; privacyNote: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  // Submitting through onSubmit (instead of the action prop) keeps typed values
  // in place when validation fails; React only auto-resets forms using `action`.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="relative block">
            <span className="sr-only">Your name</span>
            <i className="fa-regular fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="name" type="text" required autoComplete="name" placeholder="Your Name*" className={inputClass} />
          </label>
          <FieldError errors={state.errors?.name} />
        </div>
        <div>
          <label className="relative block">
            <span className="sr-only">Email address</span>
            <i className="fa-regular fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="email" type="email" required autoComplete="email" placeholder="Email Address*" className={inputClass} />
          </label>
          <FieldError errors={state.errors?.email} />
        </div>
      </div>
      <label className="relative block">
        <span className="sr-only">Phone number</span>
        <i className="fa-solid fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input name="phone" type="tel" autoComplete="tel" placeholder="Phone Number" className={inputClass} />
      </label>
      <label className="relative block">
        <span className="sr-only">What are you planning?</span>
        <i className="fa-solid fa-suitcase absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <select name="planning" defaultValue="" className={`${inputClass} pr-12 text-slate-500 appearance-none`}>
          <option value="">What are you planning? (Optional)</option>
          {planningOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
      </label>
      <div>
        <label className="relative block">
          <span className="sr-only">Message</span>
          <i className="fa-regular fa-pen-to-square absolute left-5 top-6 text-slate-400" />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell us about your trip or question..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-5 text-sm text-velnora-charcoal placeholder-slate-400 outline-none resize-none focus:border-velnora-gold-luxury focus:ring-4 focus:ring-velnora-gold-luxury/5 transition"
          />
        </label>
        <FieldError errors={state.errors?.message} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-[#051124] hover:bg-velnora-gold-luxury disabled:opacity-60 text-white hover:text-velnora-navy-deep font-bold rounded-full py-3.5 px-8 text-xs tracking-widest uppercase transition duration-300 inline-flex items-center gap-3 group shadow-md"
      >
        <i className="fa-regular fa-paper-plane text-velnora-gold-luxury group-hover:text-velnora-navy-deep" />
        {pending ? "SENDING..." : "SEND MESSAGE"}
      </button>
      {state.message && (
        <p role="status" className={`text-sm ${state.status === "success" ? "text-green-700" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
      <p className="text-xs text-slate-400 flex items-center gap-2 mt-4">
        <i className="fa-solid fa-lock text-velnora-gold-luxury" />
        {privacyNote}
      </p>
    </form>
  );
}
