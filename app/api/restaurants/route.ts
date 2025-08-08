import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  logo: z.string().optional(),
  banner: z.string().optional(),
  isActive: z.boolean().default(true),
  vatPercentage: z.number().min(0).max(100, "VAT percentage must be between 0 and 100"),
  serviceCharge: z.number().min(0).max(100, "Service charge must be between 0 and 100"),
  deliveryFee: z.number().min(0, "Delivery fee must be positive"),
  minOrderAmount: z.number().min(0, "Minimum order amount must be positive"),
  maxDeliveryDistance: z.number().min(0, "Maximum delivery distance must be positive")
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (isActive !== null) where.isActive = isActive === "true"

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: {
          _count: {
            select: {
              menuItems: true,
              orders: true,
              tables: true,
              staff: true
            }
          }
        },
        orderBy: { name: "asc" },
        skip,
        take: limit
      }),
      prisma.restaurant.count({ where })
    ])

    return NextResponse.json({
      restaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const restaurantData = restaurantSchema.parse(body)

    const restaurant = await prisma.restaurant.create({
      data: restaurantData
    })

    return NextResponse.json(
      { 
        message: "Restaurant created successfully",
        restaurant 
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

    console.error("Error creating restaurant:", error)
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    )
  }
}
