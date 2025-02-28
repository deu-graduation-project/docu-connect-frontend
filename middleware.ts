import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authService from "@/services/auth";
import { getCookie } from "@/services/cookies";

export async function middleware(request: NextRequest) {
  // Get the access token using your cookie service
  const accessToken = getCookie("accessToken");

  // If no token exists, redirect to sign-in
  if (!accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Run identity check using your auth service
  await authService.identityCheck();

  // Check if user is authenticated after identity check
  if (
    !authService.isAuthenticated ||
    !authService.isAdmin ||
    !authService.isAgency
  ) {
    // Token is invalid or expired, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // User is authenticated, continue
  return NextResponse.next();
}

// Optional: Configure paths that should use this middleware
export const config = {
  matcher: ["/api/:path*", "/dashboard/*", "/dashboard/agency-requests"],
};
