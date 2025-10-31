import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product } from "@/lib/types/database"

interface CartStore {
  items: CartItem[]
  orderType: "dine-in" | "takeaway" | "delivery" | null
  tableId: string | null
  addItem: (product: Product, quantity?: number, options?: Record<string, any>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setOrderType: (type: "dine-in" | "takeaway" | "delivery") => void
  setTableId: (tableId: string | null) => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: null,
      tableId: null,

      addItem: (product, quantity = 1, options) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(options),
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(options)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity, selectedOptions: options }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [], orderType: null, tableId: null })
      },

      setOrderType: (type) => {
        set({ orderType: type })
      },

      setTableId: (tableId) => {
        set({ tableId })
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          let itemPrice = item.product.price

          // Add option prices if any
          if (item.selectedOptions) {
            Object.values(item.selectedOptions).forEach((option: any) => {
              if (option?.price) {
                itemPrice += option.price
              }
            })
          }

          return total + itemPrice * item.quantity
        }, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "myka-cart-storage",
    },
  ),
)
