"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { uploadServiceImage } from "@/lib/imageUpload";
import { PlusCircle, ArrowLeft, Image as ImageIcon } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  // Upload the picked file to our own API (stored in MongoDB, served by /api/upload).
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadingImg(true);
    try {
      const url = await uploadServiceImage(file, token);
      setImageUrl(url);
      showToast("Image uploaded successfully!", "success");
    } catch (err) {
      setImagePreview("");
      showToast(err instanceof Error ? err.message : "Image upload failed", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !price || !location || !description) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const finalImage = imageUrl.trim() || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

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
          images: [finalImage]
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
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-rose-500 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">Add New Wedding Service</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Publish your wedding package for couples. Submitted services will be reviewed and approved by administrators.
          </p>
          {user?.subscriptionPlan !== "premium" && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 p-2.5 rounded-xl">
              Free plan allows a maximum of 3 active services. Upgrade to Premium anytime for unlimited publishing.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Luxury 4K Cinema & Aerial Drone Coverage"
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 transition"
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
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Starting Price ($ USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Manhattan, New York, NY"
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          {/* Service Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Service Image (Upload a File or Paste an Image URL) *
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-3">
                {imagePreview || imageUrl ? (
                  <img
                    src={imagePreview || imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-rose-500 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-400 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-stone-600 dark:text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 dark:file:bg-rose-950/80 file:text-rose-600 dark:file:text-rose-300 hover:file:bg-rose-100 cursor-pointer"
                  />
                  {uploadingImg && <p className="text-[11px] text-amber-500 mt-1">Uploading image...</p>}
                </div>
              </div>

              <div className="flex-1 w-full">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste a direct image URL (https://...)"
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Comprehensive Service Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included in this package (e.g. hours of coverage, equipment, staffing, delivery timeline)..."
              className="w-full p-4 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImg}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-rose-950/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Wedding Service for Approval"}
            <PlusCircle className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
