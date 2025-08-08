"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Globe } from "lucide-react"
import { toast } from "sonner"

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  isActive: boolean
  openingHours: string
  deliveryRadius: number
  createdAt: Date
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    openingHours: "",
    deliveryRadius: 5
  })

  // Mock data
  useEffect(() => {
    setBranches([
      {
        id: "1",
        name: "Spice Garden - Colombo",
        address: "123 Galle Road, Colombo 03",
        phone: "+94 11 234 5678",
        email: "colombo@spicegarden.lk",
        manager: "Kamal Perera",
        isActive: true,
        openingHours: "10:00 AM - 10:00 PM",
        deliveryRadius: 5,
        createdAt: new Date("2024-01-15")
      },
      {
        id: "2",
        name: "Spice Garden - Kandy",
        address: "456 Peradeniya Road, Kandy",
        phone: "+94 81 234 5678",
        email: "kandy@spicegarden.lk",
        manager: "Nimal Silva",
        isActive: true,
        openingHours: "11:00 AM - 11:00 PM",
        deliveryRadius: 3,
        createdAt: new Date("2024-02-20")
      },
      {
        id: "3",
        name: "Spice Garden - Galle",
        address: "789 Marine Drive, Galle",
        phone: "+94 91 234 5678",
        email: "galle@spicegarden.lk",
        manager: "Sunil Fernando",
        isActive: false,
        openingHours: "10:00 AM - 9:00 PM",
        deliveryRadius: 4,
        createdAt: new Date("2024-03-10")
      }
    ])
  }, [])

  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
      createdAt: new Date()
    }
    setBranches(prev => [...prev, newBranch])
    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      manager: "",
      openingHours: "",
      deliveryRadius: 5
    })
    toast.success("Branch added successfully")
  }

  const handleEditBranch = () => {
    if (!editingBranch) return
    setBranches(prev => prev.map(branch => 
      branch.id === editingBranch.id ? { ...editingBranch, ...formData } : branch
    ))
    setIsEditDialogOpen(false)
    setEditingBranch(null)
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      manager: "",
      openingHours: "",
      deliveryRadius: 5
    })
    toast.success("Branch updated successfully")
  }

  const handleDeleteBranch = (id: string) => {
    setBranches(prev => prev.filter(branch => branch.id !== id))
    toast.success("Branch deleted successfully")
  }

  const handleToggleStatus = (id: string) => {
    setBranches(prev => prev.map(branch => 
      branch.id === id ? { ...branch, isActive: !branch.isActive } : branch
    ))
    toast.success("Branch status updated")
  }

  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      openingHours: branch.openingHours,
      deliveryRadius: branch.deliveryRadius
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground">
            Manage multiple restaurant branches and their operations
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Create a new restaurant branch with all necessary details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">
                  Manager
                </Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="openingHours" className="text-right">
                  Hours
                </Label>
                <Input
                  id="openingHours"
                  value={formData.openingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                  className="col-span-3"
                  placeholder="10:00 AM - 10:00 PM"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryRadius" className="text-right">
                  Delivery Radius (km)
                </Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleAddBranch}>
                Add Branch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card key={branch.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {branch.name}
                    <Badge variant={branch.isActive ? "default" : "secondary"}>
                      {branch.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {branch.address}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(branch)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBranch(branch.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>{branch.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>Manager: {branch.manager}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Hours: {branch.openingHours}</div>
                <div>Delivery Radius: {branch.deliveryRadius} km</div>
                <div>Created: {branch.createdAt.toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(branch.id)}
                >
                  {branch.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm">
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Update branch information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-manager" className="text-right">
                Manager
              </Label>
              <Input
                id="edit-manager"
                value={formData.manager}
                onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-openingHours" className="text-right">
                Hours
              </Label>
              <Input
                id="edit-openingHours"
                value={formData.openingHours}
                onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deliveryRadius" className="text-right">
                Delivery Radius (km)
              </Label>
              <Input
                id="edit-deliveryRadius"
                type="number"
                value={formData.deliveryRadius}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditBranch}>
              Update Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
