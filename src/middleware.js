import { NextResponse } from "next/server";

export function middleware(request) {
  const currentUserCookie = request.cookies.get("currentUser");
  const pathname = request.nextUrl.pathname;

  // If user is not logged in
  if (!currentUserCookie) {
    if (pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("sessionExpired", "true"); // <-- flag for toast
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If user is logged in and trying to access /login
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
