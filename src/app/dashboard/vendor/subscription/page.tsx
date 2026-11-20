"use client";

import React, { Suspense } from "react";
import VendorSubscriptionClient from "./VendorSubscriptionClient";

export default function VendorSubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-400 text-xs">Loading membership plans...</p>
      </div>
    }>
      <VendorSubscriptionClient />
    </Suspense>
  );
}
