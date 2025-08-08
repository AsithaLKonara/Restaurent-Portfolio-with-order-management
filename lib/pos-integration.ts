import { prisma } from './prisma'

export interface POSConfig {
  printerType: 'thermal' | 'inkjet' | 'laser'
  printerModel: string
  paperWidth: number // mm
  paperHeight: number // mm
  printDensity: number // 0-15
  printSpeed: number // 0-3
  autoCut: boolean
  autoFeed: boolean
}

export interface ReceiptData {
  orderId: string
  restaurantName: string
  restaurantAddress: string
  restaurantPhone: string
  restaurantVatNumber: string
  orderDate: string
  orderTime: string
  tableNumber?: string
  customerName?: string
  customerPhone?: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  vatAmount: number
  serviceCharge: number
  deliveryFee: number
  total: number
  paymentMethod: string
  paymentStatus: string
  specialInstructions?: string
  cashierName: string
}

export interface KitchenTicketData {
  orderId: string
  tableNumber?: string
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'
  orderTime: string
  items: Array<{
    name: string
    quantity: number
    specialInstructions?: string
    preparationTime: number
  }>
  specialInstructions?: string
  priority: 'NORMAL' | 'URGENT' | 'VIP'
}

export class ThermalPrinter {
  private config: POSConfig

  constructor(config: POSConfig) {
    this.config = config
  }

  async printReceipt(receiptData: ReceiptData): Promise<boolean> {
    try {
      const receiptContent = this.generateReceiptContent(receiptData)
      
      // In a real implementation, this would send commands to the thermal printer
      console.log('Printing receipt:', receiptContent)
      
      // Simulate printer commands
      await this.sendPrinterCommands(receiptContent)
      
      return true
    } catch (error) {
      console.error('Error printing receipt:', error)
      return false
    }
  }

  async printKitchenTicket(ticketData: KitchenTicketData): Promise<boolean> {
    try {
      const ticketContent = this.generateKitchenTicketContent(ticketData)
      
      console.log('Printing kitchen ticket:', ticketContent)
      
      await this.sendPrinterCommands(ticketContent)
      
      return true
    } catch (error) {
      console.error('Error printing kitchen ticket:', error)
      return false
    }
  }

  private generateReceiptContent(receipt: ReceiptData): string {
    const lines: string[] = []
    
    // Header
    lines.push('='.repeat(this.config.paperWidth / 8))
    lines.push(`    ${receipt.restaurantName.toUpperCase()}`)
    lines.push(`    ${receipt.restaurantAddress}`)
    lines.push(`    Tel: ${receipt.restaurantPhone}`)
    lines.push(`    VAT: ${receipt.restaurantVatNumber}`)
    lines.push('='.repeat(this.config.paperWidth / 8))
    
    // Order details
    lines.push(`Order #: ${receipt.orderId}`)
    lines.push(`Date: ${receipt.orderDate}`)
    lines.push(`Time: ${receipt.orderTime}`)
    if (receipt.tableNumber) {
      lines.push(`Table: ${receipt.tableNumber}`)
    }
    if (receipt.customerName) {
      lines.push(`Customer: ${receipt.customerName}`)
    }
    if (receipt.customerPhone) {
      lines.push(`Phone: ${receipt.customerPhone}`)
    }
    lines.push('-'.repeat(this.config.paperWidth / 8))
    
    // Items
    lines.push('ITEM                    QTY    PRICE    TOTAL')
    lines.push('-'.repeat(this.config.paperWidth / 8))
    
    receipt.items.forEach(item => {
      const name = item.name.padEnd(20)
      const qty = item.quantity.toString().padStart(3)
      const unitPrice = item.unitPrice.toFixed(2).padStart(8)
      const total = item.totalPrice.toFixed(2).padStart(8)
      lines.push(`${name} ${qty} ${unitPrice} ${total}`)
    })
    
    lines.push('-'.repeat(this.config.paperWidth / 8))
    
    // Totals
    lines.push(`Subtotal:${' '.repeat(15)}${receipt.subtotal.toFixed(2)}`)
    lines.push(`VAT (15%):${' '.repeat(13)}${receipt.vatAmount.toFixed(2)}`)
    lines.push(`Service Charge:${' '.repeat(8)}${receipt.serviceCharge.toFixed(2)}`)
    if (receipt.deliveryFee > 0) {
      lines.push(`Delivery Fee:${' '.repeat(9)}${receipt.deliveryFee.toFixed(2)}`)
    }
    lines.push('='.repeat(this.config.paperWidth / 8))
    lines.push(`TOTAL:${' '.repeat(16)}${receipt.total.toFixed(2)}`)
    lines.push('='.repeat(this.config.paperWidth / 8))
    
    // Payment info
    lines.push(`Payment Method: ${receipt.paymentMethod}`)
    lines.push(`Payment Status: ${receipt.paymentStatus}`)
    lines.push(`Cashier: ${receipt.cashierName}`)
    
    if (receipt.specialInstructions) {
      lines.push('-'.repeat(this.config.paperWidth / 8))
      lines.push('Special Instructions:')
      lines.push(receipt.specialInstructions)
    }
    
    // Footer
    lines.push('')
    lines.push('Thank you for dining with us!')
    lines.push('Please visit again.')
    lines.push('')
    lines.push('='.repeat(this.config.paperWidth / 8))
    
    return lines.join('\n')
  }

  private generateKitchenTicketContent(ticket: KitchenTicketData): string {
    const lines: string[] = []
    
    // Header
    lines.push('='.repeat(this.config.paperWidth / 8))
    lines.push('           KITCHEN TICKET')
    lines.push('='.repeat(this.config.paperWidth / 8))
    
    // Order details
    lines.push(`Order #: ${ticket.orderId}`)
    lines.push(`Time: ${ticket.orderTime}`)
    lines.push(`Type: ${ticket.orderType}`)
    if (ticket.tableNumber) {
      lines.push(`Table: ${ticket.tableNumber}`)
    }
    lines.push(`Priority: ${ticket.priority}`)
    lines.push('-'.repeat(this.config.paperWidth / 8))
    
    // Items
    lines.push('ITEM                    QTY    PREP TIME')
    lines.push('-'.repeat(this.config.paperWidth / 8))
    
    ticket.items.forEach(item => {
      const name = item.name.padEnd(20)
      const qty = item.quantity.toString().padStart(3)
      const prepTime = `${item.preparationTime}min`.padStart(8)
      lines.push(`${name} ${qty} ${prepTime}`)
      
      if (item.specialInstructions) {
        lines.push(`  → ${item.specialInstructions}`)
      }
    })
    
    lines.push('-'.repeat(this.config.paperWidth / 8))
    
    if (ticket.specialInstructions) {
      lines.push('Special Instructions:')
      lines.push(ticket.specialInstructions)
      lines.push('-'.repeat(this.config.paperWidth / 8))
    }
    
    // Footer
    lines.push('')
    lines.push('Please prepare with care!')
    lines.push('')
    lines.push('='.repeat(this.config.paperWidth / 8))
    
    return lines.join('\n')
  }

  private async sendPrinterCommands(content: string): Promise<void> {
    // In a real implementation, this would send ESC/POS commands to the printer
    // For now, we'll simulate the printing process
    
    const commands = [
      '\x1B\x40', // Initialize printer
      '\x1B\x61\x01', // Center alignment
      content,
      '\x1B\x61\x00', // Left alignment
      '\x0C', // Form feed
    ]
    
    // Simulate printer delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Printer commands sent:', commands)
  }
}

export class POSManager {
  private printer: ThermalPrinter
  private config: POSConfig

  constructor(config: POSConfig) {
    this.config = config
    this.printer = new ThermalPrinter(config)
  }

  async printOrderReceipt(orderId: string): Promise<boolean> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          restaurant: true,
          table: true,
          user: true
        }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      const receiptData: ReceiptData = {
        orderId: order.id,
        restaurantName: order.restaurant.name,
        restaurantAddress: order.restaurant.address,
        restaurantPhone: order.restaurant.phone,
        restaurantVatNumber: 'VAT123456789', // This would come from restaurant settings
        orderDate: order.createdAt.toLocaleDateString('en-US'),
        orderTime: order.createdAt.toLocaleTimeString('en-US'),
        tableNumber: order.table?.number,
        customerName: order.customerName || order.user?.name,
        customerPhone: order.customerPhone || order.user?.phone,
        items: order.items.map(item => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        })),
        subtotal: order.subtotal,
        vatAmount: order.vatAmount,
        serviceCharge: order.serviceCharge,
        deliveryFee: order.deliveryFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        specialInstructions: order.specialInstructions,
        cashierName: 'Cashier Name' // This would come from the logged-in user
      }

      return await this.printer.printReceipt(receiptData)
    } catch (error) {
      console.error('Error printing order receipt:', error)
      return false
    }
  }

  async printKitchenTicket(orderId: string): Promise<boolean> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          table: true,
          user: true
        }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      const ticketData: KitchenTicketData = {
        orderId: order.id,
        tableNumber: order.table?.number,
        orderType: order.orderType,
        orderTime: order.createdAt.toLocaleTimeString('en-US'),
        items: order.items.map(item => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
          preparationTime: item.menuItem.preparationTime
        })),
        specialInstructions: order.specialInstructions,
        priority: this.determinePriority(order)
      }

      return await this.printer.printKitchenTicket(ticketData)
    } catch (error) {
      console.error('Error printing kitchen ticket:', error)
      return false
    }
  }

  private determinePriority(order: any): 'NORMAL' | 'URGENT' | 'VIP' {
    // Simple priority logic - in real app, this would be more sophisticated
    if (order.orderType === 'DELIVERY') return 'URGENT'
    if (order.user?.tier === 'GOLD') return 'VIP'
    return 'NORMAL'
  }

  async printDailyReport(restaurantId: string, date: Date): Promise<boolean> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const orders = await prisma.order.findMany({
        where: {
          restaurantId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
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

      const reportContent = this.generateDailyReportContent({
        date: date.toLocaleDateString('en-US'),
        totalRevenue,
        totalOrders,
        averageOrderValue,
        orders
      })

      // Print daily report
      await this.printer.sendPrinterCommands(reportContent)
      
      return true
    } catch (error) {
      console.error('Error printing daily report:', error)
      return false
    }
  }

  private generateDailyReportContent(data: any): string {
    const lines: string[] = []
    
    lines.push('='.repeat(this.config.paperWidth / 8))
    lines.push('           DAILY SALES REPORT')
    lines.push('='.repeat(this.config.paperWidth / 8))
    lines.push(`Date: ${data.date}`)
    lines.push(`Total Orders: ${data.totalOrders}`)
    lines.push(`Total Revenue: LKR ${data.totalRevenue.toFixed(2)}`)
    lines.push(`Average Order: LKR ${data.averageOrderValue.toFixed(2)}`)
    lines.push('='.repeat(this.config.paperWidth / 8))
    
    return lines.join('\n')
  }
}

// Default POS configuration for Sri Lankan restaurants
export const defaultPOSConfig: POSConfig = {
  printerType: 'thermal',
  printerModel: 'Epson TM-T88VI',
  paperWidth: 80, // 80mm thermal paper
  paperHeight: 297, // A4 height in mm
  printDensity: 8,
  printSpeed: 2,
  autoCut: true,
  autoFeed: true
}
