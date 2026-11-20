"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, SlidersHorizontal, MapPin, RefreshCcw, Sparkles } from "lucide-react";
import ServiceCard, { ServiceCardProps } from "@/components/ServiceCard";
import { API_BASE_URL } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion"
];

export default function BrowseServicesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [services, setServices] = useState<ServiceCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, sort]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedCategory && selectedCategory !== "All") params.append("category", selectedCategory);
      if (location.trim()) params.append("location", location.trim());
      if (sort === "price_asc") params.append("sort", "price_asc");
      if (sort === "price_desc") params.append("sort", "price_desc");

      const res = await fetch(`${API_BASE_URL}/services?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.services) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("All");
    setLocation("");
    setSort("newest");
    setTimeout(() => {
      fetch(`${API_BASE_URL}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data.services || []));
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 mb-2">
          <Sparkles className="w-4 h-4" />
          The Wedding Directory
        </div>
        <h1 className="text-4xl font-serif font-bold text-stone-100 mb-4">
          Explore Wedding Services
        </h1>
        <p className="text-stone-400 text-sm sm:text-base">
          Browse verified wedding venues, photography, floral designers, caterers, and artists.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search service name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-800 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Filter by city or location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-800 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          {/* Sort By Price */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-800 rounded-xl text-sm text-stone-200 focus:outline-none focus:border-rose-500 transition appearance-none cursor-pointer"
            >
              <option value="newest">Sort by: Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Submit & Reset Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-rose-950/40"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
              title="Reset Filters"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/80">
          <span className="text-xs text-stone-500 font-mono uppercase tracking-wider mr-2">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-rose-600 text-white shadow-md shadow-rose-950/40"
                  : "bg-stone-800/70 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-700/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid or Loading / Empty States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-stone-900/40 animate-pulse border border-stone-800" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="space-y-6">
          <p className="text-xs text-stone-400 font-mono">
            Showing <span className="text-rose-400 font-bold">{services.length}</span> verified wedding services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800/80 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-200 mb-2">No Services Found</h3>
          <p className="text-sm text-stone-400 mb-6">
            We couldn't find any approved services matching your filter criteria. Try adjusting your search query or reset the filters.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full text-xs font-semibold transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
