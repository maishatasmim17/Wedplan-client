"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { User as UserIcon, Mail, Building2, UploadCloud, ShieldCheck, Check } from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, token, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim(),
          businessName: user?.role === "vendor" ? businessName.trim() : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to update profile", "error");
        return;
      }

      showToast("Profile updated successfully!", "success");
      updateUser(data.user);
    } catch (err) {
      showToast("Network error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-100">Profile Settings</h1>
        <p className="text-xs text-stone-400 mt-1">
          Manage your personal details and public presentation. Roles and subscriptions are immutable here for security.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center gap-5 pb-6 border-b border-stone-800">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center font-bold text-2xl">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-stone-100">{user?.name}</p>
              <p className="text-xs text-rose-400 font-mono capitalize">
                Role: {user?.role} {user?.subscriptionPlan ? `• ${user.subscriptionPlan}` : ""}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Email Address (Account Identifier)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950/50 border border-stone-800/60 rounded-xl text-sm text-stone-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              For security, email changes require administrative verification.
            </p>
          </div>

          {user?.role === "vendor" && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Studio / Business Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Moments Cinema"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Profile Image URL (ImgBB Hosted)
            </label>
            <div className="relative">
              <UploadCloud className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://i.ibb.co/... or image URL"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-semibold text-sm shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Profile Updates"}
            <Check className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
