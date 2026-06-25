"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/features/auth/schemas/auth";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Password reset request submitted for:", data.email);
    setSuccess(true);
  };

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

      <div className="w-full max-w-[440px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e5e5e5]/10 text-white mb-6 border border-white/20">
              <Mail className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
              We have sent a temporary password reset link to your email address if it is associated with an active account.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex w-full h-[46px] items-center justify-center gap-2 rounded-lg bg-white text-[13px] font-bold text-black hover:bg-neutral-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white glow-text-primary">
                Reset password
              </h1>
              <p className="text-sm text-neutral-400">
                Enter your email address and we&apos;ll send you a recovery link
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register("email")}
                id="email"
                label="Email Address"
                placeholder="e.g. name@company.com"
                error={errors.email?.message}
                autoComplete="email"
              />

              <Button type="submit" isLoading={isSubmitting} className="w-full py-3">
                Send Recovery Link
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
