import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { sendCallEmail } from "@/lib/call-email";
import { signCallLink } from "@/lib/call-link";
import {
  CALL_TTL_SECONDS,
  createMeetingToken,
  dailyFetch,
  deleteCallRoom,
  isTrustedRoomUrl,
} from "@/lib/daily";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { SITE_URL } from "@/utils/site-url";

function sanitizeName(value: unknown) {
  if (typeof value !== "string") return "Website visitor";
  const clean = value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return clean || "Website visitor";
}

const TESTING_ORIGIN = "https://uae-development.dp3yfb9o8vob3.amplifyapp.com";

function joinOrigin(request: Request) {
  const configured = process.env.CALL_JOIN_ORIGIN?.replace(/\/$/, "");
  if (configured) return configured;

  const raw =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const host = raw.split(",")[0]?.trim().replace(/:\d+$/, "") ?? "";
  if (
    host === "uae-development.dp3yfb9o8vob3.amplifyapp.com" ||
    host === "localhost" ||
    host === "127.0.0.1"
  ) {
    return TESTING_ORIGIN;
  }
  return SITE_URL;
}

export async function POST(request: Request) {
  if (!rateLimit(`create:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      {
        error:
          "Too many call requests. Please wait a few minutes and try again.",
      },
      { status: 429 },
    );
  }

  if (
    !process.env.DAILY_API_KEY ||
    !process.env.DAILY_DOMAIN ||
    !process.env.CALL_LINK_SECRET
  ) {
    return NextResponse.json(
      { error: "Video calling is not configured" },
      { status: 500 },
    );
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return NextResponse.json(
      {
        error: "Outlook email is not configured, so the call was not started. Please check the SMTP_USER and SMTP_PASSWORD environment variables.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    customerName?: unknown;
  } | null;
  const customerName = sanitizeName(body?.customerName);
  const roomName = `call-${randomUUID()}`;
  const expiresAt = Math.floor(Date.now() / 1000) + CALL_TTL_SECONDS;

  const room = await dailyFetch("/rooms", {
    method: "POST",
    body: JSON.stringify({
      name: roomName,
      privacy: "private",
      properties: {
        exp: expiresAt,
        max_participants: 2,
        enable_chat: false,
        enable_screenshare: false,
        enable_knocking: false,
        eject_at_room_exp: true,
      },
    }),
  });

  if (!room.ok || !room.data?.url || !isTrustedRoomUrl(room.data.url)) {
    await deleteCallRoom(roomName);
    return NextResponse.json(
      { error: "Could not create the video room" },
      { status: 502 },
    );
  }

  const signed = signCallLink(roomName, expiresAt);
  const customerToken = await createMeetingToken(roomName, false, customerName);

  if (!signed || !customerToken.ok || !customerToken.data?.token) {
    await deleteCallRoom(roomName);
    return NextResponse.json(
      { error: "Could not prepare the video call" },
      { status: 502 },
    );
  }

  const requestedAt = new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(new Date());

  const email = await sendCallEmail({
    customerName,
    requestedAt,
    joinUrl: `${joinOrigin(request)}/sales/join?token=${encodeURIComponent(signed)}`,
  });

  if (!email.ok) {
    await deleteCallRoom(roomName);
    const error =
      email.reason === "auth_failed"
        ? "Outlook rejected the mailbox login, so the sales team was not emailed. The call was not started."
        : "The sales team could not be emailed. The call was not started.";
    return NextResponse.json({ error }, { status: 502 });
  }

  return NextResponse.json({
    roomUrl: room.data.url,
    token: customerToken.data.token,
    notified: true,
  });
}
