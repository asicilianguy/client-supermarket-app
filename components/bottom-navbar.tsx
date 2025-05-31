"use client"

import { ShoppingCart, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNavbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Cerca",
      href: "/explore",
      icon: Search,
      active: pathname === "/explore",
    },
    {
      name: "Lista",
      href: "/shopping-list",
      icon: ShoppingCart,
      active: pathname === "/shopping-list",
    },
    {
      name: "Profilo",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-100">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 transition-all duration-200",
              item.active ? "text-primary-purple" : "text-gray-500 hover:text-primary-purple",
            )}
          >
            <div
              className={cn(
                "relative p-2 rounded-full mb-1 transition-all duration-200",
                item.active ? "bg-primary-purple/10" : "bg-transparent",
              )}
            >
              <item.icon className={cn("w-5 h-5", item.active && item.name === "Lista" && "text-primary-purple")} />
              {item.name === "Lista" && item.active && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-pink rounded-full border-2 border-white"></span>
              )}
            </div>
            <span className={cn("text-xs font-medium", item.name === "Lista" && item.active && "font-bold")}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
