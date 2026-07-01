'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CampaignsPage() {
  const mockCampaigns = [
    { id: "CMP-001", name: "Summer Launch 2026", budget: 120000.00, spend: 45000.00, agencies: 2, status: "Active" },
    { id: "CMP-002", name: "Holiday Influencer Push", budget: 250000.00, spend: 0.00, agencies: 3, status: "Planning" },
    { id: "CMP-003", name: "Q1 TikTok Campaign", budget: 85000.00, spend: 85000.00, agencies: 1, status: "Completed" },
  ];

  return (
    <div className="space-y-6 select-text font-medium text-xs">
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Campaigns & Projects</h2>
          <p className="text-xs text-neutral-400 mt-1">Manage marketing campaigns, budget allocations, and linked agencies.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockCampaigns.map((cmp) => {
          const pct = Math.min(100, Math.round((cmp.spend / cmp.budget) * 100));
          return (
            <Card key={cmp.id} className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{cmp.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    cmp.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    cmp.status === 'Completed' ? 'bg-neutral-800 text-neutral-400' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>{cmp.status}</span>
                </div>
                <h3 className="text-[14px] font-bold text-white mt-2">{cmp.name}</h3>
                <p className="text-[11px] text-neutral-500 mt-1">{cmp.agencies} Connected Agencies</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Spend: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cmp.spend)}</span>
                  <span>Budget: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cmp.budget)}</span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
