import { createHmac, timingSafeEqual } from "node:crypto";
import { isCallId } from "@/lib/daily";

type CallLinkPayload = {
  room: string;
  exp: number;
};

export function signCallLink(room: string, exp: number) {
  const secret = process.env.CALL_LINK_SECRET;
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ room, exp })).toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyCallLink(token: string): CallLinkPayload | null {
  const secret = process.env.CALL_LINK_SECRET;
  if (!secret || !token || token.length > 2000) return null;

  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  const actualBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (
    actualBuf.length !== expectedBuf.length ||
    !timingSafeEqual(actualBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<CallLinkPayload>;
    if (!data.room || !isCallId(data.room) || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return { room: data.room, exp: data.exp };
  } catch {
    return null;
  }
}
