"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Gift, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface User {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  tier: string
  lastOrderDate: string | null
}

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
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    })

    // Generate offers based on user activity
    generateOffers(userData)
  }, [router])

  const generateOffers = (userData: User) => {
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
      })
    }

    // Birthday offer (simulate)
    if (Math.random() > 0.7) {
      generatedOffers.push({
        id: "birthday-special",
        title: "Birthday Special!",
        description: "Happy Birthday! Enjoy a complimentary dessert on us!",
        discount: 0,
        type: "freeItem",
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        earnedDate: new Date().toISOString(),
        category: "Special Occasion",
      })
    }

    setOffers(generatedOffers)
  }

  const handleSave = () => {
    if (!user) return

    const updatedUser = { ...user, ...formData }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    setIsEditing(false)
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

  const getTierProgress = (points: number) => {
    if (points >= 1000) return { progress: 100, nextTier: "Gold", pointsNeeded: 0 }
    if (points >= 500) return { progress: (points - 500) / 5, nextTier: "Gold", pointsNeeded: 1000 - points }
    return { progress: points / 5, nextTier: "Silver", pointsNeeded: 500 - points }
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

  if (!user) {
    return <div>Loading...</div>
  }

  const tierInfo = getTierProgress(user.loyaltyPoints)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/menu">
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
                <span className="font-bold">My Profile</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="offers">My Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-muted-foreground">
                        Member since {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getTierColor(user.tier)} text-white`}>
                    <Star size={12} className="mr-1" />
                    {user.tier} Member
                  </Badge>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{user.totalOrders}</div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">${user.totalSpent.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{user.loyaltyPoints}</div>
                  <p className="text-sm text-muted-foreground">Loyalty Points</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{offers.length}</div>
                  <p className="text-sm text-muted-foreground">Active Offers</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>Earn points with every order and unlock exclusive rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{user.loyaltyPoints}</div>
                  <p className="text-muted-foreground">Current Points</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{user.tier} Member</span>
                    <span>
                      {tierInfo.pointsNeeded} points to {tierInfo.nextTier}
                    </span>
                  </div>
                  <Progress value={tierInfo.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={user.tier === "Bronze" ? "border-orange-500" : ""}>
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="text-white" size={20} />
                      </div>
                      <h3 className="font-semibold">Bronze</h3>
                      <p className="text-sm text-muted-foreground">0-499 points</p>
                      <p className="text-xs mt-1">5% off orders</p>
                    </CardContent>
                  </Card>

                  <Card className={user.tier === "Silver" ? "border-gray-400" : ""}>
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="text-white" size={20} />
                      </div>
                      <h3 className="font-semibold">Silver</h3>
                      <p className="text-sm text-muted-foreground">500-999 points</p>
                      <p className="text-xs mt-1">10% off orders</p>
                    </CardContent>
                  </Card>

                  <Card className={user.tier === "Gold" ? "border-yellow-500" : ""}>
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="text-white" size={20} />
                      </div>
                      <h3 className="font-semibold">Gold</h3>
                      <p className="text-sm text-muted-foreground">1000+ points</p>
                      <p className="text-xs mt-1">15% off + exclusive offers</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">How to Earn Points</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Earn 1 point for every $1 spent</li>
                      <li>• Bonus points on special occasions</li>
                      <li>• Double points on your birthday month</li>
                      <li>• Refer friends and earn 100 bonus points</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2" />
                  My Offers
                </CardTitle>
                <CardDescription>Personalized offers based on your activity and loyalty status</CardDescription>
              </CardHeader>
              <CardContent>
                {offers.length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No offers available</h3>
                    <p className="text-muted-foreground">
                      Keep ordering to unlock personalized offers based on your activity!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <Card key={offer.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{getOfferIcon(offer.type)}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{offer.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                                  </span>
                                  <Badge variant="outline">{offer.category}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {offer.type === "percentage" && (
                                <div className="text-2xl font-bold text-green-600">{offer.discount}% OFF</div>
                              )}
                              {offer.type === "fixed" && (
                                <div className="text-2xl font-bold text-green-600">${offer.discount} OFF</div>
                              )}
                              {offer.type === "freeItem" && (
                                <div className="text-lg font-bold text-green-600">FREE ITEM</div>
                              )}
                              {offer.minSpend && (
                                <p className="text-xs text-muted-foreground">Min spend: ${offer.minSpend}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
