"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Pin, PinOff, Sparkles, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  useGetShoppingListQuery,
  useAddToShoppingListMutation,
  useRemoveFromShoppingListMutation,
  usePinProductToShoppingItemMutation,
  useUnpinProductFromShoppingItemMutation,
} from "@/lib/api/usersApi"
import { useGetOffersForShoppingListQuery } from "@/lib/api/offersApi"

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
  paghipoco: "/supermarkets/paghipoco.png",
  prestofresco: "/supermarkets/prestofresco.png",
  conad: "/placeholder.svg?height=40&width=80&text=Conad",
  auchan: "/placeholder.svg?height=40&width=80&text=Auchan",
  penny: "/supermarkets/penny.png",
  despar: "/placeholder.svg?height=40&width=80&text=Despar",
}

// Brand-based background colors for visual variety
const getBrandColors = (brand = "", chainName = ""): string => {
  const brandMap: Record<string, string> = {
    Gentilini: "from-amber-50 to-amber-100",
    Barilla: "from-blue-50 to-blue-100",
    "Mulino Bianco": "from-yellow-50 to-yellow-100",
    Colussi: "from-green-50 to-green-100",
    Kinder: "from-orange-50 to-orange-100",
    Ferrero: "from-brown-50 to-amber-100",
    Realforno: "from-teal-50 to-teal-100",
    Parmalat: "from-blue-50 to-indigo-100",
  }

  const chainMap: Record<string, string> = {
    esselunga: "from-blue-50 to-red-50",
    lidl: "from-blue-50 to-yellow-50",
    carrefourmarket: "from-red-50 to-blue-50",
    carrefourexpress: "from-green-50 to-emerald-100",
  }

  return brandMap[brand] || chainMap[chainName] || "from-gray-50 to-slate-100"
}

export default function ShoppingListPage() {
  const { data: shoppingList = [], isLoading: listLoading } = useGetShoppingListQuery()
  const { data: productOffers = [] } = useGetOffersForShoppingListQuery()
  const [addToShoppingList, { isLoading: addLoading }] = useAddToShoppingListMutation()
  const [removeFromShoppingList] = useRemoveFromShoppingListMutation()
  const [pinProductToShoppingItem] = usePinProductToShoppingItemMutation()
  const [unpinProductFromShoppingItem] = useUnpinProductFromShoppingItemMutation()

  const [newProduct, setNewProduct] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const listRef = useRef<HTMLDivElement>(null)

  const handleAddToShoppingList = async () => {
    if (!newProduct.trim()) return

    try {
      await addToShoppingList({
        productName: newProduct,
        notes: newNotes || undefined,
      }).unwrap()

      setNewProduct("")
      setNewNotes("")
      setIsAddDialogOpen(false)

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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Errore nell'aggiunta",
        description: error?.data?.message || "Impossibile aggiungere il prodotto",
      })
    }
  }

  const handleRemoveFromShoppingList = async (itemId: string, productName: string) => {
    setRemovingItem(itemId)

    // Show toast
    toast({
      title: "Prodotto rimosso",
      description: `${productName} è stato rimosso dalla lista`,
    })

    try {
      await removeFromShoppingList(itemId).unwrap()
      setRemovingItem(null)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Errore nella rimozione",
        description: "Impossibile rimuovere il prodotto",
      })
      setRemovingItem(null)
    }
  }

  const handleTogglePinOffer = async (itemId: string, offerId: string) => {
    try {
      const item = shoppingList.find((item) => item._id === itemId)
      if (!item) return

      const isPinned = item.productPins.includes(offerId)

      if (isPinned) {
        await unpinProductFromShoppingItem({ itemId, offerId }).unwrap()
        toast({
          variant: "success",
          title: "Offerta rimossa",
          description: "L'offerta è stata rimossa dai preferiti",
        })
      } else {
        await pinProductToShoppingItem({ itemId, offerId }).unwrap()
        toast({
          variant: "success",
          title: "Offerta selezionata",
          description: "L'offerta è stata aggiunta ai preferiti",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Errore",
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

  // Helper function to render offer cards
  const renderOfferCard = (offer: any, itemId: string, isPinned: boolean) => {
    const supermarketLogo = SUPERMARKET_LOGOS[offer.chainName] || "/placeholder.svg"

    return (
      <Card key={offer._id} className={`border-0 overflow-hidden ${isPinned ? "shadow-md" : "shadow-sm"}`}>
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
              onClick={() => handleTogglePinOffer(itemId, offer._id)}
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
      </Card>
    )
  }

  if (listLoading) {
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
                    onClick={handleAddToShoppingList}
                    disabled={!newProduct.trim() || addLoading}
                    className="w-full h-14 bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-xl text-base font-medium"
                  >
                    {addLoading ? (
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
          <AnimatePresence>
            {shoppingList.map((item) => {
              const isExpanded = expandedItems[item._id] || false
              const pinnedOffers = getPinnedOffersForItem(item._id)
              const nonPinnedOffers = getNonPinnedOffersForItem(item._id)
              const hasOffers = pinnedOffers.length > 0 || nonPinnedOffers.length > 0

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Card
                    className={`overflow-hidden transition-all duration-300 ${
                      removingItem === item._id ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {/* Product Header */}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{item.productName}</h3>

                              {item.notes && <p className="text-sm text-gray-600">{item.notes}</p>}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromShoppingList(item._id, item.productName)}
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
                                      {isExpanded
                                        ? "NASCONDI ALTRE OFFERTE"
                                        : `MOSTRA ${nonPinnedOffers.length} OFFERTE`}
                                    </span>
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </Button>

                                  {/* Non-Pinned Offers (Collapsible) */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="py-3 space-y-3">
                                          <div className="flex items-center">
                                            <span className="text-xs font-medium text-gray-500 mr-2">
                                              ALTRE OFFERTE
                                            </span>
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
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>

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
