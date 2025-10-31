import { MainNav } from "@/components/navigation/main-nav"
import { FloatingCartButton } from "@/components/cart/floating-cart-button"
import { MenuContent } from "./menu-content"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// 🚀 Désactive totalement le cache côté Next.js
export const revalidate = 0

export default async function MenuPage() {
  const supabase = await getSupabaseServerClient()

  // Récupération des catégories et produits
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      // Retire le filtre si tu veux tout voir :
      // .eq("is_available", true)
      .order("created_at", { ascending: false }),
  ])

  const categories = categoriesResult.data || []
  const products = productsResult.data || []

  // 🔍 Log pour vérifier les produits
  console.log("✅ Produits récupérés :", products.length)
  products.forEach((p) =>
    console.log(`- ${p.name} | Disponible: ${p.is_available}`)
  )

  if (productsResult.error) {
    console.error("❌ Erreur Supabase produits :", productsResult.error.message)
  }

  if (categoriesResult.error) {
    console.error("❌ Erreur Supabase catégories :", categoriesResult.error.message)
  }

  return (
    <div className="min-h-screen">
      <MainNav />
      <MenuContent categories={categories} products={products} />
      <FloatingCartButton />
    </div>
  )
}
