'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { RequestAnalytics } from "@/features/dashboard/components/RequestAnalytics";
import { useApp } from '@/shared/context/AppContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const { state } = useApp();
  const role = state.user?.role || 'brand';

  const brandAgenciesList = [
    { name: "VaynerMedia", amount: 27000.00, percent: 55 },
    { name: "Kairos Media", amount: 24500.00, percent: 45 },
  ];

  const talentCampaignsList = [
    { name: "Summer Glow Launch", amount: 4500.00, percent: 58 },
    { name: "TikTok Footwear Push", amount: 3200.00, percent: 42 },
  ];

  const breakdownList = role === 'talent' ? talentCampaignsList : brandAgenciesList;
  const breakDownTitle = role === 'talent' ? "Earnings by Campaign" : "Spend by Agency";

  const brandSettlement = [
    { status: "Paid Invoices", count: 2, amount: 36500.00, color: "bg-green-500" },
    { status: "Outstanding Payable", count: 2, amount: 38400.00, color: "bg-amber-500" },
    { status: "Failed Syncs", count: 0, amount: 0.00, color: "bg-red-500" },
  ];

  const talentSettlement = [
    { status: "Completed Payments", count: 1, amount: 4500.00, color: "bg-green-500" },
    { status: "Pending Payments", count: 1, amount: 3200.00, color: "bg-amber-500" },
    { status: "Failed Payouts", count: 0, amount: 0.00, color: "bg-red-500" },
  ];

  const settlementList = role === 'talent' ? talentSettlement : brandSettlement;
  const settlementTitle = role === 'talent' ? "Payment Status Breakdown" : "Invoice Settlement Breakdown";

  return (
    <div className="space-y-6 select-text">
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Reports & Financial Analytics</h2>
        <p className="text-xs text-neutral-400 mt-1">
          {role === 'talent' 
            ? "Review campaign earnings breakdown, payment settlement history, and monthly reports."
            : "Review spend reports, monthly payouts, agency breakdown, and ledger reconciliation audits."
          }
        </p>
      </div>

      <RequestAnalytics />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d]">
          <h3 className="text-[13px] font-bold text-white mb-3">{breakDownTitle}</h3>
          <div className="space-y-4 mt-4">
            {breakdownList.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{item.name}</span>
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
          <h3 className="text-[13px] font-bold text-white mb-3">{settlementTitle}</h3>
          <div className="space-y-4 mt-4">
            {settlementList.map((item, idx) => (
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
