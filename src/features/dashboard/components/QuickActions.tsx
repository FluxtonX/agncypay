"use client";

import React from "react";
import { useApp } from "@/shared/context/AppContext";
import { Card } from "@/shared/components/ui/Card";
import { ArrowRight, FileText, GitFork, Users, PlusCircle } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const { state } = useApp();
  const role = state.user?.role || "brand";

  return (
    <Card className="p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
        Workspace Quick Actions
      </h3>
      <div className="space-y-3">
        {role === "brand" && (
          <>
            <Link
              href="/dashboard/invoices"
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] p-3.5 text-xs font-bold text-white transition-all"
            >
              <span className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4 text-neutral-400" />
                Approve Pending Invoices
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </Link>
            <Link
              href="/dashboard/quickbooks"
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] p-3.5 text-xs font-bold text-white transition-all"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-neutral-400" />
                Sync QuickBooks Online
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </Link>
          </>
        )}

        {role === "agency" && (
          <>
            <Link
              href="/dashboard/splits"
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] p-3.5 text-xs font-bold text-white transition-all"
            >
              <span className="flex items-center gap-2.5">
                <GitFork className="h-4 w-4 text-neutral-400" />
                Manage Payout Splits
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </Link>
            <Link
              href="/dashboard/team"
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] p-3.5 text-xs font-bold text-white transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-neutral-400" />
                Invite Talent Manager
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </Link>
          </>
        )}

        {role === "talent" && (
          <>
            <Link
              href="/dashboard/invoices"
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] p-3.5 text-xs font-bold text-white transition-all"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-neutral-400" />
                Request Client Payout
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </Link>
            <Link
              href="/dashboard/splits"
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] p-3.5 text-xs font-bold text-white transition-all"
            >
              <span className="flex items-center gap-2.5">
                <GitFork className="h-4 w-4 text-neutral-400" />
                View Active Splits
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
