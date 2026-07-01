'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { useApp } from '@/shared/context/AppContext';

export default function SettingsPage() {
  const { state } = useApp();
  const user = state.user;

  return (
    <div className="space-y-6 select-text">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-xs text-neutral-400 mt-1">Configure company profiles, workspace settings, notifications, and security options.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="p-6 border-[#3a3a3a] bg-[#0d0d0d] space-y-4">
          <h3 className="text-sm font-bold text-white">Brand Profile</h3>
          
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
              <p className="p-2.5 rounded bg-black border border-[#222] font-semibold text-white capitalize">{user?.role} Administrator</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium">Wallet ID (Escrow Account)</span>
              <p className="p-2.5 rounded bg-black border border-[#222] font-mono text-neutral-300">{user?.walletId || 'ws-brand-wallet-id'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#3a3a3a] bg-[#0d0d0d] space-y-4">
          <h3 className="text-sm font-bold text-white">KYB & Compliance verification</h3>
          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="font-semibold text-white">Business Verification Track</p>
              <p className="text-neutral-500 mt-0.5">Your organization's KYB verification has been fully approved.</p>
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
