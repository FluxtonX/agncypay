"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../schemas/auth";
import { useApp } from "@/shared/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Eye, EyeOff, ShieldCheck, Lock, Globe2 } from "lucide-react";

// ─── Autofill fix style ─────────────────────────────────────────────────────
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #0B0B0B inset !important;
    -webkit-text-fill-color: #F8FAFC !important;
    border-color: #3A3A3A !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

// ─── Field Component ─────────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
}

function Field({ id, label, type = "text", placeholder, error, autoComplete, register }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={id} className="text-[13px] font-medium text-[#E5E5EA]">
        {label}
      </label>}
      <div className="relative w-full">
        <input
          id={id}
          type={resolvedType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-[#0B0B0B] px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#5A5A62] transition-colors focus:border-white/50 focus:outline-none ${
            error ? "border-red-500/50" : "border-[#3A3A3A]"
          } ${isPassword ? "pr-11" : "pr-4"}`}
          {...register(id)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
    </div>
  );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────
export function LoginForm() {
  const router = useRouter();
  const { login } = useApp();
  const [roleType, setRoleType] = useState<"brand" | "agency" | "talent">("brand");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDemoHelper, setShowDemoHelper] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handlePrefillDemo = () => {
    setValue("email", "martin.safi@adidas.com");
    setValue("password", "password123");
    setSubmitError(null);
    setShowDemoHelper(false);
  };

  const onSubmit = async (data: LoginInput) => {
    setSubmitError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || "Invalid credentials. Please try again.");
      }

      const { accessToken, user } = body.data;

      if (user.role !== roleType) {
        throw new Error(
          `Account role mismatch. This user is registered as a ${user.role}, not a ${roleType}.`
        );
      }

      login(accessToken, user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(message);
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-black font-sans text-white lg:grid-cols-[minmax(360px,0.95fr)_minmax(520px,1.05fr)]">
      <style dangerouslySetInnerHTML={{ __html: autofillStyle }} />

      {/* ── Demo helper ── */}
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setShowDemoHelper(!showDemoHelper)}
          className="px-3 py-1.5 bg-[#1F1F1F] border border-[#2D2D2D] hover:bg-[#2D2D2D] text-[11px] text-[#A1A1AA] rounded-md transition-colors shadow-lg cursor-pointer"
        >
          {showDemoHelper ? "Hide Demo Helper" : "Show Demo Credentials"}
        </button>

        {showDemoHelper && (
          <div className="absolute right-0 mt-2 w-72 bg-[#121212] border border-[#2D2D2D] rounded-lg p-4 shadow-2xl z-50 text-xs">
            <h4 className="font-semibold text-white mb-2">Demo Credentials</h4>
            <p className="text-[#8E8E93] mb-1">
              Email: <span className="text-white font-mono">martin.safi@adidas.com</span>
            </p>
            <p className="text-[#8E8E93] mb-3">
              Password: <span className="text-white font-mono">password123</span>
            </p>
            <button
              type="button"
              onClick={handlePrefillDemo}
              className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors cursor-pointer text-xs"
            >
              Prefill & Auto-populate
            </button>
          </div>
        )}
      </div>

      {/* ── Left panel — branding ── */}
      <aside className="hidden min-h-screen flex-col bg-black px-12 pb-12 pt-[78px] lg:flex xl:px-20 border-r border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] h-[350px] w-[350px] rounded-full bg-[#A87019]/10 blur-[80px]" />

        <div className="max-w-[650px] relative z-10">
          <Link href="/" className="mb-14 inline-block">
            <Image
              src="/agncypaybrand.png"
              alt="AgncyPay Logo"
              width={280}
              height={72}
              priority
              className="h-[72px] w-auto object-contain object-left scale-[1.15] origin-left"
            />
          </Link>

          <div className="mb-10 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] max-w-[440px]">
            <Image
              src="/asecurity.png"
              alt="AgncyPay Security"
              width={440}
              height={290}
              priority
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>

          <p className="text-[15px] font-medium leading-[1.6] text-neutral-400 max-w-[420px] mb-12">
            Automating and securing invoice payments, real-time splits, and ledger accounting across global brand networks.
          </p>

          <div className="space-y-[32px] max-w-[400px]">
            {[
              { icon: <ShieldCheck className="h-5 w-5" />, title: "SOC 2 Type II Certified", desc: "End-to-end encryption, multi-tenant boundaries, and strict operational security." },
              { icon: <Lock className="h-5 w-5" />, title: "Double-Entry Ledger", desc: "A comprehensive audit trail keeping all payment events, settlements, and credits in balance." },
              { icon: <Globe2 className="h-5 w-5" />, title: "Global Integrations", desc: "Connect bank accounts, sync QuickBooks Online accounting logs, and execute vendor mapping." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-[18px]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-neutral-300">
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs text-neutral-400 leading-normal">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto text-[11px] font-medium text-neutral-500 relative z-10">
          Copyright 2026 AgncyPay. All rights reserved.
        </div>
      </aside>

      {/* ── Right panel — form ── */}
      <main className="flex min-h-screen flex-col bg-[#121212] px-6 pb-16 pt-20 sm:px-10 sm:pt-24 md:px-16 lg:px-14 lg:pt-32 xl:px-20 overflow-y-auto justify-start">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/agncypaybrand.png"
              alt="AgncyPay Logo"
              width={240}
              height={60}
              className="h-[60px] w-auto object-contain object-left scale-[1.1] origin-left"
            />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[440px] flex-col justify-start">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[32px] font-medium text-white tracking-tight leading-tight">
              Welcome Back
            </h2>
            <p className="text-[#8E8E93] text-sm mt-1.5 font-normal">
              Sign in to your AgncyPay account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error alert */}
            {submitError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-950/30 p-3.5 text-xs text-red-300 leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Fields card */}
            <div className="rounded-[10px] border border-[#3A3A3A] bg-black/30 p-4 sm:p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col gap-5">
              {/* Account Type dropdown */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="roleType" className="text-[13px] font-medium text-[#E5E5EA]">
                  Account Type
                </label>
                <div className="relative w-full">
                  <select
                    id="roleType"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as "brand" | "agency" | "talent")}
                    className="w-full appearance-none rounded-lg border border-[#3A3A3A] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F8FAFC] transition-colors focus:border-white/50 focus:outline-none cursor-pointer"
                  >
                    <option value="brand" className="bg-[#0B0B0B] text-white">Brand</option>
                    <option value="agency" className="bg-[#0B0B0B] text-white">Agency</option>
                    <option value="talent" className="bg-[#0B0B0B] text-white">Talent</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#8E8E93]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <Field
                id="email"
                label="Email Address"
                placeholder="you@company.com"
                autoComplete="email"
                error={errors.email?.message}
                register={register}
              />

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-[13px] font-medium text-[#E5E5EA]">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#8E8E93] hover:text-white transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <Field
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  register={register}
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-[#3A3A3A] bg-[#0B0B0B] checked:bg-white checked:border-white accent-white cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-[#8E8E93] cursor-pointer hover:text-[#E5E5EA] select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-[46px] bg-white hover:bg-neutral-200 text-black font-semibold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 w-full">
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              )}
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-[#8E8E93] mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-white hover:underline font-medium ml-1">
                Sign up
              </Link>
            </p>
          </form>

          <div className="border-t border-[#3A3A3A] my-6" />

          <p className="text-center text-xs text-[#52525B] font-medium tracking-wide">
            Protected by bank-level security and encryption
          </p>
        </div>
      </main>
    </div>
  );
}
