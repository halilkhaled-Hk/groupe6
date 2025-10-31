import { MainNav } from "@/components/navigation/main-nav"
import { ReservationContent } from "./reservation-content"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function ReservationPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userReservations = []

  if (user) {
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", user.id)
      .order("reservation_date", { ascending: false })
      .limit(5)

    userReservations = data || []
  }

  // Fetch available products for preorder
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen">
      <MainNav />
      <ReservationContent user={user} userReservations={userReservations} products={products || []} />
    </div>
  )
}
