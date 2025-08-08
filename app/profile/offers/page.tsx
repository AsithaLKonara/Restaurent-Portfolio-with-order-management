"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Gift, Calendar, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface Offer {
  id: string
  title: string
  description: string
  discount: number
  type: "percentage" | "fixed" | "freeItem"
  minSpend?: number
  validUntil: string
  used: boolean
  earnedDate: string
  category: string
  code?: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [user, setUser] = useState<any>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Generate offers based on user activity (same logic as profile page)
    generateOffers(userData)
  }, [router])

  const generateOffers = (userData: any) => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get user's orders from last month
    const orders = JSON.parse(localStorage.getItem("userOrders") || "[]")
    const userOrders = orders.filter((order: any) => order.userId === userData.id)
    const lastMonthOrders = userOrders.filter((order: any) => {
      const orderDate = new Date(order.timestamp)
      return orderDate >= lastMonth && orderDate < currentMonth
    })

    const lastMonthOrderCount = lastMonthOrders.length
    const lastMonthSpent = lastMonthOrders.reduce((sum: number, order: any) => sum + order.total, 0)

    const generatedOffers: Offer[] = []

    // Offer based on order frequency
    if (lastMonthOrderCount >= 5) {
      generatedOffers.push({
        id: "frequent-customer",
        title: "Frequent Customer Reward",
        description: `You ordered ${lastMonthOrderCount} times last month! Enjoy 20% off your next order.`,
        discount: 20,
        type: "percentage",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Frequency Reward",
        code: "FREQUENT20",
      })
    } else if (lastMonthOrderCount >= 3) {
      generatedOffers.push({
        id: "regular-customer",
        title: "Regular Customer Discount",
        description: `Thanks for ordering ${lastMonthOrderCount} times last month! Get 15% off.`,
        discount: 15,
        type: "percentage",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Frequency Reward",
        code: "REGULAR15",
      })
    }

    // Offer based on spending
    if (lastMonthSpent >= 100) {
      generatedOffers.push({
        id: "high-spender",
        title: "VIP Customer Bonus",
        description: `You spent $${lastMonthSpent.toFixed(2)} last month! Get a free appetizer with your next order.`,
        discount: 0,
        type: "freeItem",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Spending Reward",
        code: "VIPFREE",
      })
    } else if (lastMonthSpent >= 50) {
      generatedOffers.push({
        id: "good-spender",
        title: "Valued Customer Offer",
        description: `You spent $${lastMonthSpent.toFixed(2)} last month! Enjoy $10 off orders over $30.`,
        discount: 10,
        type: "fixed",
        minSpend: 30,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Spending Reward",
        code: "VALUED10",
      })
    }

    // Welcome offer for new users
    const joinDate = new Date(userData.joinDate)
    const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceJoin <= 7 && userData.totalOrders === 0) {
      generatedOffers.push({
        id: "welcome-offer",
        title: "Welcome to Spice Garden!",
        description: "Get 25% off your first order as a new member!",
        discount: 25,
        type: "percentage",
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: userData.joinDate,
        category: "Welcome Offer",
        code: "WELCOME25",
      })
    }

    // Loyalty tier offers
    if (userData.tier === "Gold") {
      generatedOffers.push({
        id: "gold-exclusive",
        title: "Gold Member Exclusive",
        description: "Exclusive 30% off for our Gold members!",
        discount: 30,
        type: "percentage",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Tier Reward",
        code: "GOLD30",
      })
    } else if (userData.tier === "Silver") {
      generatedOffers.push({
        id: "silver-special",
        title: "Silver Member Special",
        description: "Silver members get 20% off this month!",
        discount: 20,
        type: "percentage",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Tier Reward",
        code: "SILVER20",
      })
    }

    setOffers(generatedOffers)
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return "🎯"
      case "fixed":
        return "💰"
      case "freeItem":
        return "🎁"
      default:
        return "🎉"
    }
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const activeOffers = offers.filter((offer) => !offer.used && !isExpired(offer.validUntil))
  const expiredOffers = offers.filter((offer) => offer.used || isExpired(offer.validUntil))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
                <span className="font-bold">My Offers</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Exclusive Offers</h1>
          <p className="text-muted-foreground">Personalized offers based on your loyalty and activity</p>
        </div>

        {/* Active Offers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Gift className="mr-2" />
            Active Offers ({activeOffers.length})
          </h2>

          {activeOffers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active offers</h3>
                <p className="text-muted-foreground mb-4">
                  Keep ordering to unlock personalized offers based on your activity!
                </p>
                <Link href="/menu">
                  <Button>Browse Menu</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeOffers.map((offer) => (
                <Card key={offer.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{getOfferIcon(offer.type)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{offer.title}</h3>
                          <p className="text-muted-foreground mb-3">{offer.description}</p>

                          {offer.code && (
                            <div className="flex items-center space-x-2 mb-3">
                              <code className="bg-muted px-3 py-1 rounded text-sm font-mono">{offer.code}</code>
                              <Button variant="outline" size="sm" onClick={() => copyCode(offer.code!)} className="h-8">
                                {copiedCode === offer.code ? <Check size={14} /> : <Copy size={14} />}
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              Valid until {new Date(offer.validUntil).toLocaleDateString()}
                            </span>
                            <Badge variant="outline">{offer.category}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {offer.type === "percentage" && (
                          <div className="text-3xl font-bold text-green-600">{offer.discount}%</div>
                        )}
                        {offer.type === "fixed" && (
                          <div className="text-3xl font-bold text-green-600">${offer.discount}</div>
                        )}
                        {offer.type === "freeItem" && <div className="text-xl font-bold text-green-600">FREE</div>}
                        <div className="text-sm text-muted-foreground">OFF</div>
                        {offer.minSpend && (
                          <p className="text-xs text-muted-foreground mt-1">Min spend: ${offer.minSpend}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Link href="/menu">
                        <Button className="w-full">Use This Offer</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Expired/Used Offers */}
        {expiredOffers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Past Offers ({expiredOffers.length})</h2>
            <div className="space-y-4">
              {expiredOffers.map((offer) => (
                <Card key={offer.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{getOfferIcon(offer.type)}</div>
                        <div>
                          <h3 className="font-medium">{offer.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {isExpired(offer.validUntil) ? "Expired" : "Used"} •
                            {offer.type === "percentage" && ` ${offer.discount}% off`}
                            {offer.type === "fixed" && ` $${offer.discount} off`}
                            {offer.type === "freeItem" && " Free item"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{isExpired(offer.validUntil) ? "Expired" : "Used"}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
