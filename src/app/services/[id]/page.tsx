"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle,
  Building2,
  Mail
} from "lucide-react";
import Link from "next/link";

interface ServiceDetail {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isActive: boolean;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    businessName?: string;
    image?: string;
    subscriptionPlan?: string;
  };
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`${API_BASE_URL}/services/${id}`);
        const data = await res.json();
        if (data.success && data.service) {
          setService(data.service);
          setSelectedImage(data.service.images?.[0] || "");
        } else {
          setError(data.message || "Failed to load wedding service details");
        }
      } catch (err) {
        setError("Network error while loading service details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadService();
    }
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Access Rule: Customers must be authenticated to submit booking requests
    if (!user || !token) {
      showToast("Please sign in to submit a booking request", "error");
      router.push(`/signin?redirect=/services/${id}`);
      return;
    }

    // Rule: Admins cannot submit customer booking requests
    if (user.role === "admin") {
      showToast("Admin accounts cannot submit customer booking requests", "error");
      return;
    }

    // Rule: Vendors cannot book services (or their own services)
    if (user.role === "vendor") {
      showToast("Vendors cannot submit booking requests. Please use a customer account.", "error");
      return;
    }

    if (!eventDate || !eventLocation) {
      showToast("Please provide both event date and event location", "error");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: service?._id,
          eventDate,
          eventLocation,
          message
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Booking request failed", "error");
        return;
      }

      showToast("Booking request successfully submitted to vendor!", "success");
      setEventDate("");
      setEventLocation("");
      setMessage("");
      router.push("/dashboard/customer/bookings");
    } catch (err) {
      showToast("Error submitting booking request", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-400">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800">
          <h2 className="text-2xl font-serif font-bold text-stone-200 mb-2">Service Not Available</h2>
          <p className="text-stone-400 text-sm mb-6">{error || "The service ID provided is invalid or removed."}</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-rose-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wedding Services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Media Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Hero Image */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl">
            <img
              src={selectedImage || service.images[0]}
              alt={service.serviceName}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-xs font-semibold text-rose-300 border border-stone-700">
              {service.category}
            </span>
            {service.vendorId?.subscriptionPlan === "premium" && (
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/90 text-stone-950 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                Featured Vendor
              </span>
            )}
          </div>

          {/* Image Thumbnails */}
          {service.images && service.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {service.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition ${
                    (selectedImage || service.images[0]) === img
                      ? "border-rose-500 ring-2 ring-rose-500/40"
                      : "border-stone-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Service Title & Info */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                {service.serviceName}
              </h1>
              <div className="text-right">
                <p className="text-xs text-stone-400 font-mono uppercase">Package Fee</p>
                <p className="text-3xl font-serif font-bold text-rose-400">
                  ${service.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-stone-400 text-sm">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{service.location}</span>
            </div>

            {/* Description */}
            <div className="pt-6 space-y-3">
              <h3 className="text-lg font-serif font-semibold text-stone-200">About This Service</h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Vendor Profile Card */}
            <div className="mt-8 p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {service.vendorId?.image ? (
                  <img
                    src={service.vendorId.image}
                    alt={service.vendorId.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/50"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-rose-900 text-white flex items-center justify-center font-bold text-xl">
                    {service.vendorId?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-semibold text-stone-100">
                    {service.vendorId?.businessName || service.vendorId?.name}
                  </h4>
                  <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-stone-500" />
                    Verified WedPlan Professional
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Identity Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Request Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
                Reserve Your Date
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-100 mt-1">
                Request a Booking
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Submit an inquiry to check availability and lock in your wedding date.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                  Wedding / Event Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                  Event Location / Venue Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Glasshouse, Manhattan NY"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase font-mono tracking-wider">
                  Special Notes / Guest Count
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Tell the vendor about your wedding theme, schedule, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-rose-500 transition resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-semibold text-sm shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {bookingLoading ? "Submitting Request..." : "Submit Booking Request"}
              </button>
            </form>

            <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 space-y-2">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                No immediate payment required
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Direct vendor response & coordination
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Cancel pending requests at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
