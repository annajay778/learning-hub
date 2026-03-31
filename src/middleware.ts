import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Truly public routes only
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // API routes secured by API key (not session) — learnings POST + week-plan POST
  // GET endpoints are read-only and low-risk, allow them
  if (
    (pathname.startsWith("/api/learnings") || pathname.startsWith("/api/week-plan")) &&
    req.method === "GET"
  ) {
    return NextResponse.next();
  }

  // Everything else requires a session cookie
  const sessionCookie =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    // API routes return 401 instead of redirecting to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
