"use client";

import React, { Suspense } from "react";
import DemoCheckoutClient from "./DemoCheckoutClient";

export default function DemoCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-400 text-xs mt-3">Loading secure checkout...</p>
        </div>
      }
    >
      <DemoCheckoutClient />
    </Suspense>
  );
}
