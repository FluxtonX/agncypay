"use client";

import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RequestAnalytics() {
  return (
    <Card className="p-6 flex flex-col justify-between min-h-[360px]">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
          Ledger Settlement History
        </h3>
        
        {/* Custom SVG Line Chart */}
        <div className="relative h-48 w-full mt-4 flex items-end">
          <svg className="h-full w-full" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area Gradient */}
            <path
              d="M0 200 L50 160 L100 170 L150 120 L200 140 L250 80 L300 95 L350 40 L400 60 L450 20 L500 10 L500 200 Z"
              fill="url(#chartGlow)"
            />
            {/* Path line */}
            <path
              d="M0 200 L50 160 L100 170 L150 120 L200 140 L250 80 L300 95 L350 40 L400 60 L450 20 L500 10"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Gridlines */}
            <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
            <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
          </svg>
        </div>
        
        {/* Chart X Labels */}
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-neutral-500 mt-3 px-1">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>

      <div className="border-t border-[#3a3a3a] pt-4 mt-6 flex justify-between items-center text-xs font-semibold text-neutral-400">
        <span className="flex items-center gap-1.5 text-white">
          <TrendingUp className="h-4 w-4" />
          Ledger settlements increased by 14% this quarter
        </span>
        <Link href="/dashboard/invoices" className="text-white hover:underline flex items-center gap-1">
          View Details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
}
