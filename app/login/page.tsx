"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnhancedCard, CardContent } from "@/components/ui/card"
import { ArrowLeft, Phone, Lock, Eye, EyeOff, Sparkles, Gift, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Validation functions
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/
    if (!phone) return "Il numero di telefono è obbligatorio"
    if (!phoneRegex.test(phone)) return "Inserisci esattamente 10 cifre"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "La password è obbligatoria"
    if (password.length < 6) return "La password deve avere almeno 6 caratteri"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const phoneError = validatePhoneNumber(formData.phoneNumber)
    const passwordError = validatePassword(formData.password)

    setErrors({
      phoneNumber: phoneError,
      password: passwordError,
    })

    if (phoneError || passwordError) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber.startsWith("+39") ? formData.phoneNumber : `+39${formData.phoneNumber}`,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        toast({
          variant: "success",
          title: "🎉 Bentornato!",
          description: "Accesso effettuato con successo",
        })
        router.push("/dashboard")
      } else {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Errore di accesso",
          description: errorData.message || "Credenziali non valide",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile connettersi al server. Riprova più tardi.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast({
      title: "Funzionalità in arrivo! 🚧",
      description: "Il recupero password sarà disponibile presto. Contattaci per assistenza.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-4 border-b border-gray-100">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Indietro
            </Button>
          </Link>
          <Image src="/logo-spesaviva-horizontal.png" alt="SpesaViva" width={120} height={36} className="h-8 w-auto" />
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Welcome Back Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-blue to-primary-purple text-white px-6 py-3 rounded-full shadow-lg animate-bounce-gentle">
            <Sparkles className="w-5 h-5" />
            <span className="font-fredoka font-bold">BENTORNATO!</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-fredoka text-4xl font-bold text-gray-900 mb-4">Ciao di nuovo! 👋</h1>
          <p className="font-nunito text-gray-600 text-lg">Accedi per continuare a risparmiare con SpesaViva</p>
        </div>

        {/* Login Form Card */}
        <EnhancedCard variant="floating" className="animate-slide-up mb-6">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number Input */}
              <div className="space-y-2">
                <label className="font-nunito text-sm font-semibold text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary-blue" />
                  Numero di Telefono
                </label>
                <div className="flex items-stretch">
                  <div className="bg-gradient-to-r from-primary-blue to-primary-purple text-white px-4 rounded-l-2xl border-2 border-r-0 border-primary-blue flex items-center justify-center min-h-[3.5rem]">
                    <span className="font-fredoka font-bold">+39</span>
                  </div>
                  <Input
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                      setFormData({ ...formData, phoneNumber: value })
                      if (errors.phoneNumber) {
                        setErrors({ ...errors, phoneNumber: "" })
                      }
                    }}
                    className={`rounded-l-none rounded-r-2xl text-lg border-2 border-l-0 min-h-[3.5rem] transition-all duration-200 ${
                      errors.phoneNumber ? "border-red-500" : "border-primary-blue focus:border-primary-purple"
                    }`}
                    type="tel"
                    maxLength={10}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-sm font-nunito">{errors.phoneNumber}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="font-nunito text-sm font-semibold text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary-purple" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="La tua password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) {
                        setErrors({ ...errors, password: "" })
                      }
                    }}
                    className={`text-lg py-4 pr-12 rounded-2xl border-2 transition-all duration-200 ${
                      errors.password ? "border-red-500" : "border-gray-200 focus:border-primary-purple"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-purple transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm font-nunito">{errors.password}</p>}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-nunito text-sm text-primary-purple hover:text-primary-pink transition-colors duration-200 flex items-center ml-auto group"
                >
                  <HelpCircle className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                  Hai dimenticato la password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-orange to-primary-pink text-white hover:from-primary-pink hover:to-primary-purple"
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Accesso in corso...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-fredoka font-bold">Accedi</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </EnhancedCard>

        {/* Register Link */}
        <div className="text-center mb-8 animate-slide-up delay-200">
          <p className="font-nunito text-gray-600 mb-4">Non hai ancora un account?</p>
          <Link href="/register" className="block group">
            <Button
              variant="outline"
              className="w-full py-4 rounded-2xl border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white transition-all duration-200 group-hover:scale-105"
            >
              <Gift className="w-5 h-5 mr-2" />
              <span className="font-fredoka font-bold">Registrati Gratis</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
