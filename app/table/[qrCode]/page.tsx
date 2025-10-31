import { MainNav } from "@/components/navigation/main-nav"
import { FloatingCartButton } from "@/components/cart/floating-cart-button"
import { TableOrderContent } from "./table-order-content"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface TableOrderPageProps {
  params: Promise<{
    qrCode: string
  }>
}

export default async function TableOrderPage({ params }: TableOrderPageProps) {
  const { qrCode } = await params
  const supabase = await getSupabaseServerClient()

  // Verify table exists and is active
  const { data: table, error } = await supabase
    .from("restaurant_tables")
    .select("*")
    .eq("qr_code", qrCode)
    .eq("is_active", true)
    .single()

  if (error || !table) {
    redirect("/menu")
  }

  // Fetch categories and products
  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from("categories").select("*").order("display_order", { ascending: true }),
    supabase.from("products").select("*").eq("is_available", true).order("created_at", { ascending: false }),
  ])

  const categories = categoriesResult.data || []
  const products = productsResult.data || []

  return (
    <div className="min-h-screen">
      <MainNav />
      <TableOrderContent table={table} categories={categories} products={products} />
      <FloatingCartButton />
    </div>
  )
}
