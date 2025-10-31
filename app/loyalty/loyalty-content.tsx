"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Award, Tag, Copy, Check } from "lucide-react"
import type { UserProfile, LoyaltyTransaction, LoyaltyReward, PromoCode } from "@/lib/types/database"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SerializableUser {
  id: string
  email?: string
}

interface LoyaltyContentProps {
  user?: SerializableUser | null
  userProfile?: UserProfile | null
  transactions?: LoyaltyTransaction[]
  rewards?: LoyaltyReward[]
  promoCodes?: PromoCode[]
}

export function LoyaltyContent({
  user = { id: "guest", email: undefined },
  userProfile = null,
  transactions = [],
  rewards = [],
  promoCodes = [],
}: LoyaltyContentProps) {
  const { toast } = useToast()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState("")

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast({
      title: "Code copié",
      description: "Le code promo a été copié dans le presse-papier",
    })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const applyPromoCode = () => {
    if (!promoCode) return

    const code = promoCodes.find((p) => p.code.toLowerCase() === promoCode.toLowerCase())

    if (code) {
      toast({
        title: "Code valide",
        description: `Code ${code.code} prêt à être utilisé`,
      })
    } else {
      toast({
        title: "Code invalide",
        description: "Ce code promo n'existe pas ou a expiré",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Programme de Fidélité et D'offres</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comment ça marche ? */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Comment ça marche ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Commandez</h4>
                  <p className="text-sm text-muted-foreground">Gagnez 1 point pour chaque passage chez Myka</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Accumulez</h4>
                  <p className="text-sm text-muted-foreground">Collectez des points à chaque commande chez Myka</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Profitez</h4>
                  <p className="text-sm text-muted-foreground">Échangez vos points contre des récompenses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Récompenses Disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Récompenses Disponibles
              </CardTitle>
              <CardDescription>Échangez vos points contre ces avantages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {rewards.map((reward) => {
                  const canRedeem = (userProfile?.loyalty_points || 0) >= reward.points_required
                  return (
                    <Card key={reward.id} className={canRedeem ? "border-primary" : ""}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-semibold">{reward.name}</h4>
                          <Badge variant={canRedeem ? "default" : "secondary"}>
                            {reward.points_required} pts
                          </Badge>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">{reward.description}</p>
                        <Button size="sm" disabled={!canRedeem} className="w-full">
                          {canRedeem ? "Échanger" : "Pas assez de points"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Historique des transactions */}
          {transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge variant={transaction.points_change > 0 ? "default" : "secondary"}>
                        {transaction.points_change > 0 ? "+" : ""}
                        {transaction.points_change} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Barre latérale des codes promo */}
        <div className="space-y-6">
          {/* Appliquer un code promo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Code Promo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promo">Entrez votre code</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    placeholder="CAMPUSMYKA"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <Button onClick={applyPromoCode}>Valider</Button>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Codes promo disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Codes Disponibles</CardTitle>
              <CardDescription>Cliquez pour copier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {promoCodes.map((promo) => (
                <Card
                  key={promo.id}
                  className="cursor-pointer transition-all hover:border-primary"
                  onClick={() => copyPromoCode(promo.code)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <code className="rounded bg-muted px-2 py-1 text-sm font-bold">{promo.code}</code>
                      {copiedCode === promo.code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mb-2 text-sm font-medium">{promo.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {promo.discount_type === "percentage" ? (
                        <Badge variant="secondary" className="text-xs">
                          -{promo.discount_value}% 
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          -{promo.discount_value.toFixed(0)} FCFA
                        </Badge>
                      )}
                      {promo.min_order_amount > 0 && <span>Min. {promo.min_order_amount.toFixed(0)} FCFA</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Carte des statistiques */}
          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">Vos Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Commandes totales</span>
                <span className="font-bold">{userProfile?.total_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Points gagnés</span>
                <span className="font-bold">{userProfile?.loyalty_points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Membre depuis</span>
                <span className="font-bold">
                  {userProfile?.created_at
                    ? new Date(userProfile.created_at).toLocaleDateString("fr-FR", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}