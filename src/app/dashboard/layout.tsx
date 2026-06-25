"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/shared/context/AppContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Receipt,
  GitFork,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  Link2,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state, logout, switchWorkspace, isInitialized } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  // Authentication guard
  useEffect(() => {
    if (isInitialized && !state.token) {
      router.push("/auth/login");
    }
  }, [isInitialized, state.token, router]);

  if (!isInitialized || !state.token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 text-neutral-400 animate-spin mb-4" />
        <p className="text-sm text-neutral-400">Verifying session details...</p>
      </div>
    );
  }

  const activeWorkspace = state.workspaces.find((ws) => ws.id === state.activeWorkspaceId);
  const userRole = state.user?.role || "brand";

  const navigationItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
    { name: "Split Payments", href: "/dashboard/splits", icon: GitFork },
    { name: "Team Settings", href: "/dashboard/team", icon: Users },
    ...(userRole !== "talent"
      ? [{ name: "Integrations", href: "/dashboard/integrations", icon: Link2 }]
      : []),
  ];

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans select-none font-medium">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-[#3a3a3a] bg-black p-6 lg:flex flex-col">
        <div className="mb-8 pl-1">
          <Link href="/dashboard" className="inline-block">
            <Image
              src="/agncypaybrand.png"
              alt="AgncyPay Logo"
              width={220}
              height={55}
              priority
              className="h-[52px] w-auto object-contain object-left scale-[1.3] origin-left"
            />
          </Link>
        </div>

        {/* Workspace Switcher */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#3a3a3a] bg-white/[0.02] px-3.5 py-2.5 text-left text-xs font-semibold text-white transition-all hover:bg-white/[0.05] focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10 text-neutral-300">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{activeWorkspace?.name || "Workspace"}</span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
          </button>

          {showWorkspaceDropdown && (
            <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-lg border border-[#3a3a3a] bg-[#0E0E0E] p-1.5 shadow-2xl">
              {state.workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setShowWorkspaceDropdown(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold transition-all hover:bg-white/[0.04] cursor-pointer ${
                    ws.id === state.activeWorkspaceId ? "text-white bg-white/[0.03]" : "text-neutral-400"
                  }`}
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.id === state.activeWorkspaceId && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all hover:text-white ${
                  isActive
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "text-neutral-400 hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="mt-auto border-t border-[#3a3a3a] pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold text-xs">
              {state.user?.fullName.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">{state.user?.fullName}</span>
              <span className="text-[10px] font-semibold text-neutral-500 capitalize truncate">
                {state.user?.role} Role
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start py-2.5 px-3 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="text-xs font-bold">Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden bg-black select-text">
        {/* Header (Mobile nav indicator & page title) */}
        <header className="flex h-16 w-full items-center justify-between border-b border-[#3a3a3a] bg-black px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="block text-neutral-400 hover:text-white lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-bold tracking-tight text-white capitalize">
              {pathname.split("/").pop() || "Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-[#3a3a3a] bg-white/[0.02] px-3.5 py-1 text-[11px] font-bold sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              API Connected
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Slide-over */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <div className="relative flex w-[280px] max-w-sm flex-col bg-black border-r border-[#3a3a3a] p-6 text-white z-10 animate-in slide-in-from-left duration-300 font-medium">
            <div className="flex items-center justify-between mb-8">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/agncypaybrand.png"
                  alt="AgncyPay Logo"
                  width={160}
                  height={40}
                  className="h-[38px] w-auto object-contain scale-[1.1] origin-left"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sidebar Nav */}
            <nav className="space-y-1.5 flex-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Footer */}
            <div className="mt-auto border-t border-[#3a3a3a] pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-3 px-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold text-xs">
                  {state.user?.fullName.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-white truncate">{state.user?.fullName}</span>
                  <span className="text-[10px] font-semibold text-neutral-500 capitalize">
                    {state.user?.role}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full justify-start py-2.5 px-3"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold">Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
