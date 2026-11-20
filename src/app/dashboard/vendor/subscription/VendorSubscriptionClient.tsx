"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";

export default function VendorSubscriptionClient() {
  const { user, token, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const status = searchParams.get("status");

    if (sessionId && status === "success" && token) {
      confirmSubscription(sessionId);
    } else if (status === "cancelled") {
      showToast("Subscription upgrade cancelled. You remain on the Free plan.", "info");
    }
  }, [searchParams, token]);

  const confirmSubscription = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payment/confirm-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await res.json();
      if (data.success) {
        showToast("Premium Subscription Activated! Enjoy unlimited services.", "success");
        await refreshProfile();
        router.replace("/dashboard/vendor/subscription");
      }
    } catch (err) {
      console.error("Confirmation error:", err);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to initialize Stripe checkout", "error");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      showToast("Network error creating checkout session", "error");
    } finally {
      setLoading(false);
    }
  };

  const isPremium = user?.subscriptionPlan === "premium";

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
          Vendor Membership & Plans
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Choose the right plan to expand your wedding reach and scale your bookings.
        </p>
      </div>

      {isPremium ? (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-900/40 border border-amber-500/40 shadow-2xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500 text-stone-950 uppercase">
              Premium Tier Active
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-100 mt-2">
              You Have Full Premium Access
            </h2>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Your account allows unlimited wedding services, priority placement in search results, and a verified vendor badge.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className={`p-8 rounded-3xl bg-stone-900/90 border flex flex-col justify-between shadow-xl ${
          !isPremium ? "border-rose-500/50 ring-1 ring-rose-500/30" : "border-stone-800"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif font-bold text-stone-100">Free Starter</h3>
              <span className="text-xs font-mono uppercase text-stone-400">$0 / Month</span>
            </div>
            <p className="text-xs text-stone-400 mb-6">
              Ideal for new independent wedding vendors testing the platform.
            </p>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Publish up to <strong>3 Active Services</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Basic Vendor Dashboard & Metrics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Booking Request Management</span>
              </li>
              <li className="flex items-center gap-2.5 text-stone-500 line-through">
                <span>Featured Search Priority</span>
              </li>
              <li className="flex items-center gap-2.5 text-stone-500 line-through">
                <span>Gold Verified Vendor Badge</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800">
            <span className="text-xs text-stone-400 block text-center font-mono">
              {!isPremium ? "Current Active Plan" : "Included"}
            </span>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/20 border border-amber-500/40 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-stone-950 uppercase tracking-widest">
              Recommended
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-serif font-bold text-stone-100">Premium Vendor</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-serif font-bold text-amber-400">$49</span>
              <span className="text-xs text-stone-400 font-mono"> / year</span>
            </div>
            <p className="text-xs text-stone-400 mb-6">
              For established wedding studios, venues, and full-time professionals.
            </p>

            <ul className="space-y-3 text-xs text-stone-200">
              <li className="flex items-center gap-2.5 font-semibold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Unlimited Active Services</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Premium Gold Vendor Badge</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority Placement on Homepage & Search</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All Free Plan Features Included</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Trust & Direct Inquiry Routing</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800">
            {isPremium ? (
              <button
                disabled
                className="w-full py-3 bg-stone-800 text-stone-400 rounded-2xl text-xs font-semibold cursor-not-allowed"
              >
                Plan Already Active
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-2xl text-xs font-bold shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 transition hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Redirecting to Stripe..." : "Upgrade to Premium ($49/yr)"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
