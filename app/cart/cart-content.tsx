"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, Package, Truck, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function CartContent() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal, clearCart, orderType, setOrderType } = useCartStore()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="pt-12 pb-12">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">Votre panier est vide</h2>
            <p className="mb-6 text-muted-foreground">Ajoutez des produits pour commencer votre commande</p>
            <Link href="/menu">
              <Button size="lg">Voir le Menu</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Votre Panier</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.image_url || "/placeholder.svg?height=100&width=100"}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.product.price.toFixed(0)} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right font-semibold">{(item.product.price * item.quantity).toFixed(0)} FCFA</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Type de commande</Label>
                <RadioGroup
                  value={orderType || ""}
                  onValueChange={(value: "takeaway" | "delivery" | "dine-in") => setOrderType(value)}
                >
                  {/* Takeaway */}
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">À emporter</div>
                        <div className="text-xs text-muted-foreground">Récupérer sur place</div>
                      </div>
                    </Label>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Livraison</div>
                        <div className="text-xs text-muted-foreground">Livré à domicile</div>
                      </div>
                    </Label>
                  </div>

                  {/* Dine-in */}
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem value="dine-in" id="dine-in" />
                    <Label htmlFor="dine-in" className="flex flex-1 cursor-pointer items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Sur place</div>
                        <div className="text-xs text-muted-foreground">Dîner au restaurant</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-semibold">{total.toFixed(0)} FCFA</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{total.toFixed(0)} FCFA</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" size="lg" onClick={() => router.push("/checkout")} disabled={!orderType}>
                Passer la commande
              </Button>
              {!orderType && (
                <p className="text-center text-xs text-muted-foreground">
                  Sélectionnez un type de commande pour continuer
                </p>
              )}
              <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                Vider le panier
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
