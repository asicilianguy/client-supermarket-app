"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FilterX } from "lucide-react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllOffersQuery, useGetAllAislesQuery, useGetAllBrandsQuery } from "@/lib/api/offersApi"
import {
  useGetUserProfileQuery,
  useAddToShoppingListMutation,
  usePinProductToShoppingItemMutation,
} from "@/lib/api/usersApi"
import { useAppDispatch } from "@/lib/hooks"
import { offersApi } from "@/lib/api/offersApi"
import { LoadingState, LoadingSpinner, InlineLoading } from "@/components/ui/loading-spinner"

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

export default function ExplorePage() {
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>("all")
  const [selectedAisle, setSelectedAisle] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set())
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)

  const { data: userProfile } = useGetUserProfileQuery()
  const { data: aisles = [], isLoading: aislesLoading } = useGetAllAislesQuery()
  const { data: brands = [], isLoading: brandsLoading } = useGetAllBrandsQuery()

  // ✅ Fix: Rimuovo il skip e gestisco meglio i parametri
  const queryParams = useMemo(() => {
    const params: any = {}

    if (selectedSupermarket !== "all") {
      params.chainName = selectedSupermarket
    }
    if (selectedAisle !== "all") {
      params.supermarketAisle = selectedAisle
    }
    if (selectedBrand !== "all") {
      params.brand = selectedBrand
    }

    return params
  }, [selectedSupermarket, selectedAisle, selectedBrand])

  const {
    data: offers = [],
    isLoading: offersLoading,
    error: offersError,
    isFetching: offersFetching,
  } = useGetAllOffersQuery(queryParams, {
    // ✅ Mostra sempre le offerte, anche senza filtri
    skip: false,
  })

  const [addToShoppingList] = useAddToShoppingListMutation()
  const [pinProductToShoppingItem] = usePinProductToShoppingItemMutation()

  const { toast } = useToast()
  const dispatch = useAppDispatch()

  // ✅ Traccia quando vengono applicati i filtri
  useEffect(() => {
    const hasFilters = selectedSupermarket !== "all" || selectedAisle !== "all" || selectedBrand !== "all"
    setHasAppliedFilters(hasFilters)
  }, [selectedSupermarket, selectedAisle, selectedBrand])

  // Filter supermarkets to show only those the user has selected
  const filteredSupermarkets = useMemo(() => {
    if (!userProfile?.frequentedSupermarkets?.length) return VALID_SUPERMARKETS
    return VALID_SUPERMARKETS.filter((market) => userProfile.frequentedSupermarkets.includes(market.id))
  }, [userProfile?.frequentedSupermarkets])

  // Filter brands based on current offers
  const availableBrands = useMemo(() => {
    return brands.filter((brand) => brand && brand.trim() !== "")
  }, [brands])

  const handleAddToShoppingList = async (offer: any) => {
    setAddingProducts((prev) => new Set(prev).add(offer._id))

    try {
      // 1. Add to shopping list (toast handled by API)
      const addedItem = await addToShoppingList({
        productName: offer.productName,
      }).unwrap()

      // 2. Pin the offer to the newly added item (toast handled by API)
      if (addedItem._id) {
        await pinProductToShoppingItem({
          itemId: addedItem._id,
          offerId: offer._id,
        }).unwrap()

        // 3. ✅ Invalida manualmente la cache delle offerte della shopping list
        dispatch(offersApi.util.invalidateTags([{ type: "Offer", id: "SHOPPING-LIST" }]))

        // Additional success toast for the complete action
        toast({
          variant: "success",
          title: "🎯 Tutto fatto!",
          description: `${offer.productName} aggiunto alla lista con offerta selezionata`,
        })
      }
    } catch (error: any) {
      // Error toasts are handled by the API hooks
      console.error("Error in handleAddToShoppingList:", error)
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
    toast({
      title: "🔄 Filtri resettati",
      description: "Tutti i filtri sono stati rimossi",
    })
  }

  const hasActiveFilters = selectedSupermarket !== "all" || selectedAisle !== "all" || selectedBrand !== "all"

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
            disabled={!hasActiveFilters}
          >
            <FilterX className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filters Section */}
        <Card className="p-4 space-y-4">
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
              <Select value={selectedAisle} onValueChange={setSelectedAisle} disabled={aislesLoading}>
                <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder={aislesLoading ? "Caricamento..." : "Tutti i reparti"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i reparti</SelectItem>
                  {aisles.map((aisle) => (
                    <SelectItem key={aisle} value={aisle}>
                      {aisle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <Select
                value={selectedBrand}
                onValueChange={setSelectedBrand}
                disabled={brandsLoading || availableBrands.length === 0}
              >
                <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-xl h-12">
                  <SelectValue placeholder={brandsLoading ? "Caricamento..." : "Tutte le marche"} />
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
          </div>

          {/* ✅ Loading indicator per i filtri */}
          {offersFetching && (
            <div className="flex items-center justify-center py-2">
              <InlineLoading message="Aggiornamento offerte..." />
            </div>
          )}
        </Card>

        {/* Results Section */}
        {offersLoading && !offersFetching ? (
          <LoadingState message="Caricamento offerte..." />
        ) : offersError ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Errore nel caricamento</h3>
            <p className="text-gray-600">Si è verificato un errore durante il caricamento delle offerte</p>
          </div>
        ) : (
          <>
            {offers.length > 0 ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center flex-wrap gap-2">
                  <span>{offers.length} offerte trovate</span>
                  {selectedSupermarket !== "all" && (
                    <Badge className="bg-blue-100 text-blue-700 border-0">
                      {filteredSupermarkets.find((m) => m.id === selectedSupermarket)?.name}
                    </Badge>
                  )}
                  {selectedAisle !== "all" && (
                    <Badge className="bg-green-100 text-green-700 border-0">{selectedAisle}</Badge>
                  )}
                  {selectedBrand !== "all" && (
                    <Badge className="bg-purple-100 text-purple-700 border-0">{selectedBrand}</Badge>
                  )}
                </h2>

                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {offers.map((offer, index) => (
                      <motion.div
                        key={offer._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
                                onClick={() => handleAddToShoppingList(offer)}
                                className="ml-auto text-primary-purple hover:bg-primary-purple/10"
                                disabled={addingProducts.has(offer._id)}
                              >
                                {addingProducts.has(offer._id) ? (
                                  <LoadingSpinner size="sm" />
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
                                  <Badge className="bg-red-100 text-red-600 border-0">
                                    -{offer.discountPercentage}%
                                  </Badge>
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
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                {hasAppliedFilters ? (
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
