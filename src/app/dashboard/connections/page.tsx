'use client';

import React, { useState } from 'react';
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import {
  useGetConnectedPartnersQuery,
  useGetIncomingConnectionsQuery,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
  useDeleteRelationshipMutation
} from '@/lib/store/services/api';
import {
  Building,
  Loader2,
  UserCheck,
  Inbox,
  DollarSign,
  Receipt,
  Briefcase,
  XCircle,
  ChevronLeft,
  Users,
  Calendar,
  Mail,
  Shield,
  Clock,
  Info,
  X,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ConnectionsPage() {
  const { data: partners = [], isLoading: loadingPartners, refetch: refetchPartners } = useGetConnectedPartnersQuery();
  const { data: incomingConnections = [], isLoading: loadingInvites, refetch: refetchInvites } = useGetIncomingConnectionsQuery();

  const [acceptConnection, { isLoading: isAccepting }] = useAcceptConnectionMutation();
  const [declineConnection, { isLoading: isDeclining }] = useDeclineConnectionMutation();
  const [deleteRelationship, { isLoading: isDeleting }] = useDeleteRelationshipMutation();

  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAcceptInvite = async (id: string) => {
    try {
      await acceptConnection(id).unwrap();
      showToast('Connection request accepted successfully!', 'success');
      refetchPartners();
      refetchInvites();
    } catch (err: any) {
      showToast('Failed to accept connection: ' + (err?.data?.error?.message || err?.data?.message || err.message), 'error');
    }
  };

  const handleDeclineInvite = async (id: string) => {
    if (!confirm('Are you sure you want to decline this request?')) return;
    try {
      await declineConnection(id).unwrap();
      showToast('Connection request declined.', 'success');
      refetchInvites();
    } catch (err: any) {
      showToast('Failed to decline: ' + (err?.data?.error?.message || err?.data?.message || err.message), 'error');
    }
  };

  const handleDisconnect = async (relationshipId: string) => {
    if (!confirm('Are you sure you want to disconnect this partner? This will stop all joint ledger mappings.')) return;
    try {
      await deleteRelationship(relationshipId).unwrap();
      showToast('Relationship disconnected.', 'success');
      setSelectedPartner(null);
      refetchPartners();
    } catch (err: any) {
      showToast('Failed to disconnect: ' + (err?.data?.error?.message || err?.data?.message || err.message), 'error');
    }
  };

  // Filter partners
  const connectedBrands = partners.filter(p => p.partner?.role === 'brand');
  const connectedAgencies = partners.filter(p => p.partner?.role === 'agency');

  return (
    <div className="space-y-6 select-text font-medium text-xs relative">
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
        <h2 className="text-xl font-bold tracking-tight text-white">My Connections</h2>
        <p className="text-xs text-neutral-400 mt-1">Manage corporate brand relationships, talent agency representation, and active payment orchestration feeds.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Incoming Invitations & Requests */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <Inbox className="h-4 w-4 text-neutral-400" />
              <h3 className="text-sm font-bold text-white">Incoming Requests</h3>
            </div>
            <p className="text-neutral-500 text-[10px] mb-4">Accept requests from Brands or Agencies to activate payments and campaign tracking.</p>

            {loadingInvites ? (
              <div className="flex flex-col items-center justify-center flex-1 py-4">
                <Loader2 className="h-5 w-5 text-neutral-500 animate-spin" />
              </div>
            ) : incomingConnections.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-[#222] rounded-lg bg-black/50 py-8 text-center text-neutral-500">
                <Inbox className="h-6 w-6 text-neutral-700 mb-1" />
                <p className="text-[10px]">No pending requests or invitations.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingConnections.map((invite) => (
                  <div
                    key={invite.id}
                    className="p-3.5 rounded-lg border border-[#222] bg-black flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs">{invite.sender?.fullName || 'A Client'}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{invite.sender?.email || invite.email}</p>
                      <span className="inline-block mt-2 text-[8px] font-mono px-1.5 py-0.25 rounded bg-neutral-800 text-neutral-300 capitalize">{invite.sender?.role || 'Brand'}</span>
                      <p className="text-[9px] text-neutral-500 font-mono mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Received: {new Date(invite.createdAt).toLocaleDateString()}
                      </p>
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

        {/* Right Column: Connected Brands & Agencies */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[460px]">
            <div className="border-b border-[#222] pb-4 mb-4">
              <h3 className="text-sm font-bold text-white">Active Connections</h3>
            </div>

            {loadingPartners ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12">
                <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
              </div>
            ) : partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-[#222] rounded-lg bg-black/50 py-16 text-center text-neutral-500">
                <Users className="h-8 w-8 text-neutral-700 mb-2" />
                <p className="text-xs">No active connections found.</p>
                <p className="text-[10px] text-neutral-600 mt-1">Once a Brand or Agency invites you to connect, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Connected Brands */}
                {connectedBrands.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Connected Brands ({connectedBrands.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connectedBrands.map((item) => (
                        <div
                          key={item.relationshipId}
                          onClick={() => setSelectedPartner(item)}
                          className="flex flex-col justify-between p-4 rounded-lg border border-[#222] bg-black hover:border-neutral-500 transition-all space-y-3 cursor-pointer group"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white text-sm group-hover:text-neutral-200">{item.partner?.fullName}</h4>
                              <Building className="h-4 w-4 text-neutral-500 shrink-0" />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{item.partner?.email}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-[#111]">
                            <span className="text-neutral-500 text-[9px] font-mono">Linked {new Date(item.connectedAt).toLocaleDateString()}</span>
                            <span className="text-[9px] font-bold text-neutral-400 flex items-center gap-1 hover:text-white transition-colors">
                              Details <Info className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connected Agencies */}
                {connectedAgencies.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Connected Agencies ({connectedAgencies.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connectedAgencies.map((item) => (
                        <div
                          key={item.relationshipId}
                          onClick={() => setSelectedPartner(item)}
                          className="flex flex-col justify-between p-4 rounded-lg border border-[#222] bg-black hover:border-neutral-500 transition-all space-y-3 cursor-pointer group"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white text-sm group-hover:text-neutral-200">{item.partner?.fullName}</h4>
                              <Users className="h-4 w-4 text-neutral-500 shrink-0" />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{item.partner?.email}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-[#111]">
                            <span className="text-neutral-500 text-[9px] font-mono">Linked {new Date(item.connectedAt).toLocaleDateString()}</span>
                            <span className="text-[9px] font-bold text-neutral-400 flex items-center gap-1 hover:text-white transition-colors">
                              Details <Info className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[16px] border border-[#3a3a3a] bg-[#0c0c0c] p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-neutral-300 mx-auto mb-3">
                {selectedPartner.partner?.role === 'brand' ? <Building className="h-6 w-6" /> : <Users className="h-6 w-6" />}
              </div>
              <h3 className="text-[16px] font-bold text-white">{selectedPartner.partner?.fullName}</h3>
              <span className="inline-block mt-1 text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-neutral-900 border border-[#222]">
                {selectedPartner.partner?.role}
              </span>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#222] text-[11px] font-semibold text-neutral-300">
              <div className="flex justify-between py-1.5 border-b border-[#111]">
                <span className="text-neutral-500">Email Address</span>
                <span className="text-white font-bold">{selectedPartner.partner?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#111]">
                <span className="text-neutral-500">Relationship ID</span>
                <span className="font-mono text-neutral-400">{selectedPartner.relationshipId.slice(0, 18)}...</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#111]">
                <span className="text-neutral-500">Wallet ID</span>
                <span className="font-mono text-neutral-400">{selectedPartner.partner?.walletId || 'None'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#111]">
                <span className="text-neutral-500">Connected Date</span>
                <span className="text-neutral-400">{new Date(selectedPartner.connectedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Sync Pipeline</span>
                <span className="text-green-400 font-bold">Active & Healthy</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedPartner(null)}
                className="flex-1 h-9 font-bold"
              >
                Close Details
              </Button>
              <Button
                onClick={() => handleDisconnect(selectedPartner.relationshipId)}
                disabled={isDeleting}
                className="h-9 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold hover:border-red-500 px-4 transition-all"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disconnect"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 ${
          toast.type === 'success' 
            ? 'border-green-500/30 bg-[#0d0d0d]/90 text-green-400' 
            : 'border-red-500/30 bg-[#0d0d0d]/90 text-red-400'
        }`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
            toast.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          </div>
          <p className="text-xs font-bold text-white">{toast.message}</p>
        </div>
      )}

    </div>
  );
}
