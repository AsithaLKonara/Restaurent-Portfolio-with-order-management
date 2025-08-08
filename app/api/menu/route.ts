import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
  isVegetarian: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  allergens: z.array(z.string()).default([]),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  cost: z.number().min(0, "Cost must be positive"),
  profitMargin: z.number().min(0).max(100, "Profit margin must be between 0 and 100"),
  popularity: z.number().min(0).max(100, "Popularity must be between 0 and 100"),
  restaurantId: z.string()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const category = searchParams.get("category")
    const isAvailable = searchParams.get("isAvailable")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}
    if (restaurantId) where.restaurantId = restaurantId
    if (category) where.category = category
    if (isAvailable !== null) where.isAvailable = isAvailable === "true"

    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit
      }),
      prisma.menuItem.count({ where })
    ])

    return NextResponse.json({
      menuItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const menuItemData = menuItemSchema.parse(body)

    const menuItem = await prisma.menuItem.create({
      data: menuItemData
    })

    return NextResponse.json(
      { 
        message: "Menu item created successfully",
        menuItem 
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

    console.error("Error creating menu item:", error)
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    )
  }
}
