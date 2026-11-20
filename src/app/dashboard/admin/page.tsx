"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/utils";
import { Users, Layers, Clock, CreditCard, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminDashboardOverview() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalServices: 0,
    pendingServices: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    async function loadAdminStats() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error loading admin stats", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadAdminStats();
    }
  }, [user, token, router]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-950/50 via-stone-900 to-indigo-950/40 border border-stone-800 shadow-xl">
        <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
          Super Admin Console
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-1">
          WedPlan Master Overview
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Monitor registered users, review pending service listings, manage vendor access, and audit platform transactions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Total Registered Users</span>
          <p className="text-3xl font-serif font-bold text-stone-100 mt-1">
            {loading ? "..." : stats.totalUsers}
          </p>
          <p className="text-[11px] text-stone-500 mt-2 font-mono">
            {stats.totalVendors} Vendors • {stats.totalCustomers} Customers
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Pending Services</span>
          <p className="text-3xl font-serif font-bold text-amber-400 mt-1">
            {loading ? "..." : stats.pendingServices}
          </p>
          <Link
            href="/dashboard/admin/services?status=pending"
            className="text-[11px] text-rose-400 hover:underline mt-2 inline-block font-mono"
          >
            Review Pending Submissions →
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Stripe Transactions</span>
          <p className="text-3xl font-serif font-bold text-stone-100 mt-1">
            {loading ? "..." : stats.totalTransactions}
          </p>
          <Link
            href="/dashboard/admin/transactions"
            className="text-[11px] text-indigo-400 hover:underline mt-2 inline-block font-mono"
          >
            Audit Transaction Logs →
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="p-6 rounded-3xl bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-rose-500/40 transition group shadow-lg flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-rose-400 transition">
              Manage User Directory
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Search by name/email, filter roles, and block or unblock accounts.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-800 group-hover:bg-rose-600 flex items-center justify-center text-stone-300 group-hover:text-white transition shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/services"
          className="p-6 rounded-3xl bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-rose-500/40 transition group shadow-lg flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-rose-400 transition">
              Service Moderation Queue
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Approve, reject, or remove wedding catalog submissions.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-800 group-hover:bg-rose-600 flex items-center justify-center text-stone-300 group-hover:text-white transition shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
