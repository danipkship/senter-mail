"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2, Save, MessageSquare, Mail,
  Phone, CheckCircle2, ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotificationSettings } from "@/lib/types";
import { toast } from "sonner";

const schema = z.object({
  senderEmail: z.string().email("Invalid email").or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface NotificationsFormProps {
  initialSettings: NotificationSettings;
}

export function NotificationsForm({ initialSettings }: NotificationsFormProps) {
  const [hasNumber, setHasNumber] = useState(false);
  const [requestingNumber, setRequestingNumber] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderEmail: initialSettings.senderEmail },
  });

  const emailValue = watch("senderEmail");

  async function handleRequestNumber() {
    setRequestingNumber(true);
    await new Promise((r) => setTimeout(r, 800));
    setRequestingNumber(false);
    toast.info("Number request submitted — we'll assign your number within 24 hours.");
  }

  async function handleVerifyEmail() {
    if (!emailValue || errors.senderEmail) return;
    setVerifyingEmail(true);
    await new Promise((r) => setTimeout(r, 700));
    setVerifyingEmail(false);
    setEmailVerified(true);
    toast.success(`Verification email sent to ${emailValue}`);
  }

  async function onSubmit(data: FormData) {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Notification settings saved:", data);
    toast.success("Notification settings saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* ── SMS ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-md">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">SMS Notifications</h3>
            <p className="text-xs text-slate-400">Send text messages directly to your customers</p>
          </div>
        </div>

        {hasNumber ? (
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-md p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">+1 (305) 555-0142</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">Active</span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs rounded-md"
              onClick={() => setHasNumber(false)}
            >
              Change Number
            </Button>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-md overflow-hidden">
            {/* Pricing header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                      Dedicated Phone Number
                    </span>
                  </div>
                  <p className="text-2xl font-bold">
                    $0.95
                    <span className="text-sm font-normal text-blue-200 ml-1">/ SMS sent</span>
                  </p>
                </div>
                <div className="text-right text-xs text-blue-200 space-y-0.5">
                  <p>No monthly fees</p>
                  <p>Pay as you go</p>
                  <p>Cancel anytime</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="px-5 py-4 bg-white border-b border-slate-100">
              <ul className="space-y-2">
                {[
                  "Your own dedicated local number",
                  "Unlimited incoming messages",
                  "Delivery status per message",
                  "Works with all SMS templates",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-5 py-4 bg-slate-50">
              <Button
                type="button"
                onClick={handleRequestNumber}
                disabled={requestingNumber}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-md"
              >
                {requestingNumber ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting request...
                  </>
                ) : (
                  <>
                    Request a Phone Number
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-400 text-center mt-2.5">
                We'll assign your number within 24 hours and notify you by email.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Email ───────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-md">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Email Notifications</h3>
            <p className="text-xs text-slate-400">
              Emails will be sent from your address so customers recognize you
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Sender Email Address</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  {...register("senderEmail")}
                  type="email"
                  placeholder="notifications@yourbusiness.com"
                  className="h-9 border-slate-200 focus-visible:ring-blue-400 rounded-md pr-8"
                />
                {emailVerified && (
                  <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVerifyEmail}
                disabled={verifyingEmail || !emailValue || !!errors.senderEmail}
                className="h-9 rounded-md flex-shrink-0"
              >
                {verifyingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : emailVerified ? (
                  "Reverify"
                ) : (
                  "Verify & Connect"
                )}
              </Button>
            </div>
            {errors.senderEmail && (
              <p className="text-xs text-red-500">{errors.senderEmail.message}</p>
            )}
          </div>

          {emailVerified ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                <strong>{emailValue}</strong> is verified. Notifications will be sent from this address.
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              After clicking "Verify & Connect", check your inbox for a confirmation link.
              Once verified, customer notifications will be sent from this address.
            </p>
          )}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
