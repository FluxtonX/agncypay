"use client";

import React, { useEffect, useState, startTransition, useCallback } from "react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { ArrowUpRight, Landmark, Loader2, Send } from "lucide-react";
import Link from "next/link";

interface QBPayout {
  id: string;
  name: string;
  detail: string;
  date: string;
  amount: string;
  fallback: string;
  method: string;
  status: string;
}

export function RecentPayoutsCard() {
  const [payouts, setPayouts] = useState<QBPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayouts = useCallback(async () => {
    try {
      const res = await fetch("/api/quickbooks/payouts", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to fetch payouts.");
      startTransition(() => {
        setConnected(body.connected ?? false);
        setPayouts(body.payouts || []);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load payouts.";
      startTransition(() => setError(msg));
    } finally {
      startTransition(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const badgeVariant = (status: string) => {
    if (status === "Paid") return "success" as const;
    if (status === "Failed") return "error" as const;
    return "warning" as const;
  };

  return (
    <Card className="p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Send className="h-4 w-4 text-orange-400" />
            Recent Outgoing Payouts
          </h3>
          <Link
            href="/dashboard/payouts"
            className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-0.5"
          >
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-neutral-500 animate-spin mb-3" />
            <p className="text-xs text-neutral-500">Retrieving settlement records...</p>
          </div>
        ) : error ? (
          <div className="text-xs text-red-400 font-medium py-8 text-center">{error}</div>
        ) : !connected ? (
          <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#3a3a3a] rounded-lg bg-white/[0.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/quickbook.png" alt="QuickBooks" className="h-8 w-8 object-contain mb-3 opacity-40" />
            <p className="text-xs text-neutral-400">Connect QuickBooks to see payouts.</p>
            <Link href="/dashboard/integrations" className="mt-2 text-xs font-bold text-white hover:underline">
              Connect QuickBooks →
            </Link>
          </div>
        ) : payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#3a3a3a] rounded-lg bg-white/[0.01]">
            <Landmark className="h-8 w-8 text-neutral-600 mb-3" />
            <p className="text-xs text-neutral-400">No outgoing payouts initiated.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="w-full flex items-center justify-between gap-3 rounded-lg border border-[#3a3a3a] bg-black px-3 py-2.5 transition-colors hover:border-white/30 hover:bg-white/[0.03] group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 border border-[#3a3a3a] font-bold text-xs text-amber-400">
                    {payout.fallback}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-[13px] font-semibold text-white">{payout.name}</p>
                    <p className="truncate text-[11px] text-neutral-500 mt-0.5">
                      {payout.detail} · {payout.method}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden text-[11px] sm:inline-block text-neutral-400">{payout.date}</span>
                  <span className="font-mono text-[13px] font-bold text-white">
                    -{payout.amount}
                  </span>
                  <Badge
                    variant={badgeVariant(payout.status)}
                    className="capitalize text-[10px] px-2 py-0.5"
                  >
                    {payout.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
