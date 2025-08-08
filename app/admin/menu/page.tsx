"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Star, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { getTranslation, getCurrentLanguage } from "@/lib/i18n"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  isVegetarian: boolean
  isSpicy: boolean
  allergens: string[]
  preparationTime: number
  popularity: number
  cost: number
  profitMargin: number
}

const categories = ["Starters", "Mains", "Sides", "Drinks", "Desserts"]
const allergens = ["Gluten", "Dairy", "Nuts", "Seafood", "Eggs", "Soy"]

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    allergens: [] as string[],
    preparationTime: 15,
    cost: 0
  })

  const lang = getCurrentLanguage()
  const t = (key: string) => getTranslation(lang, key)

  useEffect(() => {
    // Load mock menu items
    const mockItems: MenuItem[] = [
  {
    id: "1",
    name: "Chicken Kottu Roti",
    description: "Traditional stir-fried bread with chicken, vegetables, and aromatic spices",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mains",
        isAvailable: true,
        isVegetarian: false,
        isSpicy: true,
        allergens: ["Gluten"],
        preparationTime: 20,
        popularity: 95,
        cost: 8.50,
        profitMargin: 55.2
  },
  {
    id: "2",
    name: "Fish Curry",
    description: "Fresh fish cooked in coconut milk with traditional Sri Lankan spices",
    price: 22.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mains",
        isAvailable: true,
        isVegetarian: false,
        isSpicy: true,
        allergens: ["Seafood"],
        preparationTime: 25,
        popularity: 88,
        cost: 12.00,
        profitMargin: 47.8
  },
  {
    id: "3",
    name: "Hoppers (Set of 3)",
    description: "Traditional bowl-shaped pancakes made from fermented rice flour",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Starters",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["Gluten"],
        preparationTime: 15,
        popularity: 92,
        cost: 4.50,
        profitMargin: 65.4
      },
      {
        id: "4",
        name: "Pol Sambol",
        description: "Spicy coconut relish with chili, onions, and lime",
        price: 8.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "Sides",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: true,
        allergens: ["Nuts"],
        preparationTime: 10,
        popularity: 78,
        cost: 2.50,
        profitMargin: 72.2
      },
      {
        id: "5",
        name: "Ceylon Tea",
        description: "Premium black tea from the highlands of Sri Lanka",
        price: 4.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "Drinks",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: [],
        preparationTime: 5,
        popularity: 85,
        cost: 1.20,
        profitMargin: 75.9
      },
      {
        id: "6",
        name: "Watalappan",
        description: "Traditional coconut custard pudding with jaggery and spices",
        price: 9.99,
        image: "/placeholder.svg?height=200&width=300",
        category: "Desserts",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["Dairy", "Eggs"],
        preparationTime: 30,
        popularity: 82,
        cost: 3.50,
        profitMargin: 65.0
      }
    ]
    setMenuItems(mockItems)
  }, [])

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleAddItem = () => {
      const newItem: MenuItem = {
        id: Date.now().toString(),
      ...formData,
      popularity: Math.floor(Math.random() * 100),
      profitMargin: ((formData.price - formData.cost) / formData.price) * 100
    }
    setMenuItems((prev: MenuItem[]) => [...prev, newItem])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
      allergens: item.allergens,
      preparationTime: item.preparationTime,
      cost: item.cost
    })
  }

  const handleUpdateItem = () => {
    if (!editingItem) return

    const updatedItem: MenuItem = {
      ...editingItem,
      ...formData,
      profitMargin: ((formData.price - formData.cost) / formData.price) * 100
    }

    setMenuItems((prev: MenuItem[]) => prev.map((item: MenuItem) => 
      item.id === editingItem.id ? updatedItem : item
    ))
    resetForm()
    setEditingItem(null)
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems((prev: MenuItem[]) => prev.filter((item: MenuItem) => item.id !== id))
    }
  }

  const handleToggleAvailability = (id: string) => {
    setMenuItems((prev: MenuItem[]) => prev.map((item: MenuItem) => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      isAvailable: true,
      isVegetarian: false,
      isSpicy: false,
      allergens: [],
      preparationTime: 15,
      cost: 0
    })
  }

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 70) return "text-green-600"
    if (margin >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "text-green-600"
    if (popularity >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
          <p className="text-muted-foreground">Manage your menu items, pricing, and availability</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Create a new menu item with all necessary details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (LKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (LKR) *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allergens</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allergens.map(allergen => (
                      <div key={allergen} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={allergen}
                          checked={formData.allergens.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, allergens: [...prev.allergens, allergen] }))
                            } else {
                              setFormData(prev => ({ ...prev, allergens: prev.allergens.filter(a => a !== allergen) }))
                            }
                          }}
                        />
                        <Label htmlFor={allergen} className="text-sm">{allergen}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vegetarian"
                      checked={formData.isVegetarian}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegetarian: checked }))}
                    />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="spicy"
                      checked={formData.isSpicy}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSpicy: checked }))}
                    />
                    <Label htmlFor="spicy">Spicy</Label>
                  </div>
                </div>
              </div>
            </div>
              <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          onClick={() => setSelectedCategory("All")}
        >
          All Items
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
                  <Image
                src={item.image}
                    alt={item.name}
                    fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleToggleAvailability(item.id)}
                >
                  {item.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Unavailable</Badge>
                    </div>
                  )}
                </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="text-right">
                  <div className="text-lg font-bold">LKR {item.price.toFixed(2)}</div>
                  <div className={`text-sm ${getProfitMarginColor(item.profitMargin)}`}>
                    {item.profitMargin.toFixed(1)}% margin
                  </div>
                      </div>
                    </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className={`h-4 w-4 ${getPopularityColor(item.popularity)}`} />
                  <span className={`text-sm ${getPopularityColor(item.popularity)}`}>
                    {item.popularity}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.isVegetarian && <Badge variant="secondary">Vegetarian</Badge>}
                {item.isSpicy && <Badge variant="secondary">Spicy</Badge>}
                {item.allergens.map(allergen => (
                  <Badge key={allergen} variant="outline" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Prep: {item.preparationTime} min</span>
                <span>Cost: LKR {item.cost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the menu item details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (LKR) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Cost (LKR) *</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prepTime">Prep Time (min)</Label>
                  <Input
                    id="edit-prepTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allergens</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allergens.map(allergen => (
                      <div key={allergen} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-${allergen}`}
                          checked={formData.allergens.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, allergens: [...prev.allergens, allergen] }))
                            } else {
                              setFormData(prev => ({ ...prev, allergens: prev.allergens.filter(a => a !== allergen) }))
                            }
                          }}
                        />
                        <Label htmlFor={`edit-${allergen}`} className="text-sm">{allergen}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-available"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                    />
                    <Label htmlFor="edit-available">Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-vegetarian"
                      checked={formData.isVegetarian}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegetarian: checked }))}
                    />
                    <Label htmlFor="edit-vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-spicy"
                      checked={formData.isSpicy}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSpicy: checked }))}
                    />
                    <Label htmlFor="edit-spicy">Spicy</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateItem}>
                Update Item
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
