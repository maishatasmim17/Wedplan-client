import React, { Suspense } from "react";
import BrowseServicesClient from "./BrowseServicesClient";

export const metadata = {
  title: "Browse Wedding Services — WedPlan",
  description: "Search and filter through luxury wedding venues, photography, catering, florists, and fashion designers."
};

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-400">Loading wedding services catalog...</p>
      </div>
    }>
      <BrowseServicesClient />
    </Suspense>
  );
}
