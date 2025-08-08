"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, CreditCard } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getTranslation, getCurrentLanguage } from "@/lib/i18n"

interface Table {
  id: string
  number: string
  capacity: number
  isAvailable: boolean
}

interface TimeSlot {
  time: string
  available: boolean
}

interface ReservationForm {
  date: Date | undefined
  time: string
  partySize: number
  customerName: string
  customerPhone: string
  customerEmail: string
  specialRequests: string
  depositAmount: number
  depositPaid: boolean
}

const timeSlots: TimeSlot[] = [
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "12:30", available: true },
  { time: "13:00", available: true },
  { time: "13:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: true },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "18:30", available: true },
  { time: "19:00", available: true },
  { time: "19:30", available: true },
  { time: "20:00", available: true },
  { time: "20:30", available: true },
  { time: "21:00", available: true },
  { time: "21:30", available: true },
  { time: "22:00", available: true },
]

const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function ReservationsPage() {
  const [form, setForm] = useState<ReservationForm>({
    date: undefined,
    time: "",
    partySize: 2,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    specialRequests: "",
    depositAmount: 0,
    depositPaid: false,
  })
  const [availableTables, setAvailableTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [reservationConfirmed, setReservationConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const lang = getCurrentLanguage()
  const t = (key: string) => getTranslation(lang, key)

  useEffect(() => {
    // Mock available tables
    const mockTables: Table[] = [
      { id: "1", number: "1", capacity: 4, isAvailable: true },
      { id: "2", number: "2", capacity: 6, isAvailable: true },
      { id: "3", number: "3", capacity: 2, isAvailable: true },
      { id: "4", number: "4", capacity: 8, isAvailable: true },
      { id: "5", number: "5", capacity: 4, isAvailable: true },
    ]
    setAvailableTables(mockTables)
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    setForm(prev => ({ ...prev, date }))
    // In a real app, this would check availability for the selected date
  }

  const handleTimeSelect = (time: string) => {
    setForm(prev => ({ ...prev, time }))
    // In a real app, this would check availability for the selected time
  }

  const handlePartySizeChange = (size: number) => {
    setForm(prev => ({ ...prev, partySize: size }))
    // Filter tables based on capacity
    const suitableTables = availableTables.filter(table => table.capacity >= size)
    setAvailableTables(suitableTables)
  }

  const calculateDeposit = () => {
    // Deposit is 10% of estimated bill (LKR 50 per person)
    const estimatedBill = form.partySize * 50
    return Math.round(estimatedBill * 0.1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!form.date || !form.time || !form.customerName || !form.customerPhone) {
        alert("Please fill in all required fields")
        setLoading(false)
        return
      }

      // Create reservation
      const reservation = {
        id: Date.now().toString(),
        date: form.date,
        time: form.time,
        partySize: form.partySize,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        specialRequests: form.specialRequests,
        depositAmount: calculateDeposit(),
        depositPaid: form.depositPaid,
        status: "PENDING",
        tableId: selectedTable,
        createdAt: new Date().toISOString(),
      }

      // Store reservation (in real app, this would go to database)
      const existingReservations = JSON.parse(localStorage.getItem("reservations") || "[]")
      localStorage.setItem("reservations", JSON.stringify([...existingReservations, reservation]))

      setReservationConfirmed(true)
      setLoading(false)
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert("Failed to create reservation. Please try again.")
      setLoading(false)
    }
  }

  if (reservationConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Reservation Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your table has been reserved. We'll send you a confirmation SMS shortly.
            </p>
            <div className="space-y-2 text-sm text-left bg-muted p-4 rounded-lg mb-6">
              <p><strong>Date:</strong> {form.date && format(form.date, 'PPP')}</p>
              <p><strong>Time:</strong> {form.time}</p>
              <p><strong>Party Size:</strong> {form.partySize} people</p>
              <p><strong>Name:</strong> {form.customerName}</p>
              <p><strong>Phone:</strong> {form.customerPhone}</p>
              {form.depositAmount > 0 && (
                <p><strong>Deposit Required:</strong> LKR {form.depositAmount}</p>
              )}
            </div>
            <Button onClick={() => setReservationConfirmed(false)} className="w-full">
              Make Another Reservation
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
                <span className="font-bold">Table Reservations</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Reserve Your Table</CardTitle>
              <CardDescription>
                Book your table in advance to ensure availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Select Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.date ? format(form.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.date}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label>Select Time *</Label>
                  <Select value={form.time} onValueChange={handleTimeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.time} value={slot.time}>
                          {slot.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Party Size */}
                <div className="space-y-2">
                  <Label>Party Size *</Label>
                  <Select value={form.partySize.toString()} onValueChange={(value) => handlePartySizeChange(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {partySizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Tables */}
                {form.date && form.time && (
                  <div className="space-y-2">
                    <Label>Available Tables</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTables.map((table) => (
                        <Button
                          key={table.id}
                          type="button"
                          variant={selectedTable === table.id ? "default" : "outline"}
                          onClick={() => setSelectedTable(table.id)}
                          className="justify-start"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Table {table.number} ({table.capacity} seats)
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.customerName}
                      onChange={(e) => setForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={form.customerPhone}
                      onChange={(e) => setForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => setForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests</Label>
                    <Textarea
                      id="requests"
                      value={form.specialRequests}
                      onChange={(e) => setForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Any special requests or dietary requirements?"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Deposit Information */}
                {form.partySize > 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Deposit Information</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Required Deposit:</span>
                        <span className="text-lg font-bold">LKR {calculateDeposit()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A deposit is required for parties of 5 or more to confirm your reservation.
                        This will be deducted from your final bill.
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Confirm Reservation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
