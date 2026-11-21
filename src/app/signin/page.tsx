"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Heart, Lock, Mail, ArrowRight } from "lucide-react";

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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      showToast("Google sign in failed", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role: "customer"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Google authentication failed", "error");
        return;
      }

      showToast(`Welcome ${data.user.name}!`, "success");
      login(data.token, data.user);

      if (data.user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      showToast("Network error during Google authentication", "error");
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

        {/* Real Google Sign In */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-stone-900 px-3 text-xs text-stone-500 font-mono uppercase">Or Continue With</span>
            <div className="border-t border-stone-800 w-full" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast("Google Login failed", "error")}
              theme="filled_black"
              shape="pill"
              text="signin_with"
            />
          </div>
        </div>

        <p className="text-center text-xs text-stone-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-rose-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
