"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccounting } from "@/modules/accounting/hooks/useAccounting";
import { Loader2 } from "lucide-react";

export default function RedirectPage() {
  const router = useRouter();
  const { currentProvider } = useAccounting();

  useEffect(() => {
    router.replace(`/providers/${currentProvider}/payouts`);
  }, [currentProvider, router]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Loader2 className="h-8 w-8 text-neutral-500 animate-spin mb-3" />
      <p className="text-xs text-neutral-500">Redirecting to active provider payouts...</p>
    </div>
  );
}
