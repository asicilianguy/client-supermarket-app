"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Store, Check } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const SUPERMARKETS = [
  { id: "esselunga", name: "Esselunga", colors: ["#0b3a74", "#e10314"] },
  { id: "conad", name: "Conad", colors: ["#e30f15", "#0e643c"] },
  { id: "lidl", name: "Lidl", colors: ["#fff001", "#0850a8"] },
  { id: "eurospin", name: "Eurospin", colors: ["#2b4e9c", "#eac62c"] },
  { id: "bennet", name: "Bennet", colors: ["#fc0b07", "#1c1c1c"] },
  { id: "carrefourexpress", name: "Carrefour Express", colors: ["#2b8645", "#64a777"] },
  { id: "carrefourmarket", name: "Carrefour Market", colors: ["#fb0509", "#f64645"] },
  { id: "centesimo", name: "Centesimo", colors: ["#caaf0c", "#2a2627"] },
  { id: "crai", name: "Crai", colors: ["#ef4123", "#81b39d"] },
  { id: "gigante", name: "Gigante", colors: ["#0f2253", "#df050f"] },
  { id: "ins", name: "INS", colors: ["#fcf00d", "#124393"] },
  { id: "md", name: "MD", colors: ["#f9ea20", "#1b5fa5"] },
  { id: "todis", name: "Todis", colors: ["#035e42", "#ea5d11"] },
  { id: "paghipoco", name: "Paghi Poco", colors: ["#e00c14", "#fee80d"] },
  { id: "prestofresco", name: "Presto Fresco", colors: ["#e30f15", "#fcea04"] },
]

interface UserProfile {
  name: string
  phoneNumber: string
  frequentedSupermarkets: string[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [editingSupermarkets, setEditingSupermarkets] = useState(false)
  const [newName, setNewName] = useState("")
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Profilo</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Name Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
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
                  className="border-gray-200"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={updateName}
                    disabled={!newName.trim() || loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {loading ? "Salvataggio..." : "Salva"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingName(false)
                      setNewName(profile.name)
                    }}
                    className="flex-1"
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{profile.name}</span>
                <Button variant="outline" size="sm" onClick={() => setEditingName(true)}>
                  Modifica
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Phone Number (Read Only) */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2" />
              Numero di Telefono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-gray-900">{profile.phoneNumber}</span>
          </CardContent>
        </Card>

        {/* Supermarkets Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
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
                    <Card
                      key={supermarket.id}
                      className={`cursor-pointer transition-all duration-200 border-2 ${
                        selectedSupermarkets.includes(supermarket.id)
                          ? "border-green-500 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleSupermarket(supermarket.id)}
                    >
                      <CardContent className="p-3">
                        <div
                          className="w-full h-12 rounded-lg mb-2 flex items-center justify-center relative"
                          style={{
                            background: `linear-gradient(135deg, ${supermarket.colors[0]}, ${supermarket.colors[1]})`,
                          }}
                        >
                          <span className="text-white font-bold text-xs text-center px-1">{supermarket.name}</span>
                          {selectedSupermarkets.includes(supermarket.id) && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 text-center font-medium">{supermarket.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={updateSupermarkets}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {loading ? "Salvataggio..." : "Salva"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSupermarkets(false)
                      setSelectedSupermarkets(profile.frequentedSupermarkets)
                    }}
                    className="flex-1"
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {profile.frequentedSupermarkets.map((id) => {
                    const supermarket = SUPERMARKETS.find((s) => s.id === id)
                    if (!supermarket) return null

                    return (
                      <div
                        key={id}
                        className="p-2 rounded-lg text-center"
                        style={{
                          background: `linear-gradient(135deg, ${supermarket.colors[0]}20, ${supermarket.colors[1]}20)`,
                        }}
                      >
                        <span className="text-sm font-medium text-gray-900">{supermarket.name}</span>
                      </div>
                    )
                  })}
                </div>

                <Button variant="outline" onClick={() => setEditingSupermarkets(true)} className="w-full">
                  Modifica Supermercati
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
