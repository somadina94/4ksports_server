import path from "path";
import { fileURLToPath } from "url";
import pug from "pug";
import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** `src/views/email` in dev; `dist/views/email` after `build` copies `src/views` → `dist/views`. */
const emailTemplatesDir = path.join(__dirname, "..", "views", "email");

const companyName = () => process.env.COMPANY_NAME?.trim() || "4K Sportsbook";

export type AdminEmailTemplate =
  | "newUser"
  | "newDepositRequest"
  | "newWithdrawalRequest";

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.EMAIL_TO?.trim() &&
      process.env.EMAIL_FROM?.trim() &&
      process.env.EMAIL_HOST?.trim() &&
      process.env.EMAIL_ADDRESS?.trim() &&
      process.env.EMAIL_PASSWORD,
  );
}

export async function sendAdminEmail(
  template: AdminEmailTemplate,
  subject: string,
  locals: Record<string, unknown> = {},
): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn("[email] Admin notification skipped: email env not fully configured.");
    return;
  }

  const html = pug.renderFile(path.join(emailTemplatesDir, `${template}.pug`),
    {
      subject,
      companyName: companyName(),
      ...locals,
    },
  );

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT ?? 587),
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const from = `${companyName()} <${process.env.EMAIL_FROM}>`;

  await transport.sendMail({
    from,
    to: process.env.EMAIL_TO,
    subject,
    html,
    text: htmlToText(html),
  });
}

/** Fire-and-forget admin alert; never throws to callers. */
export function notifyAdminSafe(
  template: AdminEmailTemplate,
  subject: string,
  locals: Record<string, unknown> = {},
): void {
  void sendAdminEmail(template, subject, locals).catch((err) => {
    console.error("[email] Failed to send admin notification:", err);
  });
}
