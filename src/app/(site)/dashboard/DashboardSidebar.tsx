"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  History,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "Reports", icon: History },
];

const logo = "/images/logo/logo.png";

interface DashboardSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export default function DashboardSidebar({
  collapsed,
  onCollapsedChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userBtnWrapRef = useRef<HTMLDivElement>(null);

  const openUserMenu = () => {
    userBtnWrapRef.current?.querySelector<HTMLButtonElement>("button")?.click();
  };

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname?.startsWith(href);

  const displayName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "User";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="logo" width={32} height={28} priority />
          <span className="text-sm font-bold text-gray-900">MockAI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-gray-100 bg-white transition-all duration-200 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${collapsed ? "lg:w-[88px]" : "lg:w-[280px]"} w-[280px]`}
      >
        {/* Logo row */}
        <div
          className={`flex items-center gap-2 border-b border-gray-100 px-3 py-4 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          <Link
            href="/"
            className={`flex min-w-0 items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg">
              <Image
                src={logo}
                alt="logo"
                width={45}
                height={40}
                priority
                className="light-logo"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="truncate text-base font-bold text-gray-900">
                  MockAI
                </p>
                <p className="truncate text-xs text-gray-400">
                  Interview Platform
                </p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-50 lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden border-b border-gray-100 px-3 py-2 lg:block">
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className={`flex w-full items-center gap-2 rounded-lg py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 ${
              collapsed ? "justify-center" : "px-3"
            }`}
          >
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <ChevronsLeft size={16} />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Main
            </p>
          )}
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3.5 rounded-lg px-3 py-3.5 text-base font-medium transition-all
                ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={22} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user */}
        <button
          type="button"
          onClick={openUserMenu}
          className={`mb-3 flex items-center gap-2.5 border-t border-gray-100 px-3 pt-3.5 pb-2 text-left hover:bg-gray-50 ${collapsed ? "justify-center" : ""}`}
        >
          <div
            ref={userBtnWrapRef}
            className="h-10 flex items-center flex-shrink-0 pointer-events-none"
          >
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: 41,
                    height: 40,
                  },
                  userButtonPopoverFooter: {
                    display: "none",
                  },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Dashboard"
                  labelIcon={<LayoutDashboard size={16} />}
                  href="/dashboard"
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-gray-800">
                {displayName}
              </p>
              <p className="truncate text-xs text-gray-400">{email}</p>
            </div>
          )}
        </button>
      </aside>
    </>
  );
}
