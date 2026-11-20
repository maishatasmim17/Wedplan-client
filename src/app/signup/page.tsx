"use client";

import React, { Suspense } from "react";
import SignUpClient from "./SignUpClient";

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignUpClient />
    </Suspense>
  );
}
