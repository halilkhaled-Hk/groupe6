export type OrderType = "dine-in" | "takeaway" | "delivery"
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"
export type PaymentMethod = "online" | "cash" | "card"
export type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show"

export interface Category {
  id: string
  name: string
  slug: string
  display_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  is_available: boolean
  is_vegan: boolean
  is_student_special: boolean
  allergens: string[]
  created_at: string
  updated_at: string
}

export interface ProductOption {
  id: string
  product_id: string
  name: string
  type: "single" | "multiple"
  options: Array<{ label: string; price: number }>
  created_at: string
}

export interface RestaurantTable {
  id: string
  table_number: string
  qr_code: string
  capacity: number
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string | null
  order_type: OrderType
  table_id: string | null
  status: OrderStatus
  subtotal: number
  discount: number
  total: number
  payment_status: PaymentStatus
  payment_method: PaymentMethod | null
  stripe_payment_intent_id: string | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  delivery_address: string | null
  special_instructions: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  selected_options: Record<string, any> | null
  subtotal: number
  created_at: string
}

export interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  loyalty_points: number
  total_orders: number
  created_at: string
  updated_at: string
}

export interface LoyaltyReward {
  id: string
  name: string
  description: string | null
  points_required: number
  reward_type: "discount" | "free_item" | "special_offer"
  reward_value: Record<string, any>
  is_active: boolean
  created_at: string
}

export interface LoyaltyTransaction {
  id: string
  user_id: string
  order_id: string | null
  points_change: number
  transaction_type: "earned" | "redeemed" | "expired" | "adjusted"
  description: string | null
  created_at: string
}

export interface PromoCode {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  created_at: string
}

export interface Reservation {
  id: string
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string
  reservation_time: string
  party_size: number
  status: ReservationStatus
  special_requests: string | null
  preorder_items: Array<any> | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedOptions?: Record<string, any>
}
