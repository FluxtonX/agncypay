'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { RequestAnalytics } from "@/features/dashboard/components/RequestAnalytics";

export default function ReportsPage() {
  return (
    <div className="space-y-6 select-text">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Reports & Financial Analytics</h2>
        <p className="text-xs text-neutral-400 mt-1">Review spend reports, monthly payouts, agency breakdown, and ledger reconciliation audits.</p>
      </div>

      <RequestAnalytics />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d]">
          <h3 className="text-[13px] font-bold text-white mb-3">Spend by Agency</h3>
          <div className="space-y-4 mt-4">
            {[
              { agency: "VaynerMedia", amount: 27000.00, percent: 55 },
              { agency: "Kairos Media", amount: 24500.00, percent: 45 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{item.agency}</span>
                  <span className="font-mono text-neutral-300 font-bold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.amount)}
                  </span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d]">
          <h3 className="text-[13px] font-bold text-white mb-3">Invoice Settlement Breakdown</h3>
          <div className="space-y-4 mt-4">
            {[
              { status: "Paid Invoices", count: 2, amount: 36500.00, color: "bg-green-500" },
              { status: "Outstanding Payable", count: 2, amount: 38400.00, color: "bg-amber-500" },
              { status: "Failed Syncs", count: 0, amount: 0.00, color: "bg-red-500" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-neutral-400 font-medium">{item.status} ({item.count})</span>
                </div>
                <span className="font-mono font-bold text-white">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
