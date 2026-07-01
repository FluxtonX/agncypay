'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import {
  useGetConnectedBrandsQuery,
  useGetIncomingConnectionsQuery,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation
} from '@/lib/store/services/api';
import { Building, Loader2, UserCheck, Inbox, DollarSign, Receipt, Briefcase, XCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function BrandsPage() {
  const { data: brands = [], isLoading: loadingBrands, refetch: refetchBrands } = useGetConnectedBrandsQuery();
  const { data: incomingConnections = [], isLoading: loadingInvites, refetch: refetchInvites } = useGetIncomingConnectionsQuery();
  
  const [acceptConnection, { isLoading: isAccepting }] = useAcceptConnectionMutation();
  const [declineConnection, { isLoading: isDeclining }] = useDeclineConnectionMutation();

  const handleAcceptInvite = async (id: string) => {
    try {
      await acceptConnection(id).unwrap();
      alert('Brand connection accepted successfully! The Brand is now connected to your workspace.');
      refetchBrands();
      refetchInvites();
    } catch (err: any) {
      alert('Failed to accept: ' + (err?.data?.message || err.message));
    }
  };

  const handleDeclineInvite = async (id: string) => {
    if (!confirm('Are you sure you want to decline this request?')) return;
    try {
      await declineConnection(id).unwrap();
      alert('Connection request declined.');
      refetchInvites();
    } catch (err: any) {
      alert('Failed to decline: ' + (err?.data?.message || err.message));
    }
  };

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

      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Brand Partners</h2>
        <p className="text-xs text-neutral-400 mt-1">Manage corporate brand clients and active payment orchestration feeds.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Incoming Requests */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <Inbox className="h-4 w-4 text-neutral-400" />
              <h3 className="text-sm font-bold text-white">Incoming Requests</h3>
            </div>
            <p className="text-neutral-500 text-[10px] mb-4">Awaiting acceptance to activate split ledgers and payment feeds.</p>

            {loadingInvites ? (
              <div className="flex flex-col items-center justify-center flex-1 py-4">
                <Loader2 className="h-5 w-5 text-neutral-500 animate-spin" />
              </div>
            ) : incomingConnections.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-[#222] rounded-lg bg-black/50 py-8 text-center text-neutral-500">
                <Inbox className="h-6 w-6 text-neutral-700 mb-1" />
                <p className="text-[10px]">No pending connection requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingConnections.map((invite) => (
                  <div
                    key={invite.id}
                    className="p-3.5 rounded-lg border border-[#222] bg-black flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs">{invite.sender?.fullName || 'A Brand Client'}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{invite.sender?.email || invite.email}</p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-2">Received: {new Date(invite.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleAcceptInvite(invite.id)}
                        disabled={isAccepting || isDeclining}
                        className="flex-1 h-8 bg-white text-black hover:bg-neutral-200 text-[11px] font-bold cursor-pointer"
                      >
                        {isAccepting ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <UserCheck className="h-3 w-3 mr-1.5" />}
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDeclineInvite(invite.id)}
                        disabled={isAccepting || isDeclining}
                        className="h-8 px-2 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[11px] font-bold cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Connected Brands list */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[220px]">
            <h3 className="text-sm font-bold text-white mb-4">Connected Brands</h3>

            {loadingBrands ? (
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
              </div>
            ) : brands.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-[#222] rounded-lg bg-black/50 py-12 text-center text-neutral-500">
                <Building className="h-8 w-8 text-neutral-700 mb-2" />
                <p className="text-xs">No brand connections active.</p>
                <p className="text-[10px] text-neutral-600 mt-1">Once a Brand connects with you, their card will list here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex flex-col justify-between p-4 rounded-lg border border-[#222] bg-black hover:border-[#333] transition-all space-y-3"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{brand.fullName}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{brand.email}</p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-1">Wallet: {brand.walletId || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111] text-[10px]">
                      <div className="flex flex-col">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">Active Campaigns</span>
                        <span className="text-white font-bold mt-0.5 flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-neutral-400" />
                          2 Campaigns
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">Open Invoices</span>
                        <span className="text-white font-bold mt-0.5 flex items-center gap-1">
                          <Receipt className="h-3 w-3 text-neutral-400" />
                          1 Synced Invoice
                        </span>
                      </div>
                      <div className="flex flex-col mt-2">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">Total Revenue</span>
                        <span className="text-green-400 font-bold mt-0.5 flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />
                          $15,000.00
                        </span>
                      </div>
                      <div className="flex flex-col mt-2">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">Outstanding Balance</span>
                        <span className="text-amber-500 font-bold mt-0.5 flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />
                          $8,200.00
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#111]">
                      <span className="inline-flex items-center gap-1 text-[9px] text-green-400 font-bold bg-green-400/5 px-2 py-0.5 rounded border border-green-500/10">
                        <UserCheck className="h-2.5 w-2.5" />
                        Connected Partner
                      </span>
                      <span className="text-neutral-500 text-[9px] font-mono">Linked {new Date(brand.connectedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
