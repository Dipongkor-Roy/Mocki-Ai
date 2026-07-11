"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen">
      <DashboardSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div
        className={`relative min-h-screen transition-[padding] duration-200 ease-in-out ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[240px]"
        }`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-100 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
        </div>
        <main className="flex-1 py-8 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
