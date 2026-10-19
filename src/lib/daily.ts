const DAILY_API = "https://api.daily.co/v1";

export const CALL_TTL_SECONDS = 60 * 60;

const CALL_ID_PATTERN =
  /^call-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isCallId(value: string) {
  return CALL_ID_PATTERN.test(value);
}

export function dailyHeaders() {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return null;
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export async function dailyFetch(path: string, init?: RequestInit) {
  const headers = dailyHeaders();
  if (!headers) {
    return {
      ok: false as const,
      status: 500,
      error: "Video calling is not configured",
    };
  }

  const response = await fetch(`${DAILY_API}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as {
    error?: string;
    info?: string;
    url?: string;
    token?: string;
    name?: string;
  } | null;

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: data?.info || data?.error || "Daily request failed",
    };
  }

  return { ok: true as const, data };
}

export async function createMeetingToken(
  roomName: string,
  isOwner: boolean,
  userName: string,
) {
  const expiresAt = Math.floor(Date.now() / 1000) + CALL_TTL_SECONDS;
  return dailyFetch("/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        exp: expiresAt,
        eject_at_token_exp: true,
        is_owner: isOwner,
        user_name: userName,
      },
    }),
  });
}

export function isTrustedRoomUrl(url: string) {
  const domain = process.env.DAILY_DOMAIN;
  if (!domain) return false;
  try {
    return new URL(url).host === domain;
  } catch {
    return false;
  }
}

export async function deleteCallRoom(roomName: string) {
  await dailyFetch(`/rooms/${encodeURIComponent(roomName)}`, {
    method: "DELETE",
  });
}
