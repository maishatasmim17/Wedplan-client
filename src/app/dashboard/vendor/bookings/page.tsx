"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Calendar, MapPin, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function VendorBookingsPage() {
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
      const res = await fetch(`${API_BASE_URL}/bookings/vendor-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      showToast("Failed to fetch booking requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "Accepted" | "Rejected") => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || `Failed to set status to ${newStatus}`, "error");
        return;
      }

      showToast(`Booking request successfully marked as ${newStatus}!`, "success");
      fetchBookings();
    } catch (err) {
      showToast("Network error updating status", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-100">Client Booking Requests</h1>
        <p className="text-xs text-stone-400 mt-1">
          Review incoming couple inquiries, confirm availability, and accept or reject reservations.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-xs">Loading requests...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
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
                    Requested on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-100">
                    {booking.serviceId?.serviceName || "Wedding Service"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {booking.customerId?.image ? (
                      <img
                        src={booking.customerId.image}
                        alt="Customer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-rose-800 text-white text-[10px] flex items-center justify-center">
                        C
                      </div>
                    )}
                    <span className="text-xs font-medium text-stone-300">
                      {booking.customerId?.name} ({booking.customerId?.email})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300 pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Event Date: {new Date(booking.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Location: {booking.eventLocation}</span>
                  </div>
                </div>

                {booking.message && (
                  <p className="text-xs text-stone-400 bg-stone-950 p-3 rounded-xl border border-stone-800/80 italic">
                    "{booking.message}"
                  </p>
                )}
              </div>

              {/* Action Buttons: Only pending requests can be accepted or rejected */}
              {booking.status === "Pending" ? (
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "Accepted")}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "Rejected")}
                    className="flex-1 px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              ) : (
                <div className="text-xs text-stone-500 italic shrink-0">
                  Processed ({booking.status})
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800 p-8">
          <Clock className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-stone-200">No Booking Requests</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
            When couples request to book your wedding services, inquiries will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
