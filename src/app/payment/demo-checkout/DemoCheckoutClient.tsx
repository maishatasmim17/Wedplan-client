"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { CreditCard, Loader2, Lock, ShieldCheck, Sparkles, XCircle } from "lucide-react";

type DemoSession = {
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  vendorEmail: string;
};

export default function DemoCheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, loading } = useAuth();
  const { showToast } = useToast();

  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<DemoSession | null>(null);
  const [loadError, setLoadError] = useState("");
  const [processing, setProcessing] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || loading || !token || !sessionId) return;
    loaded.current = true;

    fetch(`${API_BASE_URL}/payment/demo-session?sessionId=${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Session not found");
        setSession(data.session);
      })
      .catch((err) => setLoadError(err.message || "Could not load checkout session."));
  }, [loading, token, sessionId]);

  const pay = async () => {
    if (!session || processing) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payment/demo-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId: session.sessionId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Payment confirmation failed", "error");
        return;
      }
      router.replace(`/payment/success?session_id=${session.sessionId}`);
    } catch {
      showToast("Network error during payment confirmation", "error");
    } finally {
      setProcessing(false);
    }
  };

  const cancel = async () => {
    if (!session || processing) return;
    setProcessing(true);
    try {
      await fetch(`${API_BASE_URL}/payment/demo-cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId: session.sessionId })
      });
    } catch {
      // Still send the vendor to the cancel page.
    }
    router.replace(`/payment/cancel?session_id=${session.sessionId}`);
  };

  if (loading || (!session && !loadError)) {
    return (
      <main className="min-h-[75vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
        <p className="text-stone-400 text-xs mt-3">Preparing secure checkout...</p>
      </main>
    );
  }

  if (loadError || !session) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-3xl bg-stone-900/90 border border-rose-500/40 p-10 text-center">
          <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h1 className="text-xl font-serif font-bold text-stone-100 mt-4">
            This checkout page is no longer valid
          </h1>
          <p className="text-xs text-stone-400 mt-2">{loadError || "Session not found."}</p>
          <Link
            href="/dashboard/vendor/subscription"
            className="mt-6 inline-block px-6 py-3 rounded-2xl bg-amber-500 text-stone-950 text-xs font-bold"
          >
            Return to Membership
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order summary */}
        <section className="rounded-3xl bg-stone-900/90 border border-stone-800 p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-amber-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">WedPlan Premium</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-100 mt-4">
            Complete your upgrade
          </h1>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            Unlimited active services, a gold verified badge and priority placement for one year.
          </p>

          <div className="mt-8 rounded-2xl bg-stone-950/60 border border-stone-800 p-5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Plan</span>
              <span className="text-stone-100 font-semibold">Premium Vendor (yearly)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Account</span>
              <span className="text-stone-300">{session.vendorEmail || user?.email}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-stone-800 pt-3">
              <span className="text-stone-300 font-semibold">Total due today</span>
              <span className="font-mono font-bold text-amber-400 text-lg">
                ${Number(session.amount).toFixed(2)} {session.currency?.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="mt-6 flex items-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4" />
            Access is activated by a server-side verified payment event only.
          </p>
        </section>

        {/* Simulated card form */}
        <section className="rounded-3xl bg-gradient-to-b from-stone-900 to-amber-950/20 border border-amber-500/30 p-8 shadow-2xl">
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono uppercase tracking-widest text-amber-300">
            <CreditCard className="w-3.5 h-3.5" /> Simulated Stripe Test Mode
          </div>
          <p className="text-[11px] text-stone-400 mb-6 leading-relaxed">
            No real Stripe test key is configured on the server, so this is a local test checkout.
            No real card is charged. With a valid <code className="text-amber-300">sk_test_</code> key,
            vendors are redirected to the real Stripe Checkout page instead.
          </p>

          <label className="block text-[11px] text-stone-400 mb-1.5">Card information</label>
          <div className="rounded-2xl bg-stone-950 border border-stone-700 px-4 py-3.5 font-mono text-sm text-stone-300">
            4242 4242 4242 4242 <span className="text-stone-600">· 12/34 · 123</span>
          </div>

          <label className="block text-[11px] text-stone-400 mt-4 mb-1.5">Name on card</label>
          <div className="rounded-2xl bg-stone-950 border border-stone-700 px-4 py-3.5 text-sm text-stone-300">
            {user?.name || "Test Vendor"}
          </div>

          <button
            onClick={pay}
            disabled={processing}
            className="w-full mt-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {processing ? "Confirming..." : `Pay $${Number(session.amount).toFixed(2)}`}
          </button>

          <button
            onClick={cancel}
            disabled={processing}
            className="w-full mt-3 py-3 rounded-2xl bg-stone-800/70 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition disabled:opacity-50"
          >
            Cancel and return
          </button>
        </section>
      </div>
    </main>
  );
}
