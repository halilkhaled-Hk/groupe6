import { MainNav } from "@/components/navigation/main-nav"
import { CheckoutContent } from "./checkout-content"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      <CheckoutContent />
    </div>
  )
}
