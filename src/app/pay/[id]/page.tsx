"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Shield, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useApp } from "@/shared/context/AppContext";
import Link from "next/link";

// ─── Currency utils ───────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", label: "US Dollar", rate: 1 },
  { code: "EUR", label: "Euro", rate: 0.92 },
  { code: "GBP", label: "British Pound", rate: 0.78 },
  { code: "CAD", label: "Canadian Dollar", rate: 1.37 },
  { code: "AUD", label: "Australian Dollar", rate: 1.52 },
  { code: "AED", label: "UAE Dirham", rate: 3.67 },
  { code: "JPY", label: "Japanese Yen", rate: 156.8 },
  { code: "SGD", label: "Singapore Dollar", rate: 1.35 },
] as const;
type CurrencyCode = (typeof CURRENCIES)[number]["code"];

function formatMoney(value: number, code: string): string {
  const curr = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: curr.code,
    minimumFractionDigits: 2,
  }).format(value * curr.rate);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaymentRecord {
  id: string;
  invoiceId: string | null;
  amount: string;
  currency: string;
  status: string;
  description: string | null;
  invoiceData: { clientName?: string } | null;
  createdAt: string;
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({
  payment,
  currencyCode,
  confirmRef,
}: {
  payment: PaymentRecord;
  currencyCode: string;
  confirmRef: string;
}) {
  const router = useRouter();
  const amount = parseFloat(payment.amount);
  const fee = amount * 0.015;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Success icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100 mb-5">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-[28px] font-black text-gray-900 text-center">Payment Successful</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Your payment has been processed and confirmed.
          </p>
        </div>

        {/* Receipt card */}
        <div className="rounded-2xl border border-gray-300 bg-gray-50 divide-y divide-gray-200 mb-6 shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount Paid</span>
            <span className="text-xl font-black text-gray-900">{formatMoney(amount + fee, currencyCode)}</span>
          </div>
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Confirmation #</span>
            <span className="text-xs font-mono font-bold text-emerald-600">{confirmRef}</span>
          </div>
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Client</span>
            <span className="text-xs font-bold text-gray-700">{payment.invoiceData?.clientName || "—"}</span>
          </div>
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Invoice</span>
            <span className="text-xs font-mono text-gray-700">{payment.invoiceId || payment.id.slice(0, 10).toUpperCase()}</span>
          </div>
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Date</span>
            <span className="text-xs font-semibold text-gray-700">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Settled
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="h-12 w-full rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/invoices")}
            className="h-12 w-full rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            View All Invoices
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-gray-400">
          <Shield className="h-3.5 w-3.5" />
          Secured by AgncyPay · Bank-level encryption
        </div>
      </div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function PayCheckoutPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { state } = useApp();

  const currencyCode = (searchParams.get("currency") as CurrencyCode) || "USD";
  const returnTo = searchParams.get("returnTo") || "dashboard";

  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [confirmRef, setConfirmRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayment() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const res = await fetch(`${apiUrl}/payments/${params.id}`, {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || "Failed to load payment.");
        setPayment(body.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unexpected error.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchPayment();
  }, [params.id, state.token]);

  const handlePayNow = async () => {
    setPaying(true);
    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 2400));
    const ref = `CONF-${Date.now().toString(36).toUpperCase()}`;
    setConfirmRef(ref);
    setPaid(true);
    setPaying(false);
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (paid && payment) {
    return <SuccessScreen payment={payment} currencyCode={currencyCode} confirmRef={confirmRef} />;
  }

  const amount = payment ? parseFloat(payment.amount) : 0;
  const fee = amount * 0.015;
  const total = amount + fee;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !payment) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "This checkout link is invalid."}</p>
          <Link href={`/${returnTo}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Link>
        </div>
      </div>
    );
  }

  // ── Checkout UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href={`/${returnTo}`} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <Image
            src="/agncypaybrand.png"
            alt="AgncyPay"
            width={100}
            height={24}
            className="h-6 w-auto object-contain"
            style={{ filter: "invert(1)" }}
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
          <Shield className="h-3.5 w-3.5" />
          Secure
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          {/* Invoice heading */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Invoice Payment</p>
            <h1 className="text-[32px] font-black text-gray-900">
              {formatMoney(total, currencyCode)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {payment.invoiceData?.clientName || "Manual Client"} ·{" "}
              {payment.invoiceId ? `#${payment.invoiceId}` : payment.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Main checkout card */}
          <div className="rounded-2xl border border-gray-300 bg-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.06),0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden mb-4">
            {/* Recipient */}
            <div className="px-6 py-5 border-b border-gray-200">
              <p className="text-xs font-bold text-gray-400 mb-3">Paying To</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white">
                  {(payment.invoiceData?.clientName || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {payment.invoiceData?.clientName || "Manual Client"}
                  </p>
                  <p className="text-xs text-gray-400">{payment.description || "Invoice Payment"}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="px-6 py-5 space-y-3 border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Invoice Amount</span>
                <span className="font-semibold text-gray-700">{formatMoney(amount, currencyCode)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Platform Fee (1.5%)</span>
                <span className="font-semibold text-gray-700">{formatMoney(fee, currencyCode)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Due</span>
                <span className="text-lg font-black">{formatMoney(total, currencyCode)}</span>
              </div>
            </div>

            {/* Currency & date info */}
            <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
              <div className="text-xs text-gray-400">
                Currency: <span className="font-bold text-gray-700">{currencyCode}</span>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(payment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePayNow}
            disabled={paying}
            className="w-full h-14 rounded-2xl bg-gray-900 text-white font-extrabold text-base hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-gray-900/20"
          >
            {paying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                Pay Now · {formatMoney(total, currencyCode)}
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            256-bit SSL encrypted · Protected by AgncyPay
          </p>
        </div>
      </div>
    </div>
  );
}
