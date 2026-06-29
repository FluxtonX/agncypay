import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_URL || "http://localhost:3001/api/v1";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/xero/status`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Proxy error [xero/status]:", error.message);
    return NextResponse.json({ connected: false }, { status: 200 });
  }
}
