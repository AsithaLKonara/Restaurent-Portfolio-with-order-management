import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const analyticsQuerySchema = z.object({
  restaurantId: z.string(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  type: z.enum(["sales", "inventory", "customers", "peak-hours", "revenue-projection"])
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const type = searchParams.get("type")

    if (!restaurantId || !startDate || !endDate || !type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const queryData = analyticsQuerySchema.parse({
      restaurantId,
      startDate,
      endDate,
      type
    })

    let analyticsData: any

    switch (type) {
      case "sales":
        analyticsData = await getSalesAnalytics(queryData)
        break
      case "inventory":
        analyticsData = await getInventoryAnalytics(queryData)
        break
      case "customers":
        analyticsData = await getCustomerAnalytics(queryData)
        break
      case "peak-hours":
        analyticsData = await getPeakHoursAnalytics(queryData)
        break
      case "revenue-projection":
        analyticsData = await getRevenueProjection(queryData)
        break
      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        )
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

async function getSalesAnalytics({ restaurantId, startDate, endDate }: any) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Get orders in date range
  const orders = await prisma.order.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: start,
        lte: end
      },
      status: {
        not: "CANCELLED"
      }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    }
  })

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  // Get top selling items
  const itemSales: { [key: string]: number } = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      const itemName = item.menuItem.name
      itemSales[itemName] = (itemSales[itemName] || 0) + item.quantity
    })
  })

  const topItems = Object.entries(itemSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, quantity]) => ({ name, quantity }))

  // Revenue by day
  const revenueByDay: { [key: string]: number } = {}
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0]
    revenueByDay[date] = (revenueByDay[date] || 0) + order.total
  })

  const revenueByDayArray = Object.entries(revenueByDay)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalRevenue,
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    topItems,
    revenueByDay: revenueByDayArray
  }
}

async function getInventoryAnalytics({ restaurantId }: any) {
  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId }
  })

  // Mock inventory data (in real app, this would come from inventory management system)
  const inventoryData = menuItems.map(item => ({
    name: item.name,
    currentStock: Math.floor(Math.random() * 50) + 10,
    reorderPoint: 20,
    cost: item.price * 0.3, // Assume 30% cost
    wastage: Math.floor(Math.random() * 5)
  }))

  const lowStockItems = inventoryData
    .filter(item => item.currentStock <= item.reorderPoint)
    .map(item => ({
      name: item.name,
      currentStock: item.currentStock,
      reorderPoint: item.reorderPoint
    }))

  const stockValue = inventoryData.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  const totalWastage = inventoryData.reduce((sum, item) => sum + item.wastage, 0)
  const totalStock = inventoryData.reduce((sum, item) => sum + item.currentStock, 0)
  const wastagePercentage = totalStock > 0 ? (totalWastage / totalStock) * 100 : 0

  return {
    lowStockItems,
    stockValue,
    turnoverRate: 12, // Mock turnover rate
    wastagePercentage
  }
}

async function getCustomerAnalytics({ restaurantId, startDate, endDate }: any) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Get unique customers
  const customers = await prisma.order.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: start,
        lte: end
      }
    },
    select: {
      customerEmail: true,
      customerName: true,
      total: true,
      createdAt: true
    }
  })

  const customerMap = new Map()
  customers.forEach(order => {
    const email = order.customerEmail
    if (email) {
      if (!customerMap.has(email)) {
        customerMap.set(email, {
          name: order.customerName,
          email,
          totalSpent: 0,
          orderCount: 0,
          firstOrder: order.createdAt,
          lastOrder: order.createdAt
        })
      }
      const customer = customerMap.get(email)
      customer.totalSpent += order.total
      customer.orderCount += 1
      customer.lastOrder = order.createdAt
    }
  })

  const customerArray = Array.from(customerMap.values())
  const totalCustomers = customerArray.length
  const newCustomers = customerArray.filter(c => 
    c.firstOrder >= start && c.firstOrder <= end
  ).length

  const topCustomers = customerArray
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)

  return {
    totalCustomers,
    newCustomers,
    repeatCustomers: totalCustomers - newCustomers,
    averageCustomerValue: totalCustomers > 0 ? 
      customerArray.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers : 0,
    topCustomers
  }
}

async function getPeakHoursAnalytics({ restaurantId, startDate, endDate }: any) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const orders = await prisma.order.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: start,
        lte: end
      }
    },
    select: {
      createdAt: true
    }
  })

  // Group orders by hour
  const ordersByHour: { [key: number]: number } = {}
  orders.forEach(order => {
    const hour = order.createdAt.getHours()
    ordersByHour[hour] = (ordersByHour[hour] || 0) + 1
  })

  const peakHours = Object.entries(ordersByHour)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    peakHours,
    totalOrders: orders.length
  }
}

async function getRevenueProjection({ restaurantId }: any) {
  // Get last 30 days of data
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000))

  const orders = await prisma.order.findMany({
    where: {
      restaurantId,
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      status: {
        not: "CANCELLED"
      }
    },
    select: {
      total: true,
      createdAt: true
    }
  })

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const averageDailyRevenue = totalRevenue / 30

  // Project next 30 days
  const projectedRevenue = averageDailyRevenue * 30

  return {
    currentMonthRevenue: totalRevenue,
    averageDailyRevenue,
    projectedRevenue,
    growthRate: 0.15 // Mock 15% growth rate
  }
}
