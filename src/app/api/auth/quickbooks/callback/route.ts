import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Use NEXT_PUBLIC_API_BASE_URL (already set in Vercel) as primary,
// BACKEND_URL as secondary, then localhost as dev fallback
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3001/api/v1";

/**
 * QuickBooks OAuth callback.
 * Intuit redirects here after the user authorizes.
 * We forward the full callback URL + realmId to the backend to exchange the auth code.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const realmId = searchParams.get("realmId") || undefined;

  try {
    const res = await fetch(`${BACKEND_URL}/quickbooks/oauth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callbackUrl: request.url,
        realmId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("QuickBooks OAuth exchange failed:", err);
      return NextResponse.json({ error: "Failed to authenticate with QuickBooks." }, { status: 500 });
    }

    console.log("QuickBooks connection successful!");
    // Redirect back to integrations dashboard
    return NextResponse.redirect(new URL("/dashboard/integrations", request.url));
  } catch (error: any) {
    console.error("Error during QuickBooks OAuth callback:", error.message);
    return NextResponse.json({ error: "Failed to authenticate with QuickBooks." }, { status: 500 });
  }
}
