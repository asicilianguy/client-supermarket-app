"use client";

import { useState, useEffect, useRef } from "react";
import { EnhancedCard, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pin,
  PinOff,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  Clock,
  Tag,
  Scale,
  BarChart,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { BottomNavbar } from "@/components/bottom-navbar";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";

interface ShoppingListItem {
  _id: string;
  productName: string;
  notes?: string;
  crossedOut?: boolean;
  productPins?: string[];
}

interface Offer {
  _id: string;
  productName: string;
  productQuantity?: string;
  offerPrice: number;
  previousPrice?: number;
  discountPercentage?: number;
  pricePerKg?: number;
  pricePerLiter?: number;
  offerStartDate: string;
  offerEndDate: string;
  chainName: string;
  brand?: string;
  supermarketAisle: string[];
}

interface ProductOffers {
  productName: string;
  offers: Offer[];
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
  paghipoco: "/supermarkets/paghipoco.png",
  prestofresco: "/supermarkets/prestofresco.png",
  conad: "/placeholder.svg?height=40&width=80&text=Conad",
  auchan: "/placeholder.svg?height=40&width=80&text=Auchan",
  penny: "/supermarkets/penny.png",
  despar: "/placeholder.svg?height=40&width=80&text=Despar",
};

// Brand-based background colors for visual variety
const getBrandColors = (brand: string = "", chainName: string = ""): string => {
  const brandMap: Record<string, string> = {
    Gentilini: "from-amber-50 to-amber-100",
    Barilla: "from-blue-50 to-blue-100",
    "Mulino Bianco": "from-yellow-50 to-yellow-100",
    Colussi: "from-green-50 to-green-100",
    Kinder: "from-orange-50 to-orange-100",
    Ferrero: "from-brown-50 to-amber-100",
    Realforno: "from-teal-50 to-teal-100",
    Parmalat: "from-blue-50 to-indigo-100",
  };

  const chainMap: Record<string, string> = {
    esselunga: "from-blue-50 to-red-50",
    lidl: "from-blue-50 to-yellow-50",
    carrefourmarket: "from-red-50 to-blue-50",
    carrefourexpress: "from-green-50 to-emerald-100",
  };

  return brandMap[brand] || chainMap[chainName] || "from-gray-50 to-slate-100";
};

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [productOffers, setProductOffers] = useState<ProductOffers[]>([]);
  const [newProduct, setNewProduct] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [pinningOffer, setPinningOffer] = useState<string | null>(null);
  const { toast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchShoppingList();
  }, []);

  useEffect(() => {
    if (shoppingList.length > 0) {
      fetchOffersForShoppingList();
    }
  }, [shoppingList]);

  const fetchShoppingList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://server-supermarket-app.onrender.com/api/users/shopping-list",
        {
          headers: {
            "x-auth-token": token || "",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setShoppingList(
          data.map((item: ShoppingListItem) => ({
            ...item,
            crossedOut: false,
            productPins: item.productPins || [],
          }))
        );
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento",
          description: "Impossibile caricare la lista della spesa",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile connettersi al server",
      });
    }
  };

  const fetchOffersForShoppingList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://server-supermarket-app.onrender.com/api/offers/shopping-list",
        {
          headers: {
            "x-auth-token": token || "",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProductOffers(data);
      } else {
        toast({
          variant: "destructive",
          title: "Errore nel caricamento offerte",
          description: "Impossibile caricare le offerte disponibili",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile caricare le offerte",
      });
    }
  };

  const addToShoppingList = async () => {
    if (!newProduct.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://server-supermarket-app.onrender.com/api/users/shopping-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token || "",
          },
          body: JSON.stringify({
            productName: newProduct,
            notes: newNotes || undefined,
          }),
        }
      );

      if (response.ok) {
        setNewProduct("");
        setNewNotes("");
        setIsAddDialogOpen(false);
        fetchShoppingList();
        toast({
          variant: "default",
          title: "Prodotto aggiunto!",
          description: `${newProduct} è stato aggiunto alla tua lista`,
        });

        // Scroll to bottom of list
        setTimeout(() => {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        }, 100);
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Errore nell'aggiunta",
          description:
            errorData.message || "Impossibile aggiungere il prodotto",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile aggiungere il prodotto",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromShoppingList = async (
    itemId: string,
    productName: string
  ) => {
    // Set item as crossed out
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item._id === itemId ? { ...item, crossedOut: true } : item
      )
    );
    setRemovingItem(itemId);

    // Show toast
    toast({
      title: "Prodotto rimosso",
      description: `${productName} è stato rimosso dalla lista`,
    });

    // After animation completes, actually remove the item
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://server-supermarket-app.onrender.com/api/users/shopping-list/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "x-auth-token": token || "",
            },
          }
        );

        if (response.ok) {
          fetchShoppingList();
          setRemovingItem(null);
        } else {
          toast({
            variant: "destructive",
            title: "Errore nella rimozione",
            description: "Impossibile rimuovere il prodotto",
          });
          // Revert crossed out state if deletion fails
          setShoppingList((prevList) =>
            prevList.map((item) =>
              item._id === itemId ? { ...item, crossedOut: false } : item
            )
          );
          setRemovingItem(null);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Errore di connessione",
          description: "Impossibile rimuovere il prodotto",
        });
        // Revert crossed out state if deletion fails
        setShoppingList((prevList) =>
          prevList.map((item) =>
            item._id === itemId ? { ...item, crossedOut: false } : item
          )
        );
        setRemovingItem(null);
      }
    }, 1500); // Animation duration
  };

  const togglePinOffer = async (itemId: string, offerId: string) => {
    setPinningOffer(offerId);

    try {
      const item = shoppingList.find((item) => item._id === itemId);
      if (!item) return;

      const isPinned = (item.productPins || []).includes(offerId);
      const token = localStorage.getItem("token");

      let response;
      if (isPinned) {
        // Unpin
        response = await fetch(
          `https://server-supermarket-app.onrender.com/api/users/shopping-list/${itemId}/pin/${offerId}`,
          {
            method: "DELETE",
            headers: {
              "x-auth-token": token || "",
            },
          }
        );
      } else {
        // Pin
        response = await fetch(
          `https://server-supermarket-app.onrender.com/api/users/shopping-list/${itemId}/pin/${offerId}`,
          {
            method: "PUT",
            headers: {
              "x-auth-token": token || "",
            },
          }
        );
      }

      if (response.ok) {
        const updatedItem = await response.json();

        // Update local state
        setShoppingList((prevList) =>
          prevList.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  productPins: updatedItem.productPins,
                }
              : item
          )
        );

        toast({
          variant: "default",
          title: isPinned ? "Offerta rimossa" : "Offerta selezionata",
          description: isPinned
            ? "L'offerta è stata rimossa dai preferiti"
            : "L'offerta è stata aggiunta ai preferiti",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Impossibile aggiornare le offerte preferite",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore di connessione",
        description: "Impossibile aggiornare le offerte preferite",
      });
    } finally {
      setPinningOffer(null);
    }
  };

  // Modificato per permettere solo un elemento espanso alla volta
  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      // Se l'elemento è già espanso, lo chiudiamo
      if (prev[itemId]) {
        return {
          ...prev,
          [itemId]: false,
        };
      }

      // Altrimenti chiudiamo tutti gli elementi e apriamo solo quello selezionato
      const resetState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        resetState[key] = false;
      });

      return {
        ...resetState,
        [itemId]: true,
      };
    });
  };

  // Modificato per deduplicare le offerte
  const getOffersForItem = (productName: string) => {
    const allOffers =
      productOffers.find((p) => p.productName === productName)?.offers || [];

    // Deduplicazione delle offerte basata su _id
    const uniqueOffers = allOffers.reduce((unique: Offer[], offer) => {
      // Verifica se abbiamo già aggiunto questa offerta (stessa combinazione di ID e catena)
      const isDuplicate = unique.some(
        (item) => item._id === offer._id && item.chainName === offer.chainName
      );

      if (!isDuplicate) {
        unique.push(offer);
      }

      return unique;
    }, []);

    return uniqueOffers;
  };

  const getPinnedOffersForItem = (itemId: string) => {
    const item = shoppingList.find((item) => item._id === itemId);
    if (!item || !item.productPins || item.productPins.length === 0) return [];

    const allOffers = getOffersForItem(item.productName);
    return allOffers.filter((offer) => item.productPins?.includes(offer._id));
  };

  const getNonPinnedOffersForItem = (itemId: string) => {
    const item = shoppingList.find((item) => item._id === itemId);
    if (!item) return [];

    const allOffers = getOffersForItem(item.productName);
    return allOffers.filter((offer) => !item.productPins?.includes(offer._id));
  };

  // Helper function to check if an offer is expiring soon (less than 2 days)
  const isExpiringSoon = (endDateStr: string) => {
    try {
      const endDate = new Date(endDateStr);
      const today = new Date();
      const daysRemaining = differenceInDays(endDate, today);
      return daysRemaining < 2 && daysRemaining >= 0;
    } catch (e) {
      return false;
    }
  };

  // Format dates in Italian format
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMMM yyyy", { locale: it });
    } catch (e) {
      return "Data non disponibile";
    }
  };

  // Calculate remaining days
  const getRemainingDays = (endDateStr: string) => {
    try {
      const endDate = new Date(endDateStr);
      const today = new Date();
      return Math.max(0, differenceInDays(endDate, today));
    } catch (e) {
      return null;
    }
  };

  const renderOfferCard = (offer: Offer, itemId: string, isPinned: boolean) => {
    const supermarketLogo =
      SUPERMARKET_LOGOS[offer.chainName] || "/placeholder.svg";
    const expiringSoon = isExpiringSoon(offer.offerEndDate);
    const remainingDays = getRemainingDays(offer.offerEndDate);
    const isBeingPinned = pinningOffer === offer._id;
    const brandColors = getBrandColors(offer.brand, offer.chainName);

    return (
      <EnhancedCard
        variant={isPinned ? "floating" : "elevated"}
        className={`border-0 overflow-hidden transition-all duration-300 ${
          isPinned
            ? "shadow-lg ring-4 ring-primary-purple/50 transform scale-[1.02]"
            : "shadow-sm hover:shadow-md hover:scale-[1.01]"
        } ${isBeingPinned ? "animate-pulse" : ""}`}
      >
        {/* Offer Price Banner - Very Prominent */}
        <div
          className={`w-full p-3 bg-gradient-to-r ${
            isPinned
              ? "from-primary-purple to-primary-pink"
              : "from-primary-orange to-primary-pink/70"
          } text-white flex justify-between items-center`}
        >
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">
              €{offer.offerPrice.toFixed(2)}
            </span>
            {offer.previousPrice && (
              <span className="text-base ml-2 line-through opacity-80">
                €{offer.previousPrice.toFixed(2)}
              </span>
            )}
          </div>

          {offer.discountPercentage && (
            <div className="bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full text-base font-bold">
              -{offer.discountPercentage}%
            </div>
          )}
        </div>

        {/* Supermarket Header with Logo - Rimosso il riferimento a supermarketAisle */}
        <div className="h-16 relative p-3 flex items-center bg-white border-b border-gray-100">
          <div className="w-12 h-12 relative mr-3 overflow-hidden">
            <Image
              src={supermarketLogo || "/placeholder.svg"}
              alt={offer.chainName}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-base font-semibold capitalize">
              {offer.chainName.replace(/([A-Z])/g, " $1").trim()}
            </span>
          </div>

          {/* Pin/Unpin Button with animation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePinOffer(itemId, offer._id)}
            className={`ml-auto p-1 h-12 w-12 rounded-full transition-all ${
              isBeingPinned
                ? "animate-spin"
                : isPinned
                ? "bg-primary-purple/10"
                : ""
            }`}
            disabled={isBeingPinned}
          >
            {isPinned ? (
              <PinOff className={`w-6 h-6 text-primary-purple`} />
            ) : (
              <Pin
                className={`w-6 h-6 ${
                  isPinned ? "text-primary-purple" : "text-gray-400"
                }`}
              />
            )}
          </Button>
        </div>

        {/* Offer Details */}
        <div className={`p-5 bg-gradient-to-br ${brandColors}`}>
          <div className="space-y-4">
            {/* Product Name and Brand */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {offer.productName}
              </h3>

              <div className="flex flex-wrap mt-2 gap-2">
                {offer.productQuantity && (
                  <div className="inline-flex items-center text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    <Tag className="w-4 h-4 mr-2" />
                    {offer.productQuantity}
                  </div>
                )}

                {offer.brand && (
                  <div className="inline-flex items-center bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {offer.brand}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Price Info */}
            <div className="flex flex-wrap gap-2">
              {offer.pricePerKg && (
                <div className="flex items-center text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg text-base">
                  <Scale className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-medium">
                    €{offer.pricePerKg.toFixed(2)}/kg
                  </span>
                </div>
              )}

              {offer.pricePerLiter && (
                <div className="flex items-center text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg text-base">
                  <BarChart className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-medium">
                    €{offer.pricePerLiter.toFixed(2)}/L
                  </span>
                </div>
              )}
            </div>

            {/* Offer Dates - Styled to highlight expiry */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              {/* Start Date */}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Inizio:{" "}
                  <span className="font-medium">
                    {formatDate(offer.offerStartDate)}
                  </span>
                </span>
              </div>

              {/* End Date - Highlighted if expiring soon */}
              <div
                className={`flex items-center text-sm ${
                  expiringSoon ? "text-red-600" : "text-gray-600"
                }`}
              >
                <Clock
                  className={`w-4 h-4 mr-2 ${
                    expiringSoon ? "text-red-600" : "text-gray-600"
                  }`}
                />
                <span>
                  Scadenza:{" "}
                  <span className="font-bold">
                    {formatDate(offer.offerEndDate)}
                  </span>
                </span>
              </div>

              {/* Days remaining counter */}
              {remainingDays !== null && (
                <div
                  className={`mt-2 text-center ${
                    expiringSoon ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      expiringSoon
                        ? "bg-red-100 text-red-700"
                        : remainingDays < 5
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {remainingDays === 0 ? (
                      <span className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Scade oggi!
                      </span>
                    ) : remainingDays === 1 ? (
                      <span>Scade domani!</span>
                    ) : (
                      <span>Scade tra {remainingDays} giorni</span>
                    )}
                  </div>
                </div>
              )}

              {/* Expiring Soon Alert */}
              {expiringSoon && (
                <div className="bg-red-100 border border-red-300 rounded-md p-3 mt-2 animate-pulse">
                  <p className="text-sm text-red-700 font-medium flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Affrettati! Offerta in scadenza!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </EnhancedCard>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-5 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-fredoka font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-primary-orange to-primary-pink text-transparent bg-clip-text">
              La Tua Lista della Spesa
            </span>
            <Sparkles className="w-6 h-6 ml-2 text-primary-pink animate-pulse" />
          </h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-full h-10 w-10"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 sm:max-w-md border-0 shadow-2xl rounded-2xl">
              <div className="p-6 space-y-4">
                <DialogTitle className="text-xl font-fredoka font-bold text-center text-gray-900">
                  Aggiungi alla Lista
                </DialogTitle>

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
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-16 h-16 text-gray-400"
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

          <h2 className="text-2xl font-fredoka font-bold text-gray-900 mb-2">
            La tua lista è vuota
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Aggiungi il tuo primo prodotto per iniziare a risparmiare
          </p>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-xl px-8 py-4 text-lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            Aggiungi Prodotto
          </Button>
        </div>
      ) : (
        <div
          className="max-w-md mx-auto px-4 py-6 space-y-5 overflow-auto"
          ref={listRef}
        >
          {/* Shopping List with Offers */}
          {shoppingList.map((item) => {
            const isPinned = expandedItems[item._id] || false;
            const pinnedOffers = getPinnedOffersForItem(item._id);
            const nonPinnedOffers = getNonPinnedOffersForItem(item._id);
            const hasOffers =
              pinnedOffers.length > 0 || nonPinnedOffers.length > 0;

            return (
              <div key={item._id} className="animate-fade-in">
                <EnhancedCard
                  variant="elevated"
                  className={`overflow-hidden transition-all duration-300 ${
                    item.crossedOut ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {/* Product Header - Styled more prominently */}
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3
                              className={`font-bold text-gray-900 text-xl transition-all duration-300 ${
                                item.crossedOut
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {item.productName}
                            </h3>

                            {item.notes && (
                              <p
                                className={`text-base text-gray-600 mt-1 transition-all duration-300 ${
                                  item.crossedOut
                                    ? "line-through text-gray-400"
                                    : ""
                                }`}
                              >
                                {item.notes}
                              </p>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeFromShoppingList(item._id, item.productName)
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 h-10 w-10 rounded-full"
                            disabled={!!removingItem}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Divider when has offers */}
                        {hasOffers && (
                          <div className="mt-6 mb-4 border-t border-gray-200"></div>
                        )}

                        {/* Offers Section - Completely redesigned */}
                        {hasOffers && (
                          <div className="space-y-4">
                            {/* Pinned Offers - Highlighted Section */}
                            {pinnedOffers.length > 0 && (
                              <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center">
                                  <div className="bg-gradient-to-r from-primary-purple to-primary-pink text-white px-4 py-2 rounded-lg flex items-center shadow-md">
                                    <Pin className="w-4 h-4 mr-2 fill-white" />
                                    <span className="font-bold text-sm">
                                      OFFERTE SELEZIONATE
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  {pinnedOffers.map((offer) => (
                                    <div
                                      key={offer._id}
                                      className="relative transform transition-all duration-300 hover:scale-[1.02]"
                                    >
                                      {renderOfferCard(offer, item._id, true)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Expand/Collapse Button - More stylish */}
                            {nonPinnedOffers.length > 0 && (
                              <div>
                                <Button
                                  variant={isPinned ? "outline" : "default"}
                                  size="lg"
                                  onClick={() => toggleItemExpanded(item._id)}
                                  className={`w-full justify-between text-base py-3 rounded-xl ${
                                    isPinned
                                      ? "border-2 border-gray-200 text-gray-700"
                                      : "bg-gradient-to-r from-primary-orange/90 to-primary-pink/90 text-white"
                                  }`}
                                >
                                  <span className="flex items-center text-sm font-bold">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {isPinned
                                      ? "NASCONDI ALTRE OFFERTE"
                                      : `MOSTRA ${nonPinnedOffers.length} OFFERTE`}
                                  </span>
                                  {isPinned ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </Button>

                                {/* Non-Pinned Offers (Collapsible) - Updated design */}
                                {isPinned && (
                                  <div className="py-4 space-y-4 animate-fade-in">
                                    <div className="flex items-center">
                                      <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                                        <span className="font-bold text-sm">
                                          ALTRE OFFERTE
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      {nonPinnedOffers.map((offer) => (
                                        <div
                                          key={offer._id}
                                          className="relative transition-all duration-300 hover:scale-[1.01]"
                                        >
                                          {renderOfferCard(
                                            offer,
                                            item._id,
                                            false
                                          )}
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
            );
          })}

          {/* Add Item Button (Fixed at bottom) - Larger and more prominent */}
          <div className="fixed bottom-24 right-6 z-20">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-8 h-8" />
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}
