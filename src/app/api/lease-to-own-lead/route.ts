import { NextRequest, NextResponse } from "next/server";

type LeadBody = {
  full_name?: string;
  phone?: string;
  email?: string;
  company_name?: string;
  notes?: string;
};

function clean(value: unknown, maxLen: number): string {
  const s = typeof value === "string" ? value.trim() : "";
  return maxLen > 0 && s.length > maxLen ? s.slice(0, maxLen) : s;
}

/**
 * Server-only proxy: browser → this route → HIQ POST /api/public/leads.
 * HIQ_LEADS_API_KEY and HIQ_BASE_URL must never be NEXT_PUBLIC_*.
 */
export async function POST(request: NextRequest) {
  const hiqBaseUrl = String(process.env.HIQ_BASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
  const apiKey = String(process.env.HIQ_LEADS_API_KEY || "").trim();

  if (!hiqBaseUrl || !apiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Lease-to-own lead ingest is not configured.",
      },
      { status: 503 },
    );
  }

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const full_name = clean(body.full_name, 200);
  const phone = clean(body.phone, 80);
  const email = clean(body.email, 320).toLowerCase();
  const company_name = clean(body.company_name, 300);
  const notes = clean(body.notes, 4000);

  if (!full_name || !phone || !email) {
    return NextResponse.json(
      {
        success: false,
        message: "full_name, phone, and email are required.",
      },
      { status: 400 },
    );
  }

  const payload = {
    full_name,
    phone,
    email,
    company_name: company_name || null,
    notes: notes || null,
    source: "website_lease_to_own",
  };

  try {
    const hiqRes = await fetch(`${hiqBaseUrl}/api/public/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = (await hiqRes.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!hiqRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            (typeof data.message === "string" && data.message) ||
            (typeof data.error === "string" && data.error) ||
            "Could not submit your request. Please try again.",
        },
        { status: hiqRes.status >= 400 && hiqRes.status < 600 ? hiqRes.status : 502 },
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id ?? null,
      status: data.status ?? "new",
      created_at: data.created_at ?? null,
    });
  } catch (err) {
    console.error("[lease-to-own-lead] HIQ forward failed", err);
    return NextResponse.json(
      {
        success: false,
        message: "Could not submit your request. Please try again.",
      },
      { status: 502 },
    );
  }
}
