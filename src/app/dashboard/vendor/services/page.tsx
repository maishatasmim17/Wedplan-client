"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { PlusCircle, Trash2, Edit3, Eye, AlertCircle } from "lucide-react";

export default function VendorServicesPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyServices();
  }, [token]);

  const fetchMyServices = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/services/my-services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.services) {
        setServices(data.services);
      }
    } catch (err) {
      showToast("Failed to fetch your services", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this service?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast("Service deleted successfully", "success");
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        showToast(data.message || "Failed to delete service", "error");
      }
    } catch (err) {
      showToast("Error deleting service", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Service set to ${!currentStatus ? "Active" : "Inactive"}`, "success");
        fetchMyServices();
      }
    } catch (err) {
      showToast("Error toggling active state", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">My Wedding Services</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage your published packages, check approval states, or toggle availability.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-service"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-xs">Loading services...</p>
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      service.status === "approved"
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                        : service.status === "rejected"
                        ? "bg-red-950/80 text-red-400 border border-red-500/30"
                        : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {service.status}
                  </span>

                  <button
                    onClick={() => handleToggleActive(service._id, service.isActive)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                      service.isActive
                        ? "bg-stone-800 text-emerald-400 hover:bg-stone-700"
                        : "bg-stone-800 text-stone-500 hover:bg-stone-700"
                    }`}
                  >
                    {service.isActive ? "● Listed" : "○ Unlisted"}
                  </button>
                </div>

                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-stone-950">
                  <img
                    src={service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"}
                    alt={service.serviceName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-100 line-clamp-1">
                  {service.serviceName}
                </h3>
                <p className="text-xs text-rose-400 font-medium mt-0.5">{service.category}</p>
                <p className="text-xs text-stone-400 mt-2 line-clamp-2">{service.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-base font-bold text-stone-100 font-mono">
                  ${service.price.toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/services/${service._id}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white transition"
                    title="View Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 rounded-xl bg-stone-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800 p-8">
          <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-stone-200">No Services Added Yet</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1 mb-6">
            Publish your first wedding service package to start receiving customer bookings.
          </p>
          <Link
            href="/dashboard/vendor/add-service"
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
          >
            Create Your First Service
          </Link>
        </div>
      )}
    </div>
  );
}
