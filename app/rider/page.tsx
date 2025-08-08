"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Clock, Package, CheckCircle, XCircle, AlertCircle, Navigation, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface Delivery {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  restaurantAddress: string
  status: "pending" | "accepted" | "picked" | "delivered" | "cancelled"
  estimatedTime: string
  actualTime?: string
  distance: number
  earnings: number
  specialInstructions?: string
  createdAt: Date
}

interface Rider {
  id: string
  name: string
  phone: string
  vehicleNumber: string
  isOnline: boolean
  currentLocation: string
  totalDeliveries: number
  totalEarnings: number
  rating: number
}

export default function RiderApp() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [rider, setRider] = useState<Rider | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [deliveryNote, setDeliveryNote] = useState("")

  // Mock data
  useEffect(() => {
    setRider({
      id: "1",
      name: "Amal Perera",
      phone: "+94 77 123 4567",
      vehicleNumber: "WP-ABC-1234",
      isOnline: false,
      currentLocation: "Colombo 03",
      totalDeliveries: 156,
      totalEarnings: 45000,
      rating: 4.8
    })

    setDeliveries([
      {
        id: "1",
        orderId: "ORD-001",
        customerName: "Kumara Silva",
        customerPhone: "+94 77 234 5678",
        customerAddress: "123 Lake Drive, Colombo 02",
        restaurantAddress: "456 Galle Road, Colombo 03",
        status: "pending",
        estimatedTime: "25 minutes",
        distance: 2.5,
        earnings: 350,
        specialInstructions: "Call before delivery",
        createdAt: new Date()
      },
      {
        id: "2",
        orderId: "ORD-002",
        customerName: "Nimali Fernando",
        customerPhone: "+94 77 345 6789",
        customerAddress: "789 Marine Drive, Colombo 01",
        restaurantAddress: "456 Galle Road, Colombo 03",
        status: "accepted",
        estimatedTime: "20 minutes",
        distance: 1.8,
        earnings: 300,
        createdAt: new Date()
      },
      {
        id: "3",
        orderId: "ORD-003",
        customerName: "Sunil Rajapaksa",
        customerPhone: "+94 77 456 7890",
        customerAddress: "321 Temple Road, Colombo 04",
        restaurantAddress: "456 Galle Road, Colombo 03",
        status: "picked",
        estimatedTime: "15 minutes",
        distance: 1.2,
        earnings: 250,
        createdAt: new Date()
      }
    ])
  }, [])

  const handleToggleOnline = () => {
    setIsOnline(!isOnline)
    setRider(prev => prev ? { ...prev, isOnline: !isOnline } : null)
    toast.success(isOnline ? "You are now offline" : "You are now online")
  }

  const handleAcceptDelivery = (deliveryId: string) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: "accepted" } : delivery
    ))
    toast.success("Delivery accepted")
  }

  const handlePickupDelivery = (deliveryId: string) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: "picked" } : delivery
    ))
    toast.success("Order picked up")
  }

  const handleCompleteDelivery = (deliveryId: string) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { 
        ...delivery, 
        status: "delivered",
        actualTime: new Date().toLocaleTimeString()
      } : delivery
    ))
    toast.success("Delivery completed")
  }

  const handleCancelDelivery = (deliveryId: string) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: "cancelled" } : delivery
    ))
    toast.success("Delivery cancelled")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "accepted": return "bg-blue-100 text-blue-800"
      case "picked": return "bg-orange-100 text-orange-800"
      case "delivered": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4" />
      case "accepted": return <CheckCircle className="h-4 w-4" />
      case "picked": return <Package className="h-4 w-4" />
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const pendingDeliveries = deliveries.filter(d => d.status === "pending")
  const activeDeliveries = deliveries.filter(d => ["accepted", "picked"].includes(d.status))
  const completedDeliveries = deliveries.filter(d => d.status === "delivered")

  return (
    <div className="space-y-6">
      {/* Rider Status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                {rider?.name}
                <Badge variant={isOnline ? "default" : "secondary"}>
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Vehicle: {rider?.vehicleNumber} | Rating: {rider?.rating} ⭐
              </CardDescription>
            </div>
            <Button 
              onClick={handleToggleOnline}
              variant={isOnline ? "destructive" : "default"}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Total Deliveries</div>
              <div className="text-2xl font-bold">{rider?.totalDeliveries}</div>
            </div>
            <div>
              <div className="font-semibold">Total Earnings</div>
              <div className="text-2xl font-bold">Rs. {rider?.totalEarnings?.toLocaleString()}</div>
            </div>
            <div>
              <div className="font-semibold">Today's Deliveries</div>
              <div className="text-2xl font-bold">{deliveries.length}</div>
            </div>
            <div>
              <div className="font-semibold">Current Location</div>
              <div className="text-lg">{rider?.currentLocation}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedDeliveries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{delivery.orderId}
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusIcon(delivery.status)}
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {delivery.customerName} • {delivery.customerPhone}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">Rs. {delivery.earnings}</div>
                    <div className="text-sm text-muted-foreground">{delivery.distance} km</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{delivery.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Est. {delivery.estimatedTime}</span>
                  </div>
                  {delivery.specialInstructions && (
                    <div className="text-sm text-muted-foreground">
                      Note: {delivery.specialInstructions}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAcceptDelivery(delivery.id)}
                      className="flex-1"
                    >
                      Accept Delivery
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedDelivery(delivery)
                        setIsDetailsOpen(true)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{delivery.orderId}
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusIcon(delivery.status)}
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {delivery.customerName} • {delivery.customerPhone}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">Rs. {delivery.earnings}</div>
                    <div className="text-sm text-muted-foreground">{delivery.distance} km</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{delivery.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Est. {delivery.estimatedTime}</span>
                  </div>
                  <div className="flex gap-2">
                    {delivery.status === "accepted" && (
                      <Button 
                        onClick={() => handlePickupDelivery(delivery.id)}
                        className="flex-1"
                      >
                        Pick Up Order
                      </Button>
                    )}
                    {delivery.status === "picked" && (
                      <Button 
                        onClick={() => handleCompleteDelivery(delivery.id)}
                        className="flex-1"
                      >
                        Complete Delivery
                      </Button>
                    )}
                    <Button variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{delivery.orderId}
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusIcon(delivery.status)}
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {delivery.customerName} • {delivery.customerPhone}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">Rs. {delivery.earnings}</div>
                    <div className="text-sm text-muted-foreground">
                      {delivery.actualTime}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{delivery.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Completed at {delivery.actualTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Delivery Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Order #{selectedDelivery?.orderId} - {selectedDelivery?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <div>
                <Label>Customer Details</Label>
                <div className="text-sm">
                  <div>Name: {selectedDelivery?.customerName}</div>
                  <div>Phone: {selectedDelivery?.customerPhone}</div>
                </div>
              </div>
              <div>
                <Label>Pickup Location</Label>
                <div className="text-sm">{selectedDelivery?.restaurantAddress}</div>
              </div>
              <div>
                <Label>Delivery Location</Label>
                <div className="text-sm">{selectedDelivery?.customerAddress}</div>
              </div>
              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Add delivery notes..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedDelivery) {
                handleAcceptDelivery(selectedDelivery.id)
                setIsDetailsOpen(false)
              }
            }}>
              Accept Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
