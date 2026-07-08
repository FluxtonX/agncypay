"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Inbox, X, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/components/ui/Card";

interface CsvDropzonePanelProps {
  walletId: string;
}

export function CsvDropzonePanel({ walletId }: CsvDropzonePanelProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const uploadFile = async (file: File) => {
    setIsDragActive(false);
    setUploadState("parsing");
    setErrorMessage("");
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("walletId", walletId);

      const response = await fetch("/api/payments/excel/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = null;
      }

      if (response.ok && data?.success) {
        setUploadState("success");
        // Dispatch event to trigger dashboard components to reload data
        window.dispatchEvent(new Event("incomesUpdated"));
        // Reset back to idle after a few seconds
        setTimeout(() => {
          setUploadState("idle");
          setFileName("");
        }, 5000);
      } else {
        setUploadState("error");
        setErrorMessage(data?.error || data?.message || "Failed to upload and parse file.");
      }
    } catch (error: any) {
      setUploadState("error");
      setErrorMessage(error.message || "Network error occurred.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border border-[#3a3a3a] bg-[#0d0d0d] p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px]",
        isDragActive ? "border-emerald-500 bg-emerald-500/5" : "hover:border-neutral-500 hover:bg-white/[0.01]"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (uploadState === "idle") {
          fileInputRef.current?.click();
        }
      }}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept=".csv,.pdf,.xlsx,.xls" 
      />

      {uploadState === "idle" && (
        <>
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
            {/* Pulsing background ring */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '3s' }}></div>
            {/* Background circle */}
            <div className="absolute inset-1.5 rounded-full bg-emerald-500/5"></div>
            
            {/* The Box/Folder icon */}
            <div className="absolute bottom-2 flex h-8 w-8 items-center justify-center">
              <Inbox className={cn("h-8 w-8 transition-colors duration-300", isDragActive ? "text-emerald-500" : "text-neutral-600")} />
            </div>

            {/* The File icon that bounces */}
            <div className={cn(
              "absolute z-10 flex h-7 w-7 items-center justify-center rounded-[3px] bg-[#1a1a1a] border border-[#3a3a3a] shadow-lg transition-all duration-300",
              isDragActive ? "scale-110 border-emerald-500 bg-emerald-500/10 text-emerald-500 top-5" : "animate-bounce top-1 text-white"
            )}>
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Manual Data Ingestion</h3>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-neutral-400 max-w-[280px]">
            Drag & drop your Paystub, CSV, or PDF file here to parse and split income automatically.
          </p>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="mt-4 inline-flex h-8 items-center justify-center rounded-md bg-white px-4 text-xs font-bold text-black hover:bg-neutral-200 transition-colors"
          >
            Browse Files
          </button>
        </>
      )}

      {uploadState === "parsing" && (
        <div className="flex flex-col items-center justify-center py-4 w-full">
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
            <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Parsing Income Data...</h3>
          <p className="mt-2 text-[11px] text-neutral-400 max-w-[240px] truncate">
            Ingesting {fileName}
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">
            Updating ledgers and computing balances
          </p>
        </div>
      )}

      {uploadState === "success" && (
        <div className="flex flex-col items-center justify-center py-4 w-full animate-in fade-in zoom-in duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ingested Successfully!</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-neutral-300 max-w-[280px]">
            Your digital sales payout has been parsed and posted to your ledger.
          </p>
        </div>
      )}

      {uploadState === "error" && (
        <div className="flex flex-col items-center justify-center py-4 w-full animate-in fade-in zoom-in duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400 mb-3 border border-red-500/25">
            <X className="h-6 w-6" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Ingestion Failed</h3>
          <p className="mt-1.5 text-[11px] leading-normal text-red-300/80 max-w-[260px] max-h-[60px] overflow-y-auto px-2">
            {errorMessage}
          </p>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setUploadState("idle");
              setFileName("");
            }}
            className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#3a3a3a] bg-black px-4 text-xs font-bold text-neutral-300 hover:bg-neutral-900 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </button>
        </div>
      )}
    </Card>
  );
}
