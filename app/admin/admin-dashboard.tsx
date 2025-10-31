"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  DollarSign,
  Users,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Reservation } from "@/lib/types/database"

interface AdminDashboardProps {
  initialOrders: any[]
  initialReservations: Reservation[]
  stats: {
    todayOrders: number
    todayRevenue: number
    pendingOrders: number
    totalOrders: number
  }
}

export function AdminDashboard({ initialOrders, initialReservations, stats }: AdminDashboardProps) {
  const { toast } = useToast()
  const [orders, setOrders] = useState(initialOrders)
  const [reservations, setReservations] = useState(initialReservations)
  const [selectedTab, setSelectedTab] = useState("orders")

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Subscribe to real-time order updates
    const ordersChannel = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          toast({
            title: "Nouvelle commande",
            description: `Commande #${payload.new.id.slice(0, 8)} reçue`,
          })
          // Refresh orders
          fetchOrders()
        } else if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((order) => (order.id === payload.new.id ? { ...order, ...payload.new } : order)))
        }
      })
      .subscribe()

    // Subscribe to real-time reservation updates
    const reservationsChannel = supabase
      .channel("reservations-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reservations" }, (payload) => {
        toast({
          title: "Nouvelle réservation",
          description: `Réservation pour ${payload.new.party_size} personnes`,
        })
        fetchReservations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(reservationsChannel)
    }
  }, [toast])

  const fetchOrders = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*),
        restaurant_tables (table_number)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(50)

    if (data) setOrders(data)
  }

  const fetchReservations = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .gte("reservation_date", new Date().toISOString().split("T")[0])
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true })
      .limit(20)

    if (data) setReservations(data)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Statut mis à jour",
        description: `Commande passée à ${newStatus}`,
      })
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    }
  }

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("reservations").update({ status: newStatus }).eq("id", reservationId)

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Statut mis à jour",
        description: `Réservation passée à ${newStatus}`,
      })
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation,
        ),
      )
    }
  }

  const getOrderStatusBadge = (status: string) => {
    const config = {
      pending: { label: "En attente", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Confirmée", variant: "default" as const, icon: CheckCircle2 },
      preparing: { label: "En préparation", variant: "default" as const, icon: ChefHat },
      ready: { label: "Prête", variant: "default" as const, icon: CheckCircle2 },
      completed: { label: "Terminée", variant: "secondary" as const, icon: CheckCircle2 },
      cancelled: { label: "Annulée", variant: "destructive" as const, icon: XCircle },
    }
    return config[status as keyof typeof config] || config.pending
  }

  const getOrderTypeLabel = (type: string) => {
    const labels = {
      "dine-in": "Sur place",
      takeaway: "À emporter",
      delivery: "Livraison",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <Badge variant="secondary" className="text-sm">
          Temps réel activé
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes aujourd'hui</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu aujourd'hui</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayRevenue.toFixed(0)} FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total commandes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune commande pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const statusConfig = getOrderStatusBadge(order.status)
              const StatusIcon = statusConfig.icon

              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span>Commande #{order.id.slice(0, 8).toUpperCase()}</span>
                          <Badge variant={statusConfig.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {new Date(order.created_at).toLocaleString("fr-FR")} • {getOrderTypeLabel(order.order_type)}
                          {order.restaurant_tables && ` • Table ${order.restaurant_tables.table_number}`}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{order.total.toFixed(0)} FCFA</div>
                        <Badge variant="outline" className="mt-1">
                          {order.payment_status === "paid" ? "Payé" : "Non payé"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Articles</h4>
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="font-semibold">{item.subtotal.toFixed(0)} FCFA</span>
                        </div>
                      ))}
                    </div>

                    {/* Customer Info */}
                    <div className="border-t pt-4">
                      <h4 className="mb-2 font-semibold">Client</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {order.customer_name && <p>Nom: {order.customer_name}</p>}
                        {order.customer_phone && <p>Tél: {order.customer_phone}</p>}
                        {order.customer_email && <p>Email: {order.customer_email}</p>}
                        {order.delivery_address && <p>Adresse: {order.delivery_address}</p>}
                        {order.special_instructions && <p>Instructions: {order.special_instructions}</p>}
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2 border-t pt-4">
                      {order.status === "pending" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                          Confirmer
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                          En préparation
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                          Prête
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, "completed")}>
                          Terminée
                        </Button>
                      )}
                      {order.status !== "cancelled" && order.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4">
          {reservations.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune réservation à venir</p>
              </CardContent>
            </Card>
          ) : (
            reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {reservation.customer_name}
                        <Badge
                          variant={
                            reservation.status === "confirmed"
                              ? "default"
                              : reservation.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {reservation.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {new Date(reservation.reservation_date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        à {reservation.reservation_time}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{reservation.party_size}</div>
                      <p className="text-sm text-muted-foreground">
                        {reservation.party_size === 1 ? "personne" : "personnes"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Tél:</span> {reservation.customer_phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {reservation.customer_email}
                    </p>
                    {reservation.special_requests && (
                      <p>
                        <span className="text-muted-foreground">Demandes:</span> {reservation.special_requests}
                      </p>
                    )}
                    {reservation.preorder_items && reservation.preorder_items.length > 0 && (
                      <p>
                        <span className="text-muted-foreground">Précommande:</span> {reservation.preorder_items.length}{" "}
                        {reservation.preorder_items.length === 1 ? "plat" : "plats"}
                      </p>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    {reservation.status === "pending" && (
                      <Button size="sm" onClick={() => updateReservationStatus(reservation.id, "confirmed")}>
                        Confirmer
                      </Button>
                    )}
                    {reservation.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateReservationStatus(reservation.id, "seated")}>
                        Client arrivé
                      </Button>
                    )}
                    {reservation.status === "seated" && (
                      <Button size="sm" onClick={() => updateReservationStatus(reservation.id, "completed")}>
                        Terminée
                      </Button>
                    )}
                    {reservation.status !== "cancelled" && reservation.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
