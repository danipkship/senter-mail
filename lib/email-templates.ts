const LOGO_URL = "https://senter-mail-8r6i.vercel.app/2.png";

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4361EE 0%,#6366f1 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <img src="${LOGO_URL}" width="52" height="52" alt="SENTER MAIL"
                style="display:block;margin:0 auto 14px;border-radius:12px;" />
              <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;line-height:1;">
                SENTER MAIL
              </div>
              <div style="color:#c7d2fe;font-size:13px;margin-top:4px;font-weight:500;">
                Mailbox CRM
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
              <div style="color:#64748b;font-size:13px;font-weight:700;margin-bottom:6px;">
                Go Pack &amp; Ship
              </div>
              <div style="color:#94a3b8;font-size:12px;line-height:1.7;">
                Powered by SENTER MAIL &nbsp;·&nbsp; Mailbox CRM<br />
                If you did not request this email, you can safely ignore it.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function verificationEmailHtml(storeName: string, link: string): string {
  return baseTemplate(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0D1B4B;line-height:1.2;">
      Verify your email
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
      Hi <strong style="color:#1e293b;">${storeName}</strong>, welcome to SENTER MAIL!<br />
      Click the button below to verify your email address and activate your account.
    </p>

    <div style="text-align:center;margin:36px 0;">
      <a href="${link}"
        style="display:inline-block;background:linear-gradient(135deg,#4361EE,#6366f1);color:#ffffff;font-weight:700;font-size:15px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(67,97,238,0.35);">
        Verify Email Address →
      </a>
    </div>

    <p style="margin:24px 0 8px;font-size:13px;color:#94a3b8;text-align:center;">
      This link expires in <strong>24 hours</strong>.
    </p>
    <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;word-break:break-all;">
      ${link}
    </p>
  `);
}

export function passwordResetEmailHtml(resetUrl: string): string {
  return baseTemplate(`
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#0D1B4B;line-height:1.2;">
      Reset your password
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
      We received a request to reset your SENTER MAIL password.<br />
      Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
    </p>

    <div style="text-align:center;margin:36px 0;">
      <a href="${resetUrl}"
        style="display:inline-block;background:linear-gradient(135deg,#4361EE,#6366f1);color:#ffffff;font-weight:700;font-size:15px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(67,97,238,0.35);">
        Reset Password →
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
      If you did not request a password reset, no action is needed — your account is safe.
    </p>
    <p style="margin:12px 0 0;font-size:12px;color:#cbd5e1;text-align:center;word-break:break-all;">
      ${resetUrl}
    </p>
  `);
}
