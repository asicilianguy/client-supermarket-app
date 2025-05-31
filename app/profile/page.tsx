"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnhancedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Store, Phone, Edit, Check, X, LogOut } from "lucide-react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface UserProfile {
  name: string
  phoneNumber: string
  frequentedSupermarkets: string[]
}

const SUPERMARKETS = [
  { id: "esselunga", name: "Esselunga", colors: ["#0b3a74", "#e10314"], logo: "/supermarkets/esselunga.png" },
  {
    id: "conad",
    name: "Conad",
    colors: ["#e30f15", "#0e643c"],
    logo: "/placeholder.svg?height=40&width=80&text=Conad",
  },
  { id: "lidl", name: "Lidl", colors: ["#fff001", "#0850a8"], logo: "/supermarkets/lidl.png" },
  { id: "eurospin", name: "Eurospin", colors: ["#2b4e9c", "#eac62c"], logo: "/supermarkets/eurospin.png" },
  { id: "bennet", name: "Bennet", colors: ["#fc0b07", "#1c1c1c"], logo: "/supermarkets/bennet.png" },
  {
    id: "auchan",
    name: "Auchan",
    colors: ["#e30f15", "#0e643c"],
    logo: "/placeholder.svg?height=40&width=80&text=Auchan",
  },
  { id: "penny", name: "Penny Market", colors: ["#e30f15", "#0e643c"], logo: "/supermarkets/penny.png" },
  {
    id: "despar",
    name: "Despar",
    colors: ["#e30f15", "#0e643c"],
    logo: "/placeholder.svg?height=40&width=80&text=Despar",
  },
  { id: "centesimo", name: "Il Centesimo", colors: ["#caaf0c", "#2a2627"], logo: "/supermarkets/centesimo.png" },
  {
    id: "carrefouriper",
    name: "Carrefour Iper",
    colors: ["#fb0509", "#f64645"],
    logo: "/supermarkets/carrefouriper.png",
  },
  {
    id: "carrefourexpress",
    name: "Carrefour Express",
    colors: ["#2b8645", "#64a777"],
    logo: "/supermarkets/carrefourexpress.png",
  },
  {
    id: "prestofresco",
    name: "Presto Fresco",
    colors: ["#e30f15", "#fcea04"],
    logo: "/placeholder.svg?height=40&width=80&text=Presto",
  },
  {
    id: "carrefourmarket",
    name: "Carrefour Market",
    colors: ["#fb0509", "#f64645"],
    logo: "/supermarkets/carrefourmarket.png",
  },
  { id: "gigante", name: "Il Gigante", colors: ["#0f2253", "#df050f"], logo: "/supermarkets/gigante.png" },
  { id: "ins", name: "iN's Mercato", colors: ["#fcf00d", "#124393"], logo: "/supermarkets/ins.png" },
  { id: "todis", name: "Todis", colors: ["#035e42", "#ea5d11"], logo: "/supermarkets/todis.png" },
  { id: "md", name: "MD", colors: ["#f9ea20", "#1b5fa5"], logo: "/supermarkets/md.png" },
  { id: "crai", name: "CRAI", colors: ["#ef4123", "#81b39d"], logo: "/supermarkets/crai.jpeg" },
  {
    id: "paghipoco",
    name: "Paghi Poco",
    colors: ["#e00c14", "#fee80d"],
    logo: "/placeholder.svg?height=40&width=80&text=Paghi+Poco",
  },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [editingSupermarkets, setEditingSupermarkets] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/profile", {
        headers: {
          "x-auth-token": token || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setNewName(data.name)
        setSelectedSupermarkets(data.frequentedSupermarkets)
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento",
          description: "Impossibile caricare il profilo utente",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile connettersi al server",
      })
    }
  }

  const updateName = async () => {
    if (!newName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome non valido",
        description: "Inserisci un nome valido",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ name: newName }),
      })

      if (response.ok) {
        setProfile((prev) => (prev ? { ...prev, name: newName } : null))
        setEditingName(false)
        toast({
          variant: "success",
          title: "Nome aggiornato!",
          description: "Il tuo nome è stato modificato con successo",
        })
      } else {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Errore nell'aggiornamento",
          description: errorData.message || "Impossibile aggiornare il nome",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile aggiornare il nome",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSupermarkets = async () => {
    if (selectedSupermarkets.length === 0) {
      toast({
        variant: "destructive",
        title: "Nessun supermercato selezionato",
        description: "Seleziona almeno un supermercato",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/supermarkets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          frequentedSupermarkets: selectedSupermarkets,
        }),
      })

      if (response.ok) {
        setProfile((prev) => (prev ? { ...prev, frequentedSupermarkets: selectedSupermarkets } : null))
        setEditingSupermarkets(false)
        toast({
          variant: "success",
          title: "Supermercati aggiornati!",
          description: `Hai selezionato ${selectedSupermarkets.length} supermercati`,
        })
      } else {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Errore nell'aggiornamento",
          description: errorData.message || "Impossibile aggiornare i supermercati",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile aggiornare i supermercati",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSupermarket = (id: string) => {
    setSelectedSupermarkets((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
    toast({
      title: "Disconnesso",
      description: "Hai effettuato il logout con successo",
    })
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-fredoka font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-primary-purple to-primary-pink text-transparent bg-clip-text">
              Il Tuo Profilo
            </span>
            <User className="w-5 h-5 ml-2 text-primary-purple" />
          </h1>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Esci
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <div className="animate-fade-in">
          <EnhancedCard className="overflow-hidden border-0 bg-gradient-to-br from-primary-purple/10 to-primary-pink/10">
            <div className="p-6 flex items-center">
              {/* Avatar Circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-purple to-primary-pink flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl font-bold text-white">{profile.name.charAt(0).toUpperCase()}</span>
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {profile.phoneNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {profile.frequentedSupermarkets.length} supermercati selezionati
                </p>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Name Section */}
        <div className="animate-fade-in">
          <EnhancedCard variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2" />
                Nome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingName ? (
                <div className="space-y-3">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Il tuo nome"
                    className="border-2 border-gray-200 focus:border-primary-purple rounded-xl h-12"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={updateName}
                      disabled={!newName.trim() || loading}
                      className="flex-1 bg-gradient-to-r from-primary-purple to-primary-pink text-white"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Salva
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingName(false)
                        setNewName(profile.name)
                      }}
                      className="flex-1"
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annulla
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{profile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingName(true)}
                    className="text-primary-purple hover:bg-primary-purple/10"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifica
                  </Button>
                </div>
              )}
            </CardContent>
          </EnhancedCard>
        </div>

        {/* Phone Number (Read Only) */}
        <div className="animate-fade-in">
          <EnhancedCard variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Numero di Telefono
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-gray-900">{profile.phoneNumber}</span>
              </div>
            </CardContent>
          </EnhancedCard>
        </div>

        {/* Supermarkets Section */}
        <div className="animate-fade-in">
          <EnhancedCard variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Store className="w-5 h-5 mr-2" />
                Supermercati Frequentati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingSupermarkets ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {SUPERMARKETS.map((supermarket) => (
                      <div
                        key={supermarket.id}
                        className={`cursor-pointer transition-all duration-200 border-2 rounded-xl overflow-hidden relative ${
                          selectedSupermarkets.includes(supermarket.id)
                            ? "border-primary-purple shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleSupermarket(supermarket.id)}
                      >
                        <div className="p-3">
                          <div className="w-full h-12 relative mb-2 rounded-lg overflow-hidden">
                            <Image
                              src={supermarket.logo || "/placeholder.svg"}
                              alt={supermarket.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="text-xs text-gray-700 text-center font-medium">{supermarket.name}</p>

                          {selectedSupermarkets.includes(supermarket.id) && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-primary-purple rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={updateSupermarkets}
                      disabled={selectedSupermarkets.length === 0 || loading}
                      className="flex-1 bg-gradient-to-r from-primary-purple to-primary-pink text-white"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Salva
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingSupermarkets(false)
                        setSelectedSupermarkets(profile.frequentedSupermarkets)
                      }}
                      className="flex-1"
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annulla
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {profile.frequentedSupermarkets.map((id) => {
                      const supermarket = SUPERMARKETS.find((s) => s.id === id)
                      if (!supermarket) return null

                      return (
                        <div key={id} className="relative rounded-lg overflow-hidden h-10 border border-gray-200">
                          <div className="absolute inset-0">
                            <Image
                              src={supermarket.logo || "/placeholder.svg"}
                              alt={supermarket.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button variant="outline" onClick={() => setEditingSupermarkets(true)} className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifica Supermercati
                  </Button>
                </div>
              )}
            </CardContent>
          </EnhancedCard>
        </div>

        {/* App Version */}
        <div className="text-center text-xs text-gray-400 pt-4">
          <p>SpesaViva v1.0.0</p>
          <p className="mt-1">© 2025 SpesaViva. La spesa che prende vita. 💫</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  )
}
