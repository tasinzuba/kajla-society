import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Send an email. If SMTP is not configured, logs to console and returns false.
 * Always non-fatal — never throws.
 */
export async function sendMail(opts: MailOptions): Promise<boolean> {
  const tx = getTransporter();
  if (!tx) {
    console.log(`[mailer] SMTP not configured — would send:`);
    console.log(`  To: ${opts.to}`);
    console.log(`  Subject: ${opts.subject}`);
    return false;
  }
  try {
    await tx.sendMail({
      from: env.SMTP_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return true;
  } catch (err) {
    console.error("[mailer] Send failed:", err);
    return false;
  }
}
