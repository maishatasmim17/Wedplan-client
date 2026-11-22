"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Camera, 
  Building2, 
  Flower2, 
  UtensilsCrossed, 
  Palette, 
  Shirt,
  CheckCircle2,
  Users,
  Star
} from "lucide-react";
import ServiceCard, { ServiceCardProps } from "@/components/ServiceCard";
import { API_BASE_URL } from "@/lib/utils";

const CATEGORIES = [
  { name: "Photography & Videography", icon: Camera, count: "120+ Studios", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80" },
  { name: "Wedding Venues", icon: Building2, count: "85+ Estates", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
  { name: "Decoration & Florist", icon: Flower2, count: "90+ Florists", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80" },
  { name: "Catering Services", icon: UtensilsCrossed, count: "70+ Chefs", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80" },
  { name: "Makeup & Styling", icon: Palette, count: "110+ Artists", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
  { name: "Wedding Fashion", icon: Shirt, count: "65+ Designers", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80" }
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<ServiceCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch(`${API_BASE_URL}/services/featured`);
        const data = await res.json();
        if (data.success && data.services) {
          setFeaturedServices(data.services);
        }
      } catch (err) {
        console.error("Failed to load featured services", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* 1. Banner Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(12, 10, 9, 0.75), rgba(12, 10, 9, 0.95)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')`
        }}
      >
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-950/80 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Curated High-End Wedding Experiences
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6"
          >
            Crafting Unforgettable Moments for Your{" "}
            <span className="bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200 bg-clip-text text-transparent italic">
              Dream Wedding
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-stone-200 leading-relaxed mb-10"
          >
            Explore elite wedding venues, award-winning photographers, bespoke floral artisans, and haute couture designers. Book with verified trust and complete peace of mind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-rose-950/50 flex items-center justify-center gap-3 transition-all hover:scale-105"
            >
              Explore Wedding Services
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/signup?role=vendor"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-100 font-semibold text-sm sm:text-base border border-stone-700/70 backdrop-blur-md transition-all hover:scale-105"
            >
              Join as a Wedding Vendor
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Dynamic Section 1: Featured Wedding Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2 font-bold">
              <Sparkles className="w-4 h-4" />
              Handpicked Masterpieces
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Featured Wedding Services
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-stone-200 dark:bg-stone-900/50 animate-pulse border border-stone-300 dark:border-stone-800" />
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800">
            <p className="text-stone-600 dark:text-stone-400">Services are loading. Please check back shortly.</p>
          </div>
        )}
      </section>

      {/* 3. Dynamic Section 2: Wedding Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2 font-bold">
            <Heart className="w-4 h-4" />
            Diverse Wedding Offerings
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
            Wedding Service Categories
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-medium">
            Every element of your special day, handled by industry-certified wedding professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-64 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800/80 shadow-lg hover:border-rose-500/50 transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-600/90 backdrop-blur-md flex items-center justify-center text-white mb-3 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-rose-200 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-mono mt-0.5">{cat.count}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-900/80 text-white flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Required Section: Why Choose WedPlan? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-stone-900/90 dark:to-stone-950 p-8 sm:p-14 border border-stone-200 dark:border-stone-800 shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
              Why Choose WedPlan?
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-medium">
              The modern standard for couple happiness and vendor collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
                100% Verified Vendors
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Every service catalog and vendor profile is rigorously vetted and reviewed by our administrative team before approval.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Effortless Booking Workflow
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Submit requests for your desired date and location without payment friction. Receive direct updates, confirmation, and track statuses seamlessly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Transparent Pricing
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Clear package fees, high-resolution media galleries, and direct communication ensure no surprise costs on your wedding day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Additional Section: Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2 font-bold">
            <Star className="w-4 h-4 fill-rose-600 dark:fill-rose-400" />
            Love Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
            Customer Testimonials
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-medium">
            Hear from happy couples who planned their dream celebrations with WedPlan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "Finding our photographer and floral stylist through WedPlan was effortless! The vendor response was immediate and the quality exceeded all expectations."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/80">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Claire M."
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/30"
              />
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Claire & Thomas</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Married in Newport, RI</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "As a bride planning from overseas, WedPlan gave me total confidence. The venue virtual tour and transparent pricing saved us countless hours."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/80">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Marcus D."
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/30"
              />
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">David & Priya</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Married in Miami, FL</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                "WedPlan made our destination wedding seamless. We managed catering, music, and bridal glam in one unified dashboard!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/80">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Elena S."
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/30"
              />
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Elena & Jonathan</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Married in Aspen, CO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-rose-900/40 via-stone-900 to-amber-950/30 border border-rose-500/20 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Ready to Plan Your Perfect Wedding?
          </h2>
          <p className="text-stone-200 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Join thousands of couples creating timeless memories. Browse verified services or register your wedding business today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition hover:scale-105"
            >
              Browse All Services
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm transition hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
