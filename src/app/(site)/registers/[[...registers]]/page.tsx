"use client";

import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex min-h-screen bg-home-two-price items-center justify-center bg-slate-50 p-4">
      <SignIn fallbackRedirectUrl="/dashboard" />
    </div>
  );
};

export default page;
