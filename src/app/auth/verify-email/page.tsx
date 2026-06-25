"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black font-sans text-white px-6 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[400px] w-[400px] rounded-full bg-[#A87019]/5 blur-[100px] pointer-events-none" />

      {/* Header Logo */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Image
            src="/agncypaybrand.png"
            alt="AgncyPay Logo"
            width={120}
            height={32}
            className="h-[36px] w-auto object-contain object-left scale-[1.3] origin-left"
          />
        </Link>
      </div>

      <div className="w-full max-w-[440px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center">
        {verifying ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-10 w-10 text-neutral-400 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying your email</h2>
            <p className="text-sm text-neutral-500">
              Confirming your security token with our servers...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e5e5e5]/10 text-white mb-6 border border-white/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
              Thank you. Your email address has been verified. You can now access your payment orchestration portal.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex w-full h-[46px] items-center justify-center rounded-lg bg-white text-[13px] font-bold text-black hover:bg-neutral-200"
            >
              Sign In to Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
