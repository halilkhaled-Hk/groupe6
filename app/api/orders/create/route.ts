import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, orderType, table_number, paymentMethod, customerInfo = {}, total } = body

    console.log("[Backend] Données reçues :", { orderType, table_number })

    // Validation explicite pour dine-in ou takeaway
    if ((orderType === "dine-in" || orderType === "takeaway") && !table_number) {
      console.error("[Backend] Erreur : table_number requis pour dine-in ou takeaway")
      return NextResponse.json({ error: "Numéro de table requis pour les commandes sur place ou à emporter" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Create order avec infos client optionnelles
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        order_type: orderType,
        table_number: orderType === "dine-in" || orderType === "takeaway" ? table_number : null,
        status: "pending",
        subtotal: total,
        discount: 0,
        total: total,
        payment_status: "pending",
        payment_method: paymentMethod,
        customer_name: customerInfo.name || null,
        customer_email: customerInfo.email || null,
        customer_phone: customerInfo.phone || null,
        delivery_address: customerInfo.address || null,
        special_instructions: customerInfo.instructions || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[Backend] Erreur lors de la création de la commande :", orderError)
      throw orderError
    }

    console.log("[Backend] Commande créée avec table_number :", order.table_number)

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      selected_options: item.selectedOptions || null,
      subtotal: item.product.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[Backend] Erreur lors de la création des articles de la commande :", itemsError)
      throw itemsError
    }

    // Loyalty points pour utilisateur authentifié
    if (user) {
      const pointsEarned = Math.floor(total)
      await supabase.from("loyalty_transactions").insert({
        user_id: user.id,
        order_id: order.id,
        points_change: pointsEarned,
        transaction_type: "earned",
        description: `Points gagnés pour la commande #${order.id.slice(0, 8)}`,
      })

      await supabase.rpc("increment_loyalty_points", {
        user_id: user.id,
        points: pointsEarned,
      })
    }

    return NextResponse.json({ orderId: order.id, success: true })
  } catch (error) {
    console.error("[Backend] Échec de la création de la commande :", error)
    return NextResponse.json({ error: "Échec de la création de la commande" }, { status: 500 })
  }
}
