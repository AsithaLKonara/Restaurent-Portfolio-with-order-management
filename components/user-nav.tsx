"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserProps {
  id: string
  name: string
  email: string
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  tier: string
}

export function UserNav() {
  const [user, setUser] = useState<UserProps | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    router.push("/")
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500"
      case "Silver":
        return "bg-gray-400"
      case "Bronze":
        return "bg-orange-600"
      default:
        return "bg-gray-500"
    }
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button variant="outline" size="sm">
          <span className="mr-2">Sign In</span>
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-orange-500 text-white">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <Badge className={`${getTierColor(user.tier)} text-white`}>
                <Star size={12} className="mr-1" />
                {user.tier}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-sm font-bold">{user.totalOrders}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-xs text-muted-foreground">Points</p>
                <p className="text-sm font-bold">{user.loyaltyPoints}</p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem>
            <span className="mr-2">Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/orders">
          <DropdownMenuItem>
            <span className="mr-2">Order History</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/offers">
          <DropdownMenuItem>
            <span className="mr-2">My Offers</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <span className="mr-2">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
