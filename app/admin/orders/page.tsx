"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, Truck, DollarSign } from "lucide-react"

interface Order {
  id: string
  tableNumber: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  timestamp: string
  status: "pending" | "preparing" | "ready" | "delivered"
  specialInstructions?: string
  paid: boolean
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      setOrders(
        storedOrders.map((order: any) => ({
          ...order,
          paid: order.paid || false,
        })),
      )
    }

    loadOrders()

    // Refresh orders every 5 seconds to simulate real-time updates
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const togglePaymentStatus = (orderId: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, paid: !order.paid } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

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

  const sortedOrders = [...orders].sort((a, b) => {
    // Sort by status priority, then by timestamp
    const statusPriority = { pending: 0, preparing: 1, ready: 2, delivered: 3 }
    const aPriority = statusPriority[a.status]
    const bPriority = statusPriority[b.status]

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage incoming orders and track their progress</p>
      </div>

      {sortedOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No orders yet. New orders will appear here automatically.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedOrders.map((order) => (
            <Card
              key={order.id}
              className={order.status === "pending" ? "border-red-200 bg-red-50/50 dark:bg-red-950/20" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Table {order.tableNumber}
                      <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Order #{order.id} • {new Date(order.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                    <Badge variant={order.paid ? "default" : "destructive"}>{order.paid ? "Paid" : "Unpaid"}</Badge>
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

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {order.status === "pending" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Accept Order
                    </Button>
                  )}

                  {order.status === "preparing" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Ready
                    </Button>
                  )}

                  {order.status === "ready" && (
                    <Button onClick={() => updateOrderStatus(order.id, "delivered")} variant="outline">
                      Mark as Delivered
                    </Button>
                  )}

                  <Button
                    onClick={() => togglePaymentStatus(order.id)}
                    variant={order.paid ? "outline" : "default"}
                    className={order.paid ? "" : "bg-green-600 hover:bg-green-700"}
                  >
                    <DollarSign size={16} className="mr-1" />
                    {order.paid ? "Mark Unpaid" : "Mark as Paid"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
