import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3001/api/v1";

export async function GET(request: Request) {
  try {
    const res = await fetch(`${BACKEND_URL}/xero/oauth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callbackUrl: request.url,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Xero OAuth exchange failed:", err);
      return NextResponse.json(
        {
          error: "Failed to authenticate with Xero.",
          message: err.message || "Unknown exchange error",
          detail: err.detail || err,
          xeroStatus: err.xeroStatus,
          xeroResponse: err.xeroResponse,
        },
        { status: res.status }
      );
    }

    console.log("Xero connection successful!");
    return NextResponse.redirect(new URL("/dashboard/integrations", request.url));
  } catch (error: any) {
    console.error("Error during Xero OAuth callback:", error.message);
    return NextResponse.json({ error: "Failed to authenticate with Xero." }, { status: 500 });
  }
}
