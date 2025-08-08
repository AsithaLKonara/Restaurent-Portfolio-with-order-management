"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Edit, Trash2, Star, Clock, Users, Package } from "lucide-react"
import { toast } from "sonner"
import { useFestivalMenu, getFestivalDisplayName } from "@/lib/festival-menu"

export default function FestivalsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFestival, setSelectedFestival] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    nameSinhala: "",
    nameTamil: "",
    startDate: "",
    endDate: "",
    description: "",
    pricingMultiplier: 1.0,
    isDeliveryAvailable: true,
    isDineInAvailable: true,
    specialInstructions: ""
  })

  const {
    getAllFestivals,
    getUpcomingFestivals,
    getCurrentFestival,
    getFestivalStats,
    getFestivalCalendar
  } = useFestivalMenu()

  const [festivals, setFestivals] = useState<any[]>([])
  const [currentFestival, setCurrentFestival] = useState<any>(null)
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    const allFestivals = getAllFestivals()
    const current = getCurrentFestival()
    const upcoming = getUpcomingFestivals()
    const festivalStats = getFestivalStats()

    setFestivals(allFestivals)
    setCurrentFestival(current)
    setUpcomingFestivals(upcoming)
    setStats(festivalStats)
  }, [getAllFestivals, getCurrentFestival, getUpcomingFestivals, getFestivalStats])

  const handleAddFestival = () => {
    const newFestival = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
      specialMenuItems: [],
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    }

    setFestivals(prev => [...prev, newFestival])
    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      nameSinhala: "",
      nameTamil: "",
      startDate: "",
      endDate: "",
      description: "",
      pricingMultiplier: 1.0,
      isDeliveryAvailable: true,
      isDineInAvailable: true,
      specialInstructions: ""
    })
    toast.success("Festival added successfully")
  }

  const handleEditFestival = () => {
    if (!selectedFestival) return

    const updatedFestival = {
      ...selectedFestival,
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    }

    setFestivals(prev => prev.map(festival => 
      festival.id === selectedFestival.id ? updatedFestival : festival
    ))
    setIsEditDialogOpen(false)
    setSelectedFestival(null)
    setFormData({
      name: "",
      nameSinhala: "",
      nameTamil: "",
      startDate: "",
      endDate: "",
      description: "",
      pricingMultiplier: 1.0,
      isDeliveryAvailable: true,
      isDineInAvailable: true,
      specialInstructions: ""
    })
    toast.success("Festival updated successfully")
  }

  const handleDeleteFestival = (id: string) => {
    setFestivals(prev => prev.filter(festival => festival.id !== id))
    toast.success("Festival deleted successfully")
  }

  const openEditDialog = (festival: any) => {
    setSelectedFestival(festival)
    setFormData({
      name: festival.name,
      nameSinhala: festival.nameSinhala,
      nameTamil: festival.nameTamil,
      startDate: festival.startDate.toISOString().split('T')[0],
      endDate: festival.endDate.toISOString().split('T')[0],
      description: festival.description,
      pricingMultiplier: festival.pricingMultiplier,
      isDeliveryAvailable: festival.isDeliveryAvailable,
      isDineInAvailable: festival.isDineInAvailable,
      specialInstructions: festival.specialInstructions
    })
    setIsEditDialogOpen(true)
  }

  const getStatusBadge = (festival: any) => {
    const today = new Date()
    const isActive = festival.isActive && 
                    today >= festival.startDate && 
                    today <= festival.endDate

    if (isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    } else if (festival.startDate > today) {
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Past</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Festival Management</h1>
          <p className="text-muted-foreground">
            Manage special festival menus and pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Festival
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Festival</DialogTitle>
              <DialogDescription>
                Create a new festival with special menu and pricing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="nameSinhala">Name (Sinhala)</Label>
                  <Input
                    id="nameSinhala"
                    value={formData.nameSinhala}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameSinhala: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="nameTamil">Name (Tamil)</Label>
                <Input
                  id="nameTamil"
                  value={formData.nameTamil}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameTamil: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricingMultiplier">Pricing Multiplier</Label>
                  <Input
                    id="pricingMultiplier"
                    type="number"
                    step="0.1"
                    min="1.0"
                    value={formData.pricingMultiplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricingMultiplier: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="delivery"
                        checked={formData.isDeliveryAvailable}
                        onChange={(e) => setFormData(prev => ({ ...prev, isDeliveryAvailable: e.target.checked }))}
                      />
                      <Label htmlFor="delivery">Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="dineIn"
                        checked={formData.isDineInAvailable}
                        onChange={(e) => setFormData(prev => ({ ...prev, isDineInAvailable: e.target.checked }))}
                      />
                      <Label htmlFor="dineIn">Dine-in</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleAddFestival}>
                Add Festival
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Festivals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFestivals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Festivals</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeFestivals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Festivals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingFestivals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Festival</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {currentFestival ? currentFestival.name : "None"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Festival Banner */}
      {currentFestival && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Star className="h-5 w-5" />
              Current Festival: {currentFestival.name}
            </CardTitle>
            <CardDescription className="text-green-700">
              {currentFestival.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-semibold">Pricing Multiplier</div>
                <div className="text-lg font-bold">{currentFestival.pricingMultiplier}x</div>
              </div>
              <div>
                <div className="font-semibold">Special Menu Items</div>
                <div className="text-lg font-bold">{currentFestival.specialMenuItems.length}</div>
              </div>
              <div>
                <div className="font-semibold">Delivery</div>
                <div className="text-lg font-bold">
                  {currentFestival.isDeliveryAvailable ? "Available" : "Unavailable"}
                </div>
              </div>
              <div>
                <div className="font-semibold">Dine-in</div>
                <div className="text-lg font-bold">
                  {currentFestival.isDineInAvailable ? "Available" : "Unavailable"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Festivals List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Festivals ({festivals.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingFestivals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {festivals.map((festival) => (
              <Card key={festival.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {festival.name}
                        {getStatusBadge(festival)}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {festival.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(festival)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFestival(festival.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {festival.startDate.toLocaleDateString()} - {festival.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Pricing: {festival.pricingMultiplier}x</div>
                    <div>Menu Items: {festival.specialMenuItems.length}</div>
                    <div>Delivery: {festival.isDeliveryAvailable ? "Yes" : "No"}</div>
                    <div>Dine-in: {festival.isDineInAvailable ? "Yes" : "No"}</div>
                  </div>
                  {festival.specialInstructions && (
                    <div className="text-sm text-muted-foreground">
                      <div className="font-semibold">Special Instructions:</div>
                      <div>{festival.specialInstructions}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFestivals.map((festival) => (
              <Card key={festival.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {festival.name}
                        <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {festival.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(festival)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {festival.startDate.toLocaleDateString()} - {festival.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Pricing: {festival.pricingMultiplier}x</div>
                    <div>Menu Items: {festival.specialMenuItems.length}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Festival</DialogTitle>
            <DialogDescription>
              Update festival information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name (English)</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-nameSinhala">Name (Sinhala)</Label>
                <Input
                  id="edit-nameSinhala"
                  value={formData.nameSinhala}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameSinhala: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-nameTamil">Name (Tamil)</Label>
              <Input
                id="edit-nameTamil"
                value={formData.nameTamil}
                onChange={(e) => setFormData(prev => ({ ...prev, nameTamil: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pricingMultiplier">Pricing Multiplier</Label>
                <Input
                  id="edit-pricingMultiplier"
                  type="number"
                  step="0.1"
                  min="1.0"
                  value={formData.pricingMultiplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricingMultiplier: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-delivery"
                      checked={formData.isDeliveryAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDeliveryAvailable: e.target.checked }))}
                    />
                    <Label htmlFor="edit-delivery">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-dineIn"
                      checked={formData.isDineInAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDineInAvailable: e.target.checked }))}
                    />
                    <Label htmlFor="edit-dineIn">Dine-in</Label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-specialInstructions">Special Instructions</Label>
              <Textarea
                id="edit-specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditFestival}>
              Update Festival
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
