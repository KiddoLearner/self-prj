import { server } from "./lib/auth/server";

export const proxy = server.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  // matcher: [
  //   "/((?!$|_next/static|_next/image|favicon.ico|auth/sign-in|api/auth|api/uploadthing).*)",
  // ],
 matcher: [
    '/projects/create/',
    '/edit/:path*',
  ],
};