import twilio from "twilio";

export interface ProviderResult {
  success: boolean;
  error?: string;
  simulated?: boolean;
}

export async function sendSMS(to: string, body: string): Promise<ProviderResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  // Simulation mode — no credentials configured
  if (!sid || !token || !from) {
    console.log(`[SMS SIMULATION]\nTo: ${to}\n---\n${body}\n---`);
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, simulated: true };
  }

  try {
    const client = twilio(sid, token);
    await client.messages.create({ to, from, body });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Twilio error";
    console.error("[Twilio SMS error]", message);
    return { success: false, error: message };
  }
}
