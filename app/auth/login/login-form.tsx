"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = getSupabaseBrowserClient()

    try {
      if (isSignUp) {
        // Créer l'utilisateur dans Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
            data: {
              full_name: formData.fullName,
            },
          },
        })

        if (error) throw error

        // Créer automatiquement le profil utilisateur dans user_profiles
        if (data.user) {
          const { error: profileError } = await supabase.from("user_profiles").insert({
            id: data.user.id,
            full_name: formData.fullName,
            loyalty_points: 0,
            total_orders: 0,
          })

          if (profileError) throw profileError
        }

        toast({
          title: "Compte créé",
          description: "Vérifiez votre email pour confirmer votre compte",
        })
      } else {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Myka",
        })

        router.push("/")
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Créer un compte" : "Connexion"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Rejoignez Myka et profitez du programme de fidélité" : "Connectez-vous à votre compte"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : isSignUp ? (
              "Créer un compte"
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isSignUp ? (
            <p>
              Vous avez déjà un compte ?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-primary hover:underline">
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Pas encore de compte ?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-primary hover:underline">
                Créer un compte
              </button>
            </p>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
