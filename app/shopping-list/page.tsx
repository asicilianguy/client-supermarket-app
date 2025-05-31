"use client"

import { useState, useEffect, useRef } from "react"
import { EnhancedCard, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Pin, PinOff, Sparkles, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ShoppingListItem {
  _id: string
  productName: string
  notes?: string
  crossedOut?: boolean
  productPins?: string[]
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

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [productOffers, setProductOffers] = useState<ProductOffers[]>([])
  const [newProduct, setNewProduct] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const listRef = useRef<HTMLDivElement>(null)

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
        setShoppingList(
          data.map((item: ShoppingListItem) => ({
            ...item,
            crossedOut: false,
            productPins: item.productPins || [],
          })),
        )
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
        setIsAddDialogOpen(false)
        fetchShoppingList()
        toast({
          variant: "success",
          title: "Prodotto aggiunto!",
          description: `${newProduct} è stato aggiunto alla tua lista`,
        })

        // Scroll to bottom of list
        setTimeout(() => {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
          }
        }, 100)
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
    // Set item as crossed out
    setShoppingList((prevList) => prevList.map((item) => (item._id === itemId ? { ...item, crossedOut: true } : item)))
    setRemovingItem(itemId)

    // Show toast
    toast({
      title: "Prodotto rimosso",
      description: `${productName} è stato rimosso dalla lista`,
    })

    // After animation completes, actually remove the item
    setTimeout(async () => {
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
          setRemovingItem(null)
        } else {
          toast({
            variant: "destructive",
            title: "Errore nella rimozione",
            description: "Impossibile rimuovere il prodotto",
          })
          // Revert crossed out state if deletion fails
          setShoppingList((prevList) =>
            prevList.map((item) => (item._id === itemId ? { ...item, crossedOut: false } : item)),
          )
          setRemovingItem(null)
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Errore di connessione",
          description: "Impossibile rimuovere il prodotto",
        })
        // Revert crossed out state if deletion fails
        setShoppingList((prevList) =>
          prevList.map((item) => (item._id === itemId ? { ...item, crossedOut: false } : item)),
        )
        setRemovingItem(null)
      }
    }, 1500) // Animation duration
  }

  const togglePinOffer = async (itemId: string, offerId: string) => {
    try {
      const item = shoppingList.find((item) => item._id === itemId)
      if (!item) return

      const isPinned = (item.productPins || []).includes(offerId)
      const token = localStorage.getItem("token")

      let response
      if (isPinned) {
        // Unpin
        response = await fetch(
          `https://server-supermarket-app.onrender.com/api/users/shopping-list/${itemId}/unpin/${offerId}`,
          {
            method: "DELETE",
            headers: {
              "x-auth-token": token || "",
            },
          },
        )
      } else {
        // Pin
        response = await fetch(
          `https://server-supermarket-app.onrender.com/api/users/shopping-list/${itemId}/pin/${offerId}`,
          {
            method: "PUT",
            headers: {
              "x-auth-token": token || "",
            },
          },
        )
      }

      if (response.ok) {
        const updatedItem = await response.json()

        // Update local state
        setShoppingList((prevList) =>
          prevList.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  productPins: updatedItem.productPins,
                }
              : item,
          ),
        )

        toast({
          variant: "success",
          title: isPinned ? "Offerta rimossa" : "Offerta selezionata",
          description: isPinned ? "L'offerta è stata rimossa dai preferiti" : "L'offerta è stata aggiunta ai preferiti",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Impossibile aggiornare le offerte preferite",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile aggiornare le offerte preferite",
      })
    }
  }

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const getOffersForItem = (productName: string) => {
    return productOffers.find((p) => p.productName === productName)?.offers || []
  }

  const getPinnedOffersForItem = (itemId: string) => {
    const item = shoppingList.find((item) => item._id === itemId)
    if (!item || !item.productPins || item.productPins.length === 0) return []

    const allOffers = getOffersForItem(item.productName)
    return allOffers.filter((offer) => item.productPins?.includes(offer._id))
  }

  const getNonPinnedOffersForItem = (itemId: string) => {
    const item = shoppingList.find((item) => item._id === itemId)
    if (!item) return []

    const allOffers = getOffersForItem(item.productName)
    return allOffers.filter((offer) => !item.productPins?.includes(offer._id))
  }

  const renderOfferCard = (offer: Offer, itemId: string, isPinned: boolean) => {
    const supermarketLogo = SUPERMARKET_LOGOS[offer.chainName] || "/placeholder.svg"

    return (
      <EnhancedCard
        variant={isPinned ? "floating" : "elevated"}
        className={`border-0 overflow-hidden ${isPinned ? "shadow-md" : "shadow-sm"}`}
      >
        <CardContent className="p-0">
          {/* Supermarket Logo/Header */}
          <div className="h-10 relative p-2 flex items-center">
            <div className="w-8 h-8 relative mr-2 overflow-hidden">
              <Image
                src={supermarketLogo || "/placeholder.svg"}
                alt={offer.chainName}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-medium capitalize">{offer.chainName.replace(/([A-Z])/g, " $1").trim()}</span>

            {/* Pin/Unpin Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePinOffer(itemId, offer._id)}
              className="ml-auto p-1 h-8 w-8"
            >
              {isPinned ? (
                <PinOff className="w-4 h-4 text-primary-purple" />
              ) : (
                <Pin className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>

          {/* Offer Details */}
          <div className="p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{offer.productName}</div>
                {offer.brand && <div className="text-xs text-gray-500">{offer.brand}</div>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-primary-purple">€{offer.offerPrice.toFixed(2)}</span>
                {offer.previousPrice && (
                  <span className="text-xs text-gray-400 line-through">€{offer.previousPrice.toFixed(2)}</span>
                )}
              </div>

              {offer.discountPercentage && (
                <Badge className="bg-red-100 text-red-600 border-0">-{offer.discountPercentage}%</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </EnhancedCard>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-fredoka font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-primary-orange to-primary-pink text-transparent bg-clip-text">
              La Tua Lista della Spesa
            </span>
            <Sparkles className="w-5 h-5 ml-2 text-primary-pink animate-pulse" />
          </h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 sm:max-w-md border-0 shadow-2xl rounded-2xl">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-fredoka font-bold text-center text-gray-900">Aggiungi alla Lista</h2>

                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Nome del prodotto"
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                      className="border-2 border-gray-200 focus:border-primary-purple rounded-xl p-4 text-base h-14"
                      autoFocus
                    />
                  </div>

                  <div>
                    <Input
                      placeholder="Note (opzionale)"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="border-2 border-gray-200 focus:border-primary-purple rounded-xl p-4 text-base h-14"
                    />
                  </div>

                  <Button
                    onClick={addToShoppingList}
                    disabled={!newProduct.trim() || loading}
                    className="w-full h-14 bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-xl text-base font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Aggiungo...</span>
                      </div>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Aggiungi alla Lista
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Empty State */}
      {shoppingList.length === 0 ? (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-fredoka font-bold text-gray-900 mb-2">La tua lista è vuota</h2>
          <p className="text-gray-600 mb-6">Aggiungi il tuo primo prodotto per iniziare a risparmiare</p>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-xl px-6 py-3 text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Aggiungi Prodotto
          </Button>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4 overflow-auto" ref={listRef}>
          {/* Shopping List with Offers */}
          {shoppingList.map((item) => {
            const isPinned = expandedItems[item._id] || false
            const pinnedOffers = getPinnedOffersForItem(item._id)
            const nonPinnedOffers = getNonPinnedOffersForItem(item._id)
            const hasOffers = pinnedOffers.length > 0 || nonPinnedOffers.length > 0

            return (
              <div key={item._id} className="animate-fade-in">
                <EnhancedCard
                  variant="elevated"
                  className={`overflow-hidden transition-all duration-300 ${
                    item.crossedOut ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {/* Product Header */}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3
                              className={`font-semibold text-gray-900 text-lg transition-all duration-300 ${
                                item.crossedOut ? "line-through text-gray-500" : ""
                              }`}
                            >
                              {item.productName}
                            </h3>

                            {item.notes && (
                              <p
                                className={`text-sm text-gray-600 transition-all duration-300 ${
                                  item.crossedOut ? "line-through text-gray-400" : ""
                                }`}
                              >
                                {item.notes}
                              </p>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromShoppingList(item._id, item.productName)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                            disabled={!!removingItem}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Divider when has offers */}
                        {hasOffers && <div className="mt-4 mb-2 border-t border-gray-100"></div>}

                        {/* Offers Section */}
                        {hasOffers && (
                          <div className="space-y-3">
                            {/* Pinned Offers */}
                            {pinnedOffers.length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <span className="text-xs font-medium text-primary-purple mr-2 flex items-center">
                                    <Pin className="w-3 h-3 mr-1" />
                                    OFFERTE SELEZIONATE
                                  </span>
                                  <div className="flex-1 h-px bg-gray-100"></div>
                                </div>

                                <div className="space-y-3">
                                  {pinnedOffers.map((offer) => (
                                    <div key={offer._id} className="relative">
                                      {renderOfferCard(offer, item._id, true)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Expand/Collapse Button */}
                            {nonPinnedOffers.length > 0 && (
                              <div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleItemExpanded(item._id)}
                                  className="w-full justify-between text-gray-500 hover:text-primary-purple py-2"
                                >
                                  <span className="flex items-center text-xs">
                                    <Sparkles className="w-3 h-3 mr-1 text-primary-orange" />
                                    {isPinned ? "NASCONDI ALTRE OFFERTE" : `MOSTRA ${nonPinnedOffers.length} OFFERTE`}
                                  </span>
                                  {isPinned ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>

                                {/* Non-Pinned Offers (Collapsible) */}
                                {isPinned && (
                                  <div className="py-3 space-y-3">
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium text-gray-500 mr-2">ALTRE OFFERTE</span>
                                      <div className="flex-1 h-px bg-gray-100"></div>
                                    </div>

                                    <div className="space-y-3">
                                      {nonPinnedOffers.map((offer) => (
                                        <div key={offer._id} className="relative">
                                          {renderOfferCard(offer, item._id, false)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </EnhancedCard>
              </div>
            )
          })}

          {/* Add Item Button (Fixed at bottom) */}
          <div className="fixed bottom-24 right-4 z-20">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  )
}
