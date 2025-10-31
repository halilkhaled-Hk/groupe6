import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, customerEmail } = body

    // On simule un PaymentIntent sans Stripe
    const fakePaymentIntent = {
      id: `pi_fake_${Math.random().toString(36).substring(2, 10)}`,
      client_secret: `pi_secret_fake_${Math.random().toString(36).substring(2, 20)}`,
      amount: amount,
      currency: "EUR",
      status: "requires_payment_method",
      orderId,
      receipt_email: customerEmail,
    }

    return NextResponse.json({
      clientSecret: fakePaymentIntent.client_secret,
      paymentIntentId: fakePaymentIntent.id,
    })
  } catch (error) {
    console.error("[v0] Payment intent creation error (simulated):", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
