"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Heart, Lock, Mail, User as UserIcon, Building2, UploadCloud, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function SignUpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor">(
    searchParams.get("role") === "vendor" ? "vendor" : "customer"
  );
  const [businessName, setBusinessName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    try {
      return imagePreview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
    } catch {
      return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast("Please provide all required fields", "error");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      showToast("Password must be at least 6 characters with uppercase and lowercase letters", "error");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = "";
      if (imageFile) {
        finalImageUrl = await uploadToImgBB(imageFile);
      }

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          businessName: role === "vendor" ? businessName : undefined,
          image: finalImageUrl
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Registration failed", "error");
        return;
      }

      showToast("Registration successful! Welcome to WedPlan", "success");
      login(data.token, data.user);

      if (data.user.role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      showToast("Network error occurred during registration", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      showToast("Google sign up failed", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role,
          businessName: role === "vendor" ? businessName : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Google registration failed", "error");
        return;
      }

      showToast(`Account registered as ${data.user.role}! Welcome ${data.user.name}`, "success");
      login(data.token, data.user);

      if (data.user.role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      showToast("Network error during Google sign up", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 transition-colors">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/20">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Join WedPlan as a wedding couple or register your creative wedding business.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`py-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
              role === "customer"
                ? "bg-rose-600 text-white shadow-md shadow-rose-950/20"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            {role === "customer" && <CheckCircle2 className="w-4 h-4 text-white" />}
            I am a Customer / Couple
          </button>
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`py-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
              role === "vendor"
                ? "bg-rose-600 text-white shadow-md shadow-rose-950/20"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            {role === "vendor" && <Sparkles className="w-4 h-4 text-amber-300" />}
            I am a Wedding Vendor
          </button>
        </div>

        {/* Registration Form (User Friendly, Clear Inputs) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@weddings.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          {role === "vendor" && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                Studio / Business Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Vance Haute Floral & Decor"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-rose-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Password * (Min 6 chars, uppercase & lowercase)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-500">
                  <UploadCloud className="w-5 h-5" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-stone-500 dark:text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-50 dark:file:bg-rose-950/80 file:text-rose-600 dark:file:text-rose-300 hover:file:bg-rose-100 dark:hover:file:bg-rose-900 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-950/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google Sign Up Placed Cleanly at the Bottom */}
        <div className="space-y-4 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
            <span className="bg-white dark:bg-stone-900 px-3 text-xs text-stone-500 font-mono uppercase">
              Or Fast Register With Google
            </span>
            <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast("Google registration failed", "error")}
              theme="outline"
              shape="pill"
              text="signup_with"
            />
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              One-click sign up as a <span className="text-rose-600 dark:text-rose-400 font-semibold capitalize">{role}</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
          Already registered?{" "}
          <Link href="/signin" className="text-rose-600 dark:text-rose-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
