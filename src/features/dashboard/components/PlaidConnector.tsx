"use client";

import React, { useEffect, useState, startTransition, useCallback } from "react";
import { useApp } from "@/shared/context/AppContext";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Link2, Landmark, Loader2 } from "lucide-react";
import { usePlaidLink } from "react-plaid-link";

interface BalanceMap {
  CASH?: string;
  PAYABLE?: string;
  RECEIVABLE?: string;
  CREDIT?: string;
  FEE?: string;
  SUSPENSE?: string;
}

interface WalletBalancesResponse {
  id: string;
  name: string;
  status: string;
  balances: BalanceMap;
}

export function PlaidConnector() {
  const { state } = useApp();
  const [walletDetails, setWalletDetails] = useState<WalletBalancesResponse | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Plaid connection states
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [plaidInstitutionName, setPlaidInstitutionName] = useState("");
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [loadingPlaidStatus, setLoadingPlaidStatus] = useState(true);
  const [linking, setLinking] = useState(false);
  const [plaidError, setPlaidError] = useState<string | null>(null);

  // Fetch balances from nestjs backend
  const fetchBalances = useCallback(async () => {
    if (!state.user?.walletId) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";
      const res = await fetch(`${apiUrl}/wallets/${state.user.walletId}/balances`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const body = await res.json();
      if (res.ok) {
        startTransition(() => {
          setWalletDetails(body.data);
        });
      }
    } catch (err) {
      console.error("Failed to fetch wallet balances:", err);
    } finally {
      startTransition(() => {
        setLoadingBalances(false);
      });
    }
  }, [state.user?.walletId, state.token]);

  // Fetch Plaid status
  const fetchPlaidStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/plaid/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPlaidConnected(data.connected);
        if (data.connected) {
          setPlaidInstitutionName(data.institutionName || "Linked Bank");
        }
      }
    } catch (err) {
      console.error("Failed to fetch Plaid status:", err);
    } finally {
      setLoadingPlaidStatus(false);
    }
  }, []);

  // Fetch Plaid Link token
  const fetchPlaidLinkToken = useCallback(async () => {
    try {
      setPlaidError(null);
      const res = await fetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.link_token) {
          setPlaidLinkToken(data.link_token);
          setIsMock(false);
        } else if (data.isMock) {
          setIsMock(true);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg =
          (typeof errData.error === "object" ? errData.error?.message : errData.error) ||
          errData.message ||
          "Failed to initialize Plaid token";
        setPlaidError(String(errMsg));
        setIsMock(true);
      }
    } catch (err: any) {
      console.error("Error creating Plaid link token:", err);
      setPlaidError(err.message || "Failed to initialize Plaid token");
      setIsMock(true);
    }
  }, []);

  useEffect(() => {
    fetchBalances();
    fetchPlaidStatus();
    fetchPlaidLinkToken();
  }, [fetchBalances, fetchPlaidStatus, fetchPlaidLinkToken]);

  const onPlaidSuccess = useCallback(async (public_token: string, metadata: any) => {
    setLinking(true);
    setPlaidError(null);
    try {
      const res = await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_token,
          institution: metadata.institution,
        }),
      });
      if (res.ok) {
        setPlaidConnected(true);
        setPlaidInstitutionName(metadata.institution?.name || "Connected Bank");
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg2 =
          (typeof errData.error === "object" ? errData.error?.message : errData.error) ||
          errData.message ||
          "Failed to link bank account";
        setPlaidError(String(errMsg2));
      }
    } catch (err: any) {
      console.error("Plaid token exchange error:", err);
      setPlaidError(err.message || "Failed to link bank account");
    } finally {
      setLinking(false);
    }
  }, []);

  // usePlaidLink hook
  const { open: openPlaid, ready: plaidReady } = usePlaidLink({
    token: plaidLinkToken,
    onSuccess: onPlaidSuccess,
    onExit: (error, metadata) => {
      setLinking(false);
      if (error) {
        setPlaidError(`Exit code: ${error.error_code} (${error.error_message})`);
      }
    },
  });

  const handlePlaidLink = () => {
    setLinking(true);
    if (isMock) {
      // Simulate Sandbox Link in Mock Mode
      setTimeout(async () => {
        try {
          const res = await fetch("/api/plaid/exchange-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              public_token: "mock-public-token-12345",
              institution: { name: "Plaid Sandbox Bank", institution_id: "ins_sandbox" },
            }),
          });
          if (res.ok) {
            setPlaidConnected(true);
            setPlaidInstitutionName("Plaid Sandbox Bank");
          } else {
            setPlaidError("Failed to simulate token exchange.");
          }
        } catch (err) {
          setPlaidError("Failed to simulate connection.");
        } finally {
          setLinking(false);
        }
      }, 1500);
    } else if (plaidReady) {
      openPlaid();
    } else {
      setPlaidError("Plaid link is loading, please try again in a moment.");
      setLinking(false);
    }
  };

  const handleDisconnect = async () => {
    setLinking(true);
    try {
      const res = await fetch("/api/plaid/disconnect", { method: "POST" });
      if (res.ok) {
        setPlaidConnected(false);
        setPlaidInstitutionName("");
        fetchPlaidLinkToken();
      } else {
        setPlaidError("Failed to disconnect bank account");
      }
    } catch (err: any) {
      console.error("Error disconnecting bank:", err);
      setPlaidError(err.message || "Failed to disconnect bank account");
    } finally {
      setLinking(false);
    }
  };

  const getBalanceDisplay = (amountStr?: string) => {
    if (!amountStr) return "$0.00";
    const amt = parseFloat(amountStr);
    return amt >= 0
      ? `$${amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : `-$${Math.abs(amt).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <Card className="p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-neutral-400" />
            Ledger Balances &amp; Bank Link
          </h3>
        </div>

        {loadingBalances ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-neutral-500 animate-spin mb-3" />
            <p className="text-[10px] text-neutral-500">Loading ledger account balances...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cash Account Balance */}
            <div className="flex items-center justify-between text-xs font-semibold bg-white/[0.01] border border-[#3a3a3a] p-3 rounded-lg">
              <div>
                <p className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Cash Ledger Balance</p>
                <p className="text-xl font-extrabold text-white mt-1">
                  {getBalanceDisplay(walletDetails?.balances?.CASH)}
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            {/* Credit Account Balance */}
            <div className="flex items-center justify-between text-xs font-semibold border-b border-[#3a3a3a] pb-2">
              <span className="text-neutral-400">Available Credit Line</span>
              <span className="font-mono text-white">
                {getBalanceDisplay(walletDetails?.balances?.CREDIT)}
              </span>
            </div>

            {/* Suspense Account Balance */}
            <div className="flex items-center justify-between text-xs font-semibold border-b border-[#3a3a3a] pb-2">
              <span className="text-neutral-400">Suspense Account (Escrow)</span>
              <span className="font-mono text-neutral-400">
                {getBalanceDisplay(walletDetails?.balances?.SUSPENSE)}
              </span>
            </div>
          </div>
        )}
      </div>

      {plaidError && (
        <div className="mt-4 text-[10px] text-red-400 border border-red-500/20 bg-red-500/5 p-2 rounded leading-relaxed">
          {plaidError}
        </div>
      )}

      <div className="border-t border-[#3a3a3a] pt-4 mt-6">
        {loadingPlaidStatus ? (
          <div className="flex justify-center py-1">
            <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
          </div>
        ) : plaidConnected ? (
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-white text-[11px] font-bold">{plaidInstitutionName}</p>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Connected via Plaid</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={linking}
              className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {linking ? "Disconnecting..." : "Disconnect Bank"}
            </button>
          </div>
        ) : (
          <Button
            onClick={handlePlaidLink}
            isLoading={linking}
            className="w-full h-9 text-xs font-bold gap-1.5 bg-white text-black hover:bg-neutral-200 cursor-pointer"
          >
            <Landmark className="h-4 w-4" />
            {isMock ? "Connect simulated bank" : "Connect Bank via Plaid"}
          </Button>
        )}
      </div>
    </Card>
  );
}
