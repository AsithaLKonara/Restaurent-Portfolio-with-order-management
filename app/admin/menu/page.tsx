"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  costPrice: number
  image: string
  category: string
  available: boolean
  ingredients: string[]
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Chicken Kottu Roti",
    description: "Traditional stir-fried bread with chicken, vegetables, and aromatic spices",
    price: 18.99,
    costPrice: 8.5,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mains",
    available: true,
    ingredients: ["Roti bread", "Chicken", "Vegetables", "Spices", "Eggs"],
  },
  {
    id: "2",
    name: "Fish Curry",
    description: "Fresh fish cooked in coconut milk with traditional Sri Lankan spices",
    price: 22.99,
    costPrice: 12.0,
    image: "/placeholder.svg?height=200&width=300",
    category: "Mains",
    available: true,
    ingredients: ["Fresh fish", "Coconut milk", "Curry leaves", "Spices", "Onions"],
  },
  {
    id: "3",
    name: "Hoppers (Set of 3)",
    description: "Traditional bowl-shaped pancakes made from fermented rice flour",
    price: 12.99,
    costPrice: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    category: "Starters",
    available: true,
    ingredients: ["Rice flour", "Coconut milk", "Yeast", "Sugar", "Salt"],
  },
]

const categories = ["Starters", "Mains", "Sides", "Drinks", "Desserts"]

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    costPrice: 0,
    category: "Mains",
    available: true,
    ingredients: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingItem) {
      // Update existing item
      setMenuItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? ({ ...item, ...formData } as MenuItem) : item)),
      )
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.name || "",
        description: formData.description || "",
        price: formData.price || 0,
        costPrice: formData.costPrice || 0,
        image: "/placeholder.svg?height=200&width=300&query=" + encodeURIComponent(formData.name || "food"),
        category: formData.category || "Mains",
        available: formData.available ?? true,
        ingredients: formData.ingredients || [],
      }
      setMenuItems((prev) => [...prev, newItem])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      costPrice: 0,
      category: "Mains",
      available: true,
      ingredients: [],
    })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const handleIngredientsChange = (value: string) => {
    const ingredients = value
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing)
    setFormData((prev) => ({ ...prev, ingredients }))
  }

  const getProfitMargin = (price: number, costPrice: number) => {
    return (((price - costPrice) / price) * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage your restaurant menu items</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus size={16} className="mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the menu item details" : "Create a new menu item for your restaurant"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($) *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, costPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                    required
                  />
                </div>
              </div>

              {formData.price && formData.costPrice && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Profit Margin:</strong> {getProfitMargin(formData.price, formData.costPrice)}% (
                    {(formData.price - formData.costPrice).toFixed(2)} profit per item)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <Input
                  id="ingredients"
                  value={formData.ingredients?.join(", ")}
                  onChange={(e) => handleIngredientsChange(e.target.value)}
                  placeholder="Rice, Chicken, Spices, Vegetables"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked }))}
                />
                <Label htmlFor="available">Available for ordering</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? "Update Item" : "Add Item"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
            <CardContent className="p-0">
              <div className="flex">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-l-lg">
                      <Badge variant="destructive">Unavailable</Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        Cost: ${item.costPrice.toFixed(2)} • Margin: {getProfitMargin(item.price, item.costPrice)}%
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                  {item.ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.slice(0, 3).map((ingredient, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                        {item.ingredients.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.ingredients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleAvailability(item.id)}>
                        {item.available ? <EyeOff size={16} /> : <Eye size={16} />}
                        {item.available ? "Hide" : "Show"}
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No menu items yet. Add your first menu item to get started.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Menu Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
