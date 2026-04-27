import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedApi = createRouteMatcher(["/api/analyze(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedApi(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files
    "/((?!_next|.*\\..*).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
