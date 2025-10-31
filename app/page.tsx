import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/navigation/main-nav"
import { ArrowRight, Utensils, Truck, QrCode, Gift } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  Mange. Kiffe. Relance.
                </h1>
                <p className="text-pretty text-xl text-muted-foreground md:text-2xl">
                  Commandez vos plats préférés en quelques clics. Sur place, à emporter ou en livraison.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/menu">
                  <Button size="lg" className="w-full text-lg sm:w-auto">
                    Commander Maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/reservation">
                  <Button size="lg" variant="outline" className="w-full text-lg sm:w-auto bg-transparent">
                    Réserver une Table
                  </Button>
                </Link>
              </div>

              {/* Promo Banner */}
              <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    <span className="text-primary">Offre Spéciale :</span> 15% de réduction avec le code CAMPUSMYKA
                  </p>
                </div>
              </div>
            </div>

            {/* Right Video */}
            <div className="relative">
              <div className="animate-float">
                <video
                  src="/delicious-burger-and-fries.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-auto w-full rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">Comment ça marche ?</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Sur Place</h3>
              <p className="text-muted-foreground">
                Scannez le QR code sur votre table et commandez directement depuis votre téléphone.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">À Emporter</h3>
              <p className="text-muted-foreground">
                Commandez en ligne et récupérez votre repas prêt à l'heure que vous voulez.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Livraison</h3>
              <p className="text-muted-foreground">Faites-vous livrer vos plats préférés directement chez vous.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📸 Galerie Section */}
      <section className="bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
            Galerie du Restaurant
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "/images/resto1.jpg",
              "/images/resto2.jpg",
              "/images/resto3.jpg",
              "/images/resto4.jpg",
              "/images/resto5.jpg",
              //"/images/resto6.jpg",
            ].map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl shadow-lg group"
              >
                <img
                  src={img}
                  alt={`Photo du restaurant ${index + 1}`}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Prêt à commander ?</h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Découvrez notre menu et profitez de nos offres exclusives.
          </p>
          <Link href="/menu">
            <Button size="lg" variant="secondary" className="text-lg">
              Voir le Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Myka Restaurant. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
