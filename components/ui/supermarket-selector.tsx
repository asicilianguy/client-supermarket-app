"use client"
import { Check } from "lucide-react"
import Image from "next/image"

const SUPERMARKETS = [
  {
    id: "esselunga",
    name: "Esselunga",
    logo: "/supermarkets/esselunga.png",
  },
  {
    id: "conad",
    name: "Conad",
    logo: "/placeholder.svg?height=40&width=80&text=Conad",
  },
  {
    id: "lidl",
    name: "Lidl",
    logo: "/supermarkets/lidl.png",
  },
  {
    id: "eurospin",
    name: "Eurospin",
    logo: "/supermarkets/eurospin.png",
  },
  {
    id: "bennet",
    name: "Bennet",
    logo: "/supermarkets/bennet.png",
  },
  {
    id: "auchan",
    name: "Auchan",
    logo: "/placeholder.svg?height=40&width=80&text=Auchan",
  },
  {
    id: "penny",
    name: "Penny Market",
    logo: "/supermarkets/penny.png",
  },
  {
    id: "despar",
    name: "Despar",
    logo: "/placeholder.svg?height=40&width=80&text=Despar",
  },
  {
    id: "centesimo",
    name: "Il Centesimo",
    logo: "/supermarkets/centesimo.png",
  },
  {
    id: "carrefouriper",
    name: "Carrefour Iper",
    logo: "/supermarkets/carrefouriper.png",
  },
  {
    id: "carrefourexpress",
    name: "Carrefour Express",
    logo: "/supermarkets/carrefourexpress.png",
  },
  {
    id: "prestofresco",
    name: "Presto Fresco",
    logo: "/placeholder.svg?height=40&width=80&text=Presto",
  },
  {
    id: "carrefourmarket",
    name: "Carrefour Market",
    logo: "/supermarkets/carrefourmarket.png",
  },
  {
    id: "gigante",
    name: "Il Gigante",
    logo: "/supermarkets/gigante.png",
  },
  {
    id: "ins",
    name: "iN's Mercato",
    logo: "/supermarkets/ins.png",
  },
  {
    id: "todis",
    name: "Todis",
    logo: "/supermarkets/todis.png",
  },
  {
    id: "md",
    name: "MD",
    logo: "/supermarkets/md.png",
  },
  {
    id: "crai",
    name: "CRAI",
    logo: "/supermarkets/crai.jpeg",
  },
  {
    id: "paghipoco",
    name: "Paghi Poco",
    logo: "/placeholder.svg?height=40&width=80&text=Paghi+Poco",
  },
]

interface SupermarketSelectorProps {
  selectedSupermarkets: string[]
  onSelectionChange: (selected: string[]) => void
}

export function SupermarketSelector({ selectedSupermarkets, onSelectionChange }: SupermarketSelectorProps) {
  const toggleSupermarket = (id: string) => {
    const newSelection = selectedSupermarkets.includes(id)
      ? selectedSupermarkets.filter((s) => s !== id)
      : [...selectedSupermarkets, id]
    onSelectionChange(newSelection)
  }

  const selectAll = () => {
    onSelectionChange(SUPERMARKETS.map((s) => s.id))
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex space-x-3">
        <button
          onClick={selectAll}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-green to-primary-blue text-white rounded-2xl font-nunito font-semibold text-sm hover:shadow-lg transition-all duration-200"
        >
          Seleziona Tutti
        </button>
        <button
          onClick={clearAll}
          className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-2xl font-nunito font-semibold text-sm hover:bg-gray-300 transition-all duration-200"
        >
          Deseleziona
        </button>
      </div>

      {/* Selection Counter - Fixed positioning to prevent overflow */}
      <div className="text-center relative z-10">
        <span className="inline-block bg-gradient-to-r from-primary-purple to-primary-pink text-white px-4 py-2 rounded-full font-fredoka font-bold text-sm shadow-lg">
          {selectedSupermarkets.length} supermercati selezionati
        </span>
      </div>

      {/* Supermarkets Grid Container - Added padding to prevent overflow */}
      <div className="supermarket-grid-container">
        <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto overflow-x-hidden p-2 -m-2">
          {SUPERMARKETS.map((supermarket, index) => (
            <div
              key={supermarket.id}
              className={`cursor-pointer transition-all duration-300 animate-fade-in group ${
                selectedSupermarkets.includes(supermarket.id) ? "z-10" : "hover:z-10"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => toggleSupermarket(supermarket.id)}
            >
              <div
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  selectedSupermarkets.includes(supermarket.id)
                    ? "border-primary-purple shadow-lg shadow-primary-purple/20 transform scale-105"
                    : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md hover:scale-102"
                }`}
              >
                {/* Logo Container */}
                <div className="h-16 flex items-center justify-center p-3 bg-gray-50 relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={supermarket.logo || "/placeholder.svg"}
                      alt={supermarket.name}
                      fill
                      className="object-contain filter drop-shadow-sm"
                    />
                  </div>

                  {/* Selection Check - Positioned to stay within bounds */}
                  {selectedSupermarkets.includes(supermarket.id) && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>

                {/* Name */}
                <div className="p-3 bg-white">
                  <p className="text-xs text-gray-700 text-center font-nunito font-medium leading-tight">
                    {supermarket.name}
                  </p>
                </div>

                {/* Selection indicator bar */}
                {selectedSupermarkets.includes(supermarket.id) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-orange to-primary-pink" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
