import { MainNav } from "@/components/navigation/main-nav"
import { PaymentContent } from "./payment-content"

export default function PaymentPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      <PaymentContent />
    </div>
  )
}
