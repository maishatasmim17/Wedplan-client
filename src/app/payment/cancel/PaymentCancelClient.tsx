"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/utils";
import { ArrowLeft, RotateCcw, ShieldCheck, XCircle } from "lucide-react";

export default function PaymentCancelClient() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const notified = useRef(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (notified.current || !token || !sessionId || !sessionId.startsWith("demo_")) return;
    notified.current = true;
    // Mark the simulated checkout as canceled so it cannot be paid later.
    fetch(`${API_BASE_URL}/payment/demo-cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sessionId })
    }).catch(() => undefined);
  }, [token, sessionId]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-stone-900/90 border border-stone-800 p-10 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
          <XCircle className="w-9 h-9 text-amber-400" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-100 mt-6">
          Checkout cancelled
        </h1>
        <p className="text-sm text-stone-300 mt-3 leading-relaxed">
          No charge was made. Your account is still on the Free plan and the 3 active service
          limit remains unchanged.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" /> Try Upgrade Again
          </Link>
          <Link
            href="/dashboard/vendor"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4" />
          Cancelling checkout never changes your subscription status.
        </p>
      </div>
    </main>
  );
}
