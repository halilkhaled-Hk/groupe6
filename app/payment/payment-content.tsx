"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, Lock } from "lucide-react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe/client"

function CheckoutForm({ orderId, amount }: { orderId: string; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()
  const { clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (error) {
        toast({
          title: "Erreur de paiement",
          description: error.message,
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on backend
        await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentIntentId: paymentIntent.id,
          }),
        })

        toast({
          title: "Paiement réussi",
          description: "Votre commande a été confirmée",
        })

        clearCart()
        router.push(`/order-confirmation/${orderId}`)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" className="w-full" size="lg" disabled={!stripe || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Payer {amount.toFixed(0)} FCFA
          </>
        )}
      </Button>
    </form>
  )
}

export function PaymentContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, getTotal } = useCartStore()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const total = getTotal()

  useEffect(() => {
    if (items.length === 0) {
      router.push("/menu")
      return
    }

    const initializePayment = async () => {
      try {
        const customerInfoStr = sessionStorage.getItem("customerInfo")
        const orderType = sessionStorage.getItem("orderType") || "takeaway"
        const tableId = sessionStorage.getItem("tableId") || null

        const customerInfo = customerInfoStr
          ? JSON.parse(customerInfoStr)
          : {
              name: "Customer",
              email: "customer@example.com",
              phone: "0000000000",
            }

        // First, create the order
        const orderResponse = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            orderType,
            tableId,
            paymentMethod: "online",
            customerInfo,
            total,
          }),
        })

        if (!orderResponse.ok) throw new Error("Failed to create order")

        const { orderId: newOrderId } = await orderResponse.json()
        setOrderId(newOrderId)

        // Then, create payment intent
        const paymentResponse = await fetch("/api/payment/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            orderId: newOrderId,
            customerEmail: customerInfo.email,
          }),
        })

        if (!paymentResponse.ok) throw new Error("Failed to create payment intent")

        const { clientSecret: secret } = await paymentResponse.json()
        setClientSecret(secret)

        sessionStorage.removeItem("customerInfo")
        sessionStorage.removeItem("orderType")
        sessionStorage.removeItem("tableId")
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'initialiser le paiement",
          variant: "destructive",
        })
        router.push("/checkout")
      } finally {
        setIsLoading(false)
      }
    }

    initializePayment()
  }, [items, total, router, toast])

  if (isLoading || !clientSecret || !orderId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Initialisation du paiement...</p>
        </div>
      </div>
    )
  }

  const stripePromise = getStripe()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Paiement sécurisé</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informations de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#f97316",
                      },
                    },
                  }}
                >
                  <CheckoutForm orderId={orderId} amount={total} />
                </Elements>
              </CardContent>
            </Card>

            {/* Security Info */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Paiement sécurisé par Stripe</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="font-semibold">{(item.product.price * item.quantity).toFixed(0)} FCFA</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(0)} FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
