import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  try {
    const imageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!imageRes.ok) {
      return new NextResponse("Upstream fetch failed", { status: 502 });
    }

    const buffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Failed to proxy image", { status: 500 });
  }
}
