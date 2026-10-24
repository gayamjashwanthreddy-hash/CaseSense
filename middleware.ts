import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protected Official Administration Routes
  const isProtectedAdminRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/cases") ||
    pathname.startsWith("/institutions") ||
    pathname.startsWith("/overlap-review") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/admin") ||
    pathname === "/intake";

  if (isProtectedAdminRoute) {
    const authSession = request.cookies.get("casebridge_auth_session");
    if (!authSession || !authSession.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protected Institution Portal Routes
  const isProtectedInstitutionRoute =
    pathname.startsWith("/institution") && pathname !== "/institution/login";

  if (isProtectedInstitutionRoute) {
    const instSession = request.cookies.get("casebridge_inst_session") || request.cookies.get("casebridge_auth_session");
    if (!instSession || !instSession.value) {
      const instLoginUrl = new URL("/institution/login", request.url);
      instLoginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(instLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cases/:path*",
    "/institutions/:path*",
    "/overlap-review/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/intake",
    "/institution/:path*",
  ],
};
