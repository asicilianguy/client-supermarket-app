"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchOffersByCategory = async (category: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://server-supermarket-app.onrender.com/api/offers/aisle/${encodeURIComponent(category)}`,
      )
      if (response.ok) {
        const data = await response.json()
        setOffers(data.offers || [])
        if (data.offers?.length === 0) {
          toast({
            title: "Nessuna offerta trovata",
            description: "Non ci sono offerte disponibili per questa categoria",
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento",
          description: "Impossibile caricare le offerte per questa categoria",
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

  const addToShoppingList = async (productName: string) => {
    setAddingProducts((prev) => new Set(prev).add(productName))

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          productName: productName,
          notes: "",
        }),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Prodotto aggiunto!",
          description: `${productName} è stato aggiunto alla tua lista`,
        })
      } else {
        const errorData = await response.json()
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
        newSet.delete(productName)
        return newSet
      })
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    fetchOffersByCategory(categoryId)
  }

  if (selectedCategory) {
    const category = CATEGORIES.find((c) => c.id === selectedCategory)

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 py-4">
          <div className="max-w-md mx-auto flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{category?.name}</h1>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Caricamento offerte...</p>
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map((offer) => {
                const colors = SUPERMARKET_COLORS[offer.chainName] || ["#6b7280", "#374151"]
                const isAdding = addingProducts.has(offer.productName)

                return (
                  <Card key={offer._id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div
                        className="w-full h-3 rounded-t-lg mb-3"
                        style={{
                          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                        }}
                      />

                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{offer.productName}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {offer.chainName.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToShoppingList(offer.productName)}
                          disabled={isAdding}
                          className="bg-gradient-to-r from-green-600 to-blue-600"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {isAdding ? "..." : "Aggiungi"}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">€{offer.offerPrice.toFixed(2)}</span>
                          {offer.previousPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              €{offer.previousPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {offer.discountPercentage && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            -{offer.discountPercentage}%
                          </Badge>
                        )}
                      </div>

                      {offer.brand && <p className="text-sm text-gray-600 mt-2">{offer.brand}</p>}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Nessuna offerta trovata per questa categoria</p>
            </div>
          )}
        </div>
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
          <h1 className="text-lg font-semibold text-gray-900">Esplora per Tema</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md border-0 shadow-sm"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                  {category.name.replace(/^[^\s]+ /, "")}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
