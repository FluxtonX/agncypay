"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroVisual from "./HeroVisual";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  Lock,
  Shield,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

const capabilityCards = [
  {
    icon: Zap,
    title: "Double-Entry Ledger",
    desc: "A built-in immutable ledger keeps all payment events, settlements, and credits in perfect balance.",
  },
  {
    icon: BarChart3,
    title: "QuickBooks Sync",
    desc: "Seamless synchronization of invoices, payouts, and vendor mapping directly with QuickBooks Online.",
  },
  {
    icon: Users,
    title: "Multi-Tenant Workspaces",
    desc: "Provide secure borders and role-based permissions for Brand, Agency, and Talent teams.",
  },
  {
    icon: Shield,
    title: "Payment Orchestration",
    desc: "Control funding methods, select settlement speeds, and automate split ratios within one pipeline.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Bank-Grade Security",
    desc: "End-to-end encryption, multi-factor authentication, and SOC 2 Type II certified practices.",
  },
  {
    icon: Globe2,
    title: "Plaid Bank Link",
    desc: "Securely link checking accounts and retrieve real-time bank details via Plaid Link integrations.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Register & Connect",
    desc: "Create an account matching your role and securely link bank credentials.",
  },
  {
    number: "02",
    title: "Sync Invoices",
    desc: "Import client invoices directly from QuickBooks or ingest digital sales reports.",
  },
  {
    number: "03",
    title: "Approve & Split",
    desc: "Verify totals, assign custom payout splits, and authorize payment rails.",
  },
  {
    number: "04",
    title: "Reconcile Ledger",
    desc: "Track settlements in real-time with automated accounting logs.",
  },
];

const securityItems = [
  "SOC 2 Type II Compliant Infrastructure",
  "End-to-end encryption (AES-256-GCM)",
  "Multi-factor authentication & Session control",
  "Role-based access control (RBAC)",
  "Immutable transaction ledger history",
  "PCI DSS compliant bank connections",
];

const marqueeBrands = [
  { name: "QuickBooks", logo: "/quickbook.png" },
  { name: "Plaid", logo: "/plaid-logo.svg" },
  { name: "Xero", logo: "/xero.png" },
  { name: "NetSuite", logo: "/netsuite.png" },
  { name: "Oracle", logo: "/oracle.png" },
  { name: "Mercury", logo: "/mercuryLogo.png" },
  {
    name: "Nike",
    isSvg: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto text-neutral-500 hover:text-white transition-colors">
        <path d="M21 6.5c-2.5 1.5-6.2 3.8-9.2 5.8C8.5 14.5 5.5 16.6 2 19c3.2-3 7.1-6.5 10-9.2 3.1-2.9 5.8-5.4 9-3.3z" />
      </svg>
    ),
  },
  {
    name: "Spotify",
    isSvg: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto text-neutral-500 hover:text-white transition-colors">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.746-.472-.076-.336.135-.67.472-.746 3.854-.88 7.15-.506 9.822 1.13.295.18.387.565.206.863zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.185-.412.125-.847-.11-.972-.522-.125-.412.11-.847.522-.972 3.667-1.112 8.243-.574 11.34 1.33.367.227.487.708.26 1.089zm.106-2.833C14.7 8.71 9.4 8.536 6.34 9.465c-.484.146-.99-.13-.137-.614a.89.89 0 0 1 .613-1.137c3.51-1.064 9.35-.863 13.07 1.345.437.26.58.825.32 1.262-.26.438-.825.58-1.262.32z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 h-[82px] border-b border-white/[0.06] bg-black/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center" aria-label="AgncyPay Home">
            <Image
              src="/agncypaybrand.png"
              alt="AgncyPay Logo"
              width={160}
              height={48}
              priority
              className="h-[48px] w-auto object-contain object-left scale-[1.5] origin-left"
            />
          </Link>

          <nav className="hidden items-center gap-10 text-[13px] font-semibold text-neutral-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#workflow" className="transition-colors hover:text-white">
              Workflow
            </a>
            <a href="#security" className="transition-colors hover:text-white">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <Link
              href="/auth/login"
              className="text-[13px] font-bold text-neutral-400 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex h-[38px] items-center justify-center rounded-lg bg-white px-5 text-[13px] font-bold text-black transition-colors hover:bg-neutral-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="pt-[82px]">
        <section className="relative overflow-hidden border-b border-white/[0.06] bg-black py-20 lg:py-28">
          {/* Radial ambient glow */}
          <div className="absolute inset-0 bg-radial-gradient opacity-60 pointer-events-none" />
          
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
              
              {/* LEFT Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start text-left"
              >
                <div
                  className="mb-6 rounded-full border border-white/[0.08] bg-white/[0.03] px-4.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  Automated Payment Ledger
                </div>

                <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl xl:text-7xl">
                  Payment Orchestration <br />
                  <span className="text-neutral-400">Reimagined.</span>
                </h1>

                <p className="mt-6 text-sm font-semibold leading-[1.6] text-neutral-400 sm:text-base max-w-[540px]">
                  Enterprise-grade ledger and payment workflows for digital brands, agencies, and independent creators. Connect accounting pipelines and track settlements in real-time.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/auth/register"
                    className="inline-flex h-[44px] w-full sm:w-[170px] items-center justify-center rounded-lg bg-white text-[13px] font-bold text-black transition-colors hover:bg-neutral-200 shadow-md active:scale-[0.98]"
                  >
                    Start Free
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex h-[44px] w-full sm:w-[170px] items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.02] text-[13px] font-bold text-white transition-colors hover:bg-white/[0.06] backdrop-blur-md active:scale-[0.98]"
                  >
                    Contact Sales
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 pt-8 border-t border-white/[0.08] flex items-center gap-14 w-full sm:w-auto">
                  <div>
                    <div className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">4.2B+</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-1">Volume</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">99.99%</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-1">Uptime</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-neutral-400" />
                    SOC 2 Type II Certified
                  </span>
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-neutral-400" />
                    Bank-Level Encryption
                  </span>
                  <span className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-neutral-400" />
                    Real-Time Settlement
                  </span>
                </div>
              </motion.div>

              {/* RIGHT Column - 3D Financial Core Canvas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <HeroVisual />
              </motion.div>

            </div>
          </div>
        </section>

        {/* Infinite Partners Marquee */}
        <section className="border-b border-white/[0.06] bg-[#050505] py-8 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-infinite flex gap-20 items-center">
              {[...marqueeBrands, ...marqueeBrands, ...marqueeBrands].map((brand, idx) => (
                <div key={`${brand.name}-${idx}`} className="flex items-center gap-3 shrink-0">
                  {brand.isSvg ? (
                    <div className="text-neutral-500 hover:text-white transition-colors duration-200">
                      {brand.svg}
                    </div>
                  ) : (
                    <Image
                      src={brand.logo!}
                      alt={brand.name}
                      width={100}
                      height={28}
                      className="h-6 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-200 filter brightness-100 grayscale hover:grayscale-0"
                    />
                  )}
                  <span className="text-[12px] font-bold tracking-wider uppercase text-neutral-600 select-none">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative border-b border-white/[0.06] bg-black px-6 py-24 lg:py-32">
          {/* Decorative grid outline background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-40" />

          <div className="relative z-10 mx-auto max-w-[1240px]">
            <div className="mb-20 text-center">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Core Architecture
              </p>
              <h2 className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-white sm:text-5xl">
                Built for Operational Control
              </h2>
              <p className="mt-4 text-base font-semibold text-neutral-400 max-w-[550px] mx-auto">
                Every tool engineered to provide absolute safety, precision, and automation for financial managers.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1000 }}>
              {capabilityCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.article
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ 
                      y: -10,
                      scale: 1.04,
                      rotateX: 8,
                      rotateY: -8,
                      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(168, 112, 25, 0.15)"
                    }}
                    style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                    className="group min-h-[220px] rounded-xl border border-white/20 bg-[#090909]/95 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-[#A87019]/50 cursor-pointer"
                  >
                    <div 
                      style={{ transform: "translateZ(30px)" }}
                      className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-neutral-300 transition-colors group-hover:border-white/20 group-hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 
                      style={{ transform: "translateZ(20px)" }}
                      className="mb-3 text-lg font-bold text-white tracking-tight"
                    >
                      {card.title}
                    </h3>
                    <p 
                      style={{ transform: "translateZ(15px)" }}
                      className="text-xs font-semibold leading-[1.6] text-neutral-400"
                    >
                      {card.desc}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Card Showcase Section */}
        <section id="cards-showcase" className="relative overflow-hidden border-b border-white/[0.06] bg-black px-6 py-24 lg:py-32">
          {/* Subtle gold radial gradient glow in the background */}
          <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#A87019]/5 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 mx-auto max-w-[1240px]">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <div className="rounded-full border border-[#A87019]/25 bg-[#A87019]/5 px-4.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A87019] self-start shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  The AgncyPay Card
                </div>
                <h2 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                  Tailored Spend Controls <br />
                  <span className="text-neutral-400">For Modern Teams.</span>
                </h2>
                <p className="text-base font-semibold leading-[1.6] text-neutral-400 max-w-[500px]">
                  Issue virtual and physical corporate credit cards instantly. Set granular multi-tenant spending limits, customize split payments automatically, and synchronize balance details with your core bank account in one click.
                </p>
                <div className="mt-4 flex flex-col gap-4.5 sm:flex-row">
                  <div className="flex items-center gap-3 text-sm font-bold text-neutral-300">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                      <Zap className="h-4.5 w-4.5 text-neutral-400" />
                    </div>
                    Instant Issuance
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-neutral-300">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                      <BarChart3 className="h-4.5 w-4.5 text-neutral-400" />
                    </div>
                    Real-time Tracking
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center"
              >
                {/* Background light-ray aura glow */}
                <div className="absolute inset-0 -m-8 rounded-3xl bg-radial-gradient opacity-60 pointer-events-none" />
                <div className="absolute top-[20%] left-[20%] h-[300px] w-[300px] rounded-full bg-[#A87019]/10 blur-[80px] pointer-events-none" />

                <motion.div
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: -8, 
                    rotateX: 8,
                    perspective: 1000 
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E0E]/85 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xl cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src="/agncypaycards.png"
                    alt="AgncyPay Premium Cards"
                    width={540}
                    height={360}
                    priority
                    className="rounded-xl object-contain shadow-2xl"
                  />
                  {/* Subtle glass shimmer over card */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow Timeline */}
        <section id="workflow" className="bg-neutral-950/80 px-6 py-24 lg:py-32 border-b border-white/[0.06] relative">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-20 text-center">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Process Pipeline
              </p>
              <h2 className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-white sm:text-5xl">
                Automated Ledger Ingestion
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
              {workflow.map((item, index) => (
                <motion.article
                  key={item.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-5 text-[48px] font-extrabold leading-none tracking-[-0.04em] text-neutral-700">
                    {item.number}
                  </div>
                  <h3 className="mb-3 text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold leading-[1.6] text-neutral-400">
                    {item.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Security Focus */}
        <section id="security" className="border-b border-white/[0.06] bg-black px-6 py-24 lg:py-32 relative overflow-hidden">
          {/* Subtle security light aura */}
          <div className="absolute top-[20%] left-[-10%] h-[450px] w-[450px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />

          <div className="mx-auto max-w-[1240px] relative z-10">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-4 rounded-full border border-white/[0.08] bg-white/[0.03] px-4.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 self-start shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] w-fit">
                  Security & Compliance
                </div>
                <h2 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                  Military-Grade <br />
                  <span className="text-neutral-400">Vault Security.</span>
                </h2>
                <p className="mt-5 text-base font-semibold leading-[1.6] text-neutral-400">
                  Built on top of robust cryptographic layers, providing a fully auditable double-entry accounting ledger, secure session policies, and Plaid bank mapping controls.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {securityItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs font-bold text-neutral-300"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center"
              >
                {/* Background light-ray aura glow */}
                <div className="absolute inset-0 -m-8 rounded-3xl bg-radial-gradient opacity-60 pointer-events-none" />
                <div className="absolute bottom-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-white/[0.02] blur-[80px] pointer-events-none" />

                <motion.div
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: 8, 
                    rotateX: 8,
                    perspective: 1000 
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E0E]/85 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xl cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src="/asecurity.png"
                    alt="AgncyPay Vault Security"
                    width={540}
                    height={360}
                    priority
                    className="rounded-xl object-contain shadow-2xl"
                  />
                  {/* Subtle glass shimmer over card */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-black px-6 py-24 text-center relative overflow-hidden border-b border-white/[0.06]">
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[400px] w-[400px] rounded-full bg-[#A87019]/5 blur-[90px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-[800px] relative z-10"
          >
            <h2 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl">
              Ready to Orchestrate <br />Your Network Payments?
            </h2>
            <p className="mt-6 text-sm font-semibold text-neutral-400">
              Deploy your secure wallet ledger and sync accounting in minutes.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-[46px] w-[220px] items-center justify-center gap-2 rounded-lg bg-white text-[13px] font-bold text-black transition-colors hover:bg-neutral-200 shadow-md"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-[46px] w-[220px] items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.02] text-[13px] font-bold text-white transition-colors hover:bg-white/[0.06]"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black px-6 pb-8 pt-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 gap-12 border-b border-white/[0.08] pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Link href="/">
                <Image
                  src="/agncypaybrand.png"
                  alt="AgncyPay Logo"
                  width={150}
                  height={44}
                  className="h-[44px] w-auto object-contain object-left scale-[1.4] origin-left mb-6"
                />
              </Link>
              <p className="max-w-[280px] text-xs font-semibold leading-[1.6] text-neutral-500">
                Enterprise ledger infrastructure designed for the digital agency and brand ecosystems.
              </p>
            </div>
            
            <div className="flex flex-col gap-4.5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-300">Product</h3>
              <ul className="space-y-3 text-[12px] font-semibold text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">Ledger core</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4.5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-300">Company</h3>
              <ul className="space-y-3 text-[12px] font-semibold text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4.5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-300">Support</h3>
              <ul className="space-y-3 text-[12px] font-semibold text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-8 text-[11px] font-semibold text-neutral-600 md:flex-row">
            <p>Copyright 2026 AgncyPay. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
