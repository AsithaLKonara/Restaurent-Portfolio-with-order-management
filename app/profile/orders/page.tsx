"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface Order {
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  tableNumber: string
  total: number
  timestamp: string
  status: "pending" | "preparing" | "ready" | "delivered"
  specialInstructions?: string
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load user's orders
    const userOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
    const filteredOrders = userOrders
      .filter((order: Order) => order.userId === userData.id)
      .sort((a: Order, b: Order) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setOrders(filteredOrders)
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive"
      case "preparing":
        return "secondary"
      case "ready":
        return "default"
      case "delivered":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />
      case "preparing":
        return <Truck size={16} />
      case "ready":
        return <CheckCircle size={16} />
      case "delivered":
        return <CheckCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

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
                <span className="font-bold">Order History</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-muted-foreground">Track your order history and status</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Link href="/menu">
                <Button>Browse Menu</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{order.id.slice(-6)}
                        <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {new Date(order.timestamp).toLocaleString()} • Table {order.tableNumber}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">+{Math.floor(order.total)} points earned</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.specialInstructions && (
                    <div>
                      <h4 className="font-medium mb-1">Special Instructions:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{order.specialInstructions}</p>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="flex justify-end">
                      <Link href="/menu">
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
