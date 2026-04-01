import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.slice(1); // remove leading /

  if (segment.startsWith("sk-ant-")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("key", segment);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
