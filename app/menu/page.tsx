"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ShoppingCart, ArrowLeft, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

interface CartItem extends MenuItem {
  quantity: number
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Chicken Kottu Roti",
    description: "Traditional stir-fried bread with chicken, vegetables, and aromatic spices",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mains",
    available: true,
  },
  {
    id: "2",
    name: "Fish Curry",
    description: "Fresh fish cooked in coconut milk with traditional Sri Lankan spices",
    price: 22.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mains",
    available: true,
  },
  {
    id: "3",
    name: "Hoppers (Set of 3)",
    description: "Traditional bowl-shaped pancakes made from fermented rice flour",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Starters",
    available: true,
  },
  {
    id: "4",
    name: "Pol Sambol",
    description: "Spicy coconut relish with chili, onions, and lime",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Sides",
    available: true,
  },
  {
    id: "5",
    name: "Ceylon Tea",
    description: "Premium black tea from the highlands of Sri Lanka",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Drinks",
    available: true,
  },
  {
    id: "6",
    name: "Watalappan",
    description: "Traditional coconut custard pudding with jaggery and spices",
    price: 9.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Desserts",
    available: true,
  },
]

const categories = ["All", "Starters", "Mains", "Sides", "Drinks", "Desserts"]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [tableNumber, setTableNumber] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [orderPlaced, setOrderPlaced] = useState(false)

  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const placeOrder = () => {
    if (!tableNumber.trim()) {
      alert("Please enter your table number")
      return
    }

    // Get current user
    const currentUser = localStorage.getItem("currentUser")
    let userId = null

    if (currentUser) {
      const user = JSON.parse(currentUser)
      userId = user.id

      // Update user stats
      const updatedUser = {
        ...user,
        totalOrders: user.totalOrders + 1,
        totalSpent: user.totalSpent + getTotalPrice(),
        loyaltyPoints: user.loyaltyPoints + Math.floor(getTotalPrice()), // 1 point per dollar
        lastOrderDate: new Date().toISOString(),
        tier:
          user.loyaltyPoints + Math.floor(getTotalPrice()) >= 1000
            ? "Gold"
            : user.loyaltyPoints + Math.floor(getTotalPrice()) >= 500
              ? "Silver"
              : "Bronze",
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    // Create order
    const order = {
      id: Date.now().toString(),
      userId: userId,
      items: cart,
      tableNumber: tableNumber.trim(),
      specialInstructions,
      total: getTotalPrice(),
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    // Store order for admin
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]))

    // Store user orders separately for user tracking
    const userOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
    localStorage.setItem("userOrders", JSON.stringify([...userOrders, order]))

    setOrderPlaced(true)
    setCart([])
    setTableNumber("")
    setSpecialInstructions("")
    setIsCartOpen(false)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been sent to the kitchen. We'll prepare it shortly.
            </p>
            <Button onClick={() => setOrderPlaced(false)} className="w-full">
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
                <span className="font-bold">Menu</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Unavailable</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">{item.category}</Badge>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus size={16} className="mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg">
                <ShoppingCart size={20} className="mr-2" />
                {getTotalItems()} items - ${getTotalPrice().toFixed(2)}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Your Order</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="table">Table Number *</Label>
                    <Input
                      id="table"
                      placeholder="Enter your table number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Any special requests or allergies?"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <Button onClick={placeOrder} className="w-full bg-orange-500 hover:bg-orange-600">
                    Place Order
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}
