"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string; slug: string }>
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className={cn("transition-all", selectedCategory === null && "shadow-md")}
      >
        Tout
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category.slug)}
          className={cn("transition-all", selectedCategory === category.slug && "shadow-md")}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
