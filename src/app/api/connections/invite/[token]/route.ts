import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_URL || "http://localhost:3001/api/v1";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const res = await fetch(`${BACKEND_URL}/connections/invite/${token}`, {
      cache: "no-store",
    });
    const data: any = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Proxy error [connections/invite/token]:", error.message);
    return NextResponse.json({ message: "Failed to validate invitation token." }, { status: 502 });
  }
}
