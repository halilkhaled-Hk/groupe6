"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/menu/product-card"
import { CategoryFilter } from "@/components/menu/category-filter"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import type { Category, Product } from "@/lib/types/database"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface MenuContentProps {
  categories: Category[]
  products: Product[]
}

export function MenuContent({ categories, products }: MenuContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showVeganOnly, setShowVeganOnly] = useState(false)
  const [showStudentOnly, setShowStudentOnly] = useState(false)

  // --- FILTRAGE DES PRODUITS ---
  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || ""
    const description = product.description?.toLowerCase() || ""

    // Filtrage par catégorie
    if (selectedCategory) {
      const category = categories.find((c) => c.slug === selectedCategory)
      if (category && product.category_id !== category.id) return false
    }

    // Recherche texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!name.includes(query) && !description.includes(query)) return false
    }

    // Vegan uniquement
    if (showVeganOnly && product.is_vegan !== true) return false

    // Offres étudiantes uniquement
    if (showStudentOnly && product.is_student_special !== true) return false

    return true
  })

  return (
    <div className="container mx-auto px-4 py-10">
      {/* --- HEADER --- */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Le Menu Myka
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Découvrez nos délices faits maison avec amour et passion.
        </p>
      </div>

      {/* --- RECHERCHE & FILTRES --- */}
      <div className="mb-8 space-y-6">
        {/* Barre de recherche */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm rounded-xl border-muted focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Filtres mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>Affinez votre recherche</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vegan-mobile"
                    checked={showVeganOnly}
                    onCheckedChange={(checked) => setShowVeganOnly(Boolean(checked))}
                  />
                  <Label htmlFor="vegan-mobile">Vegan uniquement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="student-mobile"
                    checked={showStudentOnly}
                    onCheckedChange={(checked) => setShowStudentOnly(Boolean(checked))}
                  />
                  <Label htmlFor="student-mobile">Offres étudiantes</Label>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Filtres desktop */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegan"
              checked={showVeganOnly}
              onCheckedChange={(checked) => setShowVeganOnly(Boolean(checked))}
            />
            <Label htmlFor="vegan" className="text-sm">
              Vegan uniquement
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="student"
              checked={showStudentOnly}
              onCheckedChange={(checked) => setShowStudentOnly(Boolean(checked))}
            />
            <Label htmlFor="student" className="text-sm">
              Offres étudiantes
            </Label>
          </div>
        </div>

        {/* Catégories */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* --- LISTE DES PRODUITS --- */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-base">
            Aucun plat trouvé. Essayez un autre filtre ou mot-clé.
          </p>
        </div>
      )}
    </div>
  )
}
