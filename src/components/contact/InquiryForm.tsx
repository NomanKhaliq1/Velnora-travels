"use client";

import { type FormEvent, startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitInquiry } from "@/lib/actions/forms";
import { initialFormState } from "@/lib/actions/form-state";
import { FieldError } from "@/components/ui/FieldError";

type Options = {
  referralOptions: string[];
  tripTypes: string[];
  budgets: string[];
  purposes: string[];
  accommodations: string[];
};

export type InquiryPrefill = { destination: string; dates: string; travelers: string; package: string };

const STEPS = [
  { label: "About You", fields: ["name", "email", "phone"] },
  { label: "Your Journey", fields: ["destination", "trip_type"] },
  { label: "Preferences", fields: ["message"] },
];

const input = "w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3.5 text-xs outline-none focus:border-velnora-gold-luxury transition bg-white";
const select = `${input} pr-10 appearance-none`;

function filledFields(form: HTMLFormElement) {
  const data = new FormData(form);
  return STEPS.flatMap((s) => s.fields).filter((name) => String(data.get(name) ?? "").trim() !== "");
}

function Icon({ name, top = false }: { name: string; top?: boolean }) {
  return <i className={`${name} absolute left-4 ${top ? "top-5" : "top-1/2 -translate-y-1/2"} text-slate-400 text-xs`} aria-hidden="true" />;
}

function Chevron() {
  return <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" aria-hidden="true" />;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="text-[10px] font-bold tracking-[2px] text-velnora-gold-soft uppercase">{children}</span>
      <span className="flex-1 h-[1px] bg-velnora-gold-luxury/20" />
    </div>
  );
}

export function InquiryForm({
  title,
  text,
  submitLabel,
  privacyNote,
  options,
  prefill,
}: {
  title: string;
  text: string;
  submitLabel: string;
  privacyNote: string;
  options: Options;
  prefill: InquiryPrefill;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const [filled, setFilled] = useState<string[]>(() => (prefill.destination ? ["destination"] : []));
  const errors = state.errors ?? {};

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  const stepDone = STEPS.map((s) => s.fields.every((f) => filled.includes(f)));
  const stepActive = STEPS.map((s, i) => i === 0 || s.fields.some((f) => filled.includes(f)) || stepDone.slice(0, i).every(Boolean));

  if (state.status === "success") {
    return (
      <div id="trip-inquiry" className="bg-white border border-slate-200/50 rounded-[32px] p-8 sm:p-12 shadow-md text-center scroll-mt-28">
        <div className="w-16 h-16 rounded-full bg-velnora-gold-luxury/10 text-velnora-gold-luxury flex items-center justify-center text-2xl mx-auto mb-6">
          <i className="fa-solid fa-check" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-velnora-navy-deep mb-3">Thank you</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto" role="status">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/50 rounded-[32px] p-8 sm:p-12 shadow-md">
      <div className="mb-10">
        <h2 className="font-serif text-2xl sm:text-3xl text-velnora-navy-deep font-normal leading-tight mb-2">{title}</h2>
        <p className="text-xs text-slate-400 font-light leading-relaxed">{text}</p>
      </div>

      <ol className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-xl text-[11px] font-medium text-slate-500" aria-label="Form progress">
        {STEPS.map((step, index) => (
          <li key={step.label} className="contents">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`hidden sm:block flex-1 h-[1px] border-t border-dashed mx-2 transition duration-300 ${stepDone[index - 1] ? "border-velnora-gold-luxury" : "border-slate-200"}`}
              />
            )}
            <span className={`flex items-center gap-3 transition duration-300 ${stepActive[index] ? "" : "opacity-60"}`}>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition duration-300 ${
                  stepActive[index] ? "bg-velnora-gold-luxury text-[#051124] shadow-sm" : "border border-slate-200 text-slate-400"
                }`}
              >
                {stepDone[index] ? <i className="fa-solid fa-check text-[9px]" /> : String(index + 1).padStart(2, "0")}
              </span>
              <span className={stepActive[index] ? "text-velnora-navy-deep font-semibold" : "text-slate-400"}>{step.label}</span>
            </span>
          </li>
        ))}
      </ol>

      <form
        id="trip-inquiry"
        ref={formRef}
        onSubmit={onSubmit}
        onInput={(event) => setFilled(filledFields(event.currentTarget))}
        onChange={(event) => setFilled(filledFields(event.currentTarget))}
        noValidate
        className="space-y-8 scroll-mt-28"
      >
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        {prefill.package && <input type="hidden" name="package" value={prefill.package} />}

        {prefill.package && (
          <p className="text-xs text-velnora-navy-deep bg-[#FDF9F3] border border-velnora-gold-luxury/20 rounded-xl px-4 py-3">
            <i className="fa-solid fa-gem text-velnora-gold-luxury mr-2" /> Inquiring about <strong>{prefill.package}</strong>
          </p>
        )}

        <div>
          <SectionLabel>ABOUT YOU</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="relative">
                <Icon name="fa-regular fa-user" />
                <input name="name" required autoComplete="name" aria-label="Full name" placeholder="Full Name*" className={input} />
              </div>
              <FieldError errors={errors.name} />
            </div>
            <div>
              <div className="relative">
                <Icon name="fa-regular fa-envelope" />
                <input name="email" type="email" required autoComplete="email" aria-label="Email address" placeholder="Email Address*" className={input} />
              </div>
              <FieldError errors={errors.email} />
            </div>
            <div>
              <div className="relative">
                <Icon name="fa-solid fa-phone" />
                <input name="phone" type="tel" required autoComplete="tel" aria-label="Phone number" placeholder="Phone Number*" className={input} />
              </div>
              <FieldError errors={errors.phone} />
            </div>
            <div className="relative">
              <Icon name="fa-regular fa-lightbulb" />
              <select name="referral" defaultValue="" aria-label="How did you hear about us?" className={select}>
                <option value="">How did you hear about us?</option>
                {options.referralOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>YOUR JOURNEY</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="relative">
                <Icon name="fa-solid fa-location-dot" />
                <input
                  name="destination"
                  required
                  defaultValue={prefill.destination}
                  aria-label="Destinations of interest"
                  placeholder="Destination(s) of Interest*"
                  className={input}
                />
              </div>
              <FieldError errors={errors.destination} />
            </div>
            <div>
              <div className="relative">
                <Icon name="fa-solid fa-compass" />
                <select name="trip_type" required defaultValue="" aria-label="Travel type" className={select}>
                  <option value="">Travel Type*</option>
                  {options.tripTypes.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <Chevron />
              </div>
              <FieldError errors={errors.trip_type} />
            </div>
            <div className="relative">
              <Icon name="fa-regular fa-calendar" />
              <input name="dates" defaultValue={prefill.dates} aria-label="Preferred travel dates" placeholder="Preferred Travel Dates" className={input} />
            </div>
            <div className="relative">
              <Icon name="fa-solid fa-users" />
              <input
                name="travelers"
                type="number"
                min={1}
                defaultValue={prefill.travelers}
                aria-label="Number of guests"
                placeholder="Number of Guests"
                className={input}
              />
            </div>
            <div className="relative">
              <Icon name="fa-solid fa-dollar-sign" />
              <select name="budget" defaultValue="" aria-label="Estimated budget" className={select}>
                <option value="">Estimated Budget Range</option>
                {options.budgets.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <Chevron />
            </div>
            <div className="relative">
              <Icon name="fa-solid fa-briefcase" />
              <select name="purpose" defaultValue="" aria-label="Purpose of travel" className={select}>
                <option value="">Purpose of Travel</option>
                {options.purposes.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>PREFERENCES</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <Icon name="fa-solid fa-bed" />
              <select name="accommodation" defaultValue="" aria-label="Accommodation preference" className={select}>
                <option value="">Accommodation Preference</option>
                {options.accommodations.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <Chevron />
            </div>
            <div className="relative">
              <Icon name="fa-solid fa-gift" />
              <input name="occasion" aria-label="Special occasion" placeholder="Special Occasion? (Optional)" className={input} />
            </div>
            <div className="sm:col-span-2">
              <div className="relative">
                <Icon name="fa-solid fa-pencil" top />
                <textarea
                  name="message"
                  required
                  rows={4}
                  aria-label="Anything else we should know?"
                  placeholder="Anything else we should know?*"
                  className={`${input} resize-none`}
                />
              </div>
              <FieldError errors={errors.message} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {state.status === "error" && (
            <p role="alert" className="text-sm text-red-600 text-center">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#051124] hover:bg-velnora-gold-luxury hover:text-[#051124] disabled:opacity-60 text-white py-4 rounded-xl text-xs font-bold tracking-[2px] uppercase transition flex items-center justify-center gap-2 shadow-md"
          >
            {pending ? "SENDING..." : submitLabel} <i className="fa-solid fa-paper-plane text-[9px]" />
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-light">
            <i className="fa-solid fa-lock text-[9px] text-slate-400" />
            <span>{privacyNote}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
