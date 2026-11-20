"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { PlusCircle, UploadCloud, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion"
];

export default function AddServicePage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !price || !location || !description) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const images = imageUrl.trim()
        ? [imageUrl.trim()]
        : ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"];

      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceName,
          category,
          price: Number(price),
          location,
          description,
          images
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to submit service", "error");
        return;
      }

      showToast("Service successfully submitted! Pending admin review.", "success");
      router.push("/dashboard/vendor/services");
    } catch (err) {
      showToast("Network error submitting service", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/vendor/services"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-rose-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl backdrop-blur-md">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-stone-100">Add New Wedding Service</h1>
          <p className="text-xs text-stone-400 mt-1">
            Publish your wedding package for couples. Submitted services will be reviewed and approved by administrators.
          </p>
          {user?.subscriptionPlan !== "premium" && (
            <p className="text-xs text-amber-400 mt-2 bg-amber-950/40 border border-amber-500/20 p-2.5 rounded-xl">
              Free plan allows a maximum of 3 active services. Upgrade to Premium anytime for unlimited publishing.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Luxury 4K Cinema & Aerial Drone Coverage"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Starting Price ($ USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Manhattan, New York, NY"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Service Image URL or ImgBB Hosted Link *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or ImgBB URL"
              className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Comprehensive Service Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included in this package (e.g. hours of coverage, equipment, staffing, delivery timeline)..."
              className="w-full p-4 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Wedding Service for Approval"}
            <PlusCircle className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
