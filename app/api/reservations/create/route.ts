import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, reservationDate, reservationTime, partySize, specialRequests, userId, preorderItems } = body

    const supabase = getSupabaseServerClient()

    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert({
        user_id: userId || null,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        party_size: partySize,
        status: "pending",
        special_requests: specialRequests || null,
        preorder_items: preorderItems || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ reservationId: reservation.id, success: true })
  } catch (err: any) {
    console.error("[API] Reservation creation failed:", err)
    return NextResponse.json({ error: err.message || "Failed to create reservation" }, { status: 500 })
  }
}
