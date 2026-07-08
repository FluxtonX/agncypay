"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/shared/context/AppContext";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  ChevronRight,
  EllipsisVertical,
  Loader2,
  Play,
  Plug,
  Plus,
  Search,
  Send,
  Settings,
  Unplug,
  Users,
  X,
  Building,
  CheckCircle2,
  Wallet,
  Receipt,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";

// Unified accounting hooks & types
import { useAccounting } from "../../hooks/useAccounting";
import { ProviderType } from "../../types";
import {
  useGetConnectedAgenciesQuery,
  useGetAgencyInvitationsQuery,
  useGetConnectedBrandsQuery,
  useGetIncomingInvitationsQuery,
  useAcceptBrandInvitationMutation,
  useGetConnectedTalentsQuery,
  useGetTalentInvitationsQuery,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetIncomingConnectionsQuery,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
  useGetConnectedPartnersQuery,
  useGetWalletBalancesQuery,
} from "@/lib/store/services/api";

// Isolated dashboard components
import { RecentIncomeCard } from "../../components/IncomeTable/RecentIncomeCard";
import { RecentPayoutsCard } from "../../components/PayoutTable/RecentPayoutsCard";
import { RecentVendorsCard } from "../../components/Dashboard/RecentVendorsCard";
import { RecentInvoicesCard } from "../../components/InvoiceTable/RecentInvoicesCard";
import { RequestAnalytics } from "@/features/dashboard/components/RequestAnalytics";
import { PlaidConnector } from "@/features/dashboard/components/PlaidConnector";
import { CsvDropzonePanel } from "@/features/dashboard/components/CsvDropzonePanel";

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
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center rounded-[inherit] border border-white/10 bg-black px-1 text-center text-[10px] font-bold text-neutral-400">
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

const getBrandLogo = (name: string): { src?: string; fallback: string; tileClassName?: string; imageClassName?: string } => {
  const norm = name.toLowerCase();
  
  if (norm.includes("spotify")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/240px-Spotify_icon.svg.png",
      fallback: "S",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("universal")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Universal_Music_Group_logo_2013.png",
      fallback: "UMG",
      tileClassName: "bg-white border border-[#ccc] p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("netflix")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Netflix_N_Icon.png",
      fallback: "N",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("sony")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Sony_Music_logo.png",
      fallback: "SM",
      tileClassName: "bg-white border border-[#ccc] p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("apple")) {
    return {
      src: "/appleMusic.png",
      fallback: "AP",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("amazon")) {
    return {
      src: "/amazonMusic.png",
      fallback: "AM",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("instagram")) {
    return {
      src: "/instagram.png",
      fallback: "IG",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("tiktok")) {
    return {
      src: "/tiktok.png",
      fallback: "TT",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("pandora")) {
    return {
      src: "/pandora.png",
      fallback: "PD",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }
  if (norm.includes("tidal")) {
    return {
      src: "/tidal.png",
      fallback: "TD",
      tileClassName: "bg-black border border-white/10 p-0",
      imageClassName: "object-cover h-full w-full"
    };
  }

  // Initials fallback
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return {
    fallback: initials || "NA",
    tileClassName: "bg-black border border-white/10 flex items-center justify-center text-neutral-300 font-bold"
  };
};

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
  fallback?: string;
  tileClassName?: string;
  imageClassName?: string;
  search?: boolean;
}) {
  const Component = href ? Link : "button";
  const displayFallback = fallback || "N/A";
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
              fallback={displayFallback}
              className="h-full w-full"
              imageClassName={cn("object-contain", imageClassName)}
            />
          </div>
        ) : (
          <div className={cn("flex h-full w-full items-center justify-center overflow-hidden rounded-[9px]", tileClassName)}>
            <span className={cn("text-[12px] font-semibold", displayFallback === "N/A" ? "text-[#555]" : "text-black")}>{displayFallback}</span>
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

const getProviderDetails = (provider: ProviderType) => {
  switch (provider) {
    case "quickbooks":
      return {
        name: "QuickBooks Online",
        logo: "/quickbook.png",
        color: "#2CA01C",
        description: "Sync invoices, payments, and vendors automatically to your QBO account.",
        connectUrl: "/api/auth/quickbooks/connect"
      };
    case "xero":
      return {
        name: "Xero",
        logo: "/xero.png",
        color: "#13B5EA",
        description: "Keep your Xero ledgers up to date in real-time as payments are processed.",
        connectUrl: null
      };
    case "sage":
      return {
        name: "Sage Intacct",
        logo: "/sage.png",
        color: "#00783C",
        description: "Automate financial reporting and sync payables effortlessly to Sage.",
        connectUrl: null
      };
  }
};

function IntegrationsShortcutsPanel({
  connectedIntegrations,
  onAddClick,
  currentProvider,
}: {
  connectedIntegrations: string[];
  onAddClick: () => void;
  currentProvider: ProviderType;
}) {
  const masterIntegrations = [
    { label: "QuickBooks", src: "/quickbook.png", href: "/providers/quickbooks/dashboard" },
    { label: "Mercury", src: "/mercuryLogo.png", href: "#", bg: "bg-white" },
    { label: "Xero", src: "/xero.png", href: "/providers/xero/dashboard" },
    { label: "Sage", src: "/sage.png", href: "/providers/sage/dashboard" },
    { label: "NetSuite", src: "/netsuite.png", href: "#" },
  ];

  const connected = masterIntegrations.filter((item) => {
    if (item.label === "QuickBooks") return connectedIntegrations.includes("QuickBooks");
    if (item.label === "Xero") return connectedIntegrations.includes("Xero");
    if (item.label === "Sage") return connectedIntegrations.includes("Sage");
    return connectedIntegrations.includes(item.label);
  });
  
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

          const isActive = (currentProvider === "quickbooks" && item.label === "QuickBooks") ||
                           (currentProvider === "xero" && item.label === "Xero") ||
                           (currentProvider === "sage" && item.label === "Sage");

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex min-w-0 flex-col items-center gap-2 text-center group"
              aria-label={item.label}
            >
              <div className={cn(
                "flex h-[72px] w-[72px] items-center justify-center rounded-[12px] border bg-[#060606] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors",
                isActive ? "border-white" : "border-[#3a3a3a] group-hover:border-[#555]"
              )}>
                <div className={cn("h-full w-full overflow-hidden rounded-[9px] flex items-center justify-center", item.bg || "bg-transparent")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.label}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
              <span className={cn("max-w-[78px] text-[12px] leading-4 transition-colors", isActive ? "text-white font-bold" : "text-[#b8b8b8] group-hover:text-white")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

function ProviderSyncPanel() {
  const { currentProvider, connectionStatuses, invoices, loading, disconnecting, disconnect } = useAccounting();
  const [showConfirm, setShowConfirm] = useState(false);

  const providerInfo = getProviderDetails(currentProvider);
  const isConnected = !!connectionStatuses[currentProvider]?.connected;

  useEffect(() => {
    setShowConfirm(false);
  }, [currentProvider, isConnected]);

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-transparent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={providerInfo.logo} alt={providerInfo.name} className="h-full w-full object-contain" />
          </div>
          <h2 className="text-[14px] font-semibold text-white">{providerInfo.name}</h2>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-[#3a3a3a] bg-[#111] px-3 text-[11px] font-semibold text-[#8f8f8f]">
              <Loader2 className="h-3 w-3 animate-spin" />
              Checking
            </span>
          ) : isConnected ? (
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
            href={`/providers/${currentProvider}/invoices`}
            className="text-[12px] font-semibold text-[#8f8f8f] hover:text-white"
          >
            Settings
          </Link>
        </div>
      </div>

      <p className="mt-1 text-[11px] text-[#8f8f8f]">
        {providerInfo.description}
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
            <h3 className="mt-4 text-[15px] font-semibold text-white">Disconnect {providerInfo.name}?</h3>
            <p className="mt-1.5 max-w-[320px] text-[12px] leading-[18px] text-[#9b9b9b]">
              Are you sure you want to disconnect {providerInfo.name}? This will stop syncing invoices and payouts immediately.
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
                  await disconnect();
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
        ) : !isConnected ? (
          /* Disconnected Empty State */
          <div className="flex flex-col items-center rounded-[10px] border border-dashed border-[#3a3a3a] bg-[#060606] px-5 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#111]">
              <Plug className="h-5 w-5 text-[#8f8f8f]" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-white">Connect {providerInfo.name}</h3>
            <p className="mt-1.5 max-w-[320px] text-[11px] leading-[18px] text-[#7f7f7f]">
              Link your connected accounts to fetch live invoices, sync payments, and manage ledgers directly from your dashboard.
            </p>
            {providerInfo.connectUrl ? (
              <Link
                href={providerInfo.connectUrl}
                className="mt-5 inline-flex h-[34px] items-center gap-2 rounded-[7px] border border-white bg-white px-4 text-[12px] font-semibold text-black transition-colors hover:bg-[#e8e8e8]"
              >
                <Plug className="h-3.5 w-3.5" />
                Connect Now
              </Link>
            ) : (
              <Link
                href="/dashboard/integrations"
                className="mt-5 inline-flex h-[34px] items-center gap-2 rounded-[7px] border border-white bg-white px-4 text-[12px] font-semibold text-black transition-colors hover:bg-[#e8e8e8]"
              >
                <Plug className="h-3.5 w-3.5" />
                Connect on Marketplace
              </Link>
            )}
          </div>
        ) : invoices.length === 0 ? (
          /* Connected but no invoices */
          <div className="flex flex-col items-center rounded-[10px] border border-dashed border-[#3a3a3a] bg-[#060606] px-5 py-6 text-center">
            <p className="text-[13px] text-[#7f7f7f]">No invoices found in {providerInfo.name}.</p>
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
                ? `/receipt/${inv.id}?tx=TX-AP-SYNC-${inv.id}&mode=logged_in&returnTo=dashboard`
                : `/dashboard/pay-flow/${inv.id}`;

              return (
                <Link
                  key={inv.id}
                  href={targetHref}
                  className="flex items-center gap-3 rounded-[8px] border border-[#3a3a3a] bg-black px-3 py-2 transition-colors hover:border-[#555] hover:bg-white/[0.04] cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-transparent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={providerInfo.logo} alt={providerInfo.name} className="h-full w-full object-contain" />
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

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/providers/${currentProvider}/income`}
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

export function DashboardPage() {
  const { state } = useApp();
  const user = state.user;
  const role = user?.role || "brand";
  const workspaceName = user?.fullName || "Acme Corp";  // Unified accounting & RTK query hooks
  const { currentProvider, connectionStatuses, invoices, loading: loadingAccounting, providerErrors, sync, disconnect, disconnecting } = useAccounting();
  
  // Brand specific queries
  const { data: connectedAgencies = [], isLoading: loadingAgencies } = useGetConnectedAgenciesQuery(undefined, { skip: role !== "brand" });
  const { data: pendingInvitations = [], isLoading: loadingInvitations } = useGetAgencyInvitationsQuery(undefined, { skip: role !== "brand" });

  // Agency specific queries
  const { data: connectedBrands = [] } = useGetConnectedBrandsQuery(undefined, { skip: role !== "agency" });
  const { data: incomingInvitations = [], refetch: refetchIncomingInvitations } = useGetIncomingInvitationsQuery(undefined, { skip: role !== "agency" });
  const { data: connectedTalents = [] } = useGetConnectedTalentsQuery(undefined, { skip: role !== "agency" });
  const { data: talentInvitations = [] } = useGetTalentInvitationsQuery(undefined, { skip: role !== "agency" });

  const [acceptBrandInvitation, { isLoading: isAcceptingBrand }] = useAcceptBrandInvitationMutation();

  const { data: notifications = [], refetch: refetchNotifications } = useGetNotificationsQuery();
  const [markNotificationsRead] = useMarkNotificationsReadMutation();

  const { data: incomingConnections = [], refetch: refetchIncomingConnections } = useGetIncomingConnectionsQuery(undefined, { skip: role !== "talent" });
  const { data: connectedPartners = [] } = useGetConnectedPartnersQuery(undefined, { skip: role !== "talent" });
  const { data: walletBalances, refetch: refetchWalletBalances } = useGetWalletBalancesQuery(user?.walletId || "", { skip: !user?.walletId || role !== "talent" });

  useEffect(() => {
    const handleUpdate = () => {
      if (role === "talent" && refetchWalletBalances) {
        refetchWalletBalances();
      }
    };
    window.addEventListener("incomesUpdated", handleUpdate);
    return () => window.removeEventListener("incomesUpdated", handleUpdate);
  }, [refetchWalletBalances, role]);

  const [acceptConnection, { isLoading: isAcceptingConnection }] = useAcceptConnectionMutation();
  const [declineConnection, { isLoading: isDecliningConnection }] = useDeclineConnectionMutation();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAcceptConnection = async (id: string) => {
    try {
      await acceptConnection(id).unwrap();
      showToast("Connection accepted successfully!", "success");
      refetchIncomingConnections();
    } catch (e: any) {
      showToast("Failed to accept connection: " + e.message, "error");
    }
  };

  const handleDeclineConnection = async (id: string) => {
    try {
      await declineConnection(id).unwrap();
      showToast("Connection declined.", "success");
      refetchIncomingConnections();
    } catch (e: any) {
      showToast("Failed to decline connection: " + e.message, "error");
    }
  };

  // Metrics calculations (Brand)
  const totalSpendVal = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + inv.amount, 0) + 103980;
  const outstandingVal = invoices.filter(inv => inv.status === "Pending").reduce((acc, inv) => acc + inv.amount, 0);
  const dueThisWeekVal = invoices.filter(inv => inv.daysText.toLowerCase().includes("due") && !inv.daysText.toLowerCase().includes("paid")).reduce((acc, inv) => acc + inv.amount, 0) || 12000;
  const paidThisMonthVal = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + inv.amount, 0) || 36500;

  const brandStats = [
    { label: "Total Spend", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalSpendVal), change: "+12.5%", trend: "up" },
    { label: "Outstanding Invoices", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(outstandingVal || 38400), change: "-4.2%", trend: "down" },
    { label: "Due This Week", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(dueThisWeekVal), change: "Next 7 Days", trend: "neutral" },
    { label: "Paid This Month", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(paidThisMonthVal), change: "June 2026", trend: "up" },
    { label: "Active Campaigns", amount: "3 Campaigns", change: "In Flight", trend: "up" },
    { label: "Connected Agencies", amount: `${connectedAgencies.length} Connected`, change: `${pendingInvitations.filter(i => i.status === 'PENDING').length} Pending`, trend: "neutral" },
  ];

  // Metrics calculations (Agency)
  const totalRevenueVal = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + inv.amount, 0) + 242000;
  const outstandingInvoicesVal = invoices.filter(inv => inv.status === "Pending").reduce((acc, inv) => acc + inv.amount, 0) || 38400;
  const pendingIncomingVal = 18500.00;
  const pendingPayoutsVal = 12800.00;

  const agencyStats = [
    { label: "Revenue Received", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalRevenueVal), change: "+18.2%", trend: "up" },
    { label: "Outstanding Invoices", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(outstandingInvoicesVal), change: "-2.5%", trend: "down" },
    { label: "Pending Incoming", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(pendingIncomingVal), change: "Next 5 Days", trend: "neutral" },
    { label: "Pending Payouts", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(pendingPayoutsVal), change: "Talents Payout", trend: "neutral" },
    { label: "Active Brands", amount: `${connectedBrands.length} Connected`, change: `${incomingInvitations.length} Pending`, trend: "up" },
    { label: "Active Campaigns", amount: "4 Campaigns", change: "2 In Flight", trend: "up" },
  ];

  // Metrics calculations (Talent)
  const connectedBrandsCount = connectedPartners.filter((p: any) => p.partner?.role === "brand").length;
  const connectedAgenciesCount = connectedPartners.filter((p: any) => p.partner?.role === "agency").length;
  const availableBal = walletBalances?.availableBalance || 0;
  const pendingBal = walletBalances?.pendingBalance || 0;
  const talentTotalEarningsVal = invoices.filter(inv => inv.status === "Paid").reduce((acc, inv) => acc + inv.amount, 0) + 12500;

  const talentStats = [
    { label: "Total Earnings", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(talentTotalEarningsVal), change: "+14.8%", trend: "up" },
    { label: "Pending Payments", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(pendingBal || 4200), change: "Settling Balance", trend: "neutral" },
    { label: "Available Balance", amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(availableBal || 5300), change: "Cleared Cash", trend: "up" },
    { label: "Active Campaigns", amount: "3 Campaigns", change: "2 Active", trend: "up" },
    { label: "Connected Brands", amount: `${connectedBrandsCount} Connected`, change: "Direct Feeds", trend: "neutral" },
    { label: "Connected Agencies", amount: `${connectedAgenciesCount} Connected`, change: "Management", trend: "neutral" },
  ];

  const stats = 
    role === "agency" ? agencyStats : 
    role === "talent" ? talentStats : 
    brandStats;

  const talentRecentPayments = [
    { brand: "Aura Skincare", agency: "VaynerMedia", campaign: "Summer Glow Launch", date: "2026-06-28", amount: 4500.00, status: "Completed" },
    { brand: "Apex Athletic", agency: "Kairos Media", campaign: "TikTok Footwear Push", date: "2026-07-02", amount: 3200.00, status: "Pending" }
  ];

  const talentUpcomingPayouts = [
    { campaign: "Summer Glow Launch", date: "2026-07-04", method: "ACH Direct", amount: 4500.00, status: "Scheduled" },
    { campaign: "TikTok Footwear Push", date: "2026-07-08", method: "Wire Payout", amount: 3200.00, status: "Pending Approval" }
  ];

  // QBO and Modal states
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

  // Sync connected integrations list with unified store
  useEffect(() => {
    const list: string[] = [];
    if (connectionStatuses.quickbooks?.connected) list.push("QuickBooks");
    if (connectionStatuses.xero?.connected) list.push("Xero");
    if (connectionStatuses.sage?.connected) list.push("Sage");
    setConnectedIntegrations(list);
  }, [connectionStatuses]);

  const handleConnectIntegration = (integration: any) => {
    setSelectedIntegration(integration);
    
    if (integration.label === "QuickBooks") {
      window.location.href = "/api/auth/quickbooks/connect";
      return;
    }
    if (integration.label === "Xero") {
      window.location.href = "/api/auth/xero/connect";
      return;
    }

    setAddIntegrationModalStep("connecting");
    setIntegrationLoadingText("Establishing secure connection with " + integration.label + "...");

    setTimeout(() => {
      setIntegrationLoadingText("Authorizing data scopes & sync intervals...");
      setTimeout(() => {
        setIntegrationLoadingText("Importing integration profiles...");
        setTimeout(() => {
          if (typeof window !== "undefined") {
            try {
              const mockKey = "agncypay_mock_connected_integrations";
              const raw = window.localStorage.getItem(mockKey);
              const connectedIds = raw ? JSON.parse(raw) as string[] : [];
              const providerId = integration.label.toLowerCase();
              if (!connectedIds.includes(providerId)) {
                connectedIds.push(providerId);
                window.localStorage.setItem(mockKey, JSON.stringify(connectedIds));
              }
            } catch (e) {
              console.error(e);
            }
          }
          
          setConnectedIntegrations((prev) => {
            if (prev.includes(integration.label)) return prev;
            return [...prev, integration.label];
          });
          setAddIntegrationModalStep("success");
          window.location.reload();
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleManualAddCard = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!cardHolder.trim()) errors.cardHolder = "Name on card is required";
    if (!cardNumber.replace(/\s/g, "")) errors.cardNumber = "Card number is required";
    if (!cardExpiry.match(/^\d\d\/\d\d$/)) errors.cardExpiry = "Expiry date must be MM/YY";
    if (!cardCVC.match(/^\d{3,4}$/)) errors.cardCVC = "CVC must be 3 or 4 digits";
    if (!cardZip.trim()) errors.cardZip = "Billing zip is required";

    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      return;
    }

    setCardErrors({});
    setLinkModalStep("card_verifying");
    setModalLoadingText("Authorizing sandbox debit card hold...");
    
    setTimeout(() => {
      setModalLoadingText("Validating card routing networks...");
      setTimeout(() => {
        const last4 = cardNumber.slice(-4) || "99";
        setLinkedCards((prev) => [
          ...prev,
          {
            name: `${cardHolder}'s Card`,
            detail: `Visa ****${last4}`,
            cardImage: BOFA_BUSINESS_DEBIT_VISA_IMAGE,
            fallback: "Visa",
          },
        ]);
        setLinkModalStep("card_success");
      }, 1500);
    }, 1500);
  };

  const handlePlaidLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!plaidUsername.trim()) errors.username = "Username is required";
    if (!plaidPassword) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setPlaidErrors(errors);
      return;
    }

    setPlaidErrors({});
    setLinkModalStep("plaid_verifying");
    setModalLoadingText("Connecting to " + selectedBank + " credentials interface...");

    setTimeout(() => {
      setModalLoadingText("Initiating OAuth security token exchange...");
      setTimeout(() => {
        setModalLoadingText("Fetching account balances and transaction data...");
        setTimeout(() => {
          setLinkedCards((prev) => [
            ...prev,
            {
              name: `${selectedBank} Business Checking`,
              detail: `Checking ****02`,
              cardImage: MERCURY_IO_CARD_IMAGE,
              fallback: selectedBank,
            },
          ]);
          setLinkModalStep("plaid_success");
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    setLinkModalStep("plaid_login");
  };

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
  };

  const handleToggleAutosplitInvoice = (invoiceId: string) => {
    setAutosplitInvoiceIds((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId]
    );
  };

  const handleToggleAutosplitContact = (contactId: string) => {
    setAutosplitContactIds((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleEnableAllAutosplitContacts = () => {
    setAutosplitContactIds(["john-adams", "amy-holland", "lucy-che", "jessica-bailey", "lola-durant"]);
    setIsWalletContactsOpen(false);
  };

  const isProviderConnected = !!connectionStatuses[currentProvider]?.connected;

  const brandQuickActions = [
    { label: "Pay Invoice", icon: Send, href: `/dashboard/invoices` },
    { label: "Invite Agency", icon: Users, href: "/dashboard/agencies" },
    { label: "Export Report", icon: BarChart3, href: "/dashboard/reports" },
    { label: "Sync Integrations", icon: Settings, href: "#" },
  ] as const;

  const agencyQuickActions = [
    { label: "Pay Talent", icon: Send, href: `/dashboard/payouts` },
    { label: "Invite Talent", icon: Users, href: "/dashboard/talents" },
    { label: "View Brands", icon: Building, href: "/dashboard/brands" },
    { label: "Export Report", icon: BarChart3, href: "/dashboard/reports" },
  ] as const;

  const talentQuickActions = [
    { label: "View Wallet", icon: Wallet, href: `/dashboard/wallet` },
    { label: "My Invoices", icon: Receipt, href: "/dashboard/invoices" },
    { label: "Campaigns", icon: Briefcase, href: "/dashboard/campaigns" },
    { label: "Connections", icon: Users, href: "/dashboard/connections" },
  ] as const;

  const quickActions = 
    role === "agency" ? agencyQuickActions : 
    role === "talent" ? talentQuickActions : 
    brandQuickActions;

  const handleQuickActionClick = async (label: string) => {
    if (label === "Sync Integrations") {
      showToast("Triggering QuickBooks & Xero data synchronization...", "success");
      try {
        await sync();
        showToast("Synchronization completed successfully!", "success");
      } catch (e: any) {
        showToast("Sync failed: " + e.message, "error");
      }
    } else if (label === "Export Report") {
      showToast("Financial reports successfully compiled and downloaded as CSV.", "success");
    }
  };

  const handleAcceptIncomingBrandInvite = async (invitationId: string) => {
    try {
      await acceptBrandInvitation(invitationId).unwrap();
      showToast("Brand connection accepted successfully!", "success");
      refetchIncomingInvitations();
    } catch (e: any) {
      showToast("Failed to accept connection: " + e.message, "error");
    }
  };

  const shortcuts = React.useMemo(() => {
    if (!isProviderConnected) {
      return Array(5).fill({
        label: "N/A",
        fallback: "N/A",
        tileClassName: "bg-transparent p-0",
      });
    }

    const clientNames = Array.from(new Set(invoices.map((inv) => inv.name)));

    const dynamicShortcuts = clientNames.map((name) => {
      const details = getBrandLogo(name);
      return {
        label: name,
        href: `/dashboard/invoices`,
        ...details
      };
    });

    const standardBrands = [
      { label: "TikTok", src: "/tiktok.png", fallback: "TT", href: `/dashboard/invoices`, tileClassName: "bg-black border border-white/10 p-0", imageClassName: "object-cover h-full w-full" },
      { label: "iHeartRadio", src: "/iheart.png", fallback: "iH", href: `/dashboard/invoices`, tileClassName: "bg-black border border-white/10 p-0", imageClassName: "object-cover h-full w-full" },
      { label: "Instagram", src: "/instagram.png", fallback: "IG", href: `/dashboard/invoices`, tileClassName: "bg-black border border-white/10 p-0", imageClassName: "object-cover h-full w-full" },
    ];

    return [...dynamicShortcuts, ...standardBrands].slice(0, 5);
  }, [isProviderConnected, invoices, currentProvider]);

  return (
    <div className="space-y-6 select-text font-medium">
      {/* Title section */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white capitalize">
            {workspaceName}&apos;s Workspace
          </h2>
          <p className="text-xs font-semibold text-neutral-400 mt-1 capitalize">
            {role === 'agency' ? 'Agency Overview Dashboard' : 'Brand Overview Dashboard'} · Primary accounting provider: <span className="text-white font-bold">{currentProvider}</span>
          </p>
        </div>
        <div className="flex gap-2.5 mt-2 sm:mt-0">
          <Button
            onClick={() => {
              resetLinkModal();
              setIsLinkModalOpen(true);
            }}
            className="h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer bg-white text-black hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            Link Bank Account
          </Button>
        </div>
      </div>

      {/* Stats Cards (6 column layout) */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5 flex flex-col justify-between min-h-[110px] border-[#3a3a3a] bg-[#0D0D0D]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {stat.label}
            </span>
            <div className="flex flex-col mt-3 gap-1">
              <span className="font-mono text-lg font-bold tracking-tight text-white">
                {stat.amount}
              </span>
              <span className={`text-[9px] font-bold ${
                stat.trend === 'up' ? 'text-green-400' :
                stat.trend === 'down' ? 'text-red-400' :
                'text-neutral-500'
              }`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Structured Multi-Column Dashboard Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        {/* Left Column (2/3 width) - Charts & Tables */}
        <div className="lg:col-span-1 space-y-6">
          {/* Analytics Chart */}
          <RequestAnalytics />

          {/* Recent Records Stack */}
          <div className="space-y-6">
            
            {/* Table 1: Recent Invoices */}
            <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[280px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Recent Invoices (Synced)
                </h3>
                <Link href="/dashboard/invoices" className="text-[10px] font-bold text-neutral-500 hover:text-white flex items-center gap-0.5">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {loadingAccounting ? (
                <div className="flex flex-col items-center justify-center flex-1 py-8">
                  <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
                </div>
              ) : !isProviderConnected ? (
                <div className="flex flex-col items-center justify-center flex-1 py-8 border border-dashed border-[#3a3a3a] rounded-lg bg-[#060606] text-center text-xs text-neutral-400">
                  No platforms connected. Invoices synchronize here once QuickBooks or Xero are linked.
                </div>
              ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-8 text-xs text-neutral-500">
                  No invoices synced from {currentProvider}.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222] text-neutral-500 font-bold">
                        <th className="pb-2">Invoice #</th>
                        <th className="pb-2">{role === 'agency' ? 'Brand' : 'Agency'}</th>
                        <th className="pb-2">Provider</th>
                        <th className="pb-2">Due Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {invoices.slice(0, 4).map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 font-mono font-bold text-neutral-300">#{inv.docNumber || "1001"}</td>
                          <td className="py-2.5 font-bold text-white">{inv.name}</td>
                          <td className="py-2.5 capitalize text-neutral-400">{currentProvider}</td>
                          <td className="py-2.5 text-neutral-400">{inv.date}</td>
                          <td className="py-2.5 font-mono font-bold text-white">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(inv.amount)}
                          </td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              inv.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/25' :
                              inv.daysText === 'Overdue' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Table 2: Brand Payments (Agency) or Recent Payments (Talent) or Upcoming Payments (Brand) */}
            {role === "agency" ? (
              <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Incoming Payments (From Brands)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222] text-neutral-500 font-bold">
                        <th className="pb-2">Brand</th>
                        <th className="pb-2">Invoice</th>
                        <th className="pb-2">Payment Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {[
                        { brand: "Aura Skincare", invoice: `INV-${invoices[0]?.docNumber || '1092'}`, date: "2026-06-28", amount: 15000.00, status: "Settled" },
                        { brand: "Apex Athletic", invoice: `INV-${invoices[1]?.docNumber || '3392'}`, date: "2026-07-02", amount: 8200.00, status: "Processing" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 font-bold text-white">{item.brand}</td>
                          <td className="py-2.5 font-mono text-neutral-400">{item.invoice}</td>
                          <td className="py-2.5 text-neutral-400">{item.date}</td>
                          <td className="py-2.5 font-mono font-bold text-white">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                          </td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Settled' ? 'bg-green-500/10 text-green-500 border border-green-500/25' : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : role === "talent" ? (
              <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Recent Payments
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222] text-neutral-500 font-bold">
                        <th className="pb-2">Brand</th>
                        <th className="pb-2">Agency</th>
                        <th className="pb-2">Campaign</th>
                        <th className="pb-2">Payment Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {talentRecentPayments.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 font-bold text-white">{item.brand}</td>
                          <td className="py-2.5 text-neutral-400">{item.agency}</td>
                          <td className="py-2.5 text-neutral-400">{item.campaign}</td>
                          <td className="py-2.5 text-neutral-400">{item.date}</td>
                          <td className="py-2.5 font-mono font-bold text-white">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                          </td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Completed' || item.status === 'Succeeded' || item.status === 'Settled' ? 'bg-green-500/10 text-green-500 border border-green-500/25' :
                              item.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Upcoming Payments
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222] text-neutral-500 font-bold">
                        <th className="pb-2">Agency</th>
                        <th className="pb-2">Invoice</th>
                        <th className="pb-2">Scheduled Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Method</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {[
                        { agency: "VaynerMedia", invoice: `INV-${invoices[0]?.docNumber || '1092'}`, date: "2026-07-05", amount: 15000.00, method: "ACH Debit", status: "Scheduled" },
                        { agency: "Kairos Media", invoice: `INV-${invoices[1]?.docNumber || '3392'}`, date: "2026-07-12", amount: 24500.00, method: "Wire Transfer", status: "Pending Approval" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 font-bold text-white">{item.agency}</td>
                          <td className="py-2.5 font-mono text-neutral-400">{item.invoice}</td>
                          <td className="py-2.5 text-neutral-400">{item.date}</td>
                          <td className="py-2.5 font-mono font-bold text-white">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                          </td>
                          <td className="py-2.5 text-neutral-400">{item.method}</td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Table 3: Upcoming Payouts (Agency only) or Upcoming Payouts (Talent only) */}
            {role === "agency" ? (
              <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Upcoming Payouts (To Creators)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222] text-neutral-500 font-bold">
                        <th className="pb-2 pr-6">Talent</th>
                        <th className="pb-2 pr-6">Campaign</th>
                        <th className="pb-2 pr-6">Scheduled Date</th>
                        <th className="pb-2 pr-6">Amount</th>
                        <th className="pb-2 pr-6">Method</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {[
                        { talent: "Jessica Bailey", campaign: "Summer Glow Launch", date: "2026-07-04", amount: 4500.00, method: "ACH Direct", status: "Scheduled" },
                        { talent: "Lucy Che", campaign: "TikTok Footwear Push", date: "2026-07-08", amount: 3200.00, method: "Wire Payout", status: "Pending Approval" }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 pr-6 font-bold text-white">{item.talent}</td>
                          <td className="py-2.5 pr-6 text-neutral-400">{item.campaign}</td>
                          <td className="py-2.5 pr-6 text-neutral-400">{item.date}</td>
                          <td className="py-2.5 pr-6 font-mono font-bold text-white">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                          </td>
                          <td className="py-2.5 pr-6 text-neutral-400">{item.method}</td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : role === "talent" ? (
              <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Upcoming Payouts
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#222] text-neutral-500 font-bold">
                        <th className="pb-2 pr-6">Campaign</th>
                        <th className="pb-2 pr-6">Expected Date</th>
                        <th className="pb-2 pr-6">Payment Method</th>
                        <th className="pb-2 pr-6">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {talentUpcomingPayouts.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 pr-6 font-bold text-white">{item.campaign}</td>
                          <td className="py-2.5 pr-6 text-neutral-400">{item.date}</td>
                          <td className="py-2.5 pr-6 text-neutral-400">{item.method}</td>
                          <td className="py-2.5 pr-6 font-mono font-bold text-white">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                          </td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : null}

            {/* Table 3.5: Incoming Requests (Talent only) */}
            {role === "talent" && (
              <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Incoming Connection Requests
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  {incomingConnections.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-8">No incoming connection requests pending.</p>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#222] text-neutral-500 font-bold">
                          <th className="pb-2">Sender Name</th>
                          <th className="pb-2">Sender Email</th>
                          <th className="pb-2">Sender Role</th>
                          <th className="pb-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {incomingConnections.map((conn: any) => (
                          <tr key={conn.id} className="hover:bg-white/[0.01]">
                            <td className="py-3 font-bold text-white">{conn.sender?.fullName || 'N/A'}</td>
                            <td className="py-3 text-neutral-400">{conn.sender?.email || conn.email}</td>
                            <td className="py-3">
                              <span className="inline-block text-[8px] font-mono px-1.5 py-0.25 rounded bg-neutral-800 text-neutral-300 capitalize">{conn.sender?.role || 'Brand'}</span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  onClick={() => handleAcceptConnection(conn.id)}
                                  disabled={isAcceptingConnection || isDecliningConnection}
                                  className="h-7 px-3 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold cursor-pointer"
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => handleDeclineConnection(conn.id)}
                                  disabled={isAcceptingConnection || isDecliningConnection}
                                  className="h-7 px-2 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-bold cursor-pointer"
                                >
                                  Decline
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            )}

            {/* Table 4: Recent Activity */}
            <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                Recent Activity Log
              </h3>
              <div className="space-y-3">
                {role === 'agency' ? (
                  [
                    { text: `Invoice Synced: Invoice #INV-${invoices[0]?.docNumber || '1092'} synced from ${currentProvider}`, date: "10 mins ago" },
                    { text: `Brand Payment Received: $15,000.00 settled from Aura Skincare`, date: "2 hours ago" },
                    { text: `Talent Paid: $4,500.00 settled via ACH to Jessica Bailey`, date: "1 day ago" },
                    { text: `Campaign Updated: Summer Glow Launch progress is now 45%`, date: "2 days ago" },
                    { text: `Brand Invitation Accepted: Aura Skincare relationship is now ACTIVE`, date: "3 days ago" },
                    { text: `Integration Synced: ${currentProvider === 'quickbooks' ? 'QuickBooks Online' : 'Xero'} connection state healthy`, date: "3 days ago" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs hover:bg-white/[0.01] py-1">
                      <span className="text-neutral-300 font-medium">{item.text}</span>
                      <span className="text-neutral-500 font-mono text-[10px]">{item.date}</span>
                    </div>
                  ))
                ) : (
                  [
                    { text: `Invoice Synced: Invoice #INV-${invoices[0]?.docNumber || '1092'} synced from ${currentProvider}`, date: "10 mins ago" },
                    { text: `Invoice Approved: Invoice #INV-${invoices[1]?.docNumber || '3392'} approved for split payout`, date: "2 hours ago" },
                    { text: `Payment Completed: $24,500.00 settled via ACH to Kairos Media`, date: "1 day ago" },
                    { text: `Agency invitation status updated: VaynerMedia invitation marked as PENDING`, date: "2 days ago" },
                    { text: `Integration Synced: ${currentProvider === 'quickbooks' ? 'QuickBooks Online' : 'Xero'} connection state healthy`, date: "3 days ago" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs hover:bg-white/[0.01] py-1">
                      <span className="text-neutral-300 font-medium">{item.text}</span>
                      <span className="text-neutral-500 font-mono text-[10px]">{item.date}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

          </div>
        </div>

        {/* Right Column (1/3 width) - Quick Actions, Integrations, Plaid, Cards */}
        <div className="space-y-6">
          
          {/* 1. Quick Actions Panel */}
          <Panel className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const baseClassName =
                  "flex flex-col items-center gap-2 rounded-[10px] border border-[#3a3a3a] bg-black px-2 py-3 text-center transition-colors hover:border-white/20 hover:bg-white/[0.02] cursor-pointer";

                if (action.label === "Sync Integrations" || action.label === "Export Report") {
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => handleQuickActionClick(action.label)}
                      className={baseClassName}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#3a3a3a] bg-black">
                        <Icon className="h-4 w-4 text-white" />
                      </span>
                      <span className="text-[9px] leading-4 text-white font-bold">{action.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={baseClassName}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#3a3a3a] bg-black">
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-[9px] leading-4 text-white font-bold">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </Panel>

          {/* 2. Wallet Snapshot Panel (Agency only) */}
          {role === "agency" && (
            <Panel className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Wallet Snapshot</h2>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Available Float Balance", amount: "$250,000.00", color: "text-white" },
                  { label: "Pending Incoming Balance", amount: "$18,500.00", color: "text-amber-500" },
                  { label: "Escrow Split Balance", amount: "$73,790.00", color: "text-blue-400" },
                ].map((bal, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 rounded border border-[#222] bg-black">
                    <span className="text-neutral-400">{bal.label}</span>
                    <span className={`font-mono font-bold ${bal.color}`}>{bal.amount}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* My Connections Widget (Talent only) */}
          {role === "talent" && (
            <Panel className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">My Connections</h2>
                <Link href="/dashboard/connections" className="text-[10px] font-bold text-neutral-500 hover:text-white flex items-center gap-0.5">
                  Manage
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded border border-[#222] bg-black flex flex-col">
                  <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wider">Connected Brands</span>
                  <span className="font-bold text-white mt-1 text-[11px]">{connectedPartners.filter((p: any) => p.partner?.role === 'brand').length} Connected</span>
                </div>
                <div className="p-2.5 rounded border border-[#222] bg-black flex flex-col">
                  <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wider">Connected Agencies</span>
                  <span className="font-bold text-white mt-1 text-[11px]">{connectedPartners.filter((p: any) => p.partner?.role === 'agency').length} Connected</span>
                </div>
                <div className="p-2.5 rounded border border-[#222] bg-black flex flex-col col-span-2">
                  <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wider">Pending Requests & Invitations</span>
                  <span className="font-bold text-amber-500 mt-1 text-[11px]">{incomingConnections.length} Pending</span>
                </div>
              </div>
            </Panel>
          )}

          {/* 2.5 Manual Data Ingestion Dropzone (Talent & Agency only) */}
          {role !== "brand" && (
            <CsvDropzonePanel walletId={user?.walletId || ""} />
          )}

          {/* 3. Integrations Shortcuts Card */}
          <IntegrationsShortcutsPanel
            connectedIntegrations={connectedIntegrations}
            onAddClick={() => setIsAddIntegrationModalOpen(true)}
            currentProvider={currentProvider}
          />

          {/* 4. Banking Summary */}
          <Panel className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Connected Banking Feeds</h2>
            </div>
            
            <div className="space-y-3">
              {linkedCards.map((card, i) => (
                <div key={i} className="flex items-center gap-3 rounded-[10px] border border-[#222] bg-[#0c0c0c] p-3">
                  <BankCardFace card={card} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-white">{card.name}</p>
                    <p className="mt-1 text-[10px] text-neutral-500 font-mono">{card.detail}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center text-xs pt-2 border-t border-[#222]">
                <span className="text-neutral-400">Plaid Available Float</span>
                <span className="font-mono font-bold text-white">$250,000.00</span>
              </div>
            </div>
          </Panel>

          {/* 5. Notifications Panel */}
          <Panel className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Action Center</h2>
              {notifications.some(n => !n.read) && (
                <button
                  type="button"
                  onClick={async () => {
                    await markNotificationsRead().unwrap();
                    refetchNotifications();
                  }}
                  className="text-[9px] font-bold text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
              {/* Render dynamic backend notifications first */}
              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded border text-xs transition-all ${
                    notif.read
                      ? 'bg-neutral-900/40 border-[#222] text-neutral-400'
                      : 'bg-blue-500/5 border-blue-500/20 text-white'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${notif.read ? 'text-neutral-500' : 'text-blue-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{notif.title}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{notif.message}</p>
                    <span className="text-[8px] font-mono text-neutral-500 block mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Fallback alerts if notifications list is empty */}
              {notifications.length === 0 && (
                <p className="text-xs text-neutral-500 text-center py-4">No pending alerts. You are all caught up!</p>
              )}
            </div>
          </Panel>

        </div>
      </div>

      {/* Modal: Plaid / Bank Link */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[16px] border border-[#3a3a3a] bg-[#0c0c0c] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {linkModalStep === "select" && (
              <div className="text-center pt-2">
                <h3 className="text-[16px] font-bold text-white mb-2">Link Bank or Debit Card</h3>
                <p className="text-[12px] text-[#8f8f8f] mb-6">Select a connection pathway to link fund sources.</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setLinkModalStep("plaid_intro")}
                    className="flex items-center justify-center h-10 w-full rounded-[8px] bg-[#0A5CFF] text-[13px] font-bold text-white hover:bg-[#004BE5] cursor-pointer transition-all"
                  >
                    Link via Plaid API
                  </button>
                  <button
                    onClick={() => setLinkModalStep("card_form")}
                    className="flex items-center justify-center h-10 w-full rounded-[8px] border border-[#3a3a3a] bg-transparent text-[13px] font-bold text-[#b8b8b8] hover:bg-[#1a1a1a] hover:text-white cursor-pointer transition-all"
                  >
                    Manual Card Binding
                  </button>
                </div>
              </div>
            )}

            {/* Plaid connection flow */}
            {linkModalStep === "plaid_intro" && (
              <div className="text-center pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5ECF6] mx-auto mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/plaid-logo.svg" alt="Plaid" className="h-6 w-auto" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">Connect via Plaid</h3>
                <p className="text-[11px] leading-relaxed text-[#8f8f8f] mb-6">
                  Plaid lets you securely link bank feeds in seconds. Credentials are encrypted end-to-end and never stored by AgncyPay.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLinkModalStep("select")}
                    className="flex-1 h-9 rounded-[7px] border border-[#3a3a3a] text-[12px] font-bold text-[#b8b8b8] hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setLinkModalStep("plaid_banks")}
                    className="flex-1 h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-neutral-200 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {linkModalStep === "plaid_banks" && (
              <div className="pt-2">
                <h3 className="text-[15px] font-bold text-white mb-4 text-center">Select your bank</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["Chase", "Bank of America", "Mercury", "Wells Fargo", "Citi", "Capital One"].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => handleSelectBank(bank)}
                      className="h-12 rounded-[8px] border border-[#3a3a3a] bg-black text-[12px] font-bold text-neutral-300 hover:border-white hover:text-white cursor-pointer transition-all"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setLinkModalStep("plaid_intro")}
                  className="w-full h-9 rounded-[7px] border border-[#3a3a3a] text-[12px] font-bold text-[#b8b8b8] hover:text-white cursor-pointer"
                >
                  Back
                </button>
              </div>
            )}

            {linkModalStep === "plaid_login" && (
              <form onSubmit={handlePlaidLogin} className="pt-2 space-y-4">
                <h3 className="text-[15px] font-bold text-white mb-2 text-center">Log in to {selectedBank}</h3>
                <p className="text-[11px] text-[#8f8f8f] text-center mb-4">Enter sandbox bank account details to authorize link.</p>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">User ID</label>
                  <input
                    type="text"
                    value={plaidUsername}
                    onChange={(e) => setPlaidUsername(e.target.value)}
                    placeholder="Username"
                    className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none"
                  />
                  {plaidErrors.username && <p className="text-[10px] text-red-400 mt-1 font-semibold">{plaidErrors.username}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={plaidPassword}
                    onChange={(e) => setPlaidPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none"
                  />
                  {plaidErrors.password && <p className="text-[10px] text-red-400 mt-1 font-semibold">{plaidErrors.password}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setLinkModalStep("plaid_banks")}
                    className="flex-1 h-9 rounded-[7px] border border-[#3a3a3a] text-[12px] font-bold text-[#b8b8b8] hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-neutral-200 cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {linkModalStep === "plaid_verifying" && (
              <div className="text-center py-6">
                <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                <h3 className="text-[15px] font-bold text-white mb-2">Verifying Plaid Link...</h3>
                <p className="text-[11px] text-[#8f8f8f] font-medium">{modalLoadingText}</p>
              </div>
            )}

            {linkModalStep === "plaid_success" && (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">Bank Linked Successfully!</h3>
                <p className="text-[11px] text-[#8f8f8f] mb-6">Checking and transactions are synced in sandbox profile.</p>
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="h-9 w-full rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-neutral-200 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

            {/* Manual Card Binds */}
            {linkModalStep === "card_form" && (
              <form onSubmit={handleManualAddCard} className="pt-2 space-y-4">
                <h3 className="text-[15px] font-bold text-white mb-4 text-center">Add Debit/Credit Card</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none"
                  />
                  {cardErrors.cardHolder && <p className="text-[10px] text-red-400 mt-1 font-semibold">{cardErrors.cardHolder}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none"
                  />
                  {cardErrors.cardNumber && <p className="text-[10px] text-red-400 mt-1 font-semibold">{cardErrors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none text-center"
                    />
                    {cardErrors.cardExpiry && <p className="text-[10px] text-red-400 mt-1 font-semibold">{cardErrors.cardExpiry}</p>}
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">CVC</label>
                    <input
                      type="password"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none text-center"
                    />
                    {cardErrors.cardCVC && <p className="text-[10px] text-red-400 mt-1 font-semibold">{cardErrors.cardCVC}</p>}
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      placeholder="90210"
                      className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-[#111] px-3 text-[12px] text-white focus:border-neutral-500 outline-none text-center"
                    />
                    {cardErrors.cardZip && <p className="text-[10px] text-red-400 mt-1 font-semibold">{cardErrors.cardZip}</p>}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setLinkModalStep("select")}
                    className="flex-1 h-9 rounded-[7px] border border-[#3a3a3a] text-[12px] font-bold text-[#b8b8b8] hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-9 rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-neutral-200 cursor-pointer"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            )}

            {linkModalStep === "card_verifying" && (
              <div className="text-center py-6">
                <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                <h3 className="text-[15px] font-bold text-white mb-2">Adding Bank Card...</h3>
                <p className="text-[11px] text-[#8f8f8f] font-medium">{modalLoadingText}</p>
              </div>
            )}

            {linkModalStep === "card_success" && (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">Card Added Successfully!</h3>
                <p className="text-[11px] text-[#8f8f8f] mb-6">Debit hold confirmed. Ready for wallet conversions.</p>
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="h-9 w-full rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-neutral-200 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Integrations Select */}
      {isAddIntegrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[16px] border border-[#3a3a3a] bg-[#0c0c0c] p-6 shadow-2xl">
            <button
              onClick={() => setIsAddIntegrationModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {addIntegrationModalStep === "select" && (
              <div className="pt-2">
                <h3 className="text-[16px] font-bold text-white mb-4 text-center">Add Integration</h3>
                <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-1">
                  {[
                    { label: "QuickBooks", src: "/quickbook.png", desc: "Keep QuickBooks Online ledgers updated in real-time." },
                    { label: "Xero", src: "/xero.png", desc: "Keep Xero ledger accounts updated in real-time." },
                    { label: "Sage", src: "/sage.png", desc: "Automate financial reporting & payables to Sage Intacct." },
                    { label: "Mercury", src: "/mercuryLogo.png", desc: "Sync bank activity and card transactions.", bg: "bg-white" },
                    { label: "NetSuite", src: "/netsuite.png", desc: "Enterprise ledger sync with Oracle NetSuite ERP." }
                  ].map((integration) => {
                    const isConnected = connectedIntegrations.includes(integration.label);
                    return (
                      <button
                        key={integration.label}
                        disabled={isConnected}
                        onClick={() => handleConnectIntegration(integration)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all",
                          isConnected 
                            ? "border-[#222] bg-[#080808] opacity-50 cursor-not-allowed" 
                            : "border-[#3a3a3a] bg-black hover:border-white hover:bg-white/[0.02]"
                        )}
                      >
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded bg-transparent p-1", integration.bg || "bg-transparent")}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={integration.src} alt={integration.label} className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-white">{integration.label}</span>
                            {isConnected && <span className="text-[9px] font-bold text-green-500">Connected</span>}
                          </div>
                          <p className="text-[10px] text-neutral-500 truncate mt-0.5">{integration.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {addIntegrationModalStep === "connecting" && (
              <div className="text-center py-6">
                <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                <h3 className="text-[15px] font-bold text-white mb-2">Connecting integration...</h3>
                <p className="text-[11px] text-[#8f8f8f] font-medium">{integrationLoadingText}</p>
              </div>
            )}

            {addIntegrationModalStep === "success" && (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                  <Plug className="h-6 w-6" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">Connected successfully!</h3>
                <p className="text-[11px] text-[#8f8f8f] mb-6">Integration profile established and synced in current workspace.</p>
                <button
                  onClick={() => setIsAddIntegrationModalOpen(false)}
                  className="h-9 w-full rounded-[7px] bg-white text-[12px] font-bold text-black hover:bg-neutral-200 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Wallet contacts */}
      {isWalletContactsOpen && (
        <WalletContactsOverlay
          query={walletContactQuery}
          autosplitContactIds={autosplitContactIds}
          onQueryChange={setWalletContactQuery}
          onClose={() => setIsWalletContactsOpen(false)}
          onToggleContact={handleToggleAutosplitContact}
          onEnableAll={handleEnableAllAutosplitContacts}
        />
      )}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "border-green-500/30 bg-[#0d0d0d]/90 text-green-400" 
            : "border-red-500/30 bg-[#0d0d0d]/90 text-red-400"
        }`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
            toast.type === "success" ? "bg-green-500/20" : "bg-red-500/20"
          }`}>
            {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <p className="text-xs font-bold text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
