"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { PlusCircle, Trash2, Edit3, Eye, AlertCircle, X, Check } from "lucide-react";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion"
];

export default function VendorServicesPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Update Modal State
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editPrice, setEditPrice] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

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

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setEditName(service.serviceName);
    setEditCategory(service.category);
    setEditPrice(service.price.toString());
    setEditLocation(service.location);
    setEditDescription(service.description);
    setEditImageUrl(service.images?.[0] || "");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setUpdateLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/services/${editingService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceName: editName,
          category: editCategory,
          price: Number(editPrice),
          location: editLocation,
          description: editDescription,
          images: [editImageUrl]
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to update service", "error");
        return;
      }

      showToast("Service updated successfully!", "success");
      setEditingService(null);
      fetchMyServices();
    } catch (err) {
      showToast("Network error updating service", "error");
    } finally {
      setUpdateLoading(false);
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
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">My Wedding Services</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Manage your published packages, update info, check approval states, or toggle availability.
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
          <p className="text-stone-500 text-xs">Loading services...</p>
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      service.status === "approved"
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                        : service.status === "rejected"
                        ? "bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30"
                        : "bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                    }`}
                  >
                    Approval: {service.status}
                  </span>

                  <button
                    onClick={() => handleToggleActive(service._id, service.isActive)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                      service.isActive
                        ? "bg-stone-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700"
                    }`}
                  >
                    {service.isActive ? "● Available (Active)" : "○ Inactive (Hidden)"}
                  </button>
                </div>

                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-stone-100 dark:bg-stone-950">
                  <img
                    src={service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"}
                    alt={service.serviceName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                  {service.serviceName}
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">{service.category}</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">{service.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono">
                  ${service.price.toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  {/* Update Service Button */}
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition"
                    title="Update Service"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/services/${service._id}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition"
                    title="View Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
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
        <div className="text-center py-20 bg-stone-50 dark:bg-stone-900/40 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-stone-800 dark:text-stone-200">No Services Added Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
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

      {/* Update Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Update Wedding Service
              </h2>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Location / City *
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
