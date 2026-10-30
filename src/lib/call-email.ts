import nodemailer from "nodemailer";
import { serverEnv } from "@/lib/server-env";

export const SALES_CALL_EMAIL = "smdxb@horecastore.ae";
export const SALES_CALL_CC = ["imran@horecastore.ae"];
export const SALES_CALL_BCC = [
  "webdeveloper01@horecastore.ae",
  "webdeveloper08@horecastore.ae",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function callEmailHtml(input: {
  customerName: string;
  requestedAt: string;
  joinUrl: string;
}) {
  const name = escapeHtml(input.customerName);
  const when = escapeHtml(input.requestedAt);
  const href = escapeHtml(input.joinUrl);

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f6f5;font-family:Arial,Helvetica,sans-serif;color:#121212;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#186737;padding:24px 28px;">
                <p style="margin:0;font-size:13px;letter-spacing:0.04em;color:#d9f5e6;">HorecaStore</p>
                <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;">Incoming customer video call</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">A customer is waiting to speak with sales.</p>
                <p style="margin:0 0 8px;font-size:14px;line-height:1.5;"><strong>Customer:</strong> ${name}</p>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.5;"><strong>Requested:</strong> ${when} (Dubai time)</p>
                <a href="${href}" style="display:inline-block;background:#186737;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 22px;border-radius:8px;">Join Video Call</a>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#4b5563;">This link is temporary and confidential. It expires in one hour. Do not forward it.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendCallEmail(input: {
  customerName: string;
  requestedAt: string;
  joinUrl: string;
}) {
  const user = serverEnv("SMTP_USER");
  const pass = serverEnv("SMTP_PASSWORD");
  if (!user || !pass) {
    return { ok: false as const, reason: "missing_config" as const };
  }

  const port = Number(serverEnv("SMTP_PORT") || 587);
  const transporter = nodemailer.createTransport({
    host: serverEnv("SMTP_HOST") || "smtp.office365.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `HorecaStore <${user}>`,
      to: SALES_CALL_EMAIL,
      cc: SALES_CALL_CC,
      bcc: SALES_CALL_BCC,
      subject: "Incoming Customer Video Call – HorecaStore",
      html: callEmailHtml(input),
    });
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const authFailed =
      /535|534|Invalid login|Authentication unsuccessful/i.test(message);
    return {
      ok: false as const,
      reason: authFailed ? ("auth_failed" as const) : ("send_failed" as const),
    };
  }
}
