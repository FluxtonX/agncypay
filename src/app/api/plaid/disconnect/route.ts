import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_URL || "http://localhost:3001/api/v1";

export async function POST() {
  try {
    const res = await fetch(`${BACKEND_URL}/plaid/disconnect`, { method: "POST" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Proxy error [plaid/disconnect]:", error.message);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
