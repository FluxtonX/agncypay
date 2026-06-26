"use client";

import React, { useEffect, useState, startTransition, useCallback } from "react";
import { useApp } from "@/shared/context/AppContext";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Modal } from "@/shared/components/ui/Modal";
import {
  FileText,
  Plus,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";

// Form validation schema using Zod
const invoiceFormSchema = z.object({
  invoiceId: z.string().trim().min(1, "Invoice number is required"),
  clientName: z.string().trim().min(1, "Client name is required"),
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  description: z.string().trim().min(1, "Description is required"),
  enableSplits: z.boolean(),
  splits: z
    .array(
      z.object({
        walletId: z.string().trim().min(1, "Wallet ID is required"),
        ratio: z
          .string()
          .trim()
          .min(1, "Ratio is required")
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 1, "Ratio must be between 0 and 1"),
        description: z.string().trim().optional(),
      })
    )
    .optional(),
});

type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;

interface BackendPayment {
  id: string;
  externalId: string;
  source: string;
  amount: string;
  currency: string;
  status: string;
  invoiceId: string;
  invoiceData: {
    clientName?: string;
  } | null;
  description: string;
  createdAt: string;
}

export default function InvoicesPage() {
  const { state } = useApp();
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceId: "",
      clientName: "",
      amount: "",
      description: "",
      enableSplits: false,
      splits: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "splits",
  });

  const enableSplits = watch("enableSplits");

  const fetchPayments = useCallback(async () => {
    if (!state.user?.walletId) return;
    try {
      const res = await fetch(`/api/payments/wallet/${state.user.walletId}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const body = await res.json();
      if (res.ok) {
        startTransition(() => {
          setPayments(body.data || []);
        });
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      startTransition(() => {
        setLoading(false);
      });
    }
  }, [state.user?.walletId, state.token]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const onSubmit = async (data: InvoiceFormInput) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      // Build split config payload if splits are enabled
      let splitConfig = undefined;
      if (data.enableSplits && data.splits && data.splits.length > 0) {
        splitConfig = {
          participants: data.splits.map((s) => ({
            walletId: s.walletId,
            ratio: s.ratio,
            description: s.description,
          })),
        };
      }

      const payload = {
        externalId: `MAN-${Date.now()}-${data.invoiceId}`,
        source: "MANUAL" as const,
        walletId: state.user?.walletId,
        amount: data.amount,
        invoiceId: data.invoiceId,
        invoiceData: {
          clientName: data.clientName,
        },
        splitConfig,
        description: data.description,
      };

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || "Failed to create invoice.");
      }

      setSuccessMessage("Invoice successfully created and ledger updated!");
      reset();
      fetchPayments();
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(msg);
    }
  };

  return (
    <div className="space-y-6 select-text">
      {/* Upper header action */}
      <div className="flex justify-between items-center">
         
         

        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Invoices & Deposits</h2>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Manage your network ledger invoices and process payments.
          </p>
        </div>
        <Button
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          className="h-9 px-4 text-xs font-bold gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Main Grid */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Invoice Ledger Log
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin mb-3" />
            <p className="text-xs text-neutral-500">Querying ledger records...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-[#3a3a3a] rounded-xl bg-white/[0.01]">
            <FileText className="h-10 w-10 text-neutral-600 mb-4 stroke-[1.5]" />
            <h4 className="text-sm font-bold text-white mb-1">No invoices found</h4>
            <p className="text-xs text-neutral-400 max-w-[280px] leading-relaxed mb-6">
              Create your first invoice to initialize transactions on your double-entry ledger.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-3.5 text-xs font-bold"
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-neutral-300">
              <thead>
                <tr className="border-b border-[#3a3a3a] pb-3 text-neutral-500">
                  <th className="py-3">Invoice ID</th>
                  <th className="py-3">Client</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Date Created</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3a3a]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 font-mono text-white">{p.invoiceId || p.externalId.split("-").pop()}</td>
                    <td className="py-3.5 text-white">{p.invoiceData?.clientName || "Manual Client"}</td>
                    <td className="py-3.5 text-neutral-400 max-w-[180px] truncate">{p.description}</td>
                    <td className="py-3.5 text-neutral-500">
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 text-white font-mono">${parseFloat(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 text-right">
                      <Badge
                        variant={p.status === "SETTLED" ? "success" : "warning"}
                        className="capitalize"
                      >
                        {p.status.toLowerCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Slide-over/Modal Form for Creating Invoices */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Ledger Invoice">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {submitError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400 leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-400 leading-relaxed">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("invoiceId")}
              id="invoiceId"
              label="Invoice Number"
              placeholder="e.g. INV-1002"
              error={errors.invoiceId?.message}
            />
            <Input
              {...register("amount")}
              id="amount"
              label="Amount (USD)"
              placeholder="e.g. 5000.00"
              error={errors.amount?.message}
            />
          </div>

          <Input
            {...register("clientName")}
            id="clientName"
            label="Client Name"
            placeholder="e.g. Adidas Group"
            error={errors.clientName?.message}
          />

          <Input
            {...register("description")}
            id="description"
            label="Campaign Description"
            placeholder="e.g. Q3 Creative Content Deliverables"
            error={errors.description?.message}
          />

          {/* Revenue splits orchestration setup */}
          <div className="border-t border-[#3a3a3a] pt-4 mt-2">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-neutral-300 select-none cursor-pointer">
              <input
                type="checkbox"
                {...register("enableSplits")}
                className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-white accent-white cursor-pointer"
              />
              <span>Configure Revenue Splits Orchestration</span>
            </label>

            {enableSplits && (
              <div className="mt-4 space-y-4 rounded-lg bg-neutral-950/60 border border-[#3a3a3a] p-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Split Participants
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => append({ walletId: "", ratio: "", description: "" })}
                    className="h-7 px-2 text-[10px] gap-1 hover:text-white border border-[#3a3a3a]"
                  >
                    <Plus className="h-3 w-3" /> Add Participant
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-[10px] text-neutral-500 italic">No split partners added yet. Click Add to define ratio.</p>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[1fr_80px_1fr_40px] gap-3 items-end">
                    <Input
                      {...register(`splits.${index}.walletId` as const)}
                      placeholder="Wallet ID"
                      label={index === 0 ? "Target Wallet ID" : undefined}
                      error={errors.splits?.[index]?.walletId?.message}
                      containerClassName="min-w-0"
                    />
                    <Input
                      {...register(`splits.${index}.ratio` as const)}
                      placeholder="e.g. 0.8"
                      label={index === 0 ? "Ratio" : undefined}
                      error={errors.splits?.[index]?.ratio?.message}
                      containerClassName="min-w-0"
                    />
                    <Input
                      {...register(`splits.${index}.description` as const)}
                      placeholder="Talent Payout"
                      label={index === 0 ? "Description" : undefined}
                      containerClassName="min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex h-11 w-full items-center justify-center text-neutral-500 hover:text-red-400 transition-colors cursor-pointer border border-neutral-900 rounded-lg hover:border-red-500/20 bg-neutral-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full py-3 mt-4">
            Provision & Submit Invoice
          </Button>
        </form>
      </Modal>
    </div>
  );
}
