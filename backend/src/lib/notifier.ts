import { env } from "../config.js";

type AdminNotificationPayload = {
  notificationId: string;
  productTitle: string;
  productSlug: string;
  customerEmail: string;
};

// Fire-and-forget admin ping when a new Notify Me signup lands.
//
// Intentionally stubbed: this logs the payload instead of calling an email
// provider. The env-var guard, non-blocking shape, and error isolation are all
// wired so swapping in Resend / SES / SMTP later is a one-file change — only
// the body of this function has to do real work. Callers must never await this
// before sending the customer-facing response; they should invoke it as
// `void sendAdminNotification(...).catch(() => {})`.
export async function sendAdminNotification(payload: AdminNotificationPayload): Promise<void> {
  const recipients = env.ADMIN_NOTIFICATION_EMAIL?.trim();

  if (!recipients) {
    // Feature is opt-in. Silent skip keeps local dev and fresh prod deploys
    // from spamming error logs until the env var is populated.
    return;
  }

  // Real providers plug in here. Keep the single-attempt + timeout contract
  // intact when you wire one up (no retry loops, no polling):
  //
  //   const controller = new AbortController();
  //   const timeout = setTimeout(() => controller.abort(), 8_000);
  //   try {
  //     await fetch(providerUrl, { signal: controller.signal, ... });
  //   } finally {
  //     clearTimeout(timeout);
  //   }
  console.log("[notifier] admin-ping stub", {
    to: recipients,
    subject: `New Notify Me signup — ${payload.productTitle}`,
    notificationId: payload.notificationId,
    product: payload.productSlug,
    customerEmail: payload.customerEmail,
  });
}
