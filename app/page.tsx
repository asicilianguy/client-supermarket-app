import { Heart, Users, GraduationCap, Briefcase, ShoppingCart, Sparkles, TrendingDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SmartShoppingList } from "@/components/ui/smart-shopping-list"
import { SupermarketGrid } from "@/components/ui/supermarket-grid"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-4 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <Image
            src="/logo-spesaviva-horizontal.png"
            alt="SpesaViva"
            width={200}
            height={60}
            className="h-10 w-auto"
            priority
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-orange-50 to-pink-50 px-4 py-20 relative overflow-hidden">
        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="mb-16 animate-fade-in">
            <div className="mb-8">
              <h1 className="font-fredoka text-6xl font-bold text-gray-900 leading-tight mb-4 animate-slide-up">
                SpesaViva
              </h1>
              <div className="relative">
                <p className="font-fredoka text-2xl text-primary-orange font-medium mb-2 animate-slide-up delay-200">
                  Dove la lista della spesa
                </p>
                <p className="font-fredoka text-2xl text-primary-purple font-bold animate-slide-up delay-400">
                  prende vita ✨
                </p>
              </div>
            </div>

            <p className="font-nunito text-gray-600 text-lg leading-relaxed animate-slide-up delay-600">
              La spesa intelligente che si adatta a te
            </p>
          </div>

          {/* Interactive Demo - Fixed Height Container */}
          <div className="mb-16 animate-slide-up delay-800">
            <SmartShoppingList />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-12 animate-slide-up delay-1000">
            <div className="text-center p-6 bg-white/70 rounded-3xl backdrop-blur-sm border border-primary-blue/20 hover:shadow-lg transition-all duration-300">
              <AnimatedCounter end={15} suffix="+" />
              <p className="font-nunito text-sm text-gray-600 mt-2 font-medium">Catene partner</p>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-3xl backdrop-blur-sm border border-primary-green/20 hover:shadow-lg transition-all duration-300">
              <AnimatedCounter end={50} suffix="%" />
              <p className="font-nunito text-sm text-gray-600 mt-2 font-medium">Risparmio medio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Per ogni stile di vita</h2>
            <p className="font-nunito text-gray-600 text-lg">
              SpesaViva si adatta alle tue esigenze, qualunque esse siano
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="group p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary-pink/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-primary-pink" />
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2">Famiglie</h3>
              <p className="font-nunito text-sm text-gray-600">Spesa organizzata per tutta la famiglia</p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary-purple/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-primary-purple" />
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2">Studenti</h3>
              <p className="font-nunito text-sm text-gray-600">Massimizza il budget universitario</p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary-green/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-primary-green" />
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2">Professionisti</h3>
              <p className="font-nunito text-sm text-gray-600">Spesa veloce ed efficiente</p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary-yellow/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary-orange" />
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2">Coppie</h3>
              <p className="font-nunito text-sm text-gray-600">Pianificate insieme i vostri acquisti</p>
            </div>
          </div>

          <div className="text-center">
            <p className="font-nunito text-sm text-gray-500 italic font-medium">
              E per chiunque voglia fare la spesa con intelligenza 🧠
            </p>
          </div>
        </div>
      </section>

      {/* Supermarkets Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">I tuoi supermercati preferiti</h2>
            <p className="font-nunito text-gray-600 text-lg">
              Confrontiamo le offerte delle principali catene italiane
            </p>
          </div>

          <SupermarketGrid />
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-fredoka text-4xl font-bold text-gray-900 mb-12">Come funziona la magia</h2>

          <div className="space-y-12">
            <div className="group text-center">
              <div className="relative mb-6">
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary-orange/20 to-primary-pink/20 rounded-3xl flex items-center justify-center mx-auto group-hover:animate-bounce-gentle transition-all duration-300">
                  <ShoppingCart className="w-10 h-10 text-primary-orange" />
                  {/* Badge in corner */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-fredoka font-bold text-sm">1</span>
                  </div>
                </div>
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2 text-xl">Scrivi la tua lista</h3>
              <p className="font-nunito text-gray-600">Semplice come su un foglio di carta</p>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary-purple/20 to-primary-blue/20 rounded-3xl flex items-center justify-center mx-auto group-hover:animate-wiggle transition-all duration-300">
                  <Sparkles className="w-10 h-10 text-primary-purple" />
                  {/* Badge in corner */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-purple rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-fredoka font-bold text-sm">2</span>
                  </div>
                </div>
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2 text-xl">La lista prende vita</h3>
              <p className="font-nunito text-gray-600">SpesaViva trova automaticamente le offerte</p>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary-green/20 to-primary-yellow/20 rounded-3xl flex items-center justify-center mx-auto group-hover:animate-bounce-gentle transition-all duration-300">
                  <TrendingDown className="w-10 h-10 text-primary-green" />
                  {/* Badge in corner */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-green rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-fredoka font-bold text-sm">3</span>
                  </div>
                </div>
              </div>
              <h3 className="font-fredoka font-bold text-gray-900 mb-2 text-xl">Risparmi tempo e denaro</h3>
              <p className="font-nunito text-gray-600">Scegli le offerte migliori per te</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-playful px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-12">
            <h2 className="font-fredoka text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Inizia a risparmiare oggi
            </h2>
            <p className="font-nunito text-white/90 text-lg font-medium">
              Unisciti a migliaia di persone che hanno già scoperto la spesa intelligente
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 mb-16">
            <Link href="/register" className="block group">
              <Button
                size="lg"
                className="w-full py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 bg-white text-primary-purple hover:bg-gray-50 font-fredoka font-bold text-lg"
              >
                <span className="mr-2">🚀</span>
                Inizia gratis ora
              </Button>
            </Link>
            <Link href="/login" className="block group">
              <Button
                variant="outline"
                size="lg"
                className="w-full py-4 rounded-2xl border-2 border-white text-white hover:bg-white hover:text-primary-purple transition-all duration-200 group-hover:scale-105 font-fredoka font-bold text-lg bg-white/20 backdrop-blur-sm"
              >
                Ho già un account
              </Button>
            </Link>
          </div>

          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo-spesaviva-horizontal.png"
              alt="SpesaViva"
              width={200}
              height={60}
              className="h-12 w-auto mx-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Footer */}
          <div className="text-sm font-nunito text-white/80 font-medium">
            <p>© 2025 SpesaViva. La spesa che prende vita. 💫</p>
          </div>
        </div>
      </section>
    </div>
  )
}
