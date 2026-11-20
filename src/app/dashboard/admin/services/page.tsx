"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Search, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminServicesPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, [statusFilter, token]);

  const fetchServices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`${API_BASE_URL}/admin/services?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.services) {
        setServices(data.services);
      }
    } catch (err) {
      showToast("Failed to fetch services for moderation", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/services/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Status update failed", "error");
        return;
      }

      showToast(`Service status updated to ${newStatus}`, "success");
      fetchServices();
    } catch (err) {
      showToast("Error updating status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this service as administrator?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Service deleted by administrator", "success");
        fetchServices();
      }
    } catch (err) {
      showToast("Error deleting service", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-100">Service Moderation Queue</h1>
        <p className="text-xs text-stone-400 mt-1">
          Review pending vendor submissions, approve verified offerings, or remove inappropriate listings.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchServices();
          }}
          className="relative flex-1 w-full"
        >
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-rose-500 transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-rose-500 transition"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-xs">Loading services...</p>
        </div>
      ) : services.length > 0 ? (
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 font-mono uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-stone-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80"}
                          alt={s.serviceName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-stone-100">{s.serviceName}</p>
                          <p className="text-rose-400">{s.category}</p>
                          <p className="text-[11px] text-stone-500">{s.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-stone-200">
                        {s.vendorId?.businessName || s.vendorId?.name || "Vendor"}
                      </p>
                      <p className="text-stone-400 text-[11px]">{s.vendorId?.email}</p>
                    </td>

                    <td className="p-4 font-mono text-stone-200 font-bold">
                      ${s.price.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                          s.status === "approved"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : s.status === "rejected"
                            ? "bg-red-950 text-red-400 border border-red-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(s._id, "approved")}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 font-semibold"
                            title="Approve Service"
                          >
                            Approve
                          </button>
                        )}
                        {s.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(s._id, "rejected")}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/30 font-semibold"
                            title="Reject Service"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="p-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/30"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800">
          <p className="text-xs text-stone-400">No services found in this queue.</p>
        </div>
      )}
    </div>
  );
}
