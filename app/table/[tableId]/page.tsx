"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Plus, Minus, Clock, Phone, User, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface TableData {
  id: string
  number: string
  restaurant: {
    id: string
    name: string
    logo: string
  }
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  isVegetarian?: boolean
  isSpicy?: boolean
  allergens?: string[]
}

interface CartItem extends MenuItem {
  quantity: number
  specialInstructions?: string
}

export default function TableOrderPage() {
  const params = useParams()
  const tableId = params.tableId as string

  const [tableData, setTableData] = useState<TableData | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        // Fetch table data from API
        const tableResponse = await fetch(`/api/tables/${tableId}`)
        if (!tableResponse.ok) {
          throw new Error("Failed to fetch table data")
        }
        const tableData = await tableResponse.json()
        setTableData(tableData.table)

        // Fetch menu items from API
        const menuResponse = await fetch(`/api/menu?restaurantId=${tableData.table.restaurantId}&isAvailable=true`)
        if (!menuResponse.ok) {
          throw new Error("Failed to fetch menu items")
        }
        const menuData = await menuResponse.json()
        setMenuItems(menuData.menuItems)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
        toast.error("Failed to load menu data")
      }
    }

    fetchTableData()
  }, [tableId])

  const categories = ["All", "Starters", "Mains", "Sides", "Drinks", "Desserts"]

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
    toast.success(`${item.name} added to cart`)
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

  const placeOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Please enter your name and phone number")
      return
    }

    if (!tableData) {
      toast.error("Table data not found")
      return
    }

    if (cart.length === 0) {
      toast.error("Please add items to your cart")
      return
    }

    try {
      const orderData = {
        tableId: tableData.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        specialInstructions,
        orderType: "DINE_IN",
        paymentMethod: "CASH",
        restaurantId: tableData.restaurant.id,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
          specialInstructions: item.specialInstructions
        }))
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error("Failed to place order")
      }

      const result = await response.json()
      toast.success("Order placed successfully!")
      setOrderPlaced(true)
      setCart([])
      setCustomerName("")
      setCustomerPhone("")
      setSpecialInstructions("")
      setIsCartOpen(false)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error("Failed to place order. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-4">
            Your order has been received and is being prepared. We'll notify you when it's ready.
          </p>
          <Button onClick={() => setOrderPlaced(false)}>
            Place Another Order
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {tableData?.restaurant.logo && (
                <img
                  src={tableData.restaurant.logo}
                  alt="Restaurant Logo"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h1 className="text-xl font-bold">{tableData?.restaurant.name}</h1>
                <p className="text-sm text-muted-foreground">Table {tableData?.number}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCartOpen(true)}
              className="relative"
              disabled={cart.length === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({getTotalItems()})
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-2">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-6">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={item.image || "/placeholder.svg?height=200&width=300"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">Unavailable</Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="mt-1">{item.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">Rs. {item.price.toFixed(2)}</div>
                            <div className="flex gap-1 mt-1">
                              {item.isVegetarian && (
                                <Badge variant="outline" className="text-xs">Veg</Badge>
                              )}
                              {item.isSpicy && (
                                <Badge variant="outline" className="text-xs">Spicy</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => addToCart(item)}
                          disabled={!item.isAvailable}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Customer Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests or dietary requirements"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Rs. {item.price.toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>Rs. {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  <Button onClick={placeOrder} className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
