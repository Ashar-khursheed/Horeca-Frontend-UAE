import { NextResponse } from "next/server";
import { verifyCallLink } from "@/lib/call-link";
import { createMeetingToken, dailyFetch, isTrustedRoomUrl } from "@/lib/daily";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(`join:${clientIp(request)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many join attempts. Please wait and try again." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    link?: unknown;
  } | null;
  const link = typeof body?.link === "string" ? body.link : "";
  const call = verifyCallLink(link);

  if (!call) {
    return NextResponse.json(
      { error: "This join link is invalid or has expired" },
      { status: 401 },
    );
  }

  const room = await dailyFetch(`/rooms/${encodeURIComponent(call.room)}`);
  if (!room.ok || !room.data?.url || !isTrustedRoomUrl(room.data.url)) {
    const missing = !room.ok && room.status === 404;
    return NextResponse.json(
      {
        error: missing
          ? "This call has ended or does not exist"
          : "Could not join this call",
      },
      { status: missing ? 404 : 502 },
    );
  }

  const token = await createMeetingToken(call.room, true, "HorecaStore Sales");
  if (!token.ok || !token.data?.token) {
    return NextResponse.json(
      { error: "Could not join this call" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    roomUrl: room.data.url,
    token: token.data.token,
  });
}
