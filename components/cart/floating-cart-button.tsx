"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import Link from "next/link"

export function FloatingCartButton() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const total = useCartStore((state) => state.getTotal())

  if (itemCount === 0) return null

  return (
    <Link href="/cart">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-40 h-14 rounded-full px-6 shadow-lg transition-transform hover:scale-105"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        <span className="font-semibold">
          {itemCount} {itemCount === 1 ? "article" : "articles"}
        </span>
        <span className="ml-3 font-bold">{total.toFixed(0)} FCFA</span>
      </Button>
    </Link>
  )
}
