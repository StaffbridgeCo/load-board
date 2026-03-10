// app/loads/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function LoadDetail({ params }: Props) {

  // Next.js 15 requiere await params
  const { id } = await params;

  const { data, error } = await supabase
    .from("loads")
    .select(`
      *,
      driver:driver_id (
        name
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold text-black">Load not found</h1>
        <Link
          href="/dashboard"
          className="text-blue-600 mt-4 inline-block hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white shadow-lg rounded-xl">

      <Link
        href="/dashboard"
        className="text-blue-600 mb-4 inline-block hover:underline"
      >
        ← Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-4 text-black">
        {data.pickup_location} → {data.delivery_location}
      </h1>

      <div className="space-y-2 text-gray-700">

        <p>
          <strong>Status:</strong> {data.status}
        </p>

        <p>
          <strong>Pickup Date:</strong> {data.pickup_date}
        </p>

        <p>
          <strong>Delivery Date:</strong> {data.delivery_date}
        </p>

        <p>
          <strong>Miles:</strong> {data.miles}
        </p>

        <p>
          <strong>Rate:</strong> ${data.rate}
        </p>

        {data.driver && (
          <p>
            <strong>Driver:</strong> {data.driver.name}
          </p>
        )}

        {data.notes && (
          <p>
            <strong>Notes:</strong> {data.notes}
          </p>
        )}

      </div>

    </div>
  );
}