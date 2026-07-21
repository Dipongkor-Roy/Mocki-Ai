"use client";

import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex min-h-screen bg-home-two-price items-center justify-center bg-slate-50 p-4">
      <SignUp
        fallbackRedirectUrl="/dashboard?login=success"
        appearance={{ elements: { footer: { display: "none" } } }}
      />
    </div>
  );
};

export default page;
