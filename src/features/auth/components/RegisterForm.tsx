"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../schemas/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";

// ─── Autofill fix ─────────────────────────────────────────────────────────────
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
  label: string;
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
      <label htmlFor={id} className="text-[13px] font-medium text-[#E5E5EA]">
        {label}
      </label>
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

// ─── RegisterForm ─────────────────────────────────────────────────────────────
export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDemoHelper, setShowDemoHelper] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      roleType: "brand",
      workspaceName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedRole = watch("roleType");

  const handlePrefillDemo = () => {
    setValue("fullName", "Martin Safi");
    setValue("email", "martin.safi@adidas.com");
    setValue("roleType", "brand");
    setValue("workspaceName", "Adidas");
    setValue("password", "password123!");
    setValue("confirmPassword", "password123!");
    setSubmitError(null);
    setShowDemoHelper(false);
  };

  const onSubmit = async (data: RegisterInput) => {
    setSubmitError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          roleType: data.roleType,
          workspaceName:
            data.roleType === "talent"
              ? `${data.fullName}'s Workspace`
              : data.workspaceName,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || "Registration failed. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(message);
    }
  };

  // ─── Success state ──────────────────────────────────────────────────────────
  if (success) {
    const loaderStyle = `
      @keyframes progress-slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
      }
      .animate-progress-slide {
        animation: progress-slide 1.5s infinite ease-in-out;
      }
    `;

    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black select-none relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: loaderStyle }} />
        {/* Glow */}
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center text-center px-6 relative z-10">
          <div className="relative mb-6">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border border-t-emerald-400 border-r-transparent border-b-emerald-800/20 border-l-transparent animate-spin duration-1000 h-16 w-16 -m-2" />
            {/* Inner check core */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Registration Successful!</h2>
          <p className="text-xs text-neutral-400 mt-2 font-semibold tracking-wide">
            Your AgncyPay workspace is provisioned. Redirecting to login...
          </p>
          {/* Linear loader */}
          <div className="w-48 h-1 bg-[#1A1A1A] rounded-full overflow-hidden mt-6 border border-white/[0.03] relative">
            <div className="h-full bg-emerald-400 rounded-full absolute left-0 top-0 w-[40%] animate-progress-slide" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-black font-sans text-white lg:grid-cols-[minmax(360px,0.95fr)_minmax(520px,1.05fr)]">
      <style dangerouslySetInnerHTML={{ __html: autofillStyle }} />

      {/* ── Demo helper ── */}
      <div className="fixed right-4 top-4 z-50">
        <button
          type="button"
          onClick={() => setShowDemoHelper(!showDemoHelper)}
          className="rounded-md border border-[#2D2D2D] bg-[#1F1F1F] px-3 py-1.5 text-[11px] text-[#A1A1AA] shadow-lg transition-colors hover:bg-[#2D2D2D] cursor-pointer"
        >
          {showDemoHelper ? "Hide Demo Helper" : "Show Demo Credentials"}
        </button>

        {showDemoHelper && (
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-[#2D2D2D] bg-[#121212] p-4 text-xs shadow-2xl">
            <h4 className="mb-2 font-semibold text-white">Demo Registration</h4>
            <p className="mb-1 text-[#8E8E93]">
              Name: <span className="text-white font-mono">Martin Safi</span>
            </p>
            <p className="mb-1 text-[#8E8E93]">
              Email: <span className="text-white font-mono">martin.safi@adidas.com</span>
            </p>
            <p className="mb-3 text-[#8E8E93]">
              Workspace: <span className="text-white font-mono">Adidas</span>
            </p>
            <button
              type="button"
              onClick={handlePrefillDemo}
              className="mt-2 w-full rounded bg-white py-2 font-semibold text-black transition-colors hover:bg-neutral-200 cursor-pointer"
            >
              Prefill Demo Data
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
            Create one AgncyPay account and unlock the full payment experience — invoicing, payouts, ledger, and integrations.
          </p>

          <div className="rounded-[8px] border border-[#272727] bg-[#070707] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-white" />
              <p className="text-[15px] font-semibold text-white">Clean signup flow</p>
            </div>
            <ul className="mt-5 space-y-3 text-[14px] leading-5 text-[#8E8E93]">
              {[
                "One account setup for the full product",
                "Redirect to sign in after signup",
                "Guest pay and logged-in pay stay separate",
              ].map((bullet) => (
                <li key={bullet} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E8E93]" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto text-[11px] font-medium text-neutral-500 relative z-10">
          Copyright 2026 AgncyPay. All rights reserved.
        </div>
      </aside>

      {/* ── Right panel — form ── */}
      <main className="flex min-h-screen flex-col bg-[#121212] px-6 pb-16 pt-20 sm:px-10 sm:pt-24 md:px-16 lg:px-14 lg:pt-32 xl:px-20 overflow-y-auto justify-start">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
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

        <div className="mx-auto flex w-full max-w-[480px] flex-col justify-start">
          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-[31px] font-medium leading-tight text-white">Create Account</h2>
            <p className="mt-2 text-sm leading-5 text-[#8E8E93]">
              Sign up once and go straight into the AgncyPay payment experience.
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
                    {...register("roleType")}
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

              {/* Full Name */}
              <Field
                id="fullName"
                label="Full Name"
                placeholder="e.g. Martin Safi"
                autoComplete="name"
                error={errors.fullName?.message}
                register={register}
              />

              {/* Email */}
              <Field
                id="email"
                label="Email Address"
                placeholder="you@company.com"
                autoComplete="email"
                error={errors.email?.message}
                register={register}
              />

              {/* Workspace Name — hidden for talent */}
              {selectedRole !== "talent" && (
                <Field
                  id="workspaceName"
                  label="Company / Workspace Name"
                  placeholder="e.g. Adidas"
                  autoComplete="organization"
                  error={errors.workspaceName?.message}
                  register={register}
                />
              )}

              {/* Password */}
              <Field
                id="password"
                type="password"
                label="Password"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                error={errors.password?.message}
                register={register}
              />

              {/* Confirm Password */}
              <Field
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                register={register}
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none" htmlFor="agree">
              <input
                type="checkbox"
                id="agree"
                required
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[#3A3A3A] bg-[#0B0B0B] accent-white shrink-0"
              />
              <span className="text-sm leading-tight text-[#8E8E93] hover:text-[#E5E5EA] transition-colors">
                I agree to the{" "}
                <Link href="#" className="font-medium text-white hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="font-medium text-white hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Info bar */}
            <div className="flex items-center justify-center gap-2 rounded-[10px] border border-[#3A3A3A] bg-[#0B0B0B] px-4 py-3 text-[13px] text-[#8E8E93]">
              <Check className="h-4 w-4 text-white shrink-0" />
              Sign in after signup to open your dashboard
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-[#8E8E93]">
            Already have an account?{" "}
            <Link href="/auth/login" className="ml-1 font-medium text-white hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
