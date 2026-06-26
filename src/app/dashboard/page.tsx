"use client";

import React, { useState, useEffect, useCallback, startTransition } from "react";
import { useApp } from "@/shared/context/AppContext";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  EllipsisVertical,
  GripVertical,
  Loader2,
  Play,
  Plug,
  Plus,
  Search,
  Send,
  Settings,
  Unplug,
  Users,
  Lock,
  Building2,
  Check,
  X,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";

// Isolated dashboard components
import { RecentIncomeCard } from "@/features/dashboard/components/RecentIncomeCard";
import { RecentPayoutsCard } from "@/features/dashboard/components/RecentPayoutsCard";
import { RecentVendorsCard } from "@/features/dashboard/components/RecentVendorsCard";
import { RecentInvoicesCard } from "@/features/dashboard/components/RecentInvoicesCard";
import { RequestAnalytics } from "@/features/dashboard/components/RequestAnalytics";
import { PlaidConnector } from "@/features/dashboard/components/PlaidConnector";

const BOFA_BUSINESS_DEBIT_VISA_IMAGE =
  "https://business.bankofamerica.com/content/dam/consumer/business/deposits/checking-accounts/debit-cards/bofa_busdbtcm_v.png";
const CHASE_INK_BUSINESS_UNLIMITED_IMAGE = "/chase-ink-business-unlimited.png";
const MERCURY_IO_CARD_IMAGE = "/mercurycard.png";

type RemoteBrandImageProps = {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
  imageClassName?: string;
};

function RemoteBrandImage({ src, alt, fallback, className, imageClassName }: RemoteBrandImageProps) {
  const [failed, setFailed] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center rounded-[inherit] border border-[#3f3f3f] bg-white px-1 text-center text-[10px] font-semibold leading-[1.05] text-black">
          <span className="block max-w-full truncate">{fallback}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-contain", imageClassName)}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      )}
    </div>
  );
}

const quickActions = [
  { label: "Send / Request", icon: Send, href: "/dashboard/invoices" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard" },
  { label: "Wallet ID contacts", icon: Users, href: "/dashboard/team" },
  { label: "More", icon: EllipsisVertical, href: "/dashboard" },
] as const;

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-[#3a3a3a] bg-[#0D0D0D] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_24px_-4px_rgba(0,0,0,0.6)]", className)}>
      {children}
    </section>
  );
}

function BrandTile({
  label,
  href,
  src,
  fallback,
  tileClassName,
  imageClassName,
  search,
}: {
  label: string;
  href?: string;
  src?: string;
  fallback: string;
  tileClassName?: string;
  imageClassName?: string;
  search?: boolean;
}) {
  const Component = href ? Link : "button";
  return (
    <Component
      href={href as string}
      className="flex min-w-0 flex-col items-center gap-2 text-center"
      aria-label={label}
    >
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[12px] border border-[#3a3a3a] bg-[#060606] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        {search ? (
          <div className={cn("flex h-full w-full items-center justify-center overflow-hidden rounded-[9px]", tileClassName)}>
            <Search className="h-6 w-6 text-black" />
          </div>
        ) : src ? (
          <div className={cn("h-full w-full overflow-hidden rounded-[9px]", tileClassName)}>
            <RemoteBrandImage
              src={src}
              alt={label}
              fallback={fallback}
              className="h-full w-full"
              imageClassName={cn("object-contain", imageClassName)}
            />
          </div>
        ) : (
          <div className={cn("flex h-full w-full items-center justify-center overflow-hidden rounded-[9px]", tileClassName)}>
            <span className={cn("text-[12px] font-semibold", fallback === "N/A" ? "text-[#555]" : "text-black")}>{fallback}</span>
          </div>
        )}
      </div>
      <span className={cn("max-w-[78px] text-[12px] leading-4", label === "N/A" ? "text-[#555]" : "text-[#b8b8b8]")}>{label}</span>
    </Component>
  );
}

function BankCardFace({ card }: { card: any }) {
  return (
    <div className="relative h-16 w-[104px] shrink-0 overflow-hidden rounded-[8px] bg-black">
      <RemoteBrandImage
        src={card.cardImage}
        alt={card.name}
        fallback={card.fallback}
        className="h-full w-full rounded-[inherit] bg-black"
        imageClassName="h-full w-full object-cover"
      />
    </div>
  );
}

function IntegrationsShortcutsPanel({
  connectedIntegrations,
  onAddClick,
}: {
  connectedIntegrations: string[];
  onAddClick: () => void;
}) {
  const masterIntegrations = [
    { label: "QuickBooks", src: "/quickbook.png", href: "/dashboard/quickbooks" },
    { label: "Mercury", src: "/mercuryLogo.png", href: "/dashboard", bg: "bg-white" },
    { label: "Xero", src: "/xero.png", href: "/dashboard" },
    { label: "Sage", src: "/sage.png", href: "/dashboard" },
    { label: "NetSuite", src: "/netsuite.png", href: "/dashboard" },
  ];

  const connected = masterIntegrations.filter((item) => connectedIntegrations.includes(item.label));
  
  const gridItems: any[] = [];
  
  connected.forEach((item) => {
    gridItems.push({ type: "connected", ...item });
  });

  if (gridItems.length < 5) {
    gridItems.push({ type: "add" });
  }

  while (gridItems.length < 5) {
    gridItems.push({ type: "na" });
  }

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[14px] font-semibold text-white">Integrations</h2>
          <p className="mt-1 text-[11px] text-[#8f8f8f]">
            Connect external systems and services to sync data automatically.
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-3">
        {gridItems.map((item, idx) => {
          if (item.type === "na") {
            return (
              <div key={`na-${idx}`} className="flex min-w-0 flex-col items-center gap-2 text-center">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[12px] border border-[#3a3a3a] bg-[#060606] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                  <span className="text-[12px] font-semibold text-[#555]">N/A</span>
                </div>
                <span className="max-w-[78px] text-[12px] leading-4 text-[#555]">N/A</span>
              </div>
            );
          }

          if (item.type === "add") {
            return (
              <button
                key="add-btn"
                type="button"
                onClick={onAddClick}
                className="flex min-w-0 flex-col items-center gap-2 text-center group cursor-pointer"
                aria-label="Add Integration"
              >
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[12px] border border-dashed border-[#3a3a3a] bg-black text-[#555] transition-all group-hover:border-[#888] group-hover:text-white">
                  <span className="text-[28px] font-light leading-none">+</span>
                </div>
                <span className="max-w-[78px] text-[12px] leading-4 text-[#555] group-hover:text-white transition-colors">Connect</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex min-w-0 flex-col items-center gap-2 text-center group"
              aria-label={item.label}
            >
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[12px] border border-[#3a3a3a] bg-[#060606] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors group-hover:border-[#555]">
                <div className={cn("h-full w-full overflow-hidden rounded-[9px] flex items-center justify-center", item.bg || "bg-transparent")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.label}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
              <span className="max-w-[78px] text-[12px] leading-4 text-[#b8b8b8] group-hover:text-white transition-colors">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

function QuickBooksOnlinePanel({
  connected,
  invoices,
  loading,
  disconnecting,
  onDisconnect,
}: {
  connected: boolean;
  invoices: any[];
  loading: boolean;
  disconnecting: boolean;
  onDisconnect: () => Promise<void>;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setShowConfirm(false);
  }, [connected]);

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-transparent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/quickbook.png" alt="QuickBooks" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-[14px] font-semibold text-white">QuickBooks Online</h2>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-[#3a3a3a] bg-[#111] px-3 text-[11px] font-semibold text-[#8f8f8f]">
              <Loader2 className="h-3 w-3 animate-spin" />
              Checking
            </span>
          ) : connected ? (
            <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 text-[11px] font-semibold text-green-500">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-[#3a3a3a] bg-[#1a1a1a] px-3 text-[11px] font-semibold text-[#777]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#555]" />
              Not Connected
            </span>
          )}
          <Link
            href="/dashboard/quickbooks"
            className="text-[12px] font-semibold text-[#8f8f8f] hover:text-white"
          >
            Settings
          </Link>
        </div>
      </div>

      <p className="mt-1 text-[11px] text-[#8f8f8f]">
        Sync invoices, payments, and vendors automatically to your QBO account.
      </p>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[#8f8f8f]" />
          </div>
        ) : showConfirm ? (
          /* Disconnect Confirmation State */
          <div className="flex flex-col items-center rounded-[10px] border border-red-500/20 bg-red-500/5 px-5 py-6 text-center animate-in fade-in duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-white">Disconnect QuickBooks?</h3>
            <p className="mt-1.5 max-w-[320px] text-[12px] leading-[18px] text-[#9b9b9b]">
              Are you sure you want to disconnect QuickBooks? This will stop syncing invoices and payouts immediately.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="inline-flex h-[32px] items-center rounded-[7px] border border-[#3a3a3a] bg-[#1a1a1a] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#2a2a2a] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDisconnect();
                  setShowConfirm(false);
                }}
                disabled={disconnecting}
                className="inline-flex h-[32px] items-center gap-1.5 rounded-[7px] border border-red-500 bg-red-500 px-4 text-[12px] font-semibold text-black transition-colors hover:bg-red-600 disabled:opacity-50 cursor-pointer"
              >
                {disconnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Unplug className="h-3 w-3" />}
                Yes, Disconnect
              </button>
            </div>
          </div>
        ) : !connected ? (
          /* Disconnected Empty State */
          <div className="flex flex-col items-center rounded-[10px] border border-dashed border-[#3a3a3a] bg-[#060606] px-5 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#111]">
              <Plug className="h-5 w-5 text-[#8f8f8f]" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-white">Connect QuickBooks</h3>
            <p className="mt-1.5 max-w-[320px] text-[11px] leading-[18px] text-[#7f7f7f]">
              Link your QuickBooks sandbox account to fetch live invoices, sync payments, and manage vendors directly from your dashboard.
            </p>
            <Link
              href="/api/auth/quickbooks/connect"
              className="mt-5 inline-flex h-[34px] items-center gap-2 rounded-[7px] border border-white bg-white px-4 text-[12px] font-semibold text-black transition-colors hover:bg-[#e8e8e8]"
            >
              <Plug className="h-3.5 w-3.5" />
              Connect Now
            </Link>
          </div>
        ) : invoices.length === 0 ? (
          /* Connected but no invoices */
          <div className="flex flex-col items-center rounded-[10px] border border-dashed border-[#3a3a3a] bg-[#060606] px-5 py-6 text-center">
            <p className="text-[13px] text-[#7f7f7f]">No invoices found in QuickBooks.</p>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={disconnecting}
              className="mt-3 inline-flex h-[30px] items-center gap-1.5 rounded-[6px] border border-red-500/20 bg-red-500/5 px-3 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
            >
              <Unplug className="h-3 w-3" />
              Disconnect
            </button>
          </div>
        ) : (
          /* Connected with invoices */
          <div className="space-y-2">
            {invoices.slice(0, 5).map((inv) => {
              const isOverdue = inv.daysText === "Overdue";
              const isPaid = inv.status === "Paid";
              const targetHref = isPaid
                ? `/receipt/${inv.id}?tx=TX-AP-QBO-${inv.id}&mode=logged_in&returnTo=dashboard`
                : `/dashboard/pay-flow/${inv.id}`;

              return (
                <Link
                  key={inv.id}
                  href={targetHref}
                  className="flex items-center gap-3 rounded-[8px] border border-[#3a3a3a] bg-black px-3 py-2 transition-colors hover:border-[#555] hover:bg-white/[0.04] cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-transparent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/quickbook.png" alt="QuickBooks" className="h-full w-full object-contain" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-white">{inv.name}</p>
                    <p className="truncate text-[11px] text-[#7f7f7f]">{inv.detail}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex h-[22px] items-center rounded-full border px-2.5 text-[10px] font-bold",
                        isPaid
                          ? "border-[#10b95f]/30 bg-[#082315] text-[#70ff9e]"
                          : isOverdue
                            ? "border-[#ff3b30]/30 bg-[#250706] text-[#ff9088]"
                            : "border-[#f59e0b]/30 bg-[#261a03] text-[#fbbf24]"
                      )}
                    >
                      {inv.status}
                    </span>

                    <span
                      className={cn(
                        "hidden text-[11px] sm:inline-block w-24 text-left",
                        isOverdue ? "text-[#ff9088]" : isPaid ? "text-[#70ff9e]" : "text-[#7f7f7f]"
                      )}
                    >
                      {inv.daysText}
                    </span>

                    <div className="min-w-[64px] text-right text-[13px] font-semibold text-white">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(inv.amount)}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Disconnect button below invoices */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="dashboard/income"
                className="text-[11px] font-semibold text-[#8f8f8f] hover:text-white"
              >
                View All Invoices →
              </Link>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={disconnecting}
                className="inline-flex h-[28px] items-center gap-1.5 rounded-[6px] border border-red-500/20 bg-red-500/5 px-2.5 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
              >
                <Unplug className="h-3 w-3" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

function WalletContactsOverlay({
  query,
  autosplitContactIds,
  onQueryChange,
  onClose,
  onToggleContact,
  onEnableAll,
}: {
  query: string;
  autosplitContactIds: string[];
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onToggleContact: (contactId: string) => void;
  onEnableAll: () => void;
}) {
  const walletContacts = [
    { id: "john-adams", name: "John Adams", handle: "@agncy11174" },
    { id: "amy-holland", name: "Amy Holland", handle: "@agncy66122" },
    { id: "lucy-che", name: "Lucy Che", handle: "@agncy88179" },
    { id: "jessica-bailey", name: "Jessica Bailey", handle: "@agncy67171" },
    { id: "lola-durant", name: "Lola Durant", handle: "@agncy72176" },
  ] as const;

  const normalized = query.trim().toLowerCase();
  const filteredContacts = normalized
    ? walletContacts.filter((contact) =>
        [contact.name, contact.handle].join(" ").toLowerCase().includes(normalized)
      )
    : walletContacts;

  return (
    <div className="fixed inset-0 z-40 bg-black/55 px-4 py-16 backdrop-blur-[1px] flex items-center justify-center">
      <div className="w-full max-w-[500px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8b8b]" />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name, Agncy ID, email, mobile"
            className="h-[52px] w-full rounded-full border border-[#3a3a3a] bg-[#0c0c0c] pl-14 pr-14 text-[14px] font-black text-white outline-none placeholder:text-[#a7a7a7]"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/[0.08] cursor-pointer"
            aria-label="Close wallet contacts"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 rounded-[7px] border border-[#3a3a3a] bg-black px-6 py-6">
          <p className="text-[14px] font-black text-white">Recent searches</p>
          <div className="mt-4 space-y-4">
            {filteredContacts.map((contact) => {
              const active = autosplitContactIds.includes(contact.id);
              return (
                <div key={contact.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-black text-white">{contact.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#9b9b9b]">{contact.handle}</p>
                  </div>
                  <button
                    onClick={() => onToggleContact(contact.id)}
                    className={cn(
                      "inline-flex h-8 items-center gap-2 rounded-full border px-2.5 text-[11px] font-black text-white cursor-pointer",
                      active ? "border-[#13e56d] bg-[#0d2b18]" : "border-[#3a3a3a] bg-black"
                    )}
                  >
                    {active ? "Autosplit On" : "Autosplit Off"}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="text-[13px] font-black text-[#22e03b] underline cursor-pointer"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={onEnableAll}
              className="h-10 rounded-[7px] border border-[#13e56d] bg-[#0d2b18] px-4 text-[13px] font-black text-white cursor-pointer"
            >
              Autosplit all talent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useApp();
  const user = state.user;
  const role = user?.role || "brand";
  const workspaceName = user?.fullName || "Acme Corp";

  // Metrics configurations
  const brandStats = [
    { label: "Total Payable", amount: "$142,380.00", change: "+12.5%", trend: "up" },
    { label: "Outstanding", amount: "$38,400.00", change: "-4.2%", trend: "down" },
    { label: "Settled (MTD)", amount: "$103,980.00", change: "+24.8%", trend: "up" },
    { label: "Available Credit", amount: "$250,000.00", change: "100%", trend: "neutral" },
  ];

  const agencyStats = [
    { label: "Net Ingested", amount: "$384,190.00", change: "+18.2%", trend: "up" },
    { label: "Split Disbursed", amount: "$310,400.00", change: "+21.4%", trend: "up" },
    { label: "Held in Escrow", amount: "$73,790.00", change: "+3.1%", trend: "up" },
    { label: "Active Talents", amount: "42 Creators", change: "+4 this month", trend: "up" },
  ];

  const talentStats = [
    { label: "Gross Earnings", amount: "$24,500.00", change: "+8.3%", trend: "up" },
    { label: "Pending Payout", amount: "$8,200.00", change: "2 Invoices", trend: "neutral" },
    { label: "Cleared & Paid", amount: "$16,300.00", change: "Direct Deposit", trend: "neutral" },
    { label: "Campaigns", amount: "6 Active", change: "+1 new booking", trend: "up" },
  ];

  const stats = role === "brand" ? brandStats : role === "agency" ? agencyStats : talentStats;

  // QBO and Modal states
  const [qboConnected, setQboConnected] = useState(false);
  const [qboInvoices, setQboInvoices] = useState<any[]>([]);
  const [qboPayouts, setQboPayouts] = useState<any[]>([]);
  const [qboVendors, setQboVendors] = useState<any[]>([]);
  const [qboLoading, setQboLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [isAddIntegrationModalOpen, setIsAddIntegrationModalOpen] = useState(false);
  const [addIntegrationModalStep, setAddIntegrationModalStep] = useState<"select" | "connecting" | "success">("select");
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [integrationLoadingText, setIntegrationLoadingText] = useState("");

  const [autosplitInvoiceIds, setAutosplitInvoiceIds] = useState<string[]>([]);
  const [autosplitContactIds, setAutosplitContactIds] = useState<string[]>([]);
  const [isAutosplitNoticeOpen, setIsAutosplitNoticeOpen] = useState(false);
  const [isWalletContactsOpen, setIsWalletContactsOpen] = useState(false);
  const [walletContactQuery, setWalletContactQuery] = useState("");

  const [linkedCards, setLinkedCards] = useState<any[]>([
    {
      name: "Chase Ink Business Unlimited Visa",
      detail: "Visa ****86",
      cardImage: CHASE_INK_BUSINESS_UNLIMITED_IMAGE,
      fallback: "Chase",
    },
    {
      name: "Mercury Business IO Mastercard",
      detail: "Mastercard ****57",
      cardImage: MERCURY_IO_CARD_IMAGE,
      fallback: "Mercury",
    },
    {
      name: "Bank of America Business Debit Visa",
      detail: "Debit ****88",
      cardImage: BOFA_BUSINESS_DEBIT_VISA_IMAGE,
      fallback: "Bank of America",
    },
    {
      name: "Mercury Debit Mastercard",
      detail: "Debit ****86",
      cardImage: MERCURY_IO_CARD_IMAGE,
      fallback: "Mercury",
    },
  ]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalStep, setLinkModalStep] = useState<
    "select" | "plaid_intro" | "plaid_banks" | "plaid_login" | "plaid_verifying" | "plaid_success" | "card_form" | "card_verifying" | "card_success"
  >("select");
  const [selectedBank, setSelectedBank] = useState("");
  const [plaidUsername, setPlaidUsername] = useState("");
  const [plaidPassword, setPlaidPassword] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [plaidErrors, setPlaidErrors] = useState<Record<string, string>>({});
  const [modalLoadingText, setModalLoadingText] = useState("");

  useEffect(() => {
    if (qboConnected) {
      setConnectedIntegrations((prev) => {
        if (prev.includes("QuickBooks")) return prev;
        return [...prev, "QuickBooks"];
      });
    } else {
      setConnectedIntegrations((prev) => prev.filter((item) => item !== "QuickBooks"));
    }
  }, [qboConnected]);

  const handleConnectIntegration = (integration: any) => {
    setSelectedIntegration(integration);
    
    if (integration.label === "QuickBooks") {
      window.location.href = "/api/auth/quickbooks/connect";
      return;
    }

    setAddIntegrationModalStep("connecting");
    setIntegrationLoadingText("Establishing secure connection with " + integration.label + "...");

    setTimeout(() => {
      setIntegrationLoadingText("Authorizing data scopes & sync intervals...");
      setTimeout(() => {
        setIntegrationLoadingText("Importing integration profiles...");
        setTimeout(() => {
          setConnectedIntegrations((prev) => {
            if (prev.includes(integration.label)) return prev;
            return [...prev, integration.label];
          });
          setAddIntegrationModalStep("success");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/quickbooks/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setQboConnected(data.connected);
        if (data.connected) {
          const [invRes, payRes, vendRes] = await Promise.all([
            fetch("/api/quickbooks/invoices", { cache: "no-store" }),
            fetch("/api/quickbooks/payouts", { cache: "no-store" }),
            fetch("/api/quickbooks/vendors", { cache: "no-store" }),
          ]);
          if (invRes.ok) {
            const invData = await invRes.json();
            setQboInvoices(invData.invoices || []);
          }
          if (payRes.ok) {
            const payData = await payRes.json();
            setQboPayouts(payData.payouts || []);
          }
          if (vendRes.ok) {
            const vendData = await vendRes.json();
            setQboVendors(vendData.vendors || []);
          }
        } else {
          setQboInvoices([]);
          setQboPayouts([]);
          setQboVendors([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch QuickBooks status:", err);
    } finally {
      setQboLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch("/api/quickbooks/disconnect", { method: "POST" });
      if (res.ok) {
        setQboConnected(false);
        setQboInvoices([]);
        setQboPayouts([]);
        setQboVendors([]);
      }
    } catch (err) {
      console.error("Failed to disconnect QuickBooks:", err);
    } finally {
      setDisconnecting(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const resetLinkModal = () => {
    setLinkModalStep("select");
    setSelectedBank("");
    setPlaidUsername("");
    setPlaidPassword("");
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVC("");
    setCardZip("");
    setCardErrors({});
    setPlaidErrors({});
    setModalLoadingText("");
  };

  const handlePlaidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!plaidUsername.trim()) errors.username = "Username is required";
    if (!plaidPassword.trim()) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setPlaidErrors(errors);
      return;
    }

    setPlaidErrors({});
    setLinkModalStep("plaid_verifying");
    setModalLoadingText("Connecting to " + selectedBank + "...");

    setTimeout(() => {
      setModalLoadingText("Verifying credentials...");
      setTimeout(() => {
        setModalLoadingText("Importing checking account details...");
        setTimeout(() => {
          const newBank = {
            name: `${selectedBank} Business Account`,
            detail: `Checking ****${Math.floor(1000 + Math.random() * 9000)}`,
            cardImage: selectedBank === "Chase" ? CHASE_INK_BUSINESS_UNLIMITED_IMAGE : (selectedBank === "Mercury" ? MERCURY_IO_CARD_IMAGE : BOFA_BUSINESS_DEBIT_VISA_IMAGE),
            fallback: selectedBank,
          };
          setLinkedCards((prev) => [newBank, ...prev]);
          setLinkModalStep("plaid_success");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!cardHolder.trim()) errors.holder = "Cardholder name is required";
    
    const cleanNum = cardNumber.replace(/\s+/g, "");
    if (!cleanNum) {
      errors.number = "Card number is required";
    } else if (cleanNum.length < 15 || cleanNum.length > 16 || !/^\d+$/.test(cleanNum)) {
      errors.number = "Invalid card number (15-16 digits)";
    }

    if (!cardExpiry.trim()) {
      errors.expiry = "Expiration is required";
    } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardExpiry)) {
      errors.expiry = "MM/YY format required";
    }

    if (!cardCVC.trim()) {
      errors.cvc = "CVC is required";
    } else if (cardCVC.length < 3 || cardCVC.length > 4 || !/^\d+$/.test(cardCVC)) {
      errors.cvc = "Invalid CVC (3-4 digits)";
    }

    if (!cardZip.trim()) {
      errors.zip = "ZIP code is required";
    } else if (cardZip.length < 5 || !/^\d+$/.test(cardZip)) {
      errors.zip = "Invalid ZIP";
    }

    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      return;
    }

    setCardErrors({});
    setLinkModalStep("card_verifying");
    setModalLoadingText("Authorizing credit/debit card details...");

    setTimeout(() => {
      setModalLoadingText("Securing tokens with payment gateway...");
      setTimeout(() => {
        const cardBrand = cleanNum.startsWith("4") ? "Visa" : (cleanNum.startsWith("5") ? "Mastercard" : "Amex");
        const newCard = {
          name: `${cardHolder}'s ${cardBrand}`,
          detail: `${cardBrand} ****${cleanNum.slice(-4)}`,
          cardImage: MERCURY_IO_CARD_IMAGE,
          fallback: cardBrand,
        };
        setLinkedCards((prev) => [newCard, ...prev]);
        setLinkModalStep("card_success");
      }, 1000);
    }, 1000);
  };

  const toggleAutosplitContact = (contactId: string) => {
    const isActive = autosplitContactIds.includes(contactId);
    if (!isActive) setIsAutosplitNoticeOpen(true);
    setAutosplitContactIds((current) =>
      isActive ? current.filter((id) => id !== contactId) : [...current, contactId]
    );
  };

  const enableAllContactAutosplit = () => {
    const walletContacts = ["john-adams", "amy-holland", "lucy-che", "jessica-bailey", "lola-durant"];
    setAutosplitContactIds(walletContacts);
    setIsAutosplitNoticeOpen(true);
  };

  // Compute brand shortcuts based on connection status
  const shortcuts = React.useMemo(() => {
    if (!qboConnected) {
      return Array(5).fill({
        label: "N/A",
        fallback: "N/A",
        tileClassName: "bg-transparent p-0",
        imageClassName: "scale-[3.2]",
      });
    }

    // Extract synced QuickBooks client brand names
    const qboClientNames = Array.from(new Set(qboInvoices.map((inv) => inv.name).filter(Boolean)));
    const dynamicShortcuts = qboClientNames.map((name) => ({
      label: name,
      fallback: name.substring(0, 2).toUpperCase(),
      href: `/dashboard/invoices`,
      tileClassName: "bg-transparent p-0",
      imageClassName: "scale-[3.2]",
    }));

    const standardBrands = [
      { label: "TikTok", src: "/tiktok.png", fallback: "TikTok", href: "/dashboard" },
      { label: "iHeartRadio", src: "/iheart.png", fallback: "iHeart", href: "/dashboard" },
      { label: "Instagram", src: "/instagram.png", fallback: "Instagram", href: "/dashboard" },
      { label: "Pandora", src: "/pandora.png", fallback: "Pandora", href: "/dashboard" },
      { label: "Tidal", src: "/tidal.png", fallback: "Tidal", href: "/dashboard" },
    ];

    return [...dynamicShortcuts, ...standardBrands].slice(0, 5);
  }, [qboConnected, qboInvoices]);

  return (
    <div className="space-y-8 select-text">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {user?.fullName}
          </h2>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Here is what is happening on your {role} ledger today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role === "brand" && (
            <Link href="/dashboard/invoices">
              <Button className="h-9 px-4 text-xs font-bold gap-1.5 bg-white text-black hover:bg-neutral-200 cursor-pointer">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          )}
          {role === "agency" && (
            <Button className="h-9 px-4 text-xs font-bold gap-1.5 border border-[#3a3a3a] bg-white/[0.02] text-white hover:bg-white/[0.06] cursor-pointer">
              <UploadCloud className="h-4 w-4" />
              Ingest CSV File
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} hoverable className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {stat.label}
              </span>
              <div
                className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  stat.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : stat.trend === "down"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {stat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                {stat.trend === "down" && <ArrowDownLeft className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-white">
              {stat.amount}
            </div>
            <div className="absolute right-0 bottom-0 h-10 w-10 bg-white/[0.01] rounded-tl-full" />
          </Card>
        ))}
      </div>

      {/* Structured Multi-Column Dashboard Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        {/* Left Column (2/3 width) - Charts & Transactions */}
        <div className="lg:col-span-1 space-y-6">
          <RequestAnalytics />
          <RecentIncomeCard />
          <RecentPayoutsCard />
          <RecentVendorsCard />
          <RecentInvoicesCard />
        </div>

        {/* Right Column (1/3 width) - Quick Actions, Integrations, Plaid, Cards */}
        <div className="space-y-6">
          
          {/* 1. Quick Actions Panel */}
          <Panel className="p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const baseClassName =
                  "flex flex-col items-center gap-2 rounded-[10px] border border-[#3a3a3a] bg-black px-2 py-3 text-center transition-colors hover:border-white/20 hover:bg-white/[0.02] cursor-pointer";

                if (action.label === "Wallet ID contacts") {
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => setIsWalletContactsOpen(true)}
                      className={baseClassName}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-[#3a3a3a] bg-black">
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <span className="text-[10px] leading-4 text-white font-bold">{action.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={baseClassName}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-[#3a3a3a] bg-black">
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="text-[10px] leading-4 text-white font-bold">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </Panel>

          {/* 2. Shortcuts Panel */}
          <Panel className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[14px] font-semibold text-white">Shortcuts</h2>
                <p className="mt-1 text-[11px] text-[#8f8f8f]">Quick brand and search access.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {shortcuts.map((item, index) => (
                <BrandTile key={index} {...item} />
              ))}
            </div>
          </Panel>

          {/* 3. Integrations Shortcuts */}
          <IntegrationsShortcutsPanel
            connectedIntegrations={connectedIntegrations}
            onAddClick={() => {
              setAddIntegrationModalStep("select");
              setSelectedIntegration(null);
              setIsAddIntegrationModalOpen(true);
            }}
          />

          {/* 4. QuickBooks Online panel */}
          {qboConnected && (
            <QuickBooksOnlinePanel
              connected={qboConnected}
              invoices={qboInvoices}
              loading={qboLoading}
              disconnecting={disconnecting}
              onDisconnect={handleDisconnect}
            />
          )}

          {/* 5. Ledger Balances & Bank Link (Functional component from the new project) */}
          <PlaidConnector />

          {/* 6. Banks and Cards Panel */}
          <Panel className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[14px] font-semibold text-white">Banks and Cards</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {linkedCards.length > 0 ? (
                linkedCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-[10px] border border-[#3a3a3a] bg-[#0c0c0c] p-3 animate-in fade-in duration-300"
                  >
                    <BankCardFace card={card} />
                    <div className="min-w-0 flex-1">
                       <p className="truncate text-[13px] font-semibold text-white">{card.name}</p>
                      <p className="mt-1 text-[11px] text-[#8f8f8f] font-mono">{card.detail}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <p className="text-[12px] text-[#555]">No bank accounts or cards linked.</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                resetLinkModal();
                setIsLinkModalOpen(true);
              }}
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-[#3a3a3a] bg-[#0c0c0c] px-3.5 text-[11px] font-semibold text-white hover:border-white/20 w-fit cursor-pointer transition-all"
            >
              Link a card or bank
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </Panel>

        </div>
      </div>

      {/* Overlay Modals */}
      {isWalletContactsOpen && (
        <WalletContactsOverlay
          query={walletContactQuery}
          autosplitContactIds={autosplitContactIds}
          onQueryChange={setWalletContactQuery}
          onClose={() => setIsWalletContactsOpen(false)}
          onToggleContact={toggleAutosplitContact}
          onEnableAll={enableAllContactAutosplit}
        />
      )}

      {isAutosplitNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-[1px]">
          <div className="w-full max-w-[400px] rounded-[12px] border border-[#3a3a3a] bg-[#0c0c0c] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold">Autosplit enabled</h2>
                <p className="mt-2.5 text-[12px] leading-5 text-[#bdbdbd]">
                  AgncyPay will include a $5 autosplit fee when this invoice or contact is paid.
                </p>
              </div>
              <button type="button" onClick={() => setIsAutosplitNoticeOpen(false)} className="text-[#8f8f8f] hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsAutosplitNoticeOpen(false)}
              className="mt-6 h-9 w-full rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-[#e8e8e8] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[450px] rounded-[16px] border border-[#3a3a3a] bg-[#0c0c0c] p-6 shadow-2xl text-left overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-4">
              <div>
                <h3 className="text-[16px] font-bold text-white">Link Account or Card</h3>
                <p className="mt-1 text-[11px] text-[#7f7f7f]">Connect your payouts and payment cards securely.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3a] bg-black text-[#8f8f8f] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              {linkModalStep === "select" && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setLinkModalStep("plaid_banks")}
                    className="flex w-full items-center gap-4 rounded-[12px] border border-[#3a3a3a] bg-[#070707] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.01] cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-white p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/plaid-logo.svg" alt="Plaid" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-[13px]">Bank Account via Plaid</h4>
                      <p className="mt-1 text-[11px] text-[#7f7f7f]">Instantly verify checking/savings accounts for royalty payouts.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkModalStep("card_form")}
                    className="flex w-full items-center gap-4 rounded-[12px] border border-[#3a3a3a] bg-[#070707] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.01] cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#1a1a1a] text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-[13px]">Debit or Credit Card</h4>
                      <p className="mt-1 text-[11px] text-[#7f7f7f]">Link Visa, Mastercard or Amex for automated payment splits.</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Plaid Bank Select */}
              {linkModalStep === "plaid_banks" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-white mb-3">Select your bank</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Chase", logo: CHASE_INK_BUSINESS_UNLIMITED_IMAGE },
                      { name: "Bank of America", logo: BOFA_BUSINESS_DEBIT_VISA_IMAGE },
                      { name: "Mercury", logo: MERCURY_IO_CARD_IMAGE },
                      { name: "Wells Fargo", logo: "/quickbook.png" },
                      { name: "Capital One", logo: "/quickbook.png" },
                      { name: "Citi", logo: "/quickbook.png" }
                    ].map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => {
                          setSelectedBank(bank.name);
                          setLinkModalStep("plaid_login");
                        }}
                        className="flex items-center gap-3 rounded-[8px] border border-[#3a3a3a] bg-[#070707] p-3 text-left hover:border-white/20 hover:bg-white/[0.01] cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#3a3a3a] bg-black overflow-hidden p-0.5">
                          {bank.logo.endsWith(".png") || bank.logo.endsWith(".svg") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={bank.logo} alt={bank.name} className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="text-[12px] font-semibold text-white">{bank.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setLinkModalStep("select")}
                      className="w-full h-9 rounded-[7px] border border-[#3a3a3a] bg-black text-[12px] font-semibold text-white hover:border-white/20 cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Plaid Login Form */}
              {linkModalStep === "plaid_login" && (
                <form onSubmit={handlePlaidLogin}>
                  <div className="text-center mb-6">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-white">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h4 className="mt-3 text-[14px] font-bold text-white">Log in to {selectedBank}</h4>
                    <p className="mt-1 text-[11px] text-[#7f7f7f]">Enter credentials to link your business account</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">Username or User ID</label>
                      <input
                        type="text"
                        value={plaidUsername}
                        onChange={(e) => setPlaidUsername(e.target.value)}
                        placeholder="Online User ID"
                        className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                      />
                      {plaidErrors.username && <p className="mt-1 text-[11px] text-red-400">{plaidErrors.username}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">Password</label>
                      <input
                        type="password"
                        value={plaidPassword}
                        onChange={(e) => setPlaidPassword(e.target.value)}
                        placeholder="Banking Password"
                        className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                      />
                      {plaidErrors.password && <p className="mt-1 text-[11px] text-red-400">{plaidErrors.password}</p>}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setLinkModalStep("plaid_banks")}
                      className="flex-1 h-9 rounded-[7px] border border-[#3a3a3a] bg-[#0b0b0b] text-[12px] font-semibold text-white hover:border-white/20 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-[#e8e8e8] cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Plaid Verifying Spinner */}
              {linkModalStep === "plaid_verifying" && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-[#8f8f8f]" />
                  <h4 className="mt-5 text-[13px] font-semibold text-white">{modalLoadingText}</h4>
                  <p className="mt-2 text-[11px] text-[#555] max-w-[280px]">Establishing secure channel. Do not close this dialog.</p>
                </div>
              )}

              {/* Plaid Success Screen */}
              {linkModalStep === "plaid_success" && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                    <Check className="h-7 w-7" strokeWidth={3} />
                  </div>
                  <h4 className="mt-5 text-[16px] font-bold text-white">Account Linked Successfully!</h4>
                  <p className="mt-2 text-[12px] text-[#8f8f8f] max-w-[320px]">
                    Your {selectedBank} account is now connected to AgncyPay.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(false)}
                    className="mt-8 w-full h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-[#e8e8e8] cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}

              {/* Card Form */}
              {linkModalStep === "card_form" && (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Jane Doe"
                      className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                    />
                    {cardErrors.holder && <p className="mt-1 text-[11px] text-red-400">{cardErrors.holder}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const parts = clean.match(/.{1,4}/g) || [];
                        setCardNumber(parts.join(" "));
                      }}
                      placeholder="4111 2222 3333 4444"
                      className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                    />
                    {cardErrors.number && <p className="mt-1 text-[11px] text-red-400">{cardErrors.number}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (clean.length > 2) {
                            setCardExpiry(clean.slice(0, 2) + "/" + clean.slice(2));
                          } else {
                            setCardExpiry(clean);
                          }
                        }}
                        placeholder="MM/YY"
                        className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                      />
                      {cardErrors.expiry && <p className="mt-1 text-[11px] text-red-400">{cardErrors.expiry}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">CVC</label>
                      <input
                        type="text"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                      />
                      {cardErrors.cvc && <p className="mt-1 text-[11px] text-red-400">{cardErrors.cvc}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8f8f8f] mb-1.5">ZIP Code</label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        placeholder="90210"
                        className="h-10 w-full rounded-[6px] border border-[#3a3a3a] bg-black px-3 text-[13px] text-white outline-none focus:border-white placeholder:text-[#444]"
                      />
                      {cardErrors.zip && <p className="mt-1 text-[11px] text-red-400">{cardErrors.zip}</p>}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setLinkModalStep("select")}
                      className="flex-1 h-9 rounded-[7px] border border-[#3a3a3a] bg-[#0b0b0b] text-[12px] font-semibold text-white hover:border-white/20 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-[#e8e8e8] cursor-pointer"
                    >
                      Link Card
                    </button>
                  </div>
                </form>
              )}

              {/* Card Verifying Spinner */}
              {linkModalStep === "card_verifying" && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-[#8f8f8f]" />
                  <h4 className="mt-5 text-[13px] font-semibold text-white">{modalLoadingText}</h4>
                  <p className="mt-2 text-[11px] text-[#555] max-w-[280px]">Verifying with card network. Do not close this dialog.</p>
                </div>
              )}

              {/* Card Success Screen */}
              {linkModalStep === "card_success" && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                    <Check className="h-7 w-7" strokeWidth={3} />
                  </div>
                  <h4 className="mt-5 text-[16px] font-bold text-white">Card Linked Successfully!</h4>
                  <p className="mt-2 text-[12px] text-[#8f8f8f] max-w-[320px]">
                    Your credit/debit card ending in ****{cardNumber.replace(/\s+/g, "").slice(-4)} is now connected.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsLinkModalOpen(false)}
                    className="mt-8 w-full h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-[#e8e8e8] cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddIntegrationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[450px] rounded-[16px] border border-[#3a3a3a] bg-[#0c0c0c] p-6 shadow-2xl text-left overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-4">
              <div>
                <h3 className="text-[16px] font-bold text-white">Connect New Integration</h3>
                <p className="mt-1 text-[11px] text-[#7f7f7f]">Sync external accounting ledgers or bank feeds.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddIntegrationModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3a] bg-black text-[#8f8f8f] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              {addIntegrationModalStep === "select" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-[#8f8f8f] mb-4">Select an available service to connect:</h4>
                  <div className="space-y-3">
                    {[
                      { label: "QuickBooks", src: "/quickbook.png", desc: "Sync invoices, payments and chart of accounts." },
                      { label: "Mercury", src: "/mercuryLogo.png", desc: "Sync business bank accounts & cards feeds.", bg: "bg-white" },
                      { label: "Xero", src: "/xero.png", desc: "Keep Xero ledger accounts updated in real-time." },
                      { label: "Sage", src: "/sage.png", desc: "Automate reporting and sync payables to Sage." },
                      { label: "NetSuite", src: "/netsuite.png", desc: "Enterprise chart of accounts syncing." }
                    ]
                      .filter((item) => !connectedIntegrations.includes(item.label))
                      .map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleConnectIntegration(item)}
                          className="flex w-full items-center gap-4 rounded-[12px] border border-[#3a3a3a] bg-[#070707] p-3 text-left hover:border-white/20 hover:bg-white/[0.01] transition-all cursor-pointer"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#3a3a3a] bg-black overflow-hidden p-1">
                            <div className={cn("h-full w-full rounded-[6px] flex items-center justify-center overflow-hidden", item.bg || "bg-transparent")}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.src} alt={item.label} className="max-h-full max-w-full object-contain" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-[13px] font-bold text-white leading-none">{item.label}</h5>
                            <p className="mt-1 text-[10px] text-[#7f7f7f] truncate">{item.desc}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#555]" />
                        </button>
                      ))}

                    {[
                      { label: "QuickBooks", src: "/quickbook.png", desc: "Sync invoices, payments and chart of accounts." },
                      { label: "Mercury", src: "/mercuryLogo.png", desc: "Sync business bank accounts & cards feeds.", bg: "bg-white" },
                      { label: "Xero", src: "/xero.png", desc: "Keep Xero ledger accounts updated in real-time." },
                      { label: "Sage", src: "/sage.png", desc: "Automate reporting and sync payables to Sage." },
                      { label: "NetSuite", src: "/netsuite.png", desc: "Enterprise chart of accounts syncing." }
                    ].filter((item) => !connectedIntegrations.includes(item.label)).length === 0 && (
                      <p className="text-center py-6 text-[13px] text-[#555]">All available integrations are connected.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Connecting Loading Spinner */}
              {addIntegrationModalStep === "connecting" && (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-200">
                  <Loader2 className="h-10 w-10 animate-spin text-[#8f8f8f]" />
                  <h4 className="mt-5 text-[13px] font-semibold text-white">{integrationLoadingText}</h4>
                  <p className="mt-2 text-[11px] text-[#555] max-w-[280px]">Establishing secure OAuth handshake. Do not close.</p>
                </div>
              )}

              {/* Success Screen */}
              {addIntegrationModalStep === "success" && (
                <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in duration-200">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                    <Check className="h-7 w-7" strokeWidth={3} />
                  </div>
                  <h4 className="mt-5 text-[16px] font-bold text-white">{selectedIntegration?.label} Integrated Successfully!</h4>
                  <p className="mt-2 text-[12px] text-[#8f8f8f] max-w-[320px]">
                    Your {selectedIntegration?.label} account is now connected and syncing ledger records automatically.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsAddIntegrationModalOpen(false)}
                    className="mt-8 w-full h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-[#e8e8e8] cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
