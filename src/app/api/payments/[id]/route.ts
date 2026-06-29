import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_URL || "http://localhost:3001/api/v1";

// GET /api/payments/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("Authorization") || "";
    
    console.log(`[Proxy] GET /api/payments/${id}`);
    console.log(`[Proxy] BACKEND_URL: ${BACKEND_URL}`);
    
    const res = await fetch(`${BACKEND_URL}/payments/${id}`, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });
    
    console.log(`[Proxy] Local backend response status: ${res.status}`);
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    // Fallback: Check if it is a QuickBooks invoice
    try {
      console.log(`[Proxy] Local payment not found. Querying QuickBooks invoices as fallback...`);
      const qbRes = await fetch(`${BACKEND_URL}/quickbooks/invoices`, {
        cache: "no-store",
      });
      
      console.log(`[Proxy] QuickBooks invoices response status: ${qbRes.status}`);
      
      if (qbRes.ok) {
        const qbData = await qbRes.json();
        console.log(`[Proxy] QuickBooks invoices count: ${qbData.invoices?.length}`);
        
        const qbInvoice = qbData.invoices?.find((inv: any) => {
          // Compare both invoice string ID and document number
          return String(inv.id) === String(id) || String(inv.docNumber) === String(id);
        });
        
        if (qbInvoice) {
          console.log(`[Proxy] Found matching QuickBooks invoice:`, qbInvoice);
          const mappedPayment = {
            id: qbInvoice.id,
            invoiceId: qbInvoice.docNumber,
            externalId: `QBO-${qbInvoice.id}`,
            source: "QUICKBOOKS",
            amount: qbInvoice.amount.toString(),
            currency: "USD",
            status: qbInvoice.status === "Paid" ? "SETTLED" : "PENDING",
            settledAmount: qbInvoice.status === "Paid" ? qbInvoice.amount.toString() : null,
            settledAt: null,
            invoiceData: {
              clientName: qbInvoice.name,
              description: qbInvoice.detail,
              dueDate: qbInvoice.date,
            },
            description: qbInvoice.detail,
            metadata: null,
            splits: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            walletId: "",
          };
          return NextResponse.json({ success: true, data: mappedPayment }, { status: 200 });
        } else {
          console.log(`[Proxy] QuickBooks invoice not found for ID: ${id}`);
        }
      }
    } catch (fallbackError: any) {
      console.error("[Proxy] QuickBooks fallback lookup failed:", fallbackError.message);
    }

    // Fallback 2: Check if it is a Xero invoice
    try {
      console.log(`[Proxy] Local payment not found. Querying Xero invoices as fallback...`);
      const xeroRes = await fetch(`${BACKEND_URL}/xero/invoices`, {
        cache: "no-store",
      });
      
      console.log(`[Proxy] Xero invoices response status: ${xeroRes.status}`);
      
      if (xeroRes.ok) {
        const xeroData = await xeroRes.json();
        console.log(`[Proxy] Xero invoices count: ${xeroData.invoices?.length}`);
        
        const xeroInvoice = xeroData.invoices?.find((inv: any) => {
          return String(inv.InvoiceID) === String(id) || String(inv.InvoiceNumber) === String(id);
        });
        
        if (xeroInvoice) {
          console.log(`[Proxy] Found matching Xero invoice:`, xeroInvoice);
          const mappedPayment = {
            id: xeroInvoice.InvoiceID,
            invoiceId: xeroInvoice.InvoiceNumber,
            externalId: `XERO-${xeroInvoice.InvoiceID}`,
            source: "XERO",
            amount: xeroInvoice.Total.toString(),
            currency: "USD",
            status: xeroInvoice.Status === "PAID" ? "SETTLED" : "PENDING",
            settledAmount: xeroInvoice.Status === "PAID" ? xeroInvoice.Total.toString() : null,
            settledAt: null,
            invoiceData: {
              clientName: xeroInvoice.ContactName,
              description: xeroInvoice.Reference,
              dueDate: xeroInvoice.Date,
            },
            description: xeroInvoice.Reference,
            metadata: null,
            splits: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            walletId: "",
          };
          return NextResponse.json({ success: true, data: mappedPayment }, { status: 200 });
        } else {
          console.log(`[Proxy] Xero invoice not found for ID: ${id}`);
        }
      }
    } catch (fallbackError: any) {
      console.error("[Proxy] Xero fallback lookup failed:", fallbackError.message);
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("[Proxy] Proxy error [payments/id]:", error.message);
    return NextResponse.json({ message: "Failed to reach server." }, { status: 502 });
  }
}
