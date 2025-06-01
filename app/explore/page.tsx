"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, EnhancedCard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FilterX } from "lucide-react"
import { BottomNavbar } from "@/components/bottom-navbar"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Offer {
  _id: string
  productName: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  chainName: string
  brand?: string
  supermarketAisle: string[]
}

const CATEGORIES = [
  { id: "frutta e verdura", name: "🍎 Frutta e Verdura", emoji: "🍎" },
  { id: "per bambini", name: "👶 Per i Bambini", emoji: "👶" },
  { id: "estate", name: "☀️ Estate", emoji: "☀️" },
  { id: "bio", name: "🌱 Bio", emoji: "🌱" },
  { id: "fitness", name: "🏋️ Fitness", emoji: "🏋️" },
  { id: "cene speciali", name: "🎉 Cene Speciali", emoji: "🎉" },
  { id: "fai da te", name: "🛠️ Fai da Te", emoji: "🛠️" },
  { id: "senza glutine", name: "🌾 Senza Glutine", emoji: "🌾" },
  { id: "vegano", name: "🥬 Vegano", emoji: "🥬" },
  { id: "dolci", name: "🍰 Dolci", emoji: "🍰" },
  { id: "bevande", name: "🥤 Bevande", emoji: "🥤" },
  { id: "surgelati", name: "🧊 Surgelati", emoji: "🧊" },
]

const SUPERMARKET_COLORS: Record<string, string[]> = {
  todis: ["#035e42", "#ea5d11"],
  bennet: ["#fc0b07", "#1c1c1c"],
  carrefourexpress: ["#2b8645", "#64a777"],
  carrefourmarket: ["#fb0509", "#f64645"],
  centesimo: ["#caaf0c", "#2a2627"],
  crai: ["#ef4123", "#81b39d"],
  esselunga: ["#0b3a74", "#e10314"],
  eurospin: ["#2b4e9c", "#eac62c"],
  gigante: ["#0f2253", "#df050f"],
  ins: ["#fcf00d", "#124393"],
  lidl: ["#fff001", "#0850a8"],
  md: ["#f9ea20", "#1b5fa5"],
  paghipoco: ["#e00c14", "#fee80d"],
  prestofresco: ["#e30f15", "#fcea04"],
}

const SUPERMARKET_LOGOS: Record<string, string> = {
  todis: "/supermarkets/todis.png",
  bennet: "/supermarkets/bennet.png",
  carrefourexpress: "/supermarkets/carrefourexpress.png",
  carrefourmarket: "/supermarkets/carrefourmarket.png",
  carrefouriper: "/supermarkets/carrefouriper.png",
  centesimo: "/supermarkets/centesimo.png",
  crai: "/supermarkets/crai.jpeg",
  esselunga: "/supermarkets/esselunga.png",
  eurospin: "/supermarkets/eurospin.png",
  gigante: "/supermarkets/gigante.png",
  ins: "/supermarkets/ins.png",
  lidl: "/supermarkets/lidl.png",
  md: "/supermarkets/md.png",
  paghipoco: "/placeholder.svg?height=40&width=80&text=Paghi+Poco",
  prestofresco: "/placeholder.svg?height=40&width=80&text=Presto",
  conad: "/placeholder.svg?height=40&width=80&text=Conad",
  auchan: "/placeholder.svg?height=40&width=80&text=Auchan",
  penny: "/supermarkets/penny.png",
  despar: "/placeholder.svg?height=40&width=80&text=Despar",
}

const VALID_SUPERMARKETS = [
  { id: "esselunga", name: "Esselunga" },
  { id: "conad", name: "Conad" },
  { id: "lidl", name: "Lidl" },
  { id: "eurospin", name: "Eurospin" },
  { id: "bennet", name: "Bennet" },
  { id: "auchan", name: "Auchan" },
  { id: "penny", name: "Penny Market" },
  { id: "despar", name: "Despar" },
  { id: "centesimo", name: "Il Centesimo" },
  { id: "carrefouriper", name: "Carrefour Iper" },
  { id: "carrefourexpress", name: "Carrefour Express" },
  { id: "prestofresco", name: "Presto Fresco" },
  { id: "carrefourmarket", name: "Carrefour Market" },
  { id: "gigante", name: "Il Gigante" },
  { id: "ins", name: "iN's Mercato" },
  { id: "todis", name: "Todis" },
  { id: "md", name: "MD" },
  { id: "crai", name: "CRAI" },
  { id: "paghipoco", name: "Paghi Poco" },
]

const VALID_AISLES = [
  { id: "frutta e verdura", name: "Frutta e verdura" },
  { id: "carne", name: "Carne" },
  { id: "pesce", name: "Pesce" },
  { id: "salumi", name: "Salumi" },
  { id: "formaggi", name: "Formaggi" },
  { id: "pane e prodotti da forno", name: "Pane e prodotti da forno" },
  { id: "pasta", name: "Pasta" },
  { id: "riso", name: "Riso" },
  { id: "legumi", name: "Legumi" },
  { id: "olio e condimenti", name: "Olio e condimenti" },
  { id: "uova", name: "Uova" },
  { id: "latticini", name: "Latticini" },
  { id: "bevande", name: "Bevande" },
  { id: "vino", name: "Vino" },
  { id: "birra", name: "Birra" },
  { id: "acqua", name: "Acqua" },
  { id: "caffè", name: "Caffè" },
  { id: "bio", name: "Bio" },
  { id: "senza glutine", name: "Senza glutine" },
  { id: "estate", name: "Estate" },
  { id: "autunno", name: "Autunno" },
  { id: "per bambini", name: "Per bambini" },
  { id: "fitness", name: "Fitness" },
]

export default function ExplorePage() {
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>("all")
  const [selectedAisle, setSelectedAisle] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set())
  const [userSupermarkets, setUserSupermarkets] = useState<string[]>([])
  const { toast } = useToast()

  // Filter supermarkets to show only those the user has selected
  const filteredSupermarkets = useMemo(() => {
    if (userSupermarkets.length === 0) return VALID_SUPERMARKETS
    return VALID_SUPERMARKETS.filter((market) => userSupermarkets.includes(market.id))
  }, [userSupermarkets])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  useEffect(() => {
    if (selectedSupermarket !== "all" || selectedAisle !== "all") {
      fetchOffers()
    }
  }, [selectedSupermarket, selectedAisle])

  useEffect(() => {
    // Reset brand selection when supermarket or aisle changes
    if (selectedBrand !== "all") {
      setSelectedBrand("all")
    }
  }, [selectedSupermarket, selectedAisle])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/profile", {
        headers: {
          "x-auth-token": token || "",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserSupermarkets(data.frequentedSupermarkets || [])
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const fetchOffers = async () => {
    setLoading(true)

    try {
      let url = "https://server-supermarket-app.onrender.com/api/offers"

      // Add query parameters based on selected filters
      const params = new URLSearchParams()

      if (selectedSupermarket !== "all") {
        params.append("chainName", selectedSupermarket)
      }

      if (selectedAisle !== "all") {
        params.append("aisle", selectedAisle)
      }

      if (selectedBrand !== "all") {
        params.append("brand", selectedBrand)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setOffers(data)

        // Extract unique brands for the brand filter
        const brands = Array.from(new Set(data.map((offer: Offer) => offer.brand).filter(Boolean)))
        setAvailableBrands(brands)
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento",
          description: "Impossibile caricare le offerte",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile connettersi al server",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToShoppingList = async (offer: Offer) => {
    setAddingProducts((prev) => new Set(prev).add(offer._id))

    try {
      // 1. Add to shopping list
      const token = localStorage.getItem("token")
      const addResponse = await fetch("https://server-supermarket-app.onrender.com/api/users/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          productName: offer.productName,
        }),
      })

      if (addResponse.ok) {
        const addedItem = await addResponse.json()

        // 2. Pin the offer to the newly added item
        if (addedItem._id) {
          const pinResponse = await fetch(
            `https://server-supermarket-app.onrender.com/api/users/shopping-list/${addedItem._id}/pin/${offer._id}`,
            {
              method: "PUT",
              headers: {
                "x-auth-token": token || "",
              },
            },
          )

          if (pinResponse.ok) {
            toast({
              variant: "default",
              title: "Prodotto aggiunto!",
              description: `${offer.productName} è stato aggiunto alla tua lista con l'offerta pinnata`,
            })
          } else {
            toast({
              title: "Prodotto aggiunto",
              description: `${offer.productName} è stato aggiunto alla lista ma non è stato possibile pinnare l'offerta`,
            })
          }
        }
      } else {
        const errorData = await addResponse.json()
        toast({
          variant: "destructive",
          title: "Errore nell'aggiunta",
          description: errorData.message || "Impossibile aggiungere il prodotto",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile aggiungere il prodotto",
      })
    } finally {
      setAddingProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(offer._id)
        return newSet
      })
    }
  }

  const clearFilters = () => {
    setSelectedSupermarket("all")
    setSelectedAisle("all")
    setSelectedBrand("all")
    setOffers([])
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-fredoka font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-primary-blue to-primary-purple text-transparent bg-clip-text">
              Cerca Offerte
            </span>
            <Search className="w-5 h-5 ml-2 text-primary-blue" />
          </h1>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500"
            disabled={selectedSupermarket === "all" && selectedAisle === "all" && selectedBrand === "all"}
          >
            <FilterX className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filters Section */}
        <EnhancedCard variant="elevated" className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Filtra per:</h2>

          <div className="space-y-4">
            {/* Supermarket Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supermercato</label>
              <Select value={selectedSupermarket} onValueChange={setSelectedSupermarket}>
                <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder="Tutti i supermercati" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i supermercati</SelectItem>
                  {filteredSupermarkets.map((market) => (
                    <SelectItem key={market.id} value={market.id}>
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 relative">
                          <Image
                            src={SUPERMARKET_LOGOS[market.id] || "/placeholder.svg"}
                            alt={market.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {market.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aisle Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reparto</label>
              <Select value={selectedAisle} onValueChange={setSelectedAisle}>
                <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder="Tutti i reparti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i reparti</SelectItem>
                  {VALID_AISLES.map((aisle) => (
                    <SelectItem key={aisle.id} value={aisle.id}>
                      {aisle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand} disabled={availableBrands.length === 0}>
                <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder="Tutte le marche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le marche</SelectItem>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Apply Filters Button */}
            <Button
              onClick={fetchOffers}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl h-12"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Cerco...</span>
                </div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Cerca Offerte
                </>
              )}
            </Button>
          </div>
        </EnhancedCard>

        {/* Results Section */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {offers.length > 0 ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span>{offers.length} offerte trovate</span>
                  {selectedSupermarket !== "all" && (
                    <Badge className="ml-2 bg-blue-100 text-blue-700 border-0">
                      {filteredSupermarkets.find((m) => m.id === selectedSupermarket)?.name}
                    </Badge>
                  )}
                  {selectedAisle !== "all" && (
                    <Badge className="ml-2 bg-green-100 text-green-700 border-0">
                      {VALID_AISLES.find((a) => a.id === selectedAisle)?.name}
                    </Badge>
                  )}
                  {selectedBrand !== "all" && (
                    <Badge className="ml-2 bg-purple-100 text-purple-700 border-0">{selectedBrand}</Badge>
                  )}
                </h2>

                <div className="space-y-4">
                  {offers.map((offer, index) => (
                    <div key={offer._id} className="animate-fade-in">
                      <EnhancedCard variant="elevated" className="overflow-hidden">
                        <CardContent className="p-0">
                          {/* Supermarket Header */}
                          <div className="h-10 relative p-2 flex items-center border-b border-gray-100">
                            <div className="w-8 h-8 relative mr-2 overflow-hidden">
                              <Image
                                src={SUPERMARKET_LOGOS[offer.chainName] || "/placeholder.svg"}
                                alt={offer.chainName}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs font-medium capitalize">
                              {offer.chainName.replace(/([A-Z])/g, " $1").trim()}
                            </span>

                            {/* Add to Shopping List Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addToShoppingList(offer)}
                              className="ml-auto text-primary-purple"
                              disabled={addingProducts.has(offer._id)}
                            >
                              {addingProducts.has(offer._id) ? (
                                <div className="w-4 h-4 border-2 border-primary-purple border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-1" />
                                  <span className="text-xs">Aggiungi</span>
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Offer Details */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="space-y-1">
                                <h3 className="font-medium text-gray-900">{offer.productName}</h3>
                                {offer.brand && <p className="text-sm text-gray-600">{offer.brand}</p>}
                              </div>

                              {offer.discountPercentage && (
                                <Badge className="bg-red-100 text-red-600 border-0">-{offer.discountPercentage}%</Badge>
                              )}
                            </div>

                            <div className="flex items-baseline justify-between">
                              <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-bold text-primary-purple">
                                  €{offer.offerPrice.toFixed(2)}
                                </span>
                                {offer.previousPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    €{offer.previousPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Aisle Tags */}
                              <div className="flex flex-wrap gap-1 justify-end">
                                {offer.supermarketAisle.slice(0, 2).map((aisle, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                                    {aisle}
                                  </Badge>
                                ))}
                                {offer.supermarketAisle.length > 2 && (
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    +{offer.supermarketAisle.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </EnhancedCard>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                {selectedSupermarket !== "all" || selectedAisle !== "all" || selectedBrand !== "all" ? (
                  <>
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna offerta trovata</h3>
                    <p className="text-gray-600">Prova a modificare i filtri per trovare le offerte che cerchi</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Resetta i filtri
                    </Button>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Inizia la tua ricerca</h3>
                    <p className="text-gray-600">Seleziona i filtri qui sopra per trovare le migliori offerte</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  )
}
