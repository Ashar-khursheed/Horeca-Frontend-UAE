import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path") || "/";

  const expectedSecret = process.env.REVALIDATION_SECRET || "horecastore_reval_token_2026";

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    // Revalidate layout to clear navigation, custom scripts, footer and search recommendations
    revalidatePath(path, "layout");
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ message: "Error revalidating", error: err?.message }, { status: 500 });
  }
}
