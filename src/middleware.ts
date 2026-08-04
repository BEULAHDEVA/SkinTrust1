export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/customers/:path*", "/agent/:path*"],
};
