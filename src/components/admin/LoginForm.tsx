"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/actions/form-state";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-velnora-gold-luxury focus:ring-2 focus:ring-velnora-gold-luxury/20";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialFormState);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="block text-xs font-semibold text-slate-600 mb-1.5">Email</span>
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </label>
      <label className="block">
        <span className="block text-xs font-semibold text-slate-600 mb-1.5">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-velnora-navy-deep py-2.5 text-sm font-semibold text-white hover:bg-velnora-gold-luxury disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
