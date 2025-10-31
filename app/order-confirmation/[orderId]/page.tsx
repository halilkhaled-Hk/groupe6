import { MainNav } from "@/components/navigation/main-nav"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Clock, ChefHat } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params
  const supabase = await getSupabaseServerClient()

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *
      )
    `,
    )
    .eq("id", orderId)
    .single()

  if (!order) {
    return (
      <div className="min-h-screen">
        <MainNav />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Commande introuvable</p>
        </div>
      </div>
    )
  }

  const statusConfig = {
    pending: { icon: Clock, label: "En attente", color: "bg-yellow-500" },
    confirmed: { icon: CheckCircle2, label: "Confirmée", color: "bg-green-500" },
    preparing: { icon: ChefHat, label: "En préparation", color: "bg-blue-500" },
    ready: { icon: CheckCircle2, label: "Prête", color: "bg-green-500" },
    completed: { icon: CheckCircle2, label: "Terminée", color: "bg-gray-500" },
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending

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
            <h1 className="mb-2 text-3xl font-bold">Commande confirmée !</h1>
            <p className="text-muted-foreground">Numéro de commande : #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          {/* Order Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Statut de la commande</span>
                <Badge className={currentStatus.color}>
                  <currentStatus.icon className="mr-1 h-4 w-4" />
                  {currentStatus.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_type === "dine-in" && (
                <p className="text-sm text-muted-foreground">
                  Votre commande a été transmise en cuisine. Elle sera servie à votre table dans quelques instants.
                </p>
              )}
              {order.order_type === "takeaway" && (
                <p className="text-sm text-muted-foreground">
                  Votre commande sera prête dans 15-20 minutes. Vous recevrez une notification.
                </p>
              )}
              {order.order_type === "delivery" && (
                <p className="text-sm text-muted-foreground">
                  Votre commande sera livrée dans 30-45 minutes à l'adresse indiquée.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-semibold">{item.subtotal.toFixed(0)} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{order.total.toFixed(0)} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-semibold">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold">{order.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Téléphone</span>
                <span className="font-semibold">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode de paiement</span>
                <span className="font-semibold capitalize">{order.payment_method}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/menu">
              <Button className="w-full" size="lg">
                Nouvelle commande
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
