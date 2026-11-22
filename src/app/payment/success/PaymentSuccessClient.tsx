"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle
} from "lucide-react";

type PaymentDetails = {
  amount: number;
  currency: string;
  status: string;
  createdAt?: string;
};

export default function PaymentSuccessClient() {
  const { user, token, loading, refreshProfile } = useAuth();
  const searchParams = useSearchParams();

  const [state, setState] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const started = useRef(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (started.current || loading) return;

    if (!user || !token) {
      setState("error");
      setMessage("Please sign in as the vendor who started the payment to see this page.");
      return;
    }

    if (!sessionId) {
      setState("error");
      setMessage("No checkout session was found in the return URL.");
      return;
    }

    started.current = true;

    const verify = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/payment/verify-session?sessionId=${encodeURIComponent(sessionId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (res.ok && data.success) {
          await refreshProfile();
          setDetails(data.transaction || null);
          setState("success");
        } else {
          setState("error");
          setMessage(
            data.message || "We could not verify this payment yet. Please try again shortly."
          );
        }
      } catch {
        setState("error");
        setMessage("Network error while verifying your payment. Please try again.");
      }
    };

    verify();
  }, [loading, user, token, sessionId, refreshProfile]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        {state === "verifying" && (
          <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-12 text-center shadow-2xl">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h1 className="text-xl font-serif font-bold text-stone-100 mt-5">
              Confirming your payment
            </h1>
            <p className="text-xs text-stone-400 mt-2">
              The server is verifying the payment with Stripe. Premium access is only granted
              after this verification succeeds.
            </p>
          </div>
        )}

        {state === "success" && (
          <div className="rounded-3xl bg-gradient-to-b from-stone-900 to-emerald-950/30 border border-emerald-500/40 p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <span className="inline-block mt-5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500 text-stone-950">
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-100 mt-3">
              Welcome to Premium, {user?.name?.split(" ")[0] || "Vendor"}!
            </h1>
            <p className="text-sm text-stone-300 mt-3 leading-relaxed">
              Your Vendor Premium membership is active. You can now publish unlimited active
              services and use your verified gold vendor badge.
            </p>

            {details && (
              <div className="mt-7 rounded-2xl bg-stone-950/60 border border-stone-800 px-5 py-4 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Transaction</span>
                  <span className="font-mono text-emerald-400 capitalize">{details.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Amount paid</span>
                  <span className="font-mono font-bold text-stone-100">
                    ${Number(details.amount).toFixed(2)} {details.currency?.toUpperCase()}
                  </span>
                </div>
                {details.createdAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">Date</span>
                    <span className="font-mono text-stone-300">
                      {new Date(details.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/vendor/subscription"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition"
              >
                View Membership <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/vendor/add-service"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold transition"
              >
                Add a Service <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="rounded-3xl bg-stone-900/90 border border-rose-500/40 p-10 text-center shadow-2xl">
            <XCircle className="w-14 h-14 text-rose-400 mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-stone-100 mt-5">
              Payment not confirmed
            </h1>
            <p className="text-sm text-stone-300 mt-3">{message}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/vendor/subscription"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition"
              >
                Back to Membership <ArrowRight className="w-4 h-4" />
              </Link>
              {!user && (
                <Link
                  href="/signin"
                  className="px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4" />
          Premium access is activated only by verified Stripe payment events.
        </p>
      </div>
    </main>
  );
}
