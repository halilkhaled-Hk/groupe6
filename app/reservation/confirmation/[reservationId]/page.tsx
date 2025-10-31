import { MainNav } from "@/components/navigation/main-nav"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Calendar, Clock, Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ReservationConfirmationPageProps {
  params: Promise<{
    reservationId: string
  }>
}

export default async function ReservationConfirmationPage({ params }: ReservationConfirmationPageProps) {
  const { reservationId } = await params
  const supabase = await getSupabaseServerClient()

  const { data: reservation } = await supabase.from("reservations").select("*").eq("id", reservationId).single()

  if (!reservation) {
    return (
      <div className="min-h-screen">
        <MainNav />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Réservation introuvable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Success Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Réservation confirmée !</h1>
            <p className="text-muted-foreground">Nous avons hâte de vous accueillir</p>
          </div>

          {/* Reservation Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Détails de votre réservation</span>
                <Badge>En attente de confirmation</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(reservation.reservation_date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="font-semibold">{reservation.reservation_time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre de personnes</p>
                    <p className="font-semibold">
                      {reservation.party_size} {reservation.party_size === 1 ? "personne" : "personnes"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Restaurant</p>
                    <p className="font-semibold">Myka</p>
                  </div>
                </div>
              </div>

              {reservation.special_requests && (
                <div className="border-t pt-4">
                  <p className="mb-1 text-sm text-muted-foreground">Demandes spéciales</p>
                  <p className="text-sm">{reservation.special_requests}</p>
                </div>
              )}

              {reservation.preorder_items && reservation.preorder_items.length > 0 && (
                <div className="border-t pt-4">
                  <p className="mb-2 text-sm font-semibold">Précommande</p>
                  <p className="text-sm text-muted-foreground">
                    Vous avez précommandé {reservation.preorder_items.length}{" "}
                    {reservation.preorder_items.length === 1 ? "plat" : "plats"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-semibold">{reservation.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold">{reservation.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Téléphone</span>
                <span className="font-semibold">{reservation.customer_phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Important Info */}
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="mb-2 font-semibold">Informations importantes</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Vous recevrez un email de confirmation à {reservation.customer_email}</li>
                <li>• Merci d'arriver à l'heure. Votre table sera libérée après 15 minutes de retard</li>
                <li>• Pour annuler ou modifier votre réservation, contactez-nous au moins 2h à l'avance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/menu">
              <Button className="w-full" size="lg">
                Découvrir le menu
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
