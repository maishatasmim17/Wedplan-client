import React from "react";
import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Globe, Share2, MessageCircle, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand & Description */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-100">WedPlan</span>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed">
            WedPlan is your premier wedding planning platform connecting discerning couples with top-tier wedding venues, photographers, florists, caterers, and stylists.
          </p>
          <div className="flex items-center gap-3 pt-2 text-stone-400">
            <span className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer">
              <Globe className="w-4 h-4" />
            </span>
            <span className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer">
              <Share2 className="w-4 h-4" />
            </span>
            <span className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer">
              <MessageCircle className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-stone-100 font-serif font-semibold mb-4 text-base tracking-wide">
            Navigation Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-rose-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-rose-400 transition">
                Browse Wedding Services
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-rose-400 transition">
                Become a WedPlan Vendor
              </Link>
            </li>
            <li>
              <Link href="/signin" className="hover:text-rose-400 transition">
                Client Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Wedding Categories */}
        <div>
          <h3 className="text-stone-100 font-serif font-semibold mb-4 text-base tracking-wide">
            Wedding Categories
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/services?category=Photography%20%26%20Videography" className="hover:text-rose-400 transition">
                Photography & Videography
              </Link>
            </li>
            <li>
              <Link href="/services?category=Wedding%20Venues" className="hover:text-rose-400 transition">
                Wedding Venues & Palaces
              </Link>
            </li>
            <li>
              <Link href="/services?category=Decoration%20%26%20Florist" className="hover:text-rose-400 transition">
                Decoration & Florists
              </Link>
            </li>
            <li>
              <Link href="/services?category=Catering%20Services" className="hover:text-rose-400 transition">
                Catering & Fine Dining
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-stone-100 font-serif font-semibold mb-4 text-base tracking-wide">
            Contact Information
          </h3>
          <p className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-rose-400 shrink-0" />
            <span>concierge@wedplan.com</span>
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-rose-400 shrink-0" />
            <span>+1 (800) 555-WEDPLAN</span>
          </p>
          <p className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>540 Madison Ave, New York, NY 10022</span>
          </p>
          <div className="mt-4 pt-4 border-t border-stone-800/60 flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified 256-Bit SSL Secured Platform</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© {new Date().getFullYear()} WedPlan Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-stone-400 cursor-pointer">Security Standards</span>
        </div>
      </div>
    </footer>
  );
}
