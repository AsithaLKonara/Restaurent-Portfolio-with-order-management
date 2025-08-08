import { prisma } from './prisma'

export interface SalesAnalytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topSellingItems: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
    orders: number
  }>
  revenueByHour: Array<{
    hour: number
    revenue: number
    orders: number
  }>
}

export interface InventoryAnalytics {
  lowStockItems: Array<{
    name: string
    currentStock: number
    reorderPoint: number
  }>
  stockValue: number
  turnoverRate: number
  wastagePercentage: number
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  repeatCustomers: number
  averageCustomerValue: number
  customerRetentionRate: number
  topCustomers: Array<{
    name: string
    totalSpent: number
    orderCount: number
  }>
}

export interface PeakHoursAnalytics {
  peakHours: Array<{
    hour: number
    orderCount: number
    revenue: number
  }>
  peakDays: Array<{
    day: string
    orderCount: number
    revenue: number
  }>
}

export async function getSalesAnalytics(restaurantId: string, startDate: Date, endDate: Date): Promise<SalesAnalytics> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: {
          not: 'CANCELLED'
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

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate top selling items
    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>()
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.menuItem.name
        const existing = itemSales.get(key)
        if (existing) {
          existing.quantity += item.quantity
          existing.revenue += item.price * item.quantity
        } else {
          itemSales.set(key, {
            name: key,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          })
        }
      })
    })

    const topSellingItems = Array.from(itemSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // Calculate revenue by day
    const revenueByDay = new Map<string, { revenue: number; orders: number }>()
    
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      const existing = revenueByDay.get(date)
      if (existing) {
        existing.revenue += order.total
        existing.orders += 1
      } else {
        revenueByDay.set(date, { revenue: order.total, orders: 1 })
      }
    })

    const revenueByDayArray = Array.from(revenueByDay.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    })).sort((a, b) => a.date.localeCompare(b.date))

    // Calculate revenue by hour
    const revenueByHour = new Map<number, { revenue: number; orders: number }>()
    
    orders.forEach(order => {
      const hour = order.createdAt.getHours()
      const existing = revenueByHour.get(hour)
      if (existing) {
        existing.revenue += order.total
        existing.orders += 1
      } else {
        revenueByHour.set(hour, { revenue: order.total, orders: 1 })
      }
    })

    const revenueByHourArray = Array.from(revenueByHour.entries()).map(([hour, data]) => ({
      hour,
      revenue: data.revenue,
      orders: data.orders
    })).sort((a, b) => a.hour - b.hour)

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topSellingItems,
      revenueByDay: revenueByDayArray,
      revenueByHour: revenueByHourArray
    }
  } catch (error) {
    console.error('Error getting sales analytics:', error)
    throw error
  }
}

export async function getInventoryAnalytics(restaurantId: string): Promise<InventoryAnalytics> {
  try {
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

    // Mock turnover rate (in real app, this would be calculated from actual usage data)
    const turnoverRate = 12 // 12 times per year

    return {
      lowStockItems,
      stockValue,
      turnoverRate,
      wastagePercentage
    }
  } catch (error) {
    console.error('Error getting inventory analytics:', error)
    throw error
  }
}

export async function getCustomerAnalytics(restaurantId: string, startDate: Date, endDate: Date): Promise<CustomerAnalytics> {
  try {
    const customers = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            restaurantId,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      },
      include: {
        orders: {
          where: {
            restaurantId,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      }
    })

    const totalCustomers = customers.length
    const newCustomers = customers.filter(customer => {
      const firstOrder = customer.orders[0]
      return firstOrder && firstOrder.createdAt >= startDate
    }).length

    const repeatCustomers = customers.filter(customer => customer.orders.length > 1).length
    const totalRevenue = customers.reduce((sum, customer) => 
      sum + customer.orders.reduce((orderSum, order) => orderSum + order.total, 0), 0
    )
    const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
    const customerRetentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0

    const topCustomers = customers
      .map(customer => ({
        name: customer.name,
        totalSpent: customer.orders.reduce((sum, order) => sum + order.total, 0),
        orderCount: customer.orders.length
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    return {
      totalCustomers,
      newCustomers,
      repeatCustomers,
      averageCustomerValue,
      customerRetentionRate,
      topCustomers
    }
  } catch (error) {
    console.error('Error getting customer analytics:', error)
    throw error
  }
}

export async function getPeakHoursAnalytics(restaurantId: string, startDate: Date, endDate: Date): Promise<PeakHoursAnalytics> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Calculate peak hours
    const hourlyData = new Map<number, { orderCount: number; revenue: number }>()
    
    orders.forEach(order => {
      const hour = order.createdAt.getHours()
      const existing = hourlyData.get(hour)
      if (existing) {
        existing.orderCount += 1
        existing.revenue += order.total
      } else {
        hourlyData.set(hour, { orderCount: 1, revenue: order.total })
      }
    })

    const peakHours = Array.from(hourlyData.entries()).map(([hour, data]) => ({
      hour,
      orderCount: data.orderCount,
      revenue: data.revenue
    })).sort((a, b) => b.orderCount - a.orderCount)

    // Calculate peak days
    const dailyData = new Map<string, { orderCount: number; revenue: number }>()
    
    orders.forEach(order => {
      const day = order.createdAt.toLocaleDateString('en-US', { weekday: 'long' })
      const existing = dailyData.get(day)
      if (existing) {
        existing.orderCount += 1
        existing.revenue += order.total
      } else {
        dailyData.set(day, { orderCount: 1, revenue: order.total })
      }
    })

    const peakDays = Array.from(dailyData.entries()).map(([day, data]) => ({
      day,
      orderCount: data.orderCount,
      revenue: data.revenue
    })).sort((a, b) => b.orderCount - a.orderCount)

    return {
      peakHours,
      peakDays
    }
  } catch (error) {
    console.error('Error getting peak hours analytics:', error)
    throw error
  }
}

export async function generateBusinessReport(restaurantId: string, startDate: Date, endDate: Date) {
  try {
    const [sales, inventory, customers, peakHours] = await Promise.all([
      getSalesAnalytics(restaurantId, startDate, endDate),
      getInventoryAnalytics(restaurantId),
      getCustomerAnalytics(restaurantId, startDate, endDate),
      getPeakHoursAnalytics(restaurantId, startDate, endDate)
    ])

    return {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      sales,
      inventory,
      customers,
      peakHours,
      summary: {
        totalRevenue: sales.totalRevenue,
        totalOrders: sales.totalOrders,
        averageOrderValue: sales.averageOrderValue,
        newCustomers: customers.newCustomers,
        customerRetentionRate: customers.customerRetentionRate,
        lowStockItems: inventory.lowStockItems.length,
        stockValue: inventory.stockValue
      }
    }
  } catch (error) {
    console.error('Error generating business report:', error)
    throw error
  }
}

export async function getRevenueProjection(restaurantId: string, days: number = 30): Promise<Array<{ date: string; projectedRevenue: number }>> {
  try {
    // Get historical data for the last 90 days
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (90 * 24 * 60 * 60 * 1000))
    
    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: {
          not: 'CANCELLED'
        }
      }
    })

    // Calculate daily averages
    const dailyRevenue = new Map<string, number>()
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + order.total)
    })

    const averageDailyRevenue = Array.from(dailyRevenue.values()).reduce((sum, revenue) => sum + revenue, 0) / dailyRevenue.size

    // Generate projections
    const projections = []
    for (let i = 1; i <= days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      // Add some variation based on day of week
      const dayOfWeek = date.getDay()
      let multiplier = 1
      if (dayOfWeek === 0 || dayOfWeek === 6) multiplier = 1.2 // Weekend boost
      else if (dayOfWeek === 5) multiplier = 1.1 // Friday boost
      
      projections.push({
        date: dateString,
        projectedRevenue: averageDailyRevenue * multiplier
      })
    }

    return projections
  } catch (error) {
    console.error('Error getting revenue projection:', error)
    throw error
  }
}
