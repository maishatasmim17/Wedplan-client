"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Calendar, MapPin, XCircle, Search, AlertCircle } from "lucide-react";

export default function CustomerBookingsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      showToast("Failed to fetch your bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending booking request?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to cancel booking", "error");
        return;
      }

      showToast("Booking request cancelled successfully", "success");
      fetchBookings();
    } catch (err) {
      showToast("Error cancelling booking request", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">My Wedding Bookings</h1>
          <p className="text-xs text-stone-400 mt-1">
            Track all submitted requests, event locations, and vendor confirmations.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/40 transition shrink-0"
        >
          <Search className="w-4 h-4" />
          Browse More Services
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-xs">Loading bookings...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl flex flex-col md:flex-row gap-6 justify-between md:items-center"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-950 shrink-0">
                  <img
                    src={booking.serviceId?.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                    alt={booking.serviceId?.serviceName || "Service"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "Accepted"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                          : booking.status === "Rejected"
                          ? "bg-red-950/80 text-red-400 border border-red-500/30"
                          : booking.status === "Cancelled"
                          ? "bg-stone-800 text-stone-400"
                          : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Request Date: {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-100">
                    {booking.serviceId?.serviceName || "Service"}
                  </h3>
                  <p className="text-xs text-rose-400">
                    Vendor: {booking.vendorId?.businessName || booking.vendorId?.name}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-stone-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>Event Date: {new Date(booking.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      <span>{booking.eventLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Rules: Customers can cancel pending requests only */}
              {booking.status === "Pending" ? (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition self-start md:self-center"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel Request
                </button>
              ) : (
                <span className="text-xs text-stone-500 italic">
                  {booking.status === "Accepted"
                    ? "Confirmed by Vendor"
                    : booking.status === "Rejected"
                    ? "Declined by Vendor"
                    : "Cancelled"}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800 p-8">
          <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-stone-200">No Bookings Yet</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1 mb-6">
            Explore our curated directory of luxury wedding vendors and send your first booking inquiry.
          </p>
          <Link
            href="/services"
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
          >
            Explore Services
          </Link>
        </div>
      )}
    </div>
  );
}
