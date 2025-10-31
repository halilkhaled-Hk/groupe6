"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Leaf } from "lucide-react"
import type { Product } from "@/lib/types/database"
import { useCartStore } from "@/lib/store/cart-store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product, 1)
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {product.is_vegan && (
          <Badge className="absolute left-2 top-2 bg-green-500">
            <Leaf className="mr-1 h-3 w-3" />
            Vegan
          </Badge>
        )}
        {product.is_student_special && (
          <Badge className="absolute right-2 top-2 bg-secondary text-secondary-foreground">Étudiant</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">{product.name}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        {product.allergens && product.allergens.length > 0 && (
          <p className="text-xs text-muted-foreground">Allergènes: {product.allergens.join(", ")}</p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <span className="text-2xl font-bold text-primary">{product.price.toFixed(0)} FCFA</span>
        <div className="flex gap-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(product)}>
              Détails
            </Button>
          )}
          <Button size="sm" onClick={handleAddToCart}>
            <Plus className="mr-1 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
