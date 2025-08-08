"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Users, UserPlus } from "lucide-react"

interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved"
  assignedStaff?: string
}

interface Staff {
  id: string
  name: string
  email: string
  role: "waiter" | "kitchen" | "admin"
  active: boolean
}

const initialTables: Table[] = [
  { id: "1", number: 1, capacity: 2, status: "available" },
  { id: "2", number: 2, capacity: 4, status: "occupied", assignedStaff: "john-doe" },
  { id: "3", number: 3, capacity: 6, status: "available" },
  { id: "4", number: 4, capacity: 2, status: "reserved", assignedStaff: "jane-smith" },
  { id: "5", number: 5, capacity: 4, status: "available" },
]

const initialStaff: Staff[] = [
  { id: "john-doe", name: "John Doe", email: "john@spicegarden.com", role: "waiter", active: true },
  { id: "jane-smith", name: "Jane Smith", email: "jane@spicegarden.com", role: "waiter", active: true },
  { id: "mike-chef", name: "Mike Johnson", email: "mike@spicegarden.com", role: "kitchen", active: true },
]

export default function TablesStaffPage() {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [staff, setStaff] = useState<Staff[]>(initialStaff)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const [tableForm, setTableForm] = useState({
    number: 0,
    capacity: 2,
    status: "available" as Table["status"],
    assignedStaff: "",
  })

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    role: "waiter" as Staff["role"],
  })

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTable) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === editingTable.id
            ? { ...table, ...tableForm, assignedStaff: tableForm.assignedStaff || undefined }
            : table,
        ),
      )
    } else {
      const newTable: Table = {
        id: Date.now().toString(),
        number: tableForm.number,
        capacity: tableForm.capacity,
        status: tableForm.status,
        assignedStaff: tableForm.assignedStaff || undefined,
      }
      setTables((prev) => [...prev, newTable])
    }

    resetTableForm()
  }

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingStaff) {
      setStaff((prev) => prev.map((member) => (member.id === editingStaff.id ? { ...member, ...staffForm } : member)))
    } else {
      const newStaff: Staff = {
        id: Date.now().toString(),
        name: staffForm.name,
        email: staffForm.email,
        role: staffForm.role,
        active: true,
      }
      setStaff((prev) => [...prev, newStaff])
    }

    resetStaffForm()
  }

  const resetTableForm = () => {
    setTableForm({
      number: 0,
      capacity: 2,
      status: "available",
      assignedStaff: "",
    })
    setEditingTable(null)
    setIsTableDialogOpen(false)
  }

  const resetStaffForm = () => {
    setStaffForm({
      name: "",
      email: "",
      role: "waiter",
    })
    setEditingStaff(null)
    setIsStaffDialogOpen(false)
  }

  const handleEditTable = (table: Table) => {
    setEditingTable(table)
    setTableForm({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
      assignedStaff: table.assignedStaff || "",
    })
    setIsTableDialogOpen(true)
  }

  const handleEditStaff = (member: Staff) => {
    setEditingStaff(member)
    setStaffForm({
      name: member.name,
      email: member.email,
      role: member.role,
    })
    setIsStaffDialogOpen(true)
  }

  const handleDeleteTable = (id: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      setTables((prev) => prev.filter((table) => table.id !== id))
    }
  }

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaff((prev) => prev.filter((member) => member.id !== id))
    }
  }

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) => prev.map((member) => (member.id === id ? { ...member, active: !member.active } : member)))
  }

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "default"
      case "occupied":
        return "destructive"
      case "reserved":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: Staff["role"]) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "kitchen":
        return "secondary"
      case "waiter":
        return "default"
      default:
        return "outline"
    }
  }

  const getStaffName = (staffId: string) => {
    const member = staff.find((s) => s.id === staffId)
    return member ? member.name : "Unassigned"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tables & Staff</h2>
        <p className="text-muted-foreground">Manage your restaurant tables and staff assignments</p>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Table Management</h3>

            <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetTableForm()}>
                  <Plus size={16} className="mr-2" />
                  Add Table
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTable ? "Edit Table" : "Add New Table"}</DialogTitle>
                  <DialogDescription>
                    {editingTable ? "Update table information" : "Create a new table for your restaurant"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleTableSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tableNumber">Table Number</Label>
                      <Input
                        id="tableNumber"
                        type="number"
                        value={tableForm.number}
                        onChange={(e) =>
                          setTableForm((prev) => ({ ...prev, number: Number.parseInt(e.target.value) || 0 }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={tableForm.capacity}
                        onChange={(e) =>
                          setTableForm((prev) => ({ ...prev, capacity: Number.parseInt(e.target.value) || 2 }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={tableForm.status}
                      onValueChange={(value: Table["status"]) => setTableForm((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedStaff">Assigned Staff</Label>
                    <Select
                      value={tableForm.assignedStaff || "unassigned"}
                      onValueChange={(value) => setTableForm((prev) => ({ ...prev, assignedStaff: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staff
                          .filter((s) => s.role === "waiter" && s.active)
                          .map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetTableForm}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingTable ? "Update Table" : "Add Table"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <Card key={table.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Table {table.number}</CardTitle>
                    <Badge variant={getStatusColor(table.status)}>{table.status}</Badge>
                  </div>
                  <CardDescription>Capacity: {table.capacity} people</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Assigned Staff:</strong> {getStaffName(table.assignedStaff || "")}
                    </p>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTable(table)}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTable(table.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Staff Management</h3>

            <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetStaffForm()}>
                  <UserPlus size={16} className="mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
                  <DialogDescription>
                    {editingStaff ? "Update staff member information" : "Add a new team member"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffName">Full Name</Label>
                    <Input
                      id="staffName"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staffEmail">Email</Label>
                    <Input
                      id="staffEmail"
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staffRole">Role</Label>
                    <Select
                      value={staffForm.role}
                      onValueChange={(value: Staff["role"]) => setStaffForm((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiter">Waiter</SelectItem>
                        <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetStaffForm}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingStaff ? "Update Staff" : "Add Staff"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {staff.map((member) => (
              <Card key={member.id} className={!member.active ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <Users className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getRoleColor(member.role)}>{member.role}</Badge>
                          <Badge variant={member.active ? "default" : "secondary"}>
                            {member.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleStaffStatus(member.id)}>
                        {member.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditStaff(member)}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
