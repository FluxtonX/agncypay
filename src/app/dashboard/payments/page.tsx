'use client';

import React from 'react';
import { Card } from "@/shared/components/ui/Card";

export default function PaymentsPage() {
  const mockPayments = [
    { id: "PAY-001", agency: "VaynerMedia", invoice: "INV-1092", scheduledDate: "2026-07-05", amount: 15000.00, method: "ACH Debit", status: "Scheduled" },
    { id: "PAY-002", agency: "Viral Nation", invoice: "INV-4821", scheduledDate: "2026-07-10", amount: 8200.00, method: "Wire Transfer", status: "Pending Approval" },
    { id: "PAY-003", agency: "Kairos Media", invoice: "INV-3392", scheduledDate: "2026-06-28", amount: 24500.00, method: "ACH Debit", status: "Succeeded" },
    { id: "PAY-004", agency: "VaynerMedia", invoice: "INV-1011", scheduledDate: "2026-06-15", amount: 12000.00, method: "ACH Debit", status: "Succeeded" },
  ];

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
