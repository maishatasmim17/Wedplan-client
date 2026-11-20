"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/utils";
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Search } from "lucide-react";

export default function CustomerDashboardOverview() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "customer") {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    async function loadCustomerData() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const bookings = data.bookings || [];

        setStats({
          total: bookings.length,
          pending: bookings.filter((b: any) => b.status === "Pending").length,
          accepted: bookings.filter((b: any) => b.status === "Accepted").length,
          rejected: bookings.filter((b: any) => b.status === "Rejected").length
        });
        setRecentBookings(bookings.slice(0, 3));
      } catch (err) {
        console.error("Error loading customer bookings", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadCustomerData();
    }
  }, [user, token, router]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-amber-950/30 border border-stone-800 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-1">
            Hello, {user?.name}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track your wedding service inquiries, accepted reservations, and special day timeline.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition hover:scale-105 shrink-0"
        >
          <Search className="w-4 h-4" />
          Find Wedding Services
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Total Bookings</span>
          <p className="text-3xl font-serif font-bold text-stone-100 mt-1">
            {loading ? "..." : stats.total}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Pending Requests</span>
          <p className="text-3xl font-serif font-bold text-amber-400 mt-1">
            {loading ? "..." : stats.pending}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Accepted Bookings</span>
          <p className="text-3xl font-serif font-bold text-emerald-400 mt-1">
            {loading ? "..." : stats.accepted}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
            <XCircle className="w-5 h-5" />
          </div>
          <span className="text-xs text-stone-400 font-mono uppercase">Rejected Bookings</span>
          <p className="text-3xl font-serif font-bold text-red-400 mt-1">
            {loading ? "..." : stats.rejected}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-100">Recent Booking Requests</h2>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
          >
            View All My Bookings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-semibold text-stone-100">
                    {b.serviceId?.serviceName || "Wedding Service"}
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Vendor: {b.vendorId?.businessName || b.vendorId?.name} • Event Date:{" "}
                    {new Date(b.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "Accepted"
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                      : b.status === "Rejected"
                      ? "bg-red-950/80 text-red-400 border border-red-500/30"
                      : b.status === "Cancelled"
                      ? "bg-stone-800 text-stone-400"
                      : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-6 text-center">
            You haven't submitted any booking requests yet. Browse services to begin!
          </p>
        )}
      </div>
    </div>
  );
}
