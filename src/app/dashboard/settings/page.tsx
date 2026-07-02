'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { useApp } from '@/shared/context/AppContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { state } = useApp();
  const user = state.user;
  const role = user?.role || 'brand';

  const profileLabel = role === 'talent' ? 'Creator Profile' : role === 'agency' ? 'Agency Profile' : 'Brand Profile';
  const complianceLabel = role === 'talent' ? 'KYC & Compliance verification' : 'KYB & Compliance verification';
  const complianceDesc = role === 'talent' ? "Your identity verification has been fully approved." : "Your organization's KYB verification has been fully approved.";
  const description = role === 'talent' ? 'Configure creator profiles, wallet settings, notifications, and security options.' : 'Configure company profiles, workspace settings, notifications, and security options.';
  const roleName = role === 'talent' ? 'Creator' : role === 'agency' ? 'Agency Administrator' : 'Brand Administrator';

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
        <h2 className="text-xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-xs text-neutral-400 mt-1">{description}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="p-6 border-[#3a3a3a] bg-[#0d0d0d] space-y-4">
          <h3 className="text-sm font-bold text-white">{profileLabel}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium">Full Name</span>
              <p className="p-2.5 rounded bg-black border border-[#222] font-semibold text-white">{user?.fullName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium">Email Address</span>
              <p className="p-2.5 rounded bg-black border border-[#222] font-semibold text-white">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium">Workspace Role</span>
              <p className="p-2.5 rounded bg-black border border-[#222] font-semibold text-white capitalize">{roleName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium">Wallet ID (Escrow Account)</span>
              <p className="p-2.5 rounded bg-black border border-[#222] font-mono text-neutral-300">{user?.walletId || 'ws-brand-wallet-id'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#3a3a3a] bg-[#0d0d0d] space-y-4">
          <h3 className="text-sm font-bold text-white">{complianceLabel}</h3>
          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="font-semibold text-white">Identity Verification Track</p>
              <p className="text-neutral-500 mt-0.5">{complianceDesc}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/25">
              Verified
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
