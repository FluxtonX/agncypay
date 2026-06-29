import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.XERO_CLIENT_ID || "";
  
  let redirectUri = process.env.XERO_REDIRECT_URI || "";
  if (!redirectUri) {
    const urlObj = new URL(request.url);
    redirectUri = `${urlObj.origin}/api/auth/xero/callback`;
  }

  if (!clientId) {
    return NextResponse.json(
      {
        error: "Xero OAuth Client ID is not configured. Please set XERO_CLIENT_ID in your environment.",
      },
      { status: 500 }
    );
  }

  const scopes = [
    "offline_access",
    "accounting.transactions",
    "accounting.contacts",
    "accounting.settings",
    "openid",
    "profile",
    "email"
  ].join(" ");

  const authUri = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=xero-oauth-state`;

  return NextResponse.redirect(authUri);
}
