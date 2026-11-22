"use client";

import React, { Suspense } from "react";
import PaymentCancelClient from "./PaymentCancelClient";

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-stone-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentCancelClient />
    </Suspense>
  );
}
