'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { useApp } from '@/shared/context/AppContext';
import {
  useGetConnectedTalentsQuery,
  useGetTalentInvitationsQuery,
  useSearchUsersQuery,
  useSendConnectionRequestMutation,
  useResendTalentInvitationMutation,
  useCancelTalentInvitationMutation,
  useAcceptTalentInvitationSandboxMutation
} from '@/lib/store/services/api';
import { Mail, Loader2, Send, RefreshCw, XCircle, CheckCircle2, UserCheck, Search, Users, Plus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TalentsPage() {
  const { state } = useApp();
  const userRole = state.user?.role || 'agency';
  const connectionType = userRole === 'brand' ? 'BRAND_TO_TALENT' : 'AGENCY_TO_TALENT';

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Queries
  const { data: talents = [], isLoading: loadingTalents, refetch: refetchTalents } = useGetConnectedTalentsQuery();
  const { data: invitations = [], isLoading: loadingInvitations, refetch: refetchInvitations } = useGetTalentInvitationsQuery();
  
  const { data: searchResults = [], isFetching: isSearching } = useSearchUsersQuery(debouncedQuery, {
    skip: !debouncedQuery.trim()
  });

  // Mutations
  const [sendConnectionRequest, { isLoading: isConnecting }] = useSendConnectionRequestMutation();
  const [resendInvitation, { isLoading: isResending }] = useResendTalentInvitationMutation();
  const [cancelInvitation, { isLoading: isCancelling }] = useCancelTalentInvitationMutation();
  const [acceptTalentInvitationSandbox, { isLoading: isSimulating }] = useAcceptTalentInvitationSandboxMutation();

  const handleConnect = async (email: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await sendConnectionRequest({ email, type: connectionType }).unwrap();
      if (result.data.registered) {
        setSuccessMessage('In-app connection request sent successfully!');
      } else {
        setSuccessMessage('Invitation email sent successfully!');
      }
      setSearchQuery('');
      refetchInvitations();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Connection request failed:', err);
      setErrorMessage(err?.data?.error?.message || err?.data?.message || err?.message || 'Failed to send request');
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendInvitation(id).unwrap();
      alert('Invitation has been resent!');
      refetchInvitations();
    } catch (err: any) {
      alert('Resend failed: ' + (err?.data?.message || err.message));
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    try {
      await cancelInvitation(id).unwrap();
      alert('Request cancelled.');
      refetchInvitations();
    } catch (err: any) {
      alert('Cancellation failed: ' + (err?.data?.message || err.message));
    }
  };

  const handleSimulateAccept = async (id: string) => {
    try {
      await acceptTalentInvitationSandbox(id).unwrap();
      alert('Sandbox Simulation: Creator accepted the connection request. Relationship active!');
      refetchTalents();
      refetchInvitations();
    } catch (err: any) {
      alert('Simulation failed: ' + (err?.data?.message || err.message));
    }
  };

  const isEmailQuery = /\S+@\S+\.\S+/.test(searchQuery.trim());

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
        <h2 className="text-xl font-bold tracking-tight text-white">Talent Directory</h2>
        <p className="text-xs text-neutral-400 mt-1">Connect, invite, and manage your creator list for client brand campaigns.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Smart Connect Search Box */}
        <div className="xl:col-span-1">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] space-y-4 h-fit">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-neutral-400" />
                Smart Connect
              </h3>
              <p className="text-neutral-500 text-[10px] mt-1">Search registered AgencyPay talents, then fall back to email invite.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators by name or email..."
                  className="h-9 w-full rounded-[6px] border border-[#3a3a3a] bg-black pl-8 pr-3 text-[12px] text-white focus:border-neutral-400 outline-none transition-colors"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
              </div>

              {successMessage && <p className="text-[10px] text-green-400 font-semibold">{successMessage}</p>}
              {errorMessage && <p className="text-[10px] text-red-400 font-semibold">{errorMessage}</p>}

              {/* Search Results / Fallbacks */}
              <div className="space-y-2 pt-2 border-t border-[#222]">
                {isSearching ? (
                  <div className="flex items-center gap-2 text-neutral-400 py-3 justify-center text-[10px]">
                    <Loader2 className="h-4 w-4 animate-spin" /> Searching directory...
                  </div>
                ) : debouncedQuery.trim() === '' ? (
                  <p className="text-[10px] text-neutral-500 text-center py-4">Enter a name or email address above.</p>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Registered Creators Matches</p>
                    {searchResults.map((user) => (
                      <div key={user.id} className="p-2.5 rounded bg-black border border-[#222] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-white text-[11px] truncate">{user.fullName}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[8px] font-mono px-1.5 py-0.25 rounded bg-neutral-800 text-neutral-300 capitalize">{user.role}</span>
                        </div>
                        <Button
                          onClick={() => handleConnect(user.email)}
                          disabled={isConnecting}
                          className="h-7 px-3 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold cursor-pointer shrink-0"
                        >
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-[10px] text-neutral-500 mb-3">No registered creators found for this query.</p>
                    {isEmailQuery ? (
                      <Button
                        onClick={() => handleConnect(searchQuery)}
                        disabled={isConnecting}
                        className="w-full h-8 bg-neutral-800 text-white hover:bg-neutral-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Invite &quot;{searchQuery}&quot; to AgencyPay
                      </Button>
                    ) : (
                      <p className="text-[9px] text-amber-500/80 font-bold">Type a valid email address to send an invitation.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Connected and Pending lists */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Connected Talents */}
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[220px]">
            <h3 className="text-sm font-bold text-white mb-4">Connected Creators</h3>
            
            {loadingTalents ? (
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
              </div>
            ) : talents.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-[#222] rounded-lg bg-black/50 py-10 text-center text-neutral-500">
                <Users className="h-8 w-8 text-neutral-700 mb-2" />
                <p className="text-xs">No active creator connections yet.</p>
                <p className="text-[10px] text-neutral-600 mt-1">Use the Smart Connect module to search and link with talents.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {talents.map((talent) => (
                  <div
                    key={talent.id}
                    className="flex flex-col justify-between p-3.5 rounded-lg border border-[#222] bg-black hover:border-[#333] transition-colors space-y-3"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs">{talent.fullName}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{talent.email}</p>
                      <p className="text-[9px] text-neutral-500 font-mono mt-1">Wallet: {talent.walletId || "N/A"}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#111]">
                      <span className="inline-flex items-center gap-1 text-[9px] text-green-400 font-bold bg-green-400/5 px-2 py-0.5 rounded border border-green-500/10">
                        <UserCheck className="h-3 w-3" />
                        Connected Creator
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Pending Invitations */}
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[220px]">
            <h3 className="text-sm font-bold text-white mb-4">Outgoing Connection Requests</h3>
            
            {loadingInvitations ? (
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
              </div>
            ) : invitations.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-8 text-neutral-500 text-center">
                No request history available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#222] text-neutral-500 font-bold">
                      <th className="pb-2">Creator Email</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date Sent</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.01]">
                        <td className="py-3 font-bold text-white">{inv.email}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            inv.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500 border border-green-500/25' :
                            inv.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' :
                            inv.status === 'DECLINED' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                            'bg-neutral-800 text-neutral-400'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-neutral-400 font-mono text-[10px]">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            {inv.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSimulateAccept(inv.id)}
                                  disabled={isSimulating}
                                  className="h-6 px-2.5 rounded bg-green-500 hover:bg-green-600 text-black font-bold text-[9px] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                                  title="Simulate Creator accepting connection request in sandbox"
                                >
                                  {isSimulating ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserCheck className="h-3 w-3" />}
                                  Simulate Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResend(inv.id)}
                                  disabled={isResending}
                                  className="h-6 px-2 rounded border border-[#3a3a3a] hover:border-white text-neutral-300 hover:text-white font-bold text-[9px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Resend
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancel(inv.id)}
                                  disabled={isCancelling}
                                  className="h-6 px-2 rounded border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-bold text-[9px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Cancel
                                </button>
                              </>
                            )}
                            {inv.status === 'ACCEPTED' && (
                              <span className="text-[10px] text-neutral-500 font-bold italic pr-2">Connected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
