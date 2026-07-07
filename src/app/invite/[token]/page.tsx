"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateInvite() {
      try {
        const res = await fetch(`/api/connections/invite/${params.token}`);
        const body = await res.json();
        
        if (!res.ok) {
          throw new Error(body.message || "Invitation link is invalid or has expired.");
        }

        const data = body.data;
        if (data && data.email) {
          // Redirect to signup prefilled with the email and the token
          const targetRole = data.type === 'BRAND_TO_AGENCY' ? 'agency' : 'talent';
          router.replace(`/auth/register?email=${encodeURIComponent(data.email)}&inviteToken=${params.token}&roleType=${targetRole}`);
        } else {
          throw new Error("Could not retrieve invitation details.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to validate invitation.");
        setLoading(false);
      }
    }

    if (params.token) {
      validateInvite();
    }
  }, [params.token, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden select-none">
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
        <div className="z-10 flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
            Validating invitation...
          </h2>
          <p className="text-xs text-neutral-500 max-w-[280px]">
            Checking secure double-entry connection registers. Please wait.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[350px] w-[350px] rounded-full bg-red-500/5 blur-[100px] pointer-events-none" />
        <div className="w-full max-w-[400px] z-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto mb-6 shadow-[0_0_24px_rgba(239,68,68,0.1)]">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Invitation Expired or Invalid</h1>
          <p className="text-xs text-neutral-400 mt-2.5 max-w-[300px] mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 font-bold text-xs text-black hover:bg-neutral-200 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
