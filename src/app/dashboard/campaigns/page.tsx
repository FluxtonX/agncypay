'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/shared/context/AppContext';

export default function CampaignsPage() {
  const { state } = useApp();
  const role = state.user?.role || 'brand';

  const mockCampaigns = [
    { id: "CMP-001", name: "Summer Launch 2026", budget: 120000.00, spend: 45000.00, agencies: 2, status: "Active" },
    { id: "CMP-002", name: "Holiday Influencer Push", budget: 250000.00, spend: 0.00, agencies: 3, status: "Planning" },
    { id: "CMP-003", name: "Q1 TikTok Campaign", budget: 85000.00, spend: 85000.00, agencies: 1, status: "Completed" },
  ];

  const mockTalentCampaigns = [
    { id: "CMP-TAL-001", name: "Summer Glow Launch", brand: "Aura Skincare", agency: "VaynerMedia", role: "Primary Creator", status: "Active", earnings: 4500.00, progress: 45 },
    { id: "CMP-TAL-002", name: "TikTok Footwear Push", brand: "Apex Athletic", agency: "Kairos Media", role: "Content Creator", status: "Active", earnings: 3200.00, progress: 0 },
    { id: "CMP-TAL-003", name: "Holiday Gift Guide", brand: "iHeartRadio", agency: "VaynerMedia", role: "Host/Influencer", status: "Planning", earnings: 5000.00, progress: 0 },
    { id: "CMP-TAL-004", name: "Spring Fashion Week", brand: "Instagram", agency: "Kairos Media", role: "Model/Presenter", status: "Completed", earnings: 6000.00, progress: 100 },
  ];

  const campaignsList = role === 'talent' ? mockTalentCampaigns : mockCampaigns;

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
          <p className="text-xs text-neutral-400 mt-1">
            {role === 'talent' 
              ? "Manage your active marketing campaigns, roles, and payouts."
              : "Manage marketing campaigns, budget allocations, and linked agencies."
            }
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaignsList.map((cmp: any) => {
          const pct = 'progress' in cmp ? cmp.progress : Math.min(100, Math.round((cmp.spend / cmp.budget) * 100));
          return (
            <Card key={cmp.id} className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{cmp.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    cmp.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    cmp.status === 'Completed' ? 'bg-neutral-800 text-neutral-400' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>{cmp.status}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3.5 tracking-tight">{cmp.name}</h3>
                
                {'role' in cmp ? (
                  <div className="mt-3.5 space-y-2 border-t border-[#1a1a1a] pt-3 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-medium">Brand</span>
                      <span className="text-white font-semibold">{cmp.brand}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-medium">Agency</span>
                      <span className="text-white font-semibold">{cmp.agency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-medium">My Role</span>
                      <span className="text-neutral-300 font-bold px-2 py-0.5 rounded bg-neutral-900 border border-[#222]/80">
                        {cmp.role}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3.5 space-y-2 border-t border-[#1a1a1a] pt-3 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-medium">Agencies</span>
                      <span className="text-white font-semibold">{cmp.agencies} Connected</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  {'earnings' in cmp ? (
                    <>
                      <span>Earnings: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cmp.earnings)}</span>
                      <span>Progress: {pct}%</span>
                    </>
                  ) : (
                    <>
                      <span>Spend: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cmp.spend)}</span>
                      <span>Budget: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cmp.budget)}</span>
                    </>
                  )}
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
