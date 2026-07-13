"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const login = searchParams.get("login");
    if (!login) return;

    if (login === "welcome") {
      toast.success("Welcome to Mocki AI! Let's get your first interview set up.");
    } else if (login === "success") {
      toast.success("Signed in successfully!");
    }

    const params = new URLSearchParams(searchParams);
    params.delete("login");
    const query = params.toString();
    router.replace(query ? `/dashboard?${query}` : "/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
