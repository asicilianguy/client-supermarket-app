"use client"

export function ProductIcon3D({ type, className = "w-12 h-12" }: { type: string; className?: string }) {
  const icons = {
    milk: (
      <div className={`${className} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600">
            <path
              fill="currentColor"
              d="M5 2v3H3v2h2v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7h2V5h-2V2H5zm2 2h10v1H7V4zm0 3h10v11H7V7z"
            />
          </svg>
        </div>
      </div>
    ),
    bread: (
      <div className={`${className} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-600">
            <path
              fill="currentColor"
              d="M12 2C9.38 2 7.25 4.13 7.25 6.75c0 1.57.75 2.97 1.91 3.84L12 13l2.84-2.41c1.16-.87 1.91-2.27 1.91-3.84C16.75 4.13 14.62 2 12 2z"
            />
          </svg>
        </div>
      </div>
    ),
    vegetables: (
      <div className={`${className} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-600">
            <path
              fill="currentColor"
              d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .55.45 1 1 1h4.21l4.38 6.56c.19.28.51.42.83.42.32 0 .64-.14.83-.43L16.63 11H21c.55 0 1-.45 1-1 0-.55-.45-1-1-1h-3.79z"
            />
          </svg>
        </div>
      </div>
    ),
  }

  return icons[type as keyof typeof icons] || icons.milk
}
