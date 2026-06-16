import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe, PLANS, PlanKey } from "@/lib/stripe";
import { createAndSendVerificationEmail } from "@/lib/email-verification";
import { getAppUrl } from "@/lib/app-url";

const registerSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters").max(100).trim(),
  email:     z.string().email("Invalid email address").max(255).toLowerCase(),
  password:  z.string().min(8, "Password must be at least 8 characters").max(128),
  plan:      z.enum(["starter", "pro", "business"]),
  billing:   z.enum(["monthly", "annual"]).default("monthly"),
});

export async function POST(req: NextRequest) {
  // Reject oversized payloads (max 10KB)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10_000) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { storeName, email, password, plan, billing } = parsed.data;
  const planKey = plan.toUpperCase() as PlanKey;
  const selectedPlan = PLANS[planKey];
  const isAnnual = billing === "annual";
  const priceId = isAnnual ? selectedPlan.annualPriceId : selectedPlan.monthlyPriceId;

  if (!priceId) {
    return NextResponse.json({ error: "Selected billing period is not available." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const stripeCustomer = await stripe.customers.create({
    email,
    name: storeName,
    metadata: { plan: planKey, billing },
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  const store = await prisma.store.create({
    data: {
      name: storeName,
      email,
      plan: planKey,
      subscriptionStatus: "UNPAID",
      stripeCustomerId: stripeCustomer.id,
      settings: { create: { senderName: storeName, senderEmail: email } },
      users: {
        create: { email, name: storeName, password: hashedPassword, role: "OWNER" },
      },
    },
    include: { users: { select: { id: true } } },
  });

  const appUrl = getAppUrl();
  const trialDays = selectedPlan.trial > 0 ? selectedPlan.trial : undefined;

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomer.id,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/register?plan=${plan}&billing=${billing}&cancelled=1`,
    metadata: { storeId: store.id, plan: planKey, billing },
    subscription_data: {
      metadata: { storeId: store.id },
      ...(trialDays ? { trial_period_days: trialDays } : {}),
    },
  });

  // Send email verification (non-blocking — don't fail registration if email fails)
  createAndSendVerificationEmail(store.users[0]?.id ?? "", email, storeName).catch(() => {});

  return NextResponse.json({ checkoutUrl: session.url });
}
