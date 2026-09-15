import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

// Optimistic redirect only. Every admin page and action re-checks the session itself.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onLoginPage = pathname === "/admin/login";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !onLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (session && onLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
