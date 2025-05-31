"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const supermarkets = [
  { name: "Esselunga", logo: "/supermarkets/esselunga.png" },
  { name: "Lidl", logo: "/supermarkets/lidl.png" },
  { name: "Bennet", logo: "/supermarkets/bennet.png" },
  { name: "CRAI", logo: "/supermarkets/crai.jpeg" },
  { name: "Il Centesimo", logo: "/supermarkets/centesimo.png" },
  { name: "Todis", logo: "/supermarkets/todis.png" },
  { name: "Penny", logo: "/supermarkets/penny.png" },
  { name: "Carrefour Express", logo: "/supermarkets/carrefourexpress.png" },
  { name: "Carrefour Market", logo: "/supermarkets/carrefourmarket.png" },
  { name: "Carrefour Iper", logo: "/supermarkets/carrefouriper.png" },
  { name: "Il Gigante", logo: "/supermarkets/gigante.png" },
  { name: "Eurospin", logo: "/supermarkets/eurospin.png" },
  { name: "iN's Mercato", logo: "/supermarkets/ins.png" },
  { name: "MD", logo: "/supermarkets/md.png" },
]

export function SupermarketGrid() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-advance through supermarkets
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % supermarkets.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center justify-center mb-6">
        <p className="font-nunito text-sm text-gray-600 text-center font-medium">
          Centralizziamo le offerte di oltre 15 catene nazionali
        </p>
      </div>

      <div className="relative rounded-2xl bg-gradient-to-r from-primary-blue/10 via-primary-purple/10 to-primary-pink/10 p-6 border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {supermarkets.map((supermarket, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === activeIndex ? "scale-110 shadow-md z-10" : "scale-100"
              }`}
            >
              <div className="relative w-full h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 p-2 border border-gray-100">
                <Image
                  src={supermarket.logo || "/placeholder.svg"}
                  alt={supermarket.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <p className="text-xs text-center mt-2 font-nunito text-gray-600 truncate">{supermarket.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-nunito text-sm leading-relaxed">
          <span className="font-bold text-blue-700">Esselunga</span> •{" "}
          <span className="font-bold text-blue-600">Lidl</span> •{" "}
          <span className="font-bold text-green-600">Conad</span> •{" "}
          <span className="font-bold text-blue-600">Carrefour</span> •{" "}
          <span className="font-bold text-blue-700">Eurospin</span> •{" "}
          <span className="font-bold text-green-700">CRAI</span> •{" "}
          <span className="font-bold text-green-600">Despar</span> • <span className="font-bold text-red-600">MD</span>{" "}
          • <span className="font-bold text-orange-600">Todis</span> •{" "}
          <span className="font-bold text-purple-600">Bennet</span> •{" "}
          <span className="text-gray-500">e molti altri...</span>
        </p>
      </div>
    </div>
  )
}
