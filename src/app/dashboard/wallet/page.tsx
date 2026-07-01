'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";
import { useApp } from '@/shared/context/AppContext';
import { useGetWalletBalancesQuery } from '@/lib/store/services/api';
import { Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function WalletPage() {
  const { state } = useApp();
  const walletId = state.user?.walletId;

  const { data: balances, isLoading } = useGetWalletBalancesQuery(walletId || '', {
    skip: !walletId,
  });

  const availableBalance = balances?.availableBalance || 0;
  const pendingBalance = balances?.pendingBalance || 0;

  const mockLedger = [
    { id: "TX-10921", description: "ACH Funding Deposit", type: "Credit", amount: 50000.00, date: "2026-06-25", account: "Cash Wallet" },
    { id: "TX-10922", description: "Disbursement for Invoice #INV-3392", type: "Debit", amount: -24500.00, date: "2026-06-28", account: "Cash Wallet" },
    { id: "TX-10923", description: "Disbursement for Invoice #INV-1011", type: "Debit", amount: -12000.00, date: "2026-06-15", account: "Cash Wallet" },
  ];

  return (
    <div className="space-y-6 select-text">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Wallet & Ledger</h2>
        <p className="text-xs text-neutral-400 mt-1">Review available cash float, double-entry ledger entries, and audit trails.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d]">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Available Cash Balance</span>
            <h3 className="font-mono text-3xl font-bold text-white mt-3">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(availableBalance || 250000.00)}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-2">Fully cleared funds available for instant payout orchestration.</p>
          </Card>
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d]">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Escrow / Pending Float</span>
            <h3 className="font-mono text-3xl font-bold text-neutral-400 mt-3">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(pendingBalance || 0.00)}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-2">Funds currently locked in settlement routes or compliance holds.</p>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-white mb-3">Audit Trail Ledger Logs</h3>
        <div className="rounded-xl border border-[#3a3a3a] bg-[#0d0d0d] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3a3a3a] bg-white/[0.02] text-neutral-400 font-bold">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Account Type</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {mockLedger.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 font-mono font-bold text-neutral-400">{tx.id}</td>
                  <td className="p-4 text-neutral-400">{tx.date}</td>
                  <td className="p-4 text-white font-medium flex items-center gap-1.5">
                    {tx.type === 'Credit' ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    )}
                    {tx.description}
                  </td>
                  <td className="p-4 text-neutral-400">{tx.account}</td>
                  <td className={`p-4 text-right font-mono font-bold ${tx.type === 'Credit' ? 'text-green-400' : 'text-white'}`}>
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
