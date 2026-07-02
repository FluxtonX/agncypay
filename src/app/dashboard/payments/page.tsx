'use client';

import React, { useState } from 'react';
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { useApp } from '@/shared/context/AppContext';
import { ChevronLeft, DollarSign, Loader2, CheckCircle2, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsPage() {
  const { state } = useApp();
  const role = state.user?.role || 'brand';

  // Standard mock payments (Brand/Agency)
  const mockPayments = [
    { id: "PAY-001", agency: "VaynerMedia", invoice: "INV-1092", scheduledDate: "2026-07-05", amount: 15000.00, method: "ACH Debit", status: "Scheduled" },
    { id: "PAY-002", agency: "Viral Nation", invoice: "INV-4821", scheduledDate: "2026-07-10", amount: 8200.00, method: "Wire Transfer", status: "Pending Approval" },
    { id: "PAY-003", agency: "Kairos Media", invoice: "INV-3392", scheduledDate: "2026-06-28", amount: 24500.00, method: "ACH Debit", status: "Succeeded" },
    { id: "PAY-004", agency: "VaynerMedia", invoice: "INV-1011", scheduledDate: "2026-06-15", amount: 12000.00, method: "ACH Debit", status: "Succeeded" },
  ];

  // Talent mock payments (Creator-centric)
  const talentPayments = [
    { id: "PAY-TAL-001", brand: "Aura Skincare", agency: "VaynerMedia", campaign: "Summer Glow Launch", date: "2026-06-28", amount: 4500.00, status: "Completed", method: "ACH Direct", timelineStep: 4 },
    { id: "PAY-TAL-002", brand: "Apex Athletic", agency: "Kairos Media", campaign: "TikTok Footwear Push", date: "2026-07-02", amount: 3200.00, status: "Pending Approval", method: "ACH Direct", timelineStep: 1 },
    { id: "PAY-TAL-003", brand: "iHeartRadio", agency: "VaynerMedia", campaign: "Holiday Gift Guide", date: "2026-07-05", amount: 5000.00, status: "Payout Scheduled", method: "Wire Payout", timelineStep: 3 },
  ];

  const [selectedTalentPaymentId, setSelectedTalentPaymentId] = useState(talentPayments[0].id);

  const selectedPayment = talentPayments.find(p => p.id === selectedTalentPaymentId) || talentPayments[0];

  // KPI Calculations for Talent
  const pendingAmount = talentPayments.filter(p => p.status !== 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = talentPayments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = 0.00; // No failed payments in MVP

  if (role === 'talent') {
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
          <h2 className="text-xl font-bold tracking-tight text-white">Payments & Disbursements</h2>
          <p className="text-xs text-neutral-400 mt-1">Track your pending creator payouts, completed earnings, and timeline settlement records.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pending Payments</span>
              <h3 className="font-mono text-xl font-bold text-amber-500 mt-1">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(pendingAmount)}
              </h3>
            </div>
            <Clock className="h-5 w-5 text-amber-500" />
          </Card>
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Completed Payments</span>
              <h3 className="font-mono text-xl font-bold text-green-500 mt-1">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(completedAmount)}
              </h3>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </Card>
          <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Failed Payments</span>
              <h3 className="font-mono text-xl font-bold text-neutral-500 mt-1">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(failedAmount)}
              </h3>
            </div>
            <AlertCircle className="h-5 w-5 text-neutral-500" />
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Column 1: Payments List Table */}
          <div className="xl:col-span-2">
            <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col min-h-[300px]">
              <h3 className="text-sm font-bold text-white mb-4">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#3a3a3a] bg-white/[0.02] text-neutral-400 font-bold">
                      <th className="p-4">Brand</th>
                      <th className="p-4">Agency</th>
                      <th className="p-4">Campaign</th>
                      <th className="p-4">Payment Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {talentPayments.map((pay) => (
                      <tr 
                        key={pay.id} 
                        onClick={() => setSelectedTalentPaymentId(pay.id)}
                        className={`hover:bg-white/[0.01] cursor-pointer transition-colors ${pay.id === selectedTalentPaymentId ? 'bg-white/[0.02]' : ''}`}
                      >
                        <td className="p-4 font-bold text-white">{pay.brand}</td>
                        <td className="p-4 text-neutral-400">{pay.agency}</td>
                        <td className="p-4 text-neutral-400">{pay.campaign}</td>
                        <td className="p-4 text-neutral-400">{pay.date}</td>
                        <td className="p-4 font-mono font-bold text-white">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(pay.amount)}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pay.status === 'Completed' ? 'bg-green-500/10 text-green-500 border border-green-500/25' :
                            pay.status === 'Payout Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Column 2: Payment Timeline Panel */}
          <div className="xl:col-span-1">
            <Card className="p-5 border-[#3a3a3a] bg-[#0d0d0d] flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Payment Timeline</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-bold">Campaign:</span>
                    <span className="text-white font-bold">{selectedPayment.campaign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-bold">Brand:</span>
                    <span className="text-neutral-300 font-bold">{selectedPayment.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-bold">Agency:</span>
                    <span className="text-neutral-300 font-bold">{selectedPayment.agency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-bold">Amount:</span>
                    <span className="text-white font-mono font-bold">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selectedPayment.amount)}
                    </span>
                  </div>
                </div>

                {/* Timeline Stepper */}
                <div className="relative pl-6 space-y-6 border-l border-neutral-800 ml-3">
                  {[
                    { label: "Invoice Synced", desc: "Accounting record matched from QuickBooks/Xero", step: 1 },
                    { label: "Payment Approved", desc: "Brand funds authorized for split disbursement", step: 2 },
                    { label: "Payout Scheduled", desc: "ACH/Wire payout queue batch processing", step: 3 },
                    { label: "Completed", desc: "Settled cleared funds released to creator wallet", step: 4 },
                  ].map((t) => {
                    const isDone = selectedPayment.timelineStep >= t.step;
                    return (
                      <div key={t.step} className="relative">
                        {/* Circle bullet */}
                        <div className={`absolute -left-[31px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[9px] font-bold ${
                          isDone 
                            ? 'bg-white border-white text-black' 
                            : 'bg-black border-neutral-700 text-neutral-500'
                        }`}>
                          {isDone ? <Check className="h-2.5 w-2.5" /> : t.step}
                        </div>
                        <div>
                          <p className={`font-bold ${isDone ? 'text-white' : 'text-neutral-500'}`}>{t.label}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">{t.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Standard non-talent view
  return (
    <div className="space-y-6 select-text">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Payments & Disbursements</h2>
        <p className="text-xs text-neutral-400 mt-1">Track outgoing agency invoice payouts, payment methods, and bank processing logs.</p>
      </div>
      
      <div className="rounded-xl border border-[#3a3a3a] bg-[#0d0d0d] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#3a3a3a] bg-white/[0.02] text-neutral-400 font-bold">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Agency</th>
              <th className="p-4">Invoice</th>
              <th className="p-4">Scheduled Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {mockPayments.map((pay) => (
              <tr key={pay.id} className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-neutral-300">{pay.id}</td>
                <td className="p-4 font-bold text-white">{pay.agency}</td>
                <td className="p-4 text-neutral-400">{pay.invoice}</td>
                <td className="p-4 text-neutral-400">{pay.scheduledDate}</td>
                <td className="p-4 font-bold text-white">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(pay.amount)}
                </td>
                <td className="p-4 text-neutral-400">{pay.method}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    pay.status === 'Succeeded' ? 'bg-green-500/10 text-green-500 border border-green-500/25' :
                    pay.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                  }`}>
                    {pay.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
