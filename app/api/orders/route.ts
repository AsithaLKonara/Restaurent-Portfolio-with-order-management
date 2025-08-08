import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const orderSchema = z.object({
  tableId: z.string().optional(),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  customerEmail: z.string().email("Invalid email address").optional(),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be positive"),
    specialInstructions: z.string().optional()
  })),
  specialInstructions: z.string().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  paymentMethod: z.enum(["CASH", "CARD", "PAYHERE", "LANKAQR", "BANK_TRANSFER"]),
  deliveryAddress: z.string().optional(),
  deliveryFee: z.number().min(0).optional(),
  restaurantId: z.string()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (restaurantId) where.restaurantId = restaurantId
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          table: true,
          restaurant: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderData = orderSchema.parse(body)

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = orderData.deliveryFee || 0
    const total = subtotal + deliveryFee

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        specialInstructions: orderData.specialInstructions,
        orderType: orderData.orderType,
        paymentMethod: orderData.paymentMethod,
        deliveryAddress: orderData.deliveryAddress,
        deliveryFee: deliveryFee,
        subtotal,
        total,
        status: "PENDING",
        restaurantId: orderData.restaurantId,
        tableId: orderData.tableId,
        items: {
          create: orderData.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            specialInstructions: item.specialInstructions
          }))
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true,
        restaurant: true
      }
    })

    return NextResponse.json(
      { 
        message: "Order created successfully",
        order 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
