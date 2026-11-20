"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Heart, Menu, X, ChevronDown, User, LayoutDashboard, Settings, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!user) return "/signin";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-900/80 border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif tracking-wide font-bold bg-gradient-to-r from-rose-200 via-rose-100 to-amber-200 bg-clip-text text-transparent">
              WedPlan
            </span>
            <span className="text-[10px] tracking-widest uppercase text-rose-400/80 -mt-1 font-mono">
              Luxury Weddings
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition hover:text-rose-400 ${
              pathname === "/" ? "text-rose-400 font-semibold" : "text-stone-300"
            }`}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={`transition hover:text-rose-400 ${
              pathname === "/services" ? "text-rose-400 font-semibold" : "text-stone-300"
            }`}
          >
            Browse Services
          </Link>
        </nav>

        {/* User Authentication Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 pr-2.5 rounded-full bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 transition group shadow-sm"
              >
                <div className="text-right">
                  <p className="text-xs font-medium text-stone-200 leading-tight flex items-center gap-1 justify-end">
                    {user.name}
                    {user.subscriptionPlan === "premium" && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                  </p>
                  <p className="text-[10px] text-rose-400 capitalize font-mono leading-none mt-0.5">
                    {user.role}
                  </p>
                </div>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-600/30 text-rose-300 flex items-center justify-center font-medium ring-1 ring-rose-500/30 text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-200 transition" />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-50 text-sm animate-fade-in divide-y divide-stone-800/60"
                >
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-stone-400">Signed in as</p>
                    <p className="text-sm font-medium text-stone-200 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800/70 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-rose-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800/70 transition"
                    >
                      <Settings className="w-4 h-4 text-rose-400" />
                      Profile Settings
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm text-stone-300 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-rose-950/30 hover:shadow-rose-900/40 transition hover:scale-[1.02]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-200 hover:text-rose-400"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-200 hover:text-rose-400"
          >
            Browse Services
          </Link>

          {user ? (
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <div className="flex items-center gap-3 py-2">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-stone-100">{user.name}</p>
                  <p className="text-xs text-rose-400 capitalize">{user.role}</p>
                </div>
              </div>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-stone-300 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-stone-300 hover:text-white"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="block w-full text-left py-2 text-rose-400"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-lg border border-stone-700 text-stone-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-lg bg-rose-600 text-white font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
