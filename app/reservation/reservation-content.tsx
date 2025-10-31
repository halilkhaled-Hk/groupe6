"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Users, AlertCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { Reservation, Product } from "@/lib/types/database"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

interface ReservationContentProps {
  user: User | null
  userReservations: Reservation[]
  products: Product[]
}

export function ReservationContent({ user, userReservations, products }: ReservationContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreorder, setShowPreorder] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({})

  const [formData, setFormData] = useState({
    customerName: user?.user_metadata?.full_name || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    reservationDate: "",
    reservationTime: "",
    partySize: 2,
    specialRequests: "",
  })

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSelected = { ...prev }
      if (newSelected[productId]) {
        delete newSelected[productId]
      } else {
        newSelected[productId] = 1
      }
      return newSelected
    })
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts((prev) => {
        const newSelected = { ...prev }
        delete newSelected[productId]
        return newSelected
      })
    } else {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: quantity,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const preorderItems = showPreorder
        ? Object.entries(selectedProducts).map(([productId, quantity]) => ({
            product_id: productId,
            quantity,
          }))
        : null

      const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null,
          preorderItems,
        }),
      })

      if (!response.ok) throw new Error("Failed to create reservation")

      const { reservationId } = await response.json()

      toast({
        title: "Réservation confirmée",
        description: "Vous recevrez une confirmation par email",
      })

      router.push(`/reservation/confirmation/${reservationId}`)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const },
      confirmed: { label: "Confirmée", variant: "default" as const },
      seated: { label: "En cours", variant: "default" as const },
      completed: { label: "Terminée", variant: "secondary" as const },
      cancelled: { label: "Annulée", variant: "destructive" as const },
      no_show: { label: "Absent", variant: "destructive" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Réserver une Table</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Reservation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Réservation</CardTitle>
              <CardDescription>Réservez votre table en quelques clics</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Informations de contact</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Détails de la réservation</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        min={today}
                        value={formData.reservationDate}
                        onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Heure *</Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.reservationTime}
                        onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partySize">Nombre de personnes *</Label>
                      <Input
                        id="partySize"
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={formData.partySize}
                        onChange={(e) => setFormData({ ...formData, partySize: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="requests">Demandes spéciales (optionnel)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Allergies, occasion spéciale, préférences de placement..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  />
                </div>

                {/* Preorder Option */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="preorder"
                      checked={showPreorder}
                      onCheckedChange={(checked) => setShowPreorder(checked as boolean)}
                    />
                    <Label htmlFor="preorder" className="cursor-pointer">
                      Précommander des plats (optionnel)
                    </Label>
                  </div>

                  {showPreorder && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="mb-4 text-sm text-muted-foreground">
                          Gagnez du temps en précommandant vos plats. Ils seront prêts à votre arrivée.
                        </p>
                        <div className="space-y-3">
                          {products.slice(0, 6).map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between rounded-lg border bg-background p-3"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={!!selectedProducts[product.id]}
                                  onCheckedChange={() => handleProductToggle(product.id)}
                                />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">{product.price.toFixed(0)} FCFA</p>
                                </div>
                              </div>
                              {selectedProducts[product.id] && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(product.id, selectedProducts[product.id] - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center font-semibold">{selectedProducts[product.id]}</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(product.id, selectedProducts[product.id] + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Réservation en cours..." : "Confirmer la réservation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Horaires</p>
                  <p className="text-muted-foreground">Lun-Dim : 11h30 - 14h30, 18h30 - 23h00</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Politique d'annulation</p>
                  <p className="text-muted-foreground">Annulation gratuite jusqu'à 2h avant la réservation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Groupes</p>
                  <p className="text-muted-foreground">Pour plus de 10 personnes, contactez-nous directement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Reservations */}
          {user && userReservations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vos réservations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userReservations.map((reservation) => {
                  const statusBadge = getStatusBadge(reservation.status)
                  return (
                    <Card key={reservation.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(reservation.reservation_date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold">{reservation.reservation_time}</p>
                          <p className="text-muted-foreground">
                            {reservation.party_size} {reservation.party_size === 1 ? "personne" : "personnes"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Contact Card */}
          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Pour toute question ou demande spéciale, n'hésitez pas à nous contacter
              </p>
              <Link href="/about">
                <Button variant="outline" className="w-full bg-transparent">
                  Nous contacter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
