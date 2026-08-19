import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Everything requires a session EXCEPT: the login page itself, its API
// routes, and static assets (Next internals + the public logo, which must
// stay reachable so it renders on the login page too).
export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico|logo.png).*)"],
};
