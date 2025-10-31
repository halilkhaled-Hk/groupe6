import { MainNav } from "@/components/navigation/main-nav"
import { CartContent } from "./cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      <CartContent />
    </div>
  )
}
