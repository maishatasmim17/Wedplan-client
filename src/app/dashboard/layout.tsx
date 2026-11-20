"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  CalendarCheck, 
  Sparkles, 
  UserCheck, 
  Users, 
  CreditCard,
  Settings,
  HeartHandshake
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Define navigation items per role
  const vendorNav = [
    { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "My Services", href: "/dashboard/vendor/services", icon: Layers },
    { name: "Add Service", href: "/dashboard/vendor/add-service", icon: PlusCircle },
    { name: "Booking Requests", href: "/dashboard/vendor/bookings", icon: CalendarCheck },
    { name: "Subscription", href: "/dashboard/vendor/subscription", icon: Sparkles },
    { name: "Profile Settings", href: "/profile", icon: Settings },
  ];

  const customerNav = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
    { name: "Profile Settings", href: "/profile", icon: Settings },
  ];

  const adminNav = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Services", href: "/dashboard/admin/services", icon: Layers },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { name: "Profile Settings", href: "/profile", icon: Settings },
  ];

  let currentNav = customerNav;
  let roleTitle = "Customer Portal";
  if (user.role === "vendor") {
    currentNav = vendorNav;
    roleTitle = "Vendor Studio";
  } else if (user.role === "admin") {
    currentNav = adminNav;
    roleTitle = "Admin Console";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 pb-6 border-b border-stone-800">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-rose-900/80 text-rose-200 flex items-center justify-center font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold text-stone-100 truncate">{user.name}</h3>
                <span className="text-[11px] font-mono uppercase text-rose-400 block tracking-wider">
                  {roleTitle}
                </span>
                {user.role === "vendor" && (
                  <span className="text-[10px] px-2 py-0.5 mt-1 inline-block rounded-full bg-stone-800 text-stone-300 capitalize border border-stone-700">
                    Plan: {user.subscriptionPlan || "free"}
                  </span>
                )}
              </div>
            </div>

            <nav className="mt-6 space-y-1.5">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-rose-600 text-white shadow-md shadow-rose-950/40"
                        : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
