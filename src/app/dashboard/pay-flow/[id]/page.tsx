import { PayFlowPage } from "@/features/payflow/components/PayFlowPage";

// Next.js 15: params is a Promise — must be awaited
export default async function PayFlowRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PayFlowPage id={id} />;
}
