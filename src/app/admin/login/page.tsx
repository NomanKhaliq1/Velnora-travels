import type { Metadata } from "next";
import Image from "next/image";
import { authConfigured } from "@/lib/auth/token";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  const configured = authConfigured();

  return (
    <main className="min-h-screen bg-velnora-navy-deep flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/images/logo-white.png" alt="Velnora Travel" width={1313} height={352} sizes="180px" className="h-12 w-auto" />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="font-serif text-2xl text-velnora-navy-deep mb-1">Admin sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Manage the site&apos;s content and inquiries.</p>
          {configured ? (
            <LoginForm />
          ) : (
            <p className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              Login isn&apos;t configured. Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD_HASH</code> and <code>SESSION_SECRET</code> in{" "}
              <code>.env.local</code>, then restart the server. See <code>.env.example</code>.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
