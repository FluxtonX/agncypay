"use client";

import React, { useEffect, useState, startTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { ArrowDownLeft, FileText, Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/shared/context/AppContext";

interface QBInvoice {
  id: string;
  docNumber: string;
  name: string;
  detail: string;
  date: string;
  amount: number;
  status: string;
  daysText: string;
  isManual?: boolean;
  logo?: string;
}

export function RecentIncomeCard() {
  const router = useRouter();
  const { state } = useApp();
  const walletId = state.user?.walletId;
  const [invoices, setInvoices] = useState<QBInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncome = useCallback(async () => {
    try {
      // 1. Fetch QuickBooks invoices
      let qbInvoices: QBInvoice[] = [];
      let qbConnected = false;
      try {
        const qbRes = await fetch("/api/quickbooks/invoices", { cache: "no-store" });
        const qbBody = await qbRes.json();
        if (qbRes.ok) {
          qbInvoices = qbBody.invoices || [];
          qbConnected = qbBody.connected ?? false;
        }
      } catch (e) {
        // ignore QBO errors to allow manual payments to load
      }

      // 2. Fetch manual payments from our database if walletId is present
      let manualInvoices: QBInvoice[] = [];
      if (walletId) {
        try {
          const paymentsRes = await fetch(`/api/payments/wallet/${walletId}`, { cache: "no-store" });
          const paymentsBody = await paymentsRes.json();
          if (paymentsRes.ok && paymentsBody?.success && Array.isArray(paymentsBody?.data)) {
            const groupedManual: { [vendor: string]: any } = {};
            for (const p of paymentsBody.data) {
              if (p.source !== "MANUAL") continue;
              const vendorName = p.metadata?.vendor || "Digital Sales";
              const amount = parseFloat(p.amount);
              const createdAt = new Date(p.createdAt);

              if (groupedManual[vendorName]) {
                groupedManual[vendorName].amount += amount;
                if (createdAt > new Date(groupedManual[vendorName].rawDate)) {
                  groupedManual[vendorName].rawDate = p.createdAt;
                  groupedManual[vendorName].date = createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                  });
                  groupedManual[vendorName].daysText = p.status === "SETTLED" ? "Succeed" : "Processing";
                  groupedManual[vendorName].status = p.status === "SETTLED" ? "Paid" : "Pending";
                }
              } else {
                groupedManual[vendorName] = {
                  id: p.id,
                  docNumber: p.externalId?.split("-").slice(1).join("-").toUpperCase() || "CSV",
                  name: vendorName,
                  detail: p.description || "Manual File Ingestion",
                  rawDate: p.createdAt,
                  date: createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                  }),
                  amount: amount,
                  status: p.status === "SETTLED" ? "Paid" : "Pending",
                  daysText: p.status === "SETTLED" ? "Succeed" : "Processing",
                  isManual: true,
                  logo: `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&size=128`
                };
              }
            }
            manualInvoices = Object.values(groupedManual);
          }
        } catch (e) {
          // ignore manual payments fetch errors
        }
      }

      // 3. Combine and sort by amount descending (highest amount first)
      const combined = [...qbInvoices, ...manualInvoices];
      combined.sort((a, b) => b.amount - a.amount);

      startTransition(() => {
        setConnected(qbConnected || manualInvoices.length > 0);
        setInvoices(combined);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load income.";
      startTransition(() => setError(msg));
    } finally {
      startTransition(() => setLoading(false));
    }
  }, [walletId]);

  useEffect(() => {
    fetchIncome();
    window.addEventListener("incomesUpdated", fetchIncome);
    return () => window.removeEventListener("incomesUpdated", fetchIncome);
  }, [fetchIncome]);

  const badgeVariant = (status: string) => {
    if (status === "Paid") return "success" as const;
    if (status === "Pending") return "warning" as const;
    return "neutral" as const;
  };

  return (
    <Card className="p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
            Recent Income & Deposits
          </h3>
          <Link
            href="/dashboard/income"
            className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-0.5"
          >
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-neutral-500 animate-spin mb-3" />
            <p className="text-xs text-neutral-500">Retrieving income data...</p>
          </div>
        ) : error ? (
          <div className="text-xs text-red-400 font-medium py-8 text-center">{error}</div>
        ) : invoices.length > 0 ? (
          <div className="space-y-2">
            {invoices.map((invoice) => {
              const isClickable = !invoice.isManual;
              return (
                <button
                  key={invoice.id}
                  type="button"
                  disabled={!isClickable}
                  onClick={isClickable ? () => router.push(`/dashboard/pay-flow/${invoice.id}`) : undefined}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg border border-[#3a3a3a] bg-black px-3 py-2.5 transition-colors",
                    isClickable ? "hover:border-white/30 hover:bg-white/[0.03] cursor-pointer group" : "cursor-default"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 border border-[#3a3a3a] p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={invoice.isManual ? invoice.logo : "/quickbook.png"} 
                        alt={invoice.isManual ? "Manual Ingest" : "QuickBooks"} 
                        className="h-full w-full object-contain rounded"
                        onError={(e) => {
                          // Fallback to generic icon if image load fails
                          (e.target as HTMLImageElement).src = "/music-file.png";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className={cn(
                        "truncate text-[13px] font-semibold text-white transition-colors",
                        isClickable && "group-hover:text-neutral-200"
                      )}>
                        {invoice.name}
                      </p>
                      <p className="truncate text-[11px] text-neutral-500 mt-0.5">
                        {invoice.isManual ? `Digital Sales Ingest · ${invoice.detail}` : `Invoice #${invoice.docNumber} · ${invoice.daysText}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden text-[11px] sm:inline-block text-neutral-400">{invoice.date}</span>
                    <span className="font-mono text-[13px] font-bold text-white">
                      +${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <Badge
                      variant={badgeVariant(invoice.status)}
                      className="capitalize text-[10px] px-2 py-0.5"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        ) : !connected ? (
          <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#3a3a3a] rounded-lg bg-white/[0.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/quickbook.png" alt="QuickBooks" className="h-8 w-8 object-contain mb-3 opacity-40" />
            <p className="text-xs text-neutral-400">Connect QuickBooks to see income.</p>
            <Link href="/dashboard/integrations" className="mt-2 text-xs font-bold text-white hover:underline">
              Connect QuickBooks →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#3a3a3a] rounded-lg bg-white/[0.01]">
            <FileText className="h-8 w-8 text-neutral-600 mb-3" />
            <p className="text-xs text-neutral-400">No incoming transactions found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
