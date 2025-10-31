"use client"

import type React from "react"
import { useState } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectItem } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, Wallet, Banknote } from "lucide-react"
import Link from "next/link"

export function CheckoutContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, orderType, tableId, getTotal, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash" | "card">("online")
  const [selectedTable, setSelectedTable] = useState(tableId || "")
  const total = getTotal()

  if (items.length === 0) {
    router.push("/menu")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderType) {
      toast({ title: "Erreur", description: "Le type de commande est requis", variant: "destructive" })
      return
    }

    if ((orderType === "dine-in" || orderType === "takeaway") && !selectedTable) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une table.", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          orderType,
          table_number: orderType === "dine-in" || orderType === "takeaway" ? selectedTable : null,
          paymentMethod,
          customerInfo: {}, // aucun info nécessaire
          total,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Échec de la création de la commande")
      }

      const { orderId } = await response.json()
      toast({ title: "Commande envoyée", description: "Votre commande a été transmise avec succès" })
      clearCart()
      router.push(`/order-confirmation/${orderId}`)
    } catch (error) {
      console.error("[Frontend] Erreur:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {(orderType === "dine-in" || orderType === "takeaway") && (
              <Card>
                <CardHeader>
                  <CardTitle>Choisir la table</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedTable}
                    onValueChange={(value: string) => setSelectedTable(value)}
                    placeholder="Sélectionnez une table"
                  >
                    <SelectItem value="table-1">Table 1</SelectItem>
                    <SelectItem value="table-2">Table 2</SelectItem>
                    <SelectItem value="table-3">Table 3</SelectItem>
                    <SelectItem value="table-4">Table 4</SelectItem>
                    <SelectItem value="table-5">Table 5</SelectItem>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Mode de paiement */}
            <Card>
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  {/* Paiement en ligne */}
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="online" id="online" />
                    <label htmlFor="online" className="flex flex-1 cursor-pointer items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Paiement en ligne</div>
                        <div className="text-sm text-muted-foreground">Carte bancaire sécurisée</div>
                      </div>
                    </label>
                  </div>

                  {/* Carte sur place */}
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="card" id="card" />
                    <label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Carte sur place</div>
                        <div className="text-sm text-muted-foreground">
                          {orderType === "dine-in" || orderType === "takeaway"
                            ? "Payer par carte à la table"
                            : "Payer par carte à la réception"}
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Espèces */}
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="cash" id="cash" />
                    <label htmlFor="cash" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Banknote className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Espèces</div>
                        <div className="text-sm text-muted-foreground">
                          {orderType === "dine-in" || orderType === "takeaway"
                            ? "Payer en espèces à la table"
                            : "Payer en espèces à la réception"}
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
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
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : paymentMethod === "online" ? (
                    "Procéder au paiement"
                  ) : (
                    "Confirmer la commande"
                  )}
                </Button>
                <Link href="/cart">
                  <Button variant="outline" className="w-full bg-transparent">
                    Retour au panier
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
