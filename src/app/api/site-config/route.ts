import { getTrackingNumber } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function GET() {
  const tracking = getTrackingNumber();
  return Response.json(
    {
      trackingNumber: tracking.e164,
      trackingHref: tracking.href,
      trackingDisplay: tracking.display,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
