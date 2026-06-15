import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const appUrl = process.env.AUTH_URL ?? "http://localhost:3001";
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });
  } catch {
    // Invalid session ID — just send to login, don't expose error details
    return NextResponse.redirect(`${appUrl}/login`);
  }

  // Get storeId from Stripe metadata — never from URL params (prevents forgery)
  const storeId = session.metadata?.storeId;
  if (!storeId) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  const isComplete = session.payment_status === "paid"
    || session.status === "complete"
    || session.status === "open"; // open = trial started, no payment yet

  if (isComplete) {
    const sub = session.subscription as {
      id: string;
      status: string;
      current_period_end: number;
    } | null;

    const status = sub?.status === "trialing" ? "TRIALING" : "ACTIVE";

    await prisma.store.update({
      where: { id: storeId },
      data: {
        subscriptionStatus: status,
        stripeSubscriptionId: sub?.id ?? null,
        currentPeriodEnd: sub?.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null,
      },
    });
  }

  return NextResponse.redirect(`${appUrl}/login?registered=1`);
}
