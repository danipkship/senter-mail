import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sub = event.data.object as Stripe.Subscription & { current_period_end: number };

  function stripeStatusToDB(status: string) {
    switch (status) {
      case "active":    return "ACTIVE";
      case "trialing":  return "TRIALING";
      case "past_due":  return "PAST_DUE";
      case "canceled":  return "CANCELLED";
      default:          return "UNPAID";
    }
  }

  switch (event.type) {
    // Subscription created — fires when checkout completes (including trial start)
    case "customer.subscription.created": {
      const storeId = sub.metadata?.storeId;
      if (storeId) {
        await prisma.store.update({
          where: { id: storeId },
          data: {
            stripeSubscriptionId: sub.id,
            subscriptionStatus:   stripeStatusToDB(sub.status),
            currentPeriodEnd:     new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;
    }

    // Subscription updated — status changes, renewals, plan changes
    case "customer.subscription.updated": {
      await prisma.store.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionStatus: stripeStatusToDB(sub.status),
          currentPeriodEnd:   new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    // Subscription cancelled
    case "customer.subscription.deleted": {
      await prisma.store.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { subscriptionStatus: "CANCELLED" },
      });
      break;
    }

    // Payment failed — mark as past_due
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } };
      const subscriptionId = typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id;
      if (subscriptionId) {
        await prisma.store.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { subscriptionStatus: "PAST_DUE" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
