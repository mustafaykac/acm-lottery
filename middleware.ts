import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    // Build the redirect from the actual forwarded request headers rather
    // than `request.url`/`request.nextUrl` - behind this app's nginx +
    // systemd setup (bound to a fixed HOSTNAME/PORT), those can resolve to
    // the internal "http://localhost:3060" address instead of the public
    // domain, sending browsers to a redirect they can't reach.
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
    const loginUrl = new URL(`${proto}://${host}/login`);
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
