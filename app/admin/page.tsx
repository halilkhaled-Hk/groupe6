import { MainNav } from "@/components/navigation/main-nav"
import { AdminDashboard } from "./admin-dashboard"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  // Fetch initial data
  const [ordersResult, reservationsResult, statsResult] = await Promise.all([
    supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *
        ),
        restaurant_tables (
          table_number
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reservations")
      .select("*")
      .gte("reservation_date", new Date().toISOString().split("T")[0])
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true })
      .limit(20),
    supabase.from("orders").select("total, status, created_at"),
  ])

  const orders = ordersResult.data || []
  const reservations = reservationsResult.data || []
  const allOrders = statsResult.data || []

  // Calculate stats
  const today = new Date().toISOString().split("T")[0]
  const todayOrders = allOrders.filter((o) => o.created_at.startsWith(today))
  const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total), 0)
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length

  return (
    <div className="min-h-screen">
      <MainNav />
      <AdminDashboard
        initialOrders={orders}
        initialReservations={reservations}
        stats={{
          todayOrders: todayOrders.length,
          todayRevenue,
          pendingOrders,
          totalOrders: allOrders.length,
        }}
      />
    </div>
  )
}
