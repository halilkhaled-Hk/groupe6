"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/menu/product-card"
import { CategoryFilter } from "@/components/menu/category-filter"
import { Input } from "@/components/ui/input"
import { Search, Bell, CheckCircle2 } from "lucide-react"
import type { Category, Product, RestaurantTable } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface TableOrderContentProps {
  table: RestaurantTable
  categories: Category[]
  products: Product[]
}

export function TableOrderContent({ table, categories, products }: TableOrderContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { setOrderType, setTableId } = useCartStore()
  const { toast } = useToast()

  // Set order type and table ID when component mounts
  useEffect(() => {
    setOrderType("dine-in")
    setTableId(table.id)
  }, [table.id, setOrderType, setTableId])

  const filteredProducts = products.filter((product) => {
    if (selectedCategory) {
      const category = categories.find((c) => c.slug === selectedCategory)
      if (category && product.category_id !== category.id) {
        return false
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!product.name.toLowerCase().includes(query) && !product.description?.toLowerCase().includes(query)) {
        return false
      }
    }

    return true
  })

  const handleCallWaiter = () => {
    toast({
      title: "Serveur appelé",
      description: "Un serveur arrive à votre table dans quelques instants",
    })
    // In a real app, this would send a notification to the admin dashboard
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Table Info Banner */}
      <Card className="mb-6 border-2 border-primary bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Table {table.table_number}</h2>
              <p className="text-sm text-muted-foreground">Commandez directement depuis votre téléphone</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleCallWaiter} className="bg-transparent">
            <Bell className="mr-2 h-4 w-4" />
            Appeler
          </Button>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="bg-accent/50">
          <CardContent className="p-4">
            <h3 className="mb-1 font-semibold text-accent-foreground">Paiement flexible</h3>
            <p className="text-sm text-muted-foreground">Payez en ligne ou au serveur à la fin du repas</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <h3 className="mb-1 font-semibold text-secondary-foreground">Service rapide</h3>
            <p className="text-sm text-muted-foreground">Votre commande arrive directement en cuisine</p>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Menu</h1>
          <Badge variant="secondary" className="text-sm">
            Sur Place
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">Choisissez vos plats préférés</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">Aucun produit trouvé. Essayez de modifier vos filtres.</p>
        </div>
      )}
    </div>
  )
}
