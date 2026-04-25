import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that should skip i18n middleware entirely
  const skipPrefixes = ["/api", "/auth", "/_next", "/_vercel"];
  if (skipPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Static files
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // Locale-prefixed paths (e.g., /hi/, /ta/) go through next-intl
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  // Root and all other paths: serve normally without locale rewriting
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};