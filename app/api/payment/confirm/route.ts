import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentIntentId } = body

    const supabase = await getSupabaseServerClient()

    // Update order with payment information
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        stripe_payment_intent_id: paymentIntentId,
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("[v0] Order update error:", error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Payment confirmation error:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
