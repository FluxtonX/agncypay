"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/Card";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const chartData = [
  { label: "Jan", val: 190, amount: "$12,400", x: 10, y: 170 },
  { label: "Feb", val: 160, amount: "$15,800", x: 100, y: 140 },
  { label: "Mar", val: 165, amount: "$14,200", x: 190, y: 150 },
  { label: "Apr", val: 110, amount: "$22,500", x: 280, y: 95 },
  { label: "May", val: 130, amount: "$19,100", x: 370, y: 110 },
  { label: "Jun", val: 15, amount: "$34,000", x: 460, y: 20 },
];

export function RequestAnalytics() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // D-path for smooth line through data points
  const linePath = "M 10 170 C 55 155, 55 145, 100 140 C 145 135, 145 155, 190 150 C 235 145, 235 100, 280 95 C 325 90, 325 115, 370 110 C 415 105, 415 30, 460 20";
  const areaPath = `${linePath} L 460 200 L 10 200 Z`;

  return (
    <Card className="p-6 flex flex-col justify-between min-h-[360px] border-[#3a3a3a] bg-[#0d0d0d] relative group select-none">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Ledger Settlement History
          </h3>
          <span className="text-[10px] text-neutral-500">Hover graph to inspect</span>
        </div>

        {/* Custom SVG Line Chart */}
        <div className="relative h-48 w-full mt-4 flex items-end">
          {/* Floating Pill Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="absolute bg-black border border-[#3a3a3a] text-white px-2 py-1 rounded-[4px] text-[10px] font-bold pointer-events-none shadow-xl flex items-center gap-1.5 transition-all duration-150 z-10"
              style={{
                left: `${(chartData[hoveredIdx].x / 480) * 100}%`,
                top: `${(chartData[hoveredIdx].y / 200) * 100}%`,
                transform: "translate(-50%, -130%)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{chartData[hoveredIdx].label}: {chartData[hoveredIdx].amount}</span>
            </div>
          )}

          <svg className="h-full w-full overflow-visible" viewBox="0 0 480 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Gridlines */}
            <line x1="0" y1="50" x2="480" y2="50" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
            <line x1="0" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
            <line x1="0" y1="150" x2="480" y2="150" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />

            {/* Area Gradient */}
            <path
              d={areaPath}
              fill="url(#chartGlow)"
              className="transition-all duration-700 ease-out"
            />

            {/* Path line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#shadow)"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 0,
              }}
            />

            {/* Active Pointer line */}
            {hoveredIdx !== null && (
              <line
                x1={chartData[hoveredIdx].x}
                y1={0}
                x2={chartData[hoveredIdx].x}
                y2={200}
                stroke="rgba(16, 185, 129, 0.2)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            )}

            {/* Data Dots & Interactive Hotspots */}
            {chartData.map((pt, idx) => (
              <g key={idx}>
                {/* Visual Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === idx ? 6 : 4}
                  fill={hoveredIdx === idx ? "#ffffff" : "#10b981"}
                  stroke="#121214"
                  strokeWidth={hoveredIdx === idx ? 3 : 2}
                  className="transition-all duration-200 cursor-pointer shadow-lg"
                />
                
                {/* Glowing outer ring when hovered */}
                {hoveredIdx === idx && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={12}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ animationDuration: "1.5s" }}
                  />
                )}

                {/* Invisible larger hover target area */}
                <rect
                  x={pt.x - 30}
                  y={0}
                  width={60}
                  height={200}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            ))}
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
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Ledger settlements increased by 14% this quarter
        </span>
        <Link href="/dashboard/reports" className="text-white hover:text-emerald-300 transition-colors flex items-center gap-1">
          View Details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
}
