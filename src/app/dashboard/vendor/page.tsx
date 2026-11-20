"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/utils";
import { Layers, CheckCircle2, Clock, CheckCheck, Sparkles, PlusCircle } from "lucide-react";

export default function VendorDashboardOverview() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Route protection: only vendor
    if (user && user.role !== "vendor") {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    async function loadVendorData() {
      if (!token) return;
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/services/my-services`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/bookings/vendor-requests`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const servicesData = await servicesRes.json();
        const bookingsData = await bookingsRes.json();

        const myServices = servicesData.services || [];
        const myBookings = bookingsData.bookings || [];

        setStats({
          totalServices: myServices.length,
          activeServices: myServices.filter((s: any) => s.isActive && s.status === "approved").length,
          pendingBookings: myBookings.filter((b: any) => b.status === "Pending").length,
          acceptedBookings: myBookings.filter((b: any) => b.status === "Accepted").length
        });
      } catch (err) {
        console.error("Error fetching vendor stats", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadVendorData();
    }
  }, [user, token, router]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-amber-950/30 border border-stone-800 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
            Vendor Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage your wedding service portfolio, review client requests, and expand your bookings.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-service"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Service
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Total Services</span>
          <p className="text-3xl font-serif font-bold text-stone-100 mt-1">
            {loading ? "..." : stats.totalServices}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Active / Approved</span>
          <p className="text-3xl font-serif font-bold text-stone-100 mt-1">
            {loading ? "..." : stats.activeServices}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Pending Requests</span>
          <p className="text-3xl font-serif font-bold text-amber-400 mt-1">
            {loading ? "..." : stats.pendingBookings}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <CheckCheck className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Accepted Bookings</span>
          <p className="text-3xl font-serif font-bold text-stone-100 mt-1">
            {loading ? "..." : stats.acceptedBookings}
          </p>
        </div>
      </div>

      {/* Subscription Plan Summary Card */}
      <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Subscription Tier:{" "}
                <span className="text-amber-400 uppercase font-mono">
                  {user?.subscriptionPlan || "free"}
                </span>
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              {user?.subscriptionPlan === "premium"
                ? "You enjoy unlimited active service listings, featured badges, and priority matching."
                : "Free Plan is active (Limit: 3 active services). Upgrade to unlock unlimited catalogs!"}
            </p>
          </div>
        </div>

        {user?.subscriptionPlan !== "premium" && (
          <Link
            href="/dashboard/vendor/subscription"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition hover:scale-105 shrink-0"
          >
            Upgrade to Premium ($49/yr)
          </Link>
        )}
      </div>
    </div>
  );
}
