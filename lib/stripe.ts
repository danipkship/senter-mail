import Stripe from "stripe";
import { PLANS, PlanKey } from "@/lib/plans";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export { PLANS };
export type { PlanKey };
