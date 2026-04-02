import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const KNOWN_ROUTES = new Set([
  "",
  "she",
  "he",
  "share",
  "privacy",
  "terms",
]);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.slice(1); // remove leading /

  // Safety: strip raw API keys from URL
  if (segment.startsWith("sk-ant-")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Skip known routes, nested paths, static files, and Next.js generated routes
  if (segment.includes("/") || segment.includes(".") || segment.startsWith("opengraph-image") || segment.startsWith("twitter-image") || segment.startsWith("icon") || KNOWN_ROUTES.has(segment)) {
    return NextResponse.next();
  }

  // Treat unknown single-segment paths as encrypted key links
  if (segment.length > 10) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("ek", segment);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
