"use client";

import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { GitFork, Plus, ArrowRight } from "lucide-react";

export default function SplitsPage() {
  const activeSplits = [
    {
      id: "SPL-1002",
      campaign: "Nike Autumn Collection 2026",
      participants: [
        { role: "Agency Share", ratio: "20%", wallet: "ws-agency-main" },
        { role: "Talent Payout", ratio: "80%", wallet: "ws-talent-martin" },
      ],
      feeRatio: "2.0%",
      status: "active",
    },
    {
      id: "SPL-1003",
      campaign: "Coca-Cola Refresh Campaign",
      participants: [
        { role: "Agency Share", ratio: "15%", wallet: "ws-agency-main" },
        { role: "Talent Payout", ratio: "85%", wallet: "ws-talent-sara" },
      ],
      feeRatio: "2.0%",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6 select-text">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Split Payments</h2>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Orchestrate campaign revenue split ratios across multiple stakeholder wallets.
          </p>
        </div>
        <Button className="h-9 px-4 text-xs font-bold gap-1.5">
          <Plus className="h-4 w-4" />
          Add Split Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {activeSplits.map((split) => (
          <Card key={split.id} className="p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-neutral-500">{split.id}</span>
                <Badge variant="success">Active</Badge>
              </div>

              <h3 className="text-sm font-bold text-white mb-6">{split.campaign}</h3>

              <div className="space-y-4">
                {split.participants.map((part, index) => (
                  <div key={index} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-400">{part.role}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white">{part.ratio}</span>
                      <span className="font-mono text-[10px] text-neutral-600 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                        {part.wallet}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#3a3a3a] pt-4 mt-6 flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              <span>Platform Fee: {split.feeRatio}</span>
              <button className="text-white hover:underline flex items-center gap-1">
                Edit Splits <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
          Visual Split Simulation
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-lg bg-neutral-950/40 border border-[#3a3a3a] p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white font-bold text-xs border border-white/20 shadow-md">
              $10K
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Client Invoice</span>
          </div>

          <div className="flex flex-col items-center gap-2 text-neutral-600">
            <GitFork className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Auto Splitter</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
            <div className="flex flex-col items-center gap-2 border border-[#3a3a3a] bg-white/[0.01] p-4 rounded-xl min-w-[120px]">
              <span className="text-base font-bold text-white">$8,000</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Talent (80%)</span>
            </div>
            <div className="flex flex-col items-center gap-2 border border-[#3a3a3a] bg-white/[0.01] p-4 rounded-xl min-w-[120px]">
              <span className="text-base font-bold text-white">$2,000</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Agency (20%)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
