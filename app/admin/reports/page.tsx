"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, AlertTriangle } from "lucide-react"

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
  status: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [timeRange, setTimeRange] = useState("7days")
  const [salesData, setSalesData] = useState<any[]>([])
  const [topItems, setTopItems] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(storedOrders)

    // Process data for charts
    processSalesData(storedOrders)
    processTopItems(storedOrders)
    processCategoryData(storedOrders)
  }, [timeRange])

  const processSalesData = (orders: Order[]) => {
    const now = new Date()
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90

    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayOrders = orders.filter((order) => order.timestamp.split("T")[0] === dateStr)

      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
      const orderCount = dayOrders.length

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: revenue,
        orders: orderCount,
      })
    }

    setSalesData(data)
  }

  const processTopItems = (orders: Order[]) => {
    const itemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 }
        }
        itemCounts[item.id].count += item.quantity
        itemCounts[item.id].revenue += item.price * item.quantity
      })
    })

    const sortedItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setTopItems(sortedItems)
  }

  const processCategoryData = (orders: Order[]) => {
    const categories = ["Starters", "Mains", "Sides", "Drinks", "Desserts"]
    const categoryRevenue: { [key: string]: number } = {}

    // Initialize categories
    categories.forEach((cat) => (categoryRevenue[cat] = 0))

    // This is simplified - in a real app, you'd have category info for each item
    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Simulate category assignment based on item name
        let category = "Mains"
        if (item.name.toLowerCase().includes("hopper") || item.name.toLowerCase().includes("sambol")) {
          category = "Starters"
        } else if (item.name.toLowerCase().includes("tea") || item.name.toLowerCase().includes("drink")) {
          category = "Drinks"
        } else if (item.name.toLowerCase().includes("dessert") || item.name.toLowerCase().includes("watalappan")) {
          category = "Desserts"
        }

        categoryRevenue[category] += item.price * item.quantity
      })
    })

    const data = Object.entries(categoryRevenue)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)

    setCategoryData(data)
  }

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  const getTotalOrders = () => {
    return orders.length
  }

  const getAverageOrderValue = () => {
    return orders.length > 0 ? getTotalRevenue() / getTotalOrders() : 0
  }

  const getRevenueGrowth = () => {
    // Simplified growth calculation
    return 12.5 // This would be calculated based on historical data
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Track your restaurant's performance and insights</p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalRevenue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{getRevenueGrowth()}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalOrders()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getAverageOrderValue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +3.2% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="items">Top Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Daily revenue and order count over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>Most popular menu items by quantity sold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.count} sold • ${item.revenue.toFixed(2)} revenue
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.count} units</p>
                    </div>
                  </div>
                ))}

                {topItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No sales data available yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Breakdown of sales by menu category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
