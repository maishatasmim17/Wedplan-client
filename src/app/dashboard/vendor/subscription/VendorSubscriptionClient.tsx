"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Loader2,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function VendorSubscriptionClient() {
  const { user, token, loading: authLoading, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [managing, setManaging] = useState(false);
  const refreshed = useRef(false);

  // Always read the latest subscription state from the server (handles expiry).
  useEffect(() => {
    if (refreshed.current || authLoading || !token) return;
    refreshed.current = true;
    refreshProfile();
  }, [authLoading, token, refreshProfile]);

  const isPremium =
    user?.subscriptionPlan === "premium" &&
    (!user.subscriptionExpiresAt ||
      new Date(user.subscriptionExpiresAt).getTime() > Date.now());

  const handleUpgrade = async () => {
    if (!token) {
      showToast("Please sign in to upgrade your plan.", "error");
      return;
    }

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

      // Never navigate to an undefined/invalid URL.
      if (typeof data.url === "string" && /^https?:\/\//.test(data.url)) {
        window.location.assign(data.url);
      } else {
        showToast("Checkout URL was invalid. Please try again.", "error");
      }
    } catch {
      showToast("Network error creating checkout session", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!token) return;
    setManaging(true);
    try {
      if (user?.stripeSubscriptionId) {
        const res = await fetch(`${API_BASE_URL}/payment/create-portal-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success && /^https?:\/\//.test(data.url)) {
          window.location.assign(data.url);
          return;
        }
        showToast(data.message || "Could not open Stripe subscription settings", "error");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/payment/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Could not cancel subscription", "error");
        return;
      }
      showToast("Premium subscription cancelled. You are back on the Free plan.", "info");
      await refreshProfile();
    } catch {
      showToast("Network error managing your subscription", "error");
    } finally {
      setManaging(false);
    }
  };

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
            {user?.subscriptionExpiresAt && (
              <p className="mt-3 flex items-center gap-2 text-[11px] font-mono text-amber-300/90">
                <CalendarClock className="w-3.5 h-3.5" />
                Renews / expires: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
              </p>
            )}
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
                onClick={handleManageSubscription}
                disabled={managing}
                className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {managing && <Loader2 className="w-4 h-4 animate-spin" />}
                {managing
                  ? "Updating..."
                  : user?.stripeSubscriptionId
                    ? "Manage / Cancel Subscription"
                    : "Cancel Premium (Test Mode)"}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-2xl text-xs font-bold shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 transition hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Opening secure checkout...
                  </>
                ) : (
                  <>
                    Upgrade to Premium ($49/yr) <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
