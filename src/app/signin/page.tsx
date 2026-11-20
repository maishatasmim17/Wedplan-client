"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Heart, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to sign in", "error");
        return;
      }

      showToast("Welcome back to WedPlan!", "success");
      login(data.token, data.user);

      // Redirect according to role
      if (data.user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      showToast("Network error occurred during login", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMockLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Google Wedding Explorer",
          email: "google.user@example.com",
          image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          role: "customer"
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast("Signed in with Google successfully", "success");
        login(data.token, data.user);
        router.push("/dashboard/customer");
      }
    } catch (err) {
      showToast("Google authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-8 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/40">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">Welcome to WedPlan</h1>
          <p className="text-xs text-stone-400">
            Sign in to manage your wedding bookings, services, or platform controls.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs text-stone-400 space-y-1">
          <p className="font-semibold text-rose-300">Quick Test Credentials:</p>
          <div className="flex justify-between">
            <span>Admin: admin@wedplan.com</span>
            <span className="font-mono text-stone-300">WedPlan@2026</span>
          </div>
          <div className="flex justify-between">
            <span>Vendor: elena@royalphoto.com</span>
            <span className="font-mono text-stone-300">WedPlan@2026</span>
          </div>
          <div className="flex justify-between">
            <span>Customer: sarah.j@gmail.com</span>
            <span className="font-mono text-stone-300">WedPlan@2026</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In to WedPlan"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Alternative Google Sign In */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-stone-900 px-3 text-xs text-stone-500 font-mono uppercase">Or Continue With</span>
            <div className="border-t border-stone-800 w-full" />
          </div>

          <button
            type="button"
            onClick={handleGoogleMockLogin}
            disabled={loading}
            className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-200 flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.54 0 2.94.54 4.04 1.44l3.03-3.03C17.24 1.71 14.8 1 12 1 7.42 1 3.51 3.61 1.7 7.43l3.66 2.84C6.24 7.22 8.87 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.72-4.92 3.72-8.69z"
              />
              <path
                fill="#FBBC05"
                d="M5.36 14.73c-.24-.72-.36-1.49-.36-2.28 0-.79.12-1.56.36-2.28L1.7 7.33C.62 9.5 0 11.92 0 14.45s.62 4.95 1.7 7.12l3.66-2.84z"
              />
              <path
                fill="#34A853"
                d="M12 23.9c3.24 0 5.96-1.08 7.95-2.93l-3.7-2.87c-1.08.72-2.46 1.15-4.25 1.15-3.13 0-5.76-2.22-6.64-5.27L1.7 16.82C3.51 20.64 7.42 23.9 12 23.9z"
              />
            </svg>
            Sign in with Google OAuth
          </button>
        </div>

        <p className="text-center text-xs text-stone-400">
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-rose-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
