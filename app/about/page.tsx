"use client"

import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const phoneNumber = "+237699118874"
  const email = "glaciermika@gmail.com"
  const address = "Mini Prix Bastos, Yaounde Cameroun"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {/* Titre */}
        <h1 className="mb-8 text-3xl font-bold text-center md:text-4xl text-gray-900 dark:text-white">
          À Propos de Myka
        </h1>

        {/* Grille Story + Contact */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Story */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Myka est né de la passion pour la bonne cuisine et l'envie de créer un lieu convivial où chacun se sent chez soi. Notre équipe jeune et dynamique met tout en œuvre pour vous offrir une expérience culinaire mémorable.
                </p>
                <p>
                  Nous proposons une cuisine moderne et savoureuse, préparée avec des ingrédients frais et de qualité. Que vous veniez pour un déjeuner rapide, un dîner entre amis ou une soirée spéciale, nous avons ce qu'il vous faut.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6 space-y-4">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Nous Contacter
              </h2>

              {/* Adresse */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Adresse</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{address}</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 justify-start gap-2 border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
                >
                  <a
                    href={`https://wa.me/${phoneNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp: {phoneNumber}
                  </a>
                </Button>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 justify-start gap-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  <a href={`mailto:${email}`}>{email}</a>
                </Button>
              </div>

              {/* Horaires */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 shrink-0 text-primary dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Horaires</p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Lundi - Dimanche</p>
                    <p>8h00 - 22h00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Google Map intégré */}
        <section className="py-16 bg-gray-100 dark:bg-gray-800/50 mt-8">
          <div className="container px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Nous trouver
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Notre établissement est situé au cœur de Yaoundé, facilement accessible, pivoter la carte pour vous retrouver.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.744364018746!2d11.510900375431714!3d3.848960996873542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x109d125b3c3c4c7b%3A0x4e2b90f2fa2b9c99!2sGlacier%20Myka%2C%20Bastos%2C%20Yaound%C3%A9!5e0!3m2!1sfr!2sfr!4v1699999999999!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation de Myka à Yaoundé"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8 text-center">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    En transport public
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bus et taxi disponibles dans tout Yaoundé
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    En voiture
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Parking disponible à proximité
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    À pied
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Situé au cœur de Bastos, facile à trouver
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}