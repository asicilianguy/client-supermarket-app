"use client"

import { useState, useEffect } from "react"

const offers = [
  {
    id: 1,
    supermarket: "Esselunga",
    product: "Latte Fresco",
    price: "€1.29",
    originalPrice: "€1.89",
    discount: "32%",
    gradient: "from-blue-600 to-red-500",
    delay: 0,
  },
  {
    id: 2,
    supermarket: "Lidl",
    product: "Pane Integrale",
    price: "€0.89",
    originalPrice: "€1.20",
    discount: "26%",
    gradient: "from-yellow-400 to-blue-600",
    delay: 200,
  },
  {
    id: 3,
    supermarket: "Conad",
    product: "Pomodori Bio",
    price: "€2.49",
    originalPrice: "€3.20",
    discount: "22%",
    gradient: "from-red-500 to-green-600",
    delay: 400,
  },
]

export function OfferCardsStack() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    offers.forEach((offer, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, offer.id])
      }, offer.delay)
    })
  }, [])

  return (
    <div className="relative w-64 h-48">
      {offers.map((offer, index) => (
        <div
          key={offer.id}
          className={`absolute w-full transition-all duration-700 ease-out ${
            visibleCards.includes(offer.id) ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-8 rotate-12"
          }`}
          style={{
            transform: `translateY(${index * -8}px) translateX(${index * 4}px) rotate(${index * -2}deg)`,
            zIndex: offers.length - index,
          }}
        >
          <div
            className={`bg-gradient-to-br ${offer.gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            {/* Supermarket name */}
            <div className="text-xs font-medium opacity-90 mb-1">{offer.supermarket}</div>

            {/* Product name */}
            <div className="font-semibold text-sm mb-2">{offer.product}</div>

            {/* Price section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{offer.price}</span>
                <span className="text-xs line-through opacity-75">{offer.originalPrice}</span>
              </div>
              <div className="bg-white/20 rounded-full px-2 py-1">
                <span className="text-xs font-medium">-{offer.discount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
