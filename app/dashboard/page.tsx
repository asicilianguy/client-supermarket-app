"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnhancedCard, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"
import { Plus, Search, User, ShoppingCart, Trash2, Pin, PinOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface ShoppingListItem {
  _id: string
  productName: string
  notes?: string
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

interface ProductOffers {
  productName: string
  offers: Offer[]
}

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

export default function DashboardPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [productOffers, setProductOffers] = useState<ProductOffers[]>([])
  const [newProduct, setNewProduct] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [pinnedOffers, setPinnedOffers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchShoppingList()
  }, [])

  useEffect(() => {
    if (shoppingList.length > 0) {
      fetchOffersForShoppingList()
    }
  }, [shoppingList])

  const fetchShoppingList = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/shopping-list", {
        headers: {
          "x-auth-token": token || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setShoppingList(data)
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento",
          description: "Impossibile caricare la lista della spesa",
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

  const fetchOffersForShoppingList = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/offers/shopping-list", {
        headers: {
          "x-auth-token": token || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProductOffers(data)
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento offerte",
          description: "Impossibile caricare le offerte disponibili",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile caricare le offerte",
      })
    }
  }

  const addToShoppingList = async () => {
    if (!newProduct.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://server-supermarket-app.onrender.com/api/users/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          productName: newProduct,
          notes: newNotes || undefined,
        }),
      })

      if (response.ok) {
        setNewProduct("")
        setNewNotes("")
        fetchShoppingList()
        toast({
          variant: "success",
          title: "Prodotto aggiunto!",
          description: `${newProduct} è stato aggiunto alla tua lista`,
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
      setLoading(false)
    }
  }

  const removeFromShoppingList = async (itemId: string, productName: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://server-supermarket-app.onrender.com/api/users/shopping-list/${itemId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token || "",
        },
      })

      if (response.ok) {
        fetchShoppingList()
        toast({
          title: "Prodotto rimosso",
          description: `${productName} è stato rimosso dalla lista`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Errore nella rimozione",
          description: "Impossibile rimuovere il prodotto",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile rimuovere il prodotto",
      })
    }
  }

  const togglePinOffer = (productName: string, offerId: string) => {
    const isCurrentlyPinned = pinnedOffers[productName] === offerId
    setPinnedOffers((prev) => ({
      ...prev,
      [productName]: isCurrentlyPinned ? "" : offerId,
    }))

    toast({
      title: isCurrentlyPinned ? "Offerta rimossa" : "Offerta selezionata",
      description: isCurrentlyPinned
        ? "L'offerta è stata rimossa dai preferiti"
        : "L'offerta è stata aggiunta ai preferiti",
    })
  }

  const getOfferCard = (offer: Offer, productName: string, isPinned: boolean) => {
    const colors = SUPERMARKET_COLORS[offer.chainName] || ["#6b7280", "#374151"]

    return (
      <EnhancedCard
        key={offer._id}
        variant={isPinned ? "floating" : "elevated"}
        className={`offer-card ${isPinned ? "ring-2 ring-primary" : ""}`}
      >
        <CardContent className="p-4">
          <div
            className="w-full h-3 rounded-t-lg mb-3"
            style={{
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            }}
          />

          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-neutral-900 capitalize text-sm">
              {offer.chainName.replace(/([A-Z])/g, " $1").trim()}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePinOffer(productName, offer._id)}
              className="p-1 h-auto"
            >
              {isPinned ? <PinOff className="w-4 h-4 text-primary" /> : <Pin className="w-4 h-4 text-neutral-400" />}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">€{offer.offerPrice.toFixed(2)}</span>
              {offer.previousPrice && (
                <span className="text-sm text-neutral-500 line-through">€{offer.previousPrice.toFixed(2)}</span>
              )}
            </div>

            {offer.discountPercentage && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                -{offer.discountPercentage}%
              </Badge>
            )}

            {offer.brand && <p className="text-sm text-neutral-600">{offer.brand}</p>}

            {offer.supermarketAisle && offer.supermarketAisle.length > 0 && (
              <p className="text-xs text-neutral-500">{offer.supermarketAisle[0]}</p>
            )}
          </div>
        </CardContent>
      </EnhancedCard>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-xs px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center space-x-3">
            <Link href="/explore">
              <Button variant="ghost" size="sm" className="rounded-lg">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="rounded-lg">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Add Product Form */}
        <EnhancedCard variant="elevated" className="animate-fade-in">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-neutral-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Lista della Spesa
            </h2>

            <div className="space-y-3">
              <Input
                placeholder="Nome del prodotto"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="border-neutral-200 rounded-lg"
              />
              <Input
                placeholder="Note (opzionale)"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="border-neutral-200 rounded-lg"
              />
              <Button
                onClick={addToShoppingList}
                disabled={!newProduct.trim() || loading}
                variant="gradient"
                className="w-full rounded-lg shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Aggiunta..." : "Aggiungi"}
              </Button>
            </div>
          </CardContent>
        </EnhancedCard>

        {/* Shopping List with Offers */}
        {shoppingList.length > 0 && (
          <div className="space-y-6">
            {shoppingList.map((item, index) => {
              const offers = productOffers.find((p) => p.productName === item.productName)?.offers || []
              const pinnedOfferId = pinnedOffers[item.productName]
              const pinnedOffer = offers.find((o) => o._id === pinnedOfferId)
              const otherOffers = offers.filter((o) => o._id !== pinnedOfferId)

              return (
                <EnhancedCard
                  key={item._id}
                  variant="elevated"
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4 space-y-4">
                    {/* Product Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{item.productName}</h3>
                        {item.notes && <p className="text-sm text-neutral-600">{item.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromShoppingList(item._id, item.productName)}
                        className="text-red-500 hover:text-red-700 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Offers */}
                    {offers.length > 0 ? (
                      <div className="space-y-3">
                        {/* Pinned Offer */}
                        {pinnedOffer && (
                          <div>
                            <p className="text-xs font-medium text-primary mb-2">OFFERTA SELEZIONATA</p>
                            {getOfferCard(pinnedOffer, item.productName, true)}
                          </div>
                        )}

                        {/* Other Offers */}
                        {otherOffers.length > 0 && (
                          <div>
                            {pinnedOffer && <p className="text-xs font-medium text-neutral-500 mb-2">ALTRE OFFERTE</p>}
                            <div className="flex space-x-3 overflow-x-auto pb-2 horizontal-scroll">
                              {otherOffers.map((offer) => (
                                <div key={offer._id} className="flex-shrink-0 w-64">
                                  {getOfferCard(offer, item.productName, false)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-neutral-500">
                        <p className="text-sm">Nessuna offerta trovata</p>
                      </div>
                    )}
                  </CardContent>
                </EnhancedCard>
              )
            })}
          </div>
        )}

        {shoppingList.length === 0 && (
          <div className="text-center py-12 text-neutral-500 animate-fade-in">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p>La tua lista è vuota</p>
            <p className="text-sm">Aggiungi il primo prodotto per iniziare</p>
          </div>
        )}
      </div>
    </div>
  )
}
