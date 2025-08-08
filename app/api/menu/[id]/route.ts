import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateMenuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  image: z.string().optional(),
  category: z.string().min(1, "Category is required").optional(),
  isAvailable: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  allergens: z.array(z.string()).optional(),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute").optional(),
  cost: z.number().min(0, "Cost must be positive").optional(),
  profitMargin: z.number().min(0).max(100, "Profit margin must be between 0 and 100").optional(),
  popularity: z.number().min(0).max(100, "Popularity must be between 0 and 100").optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id }
    })

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error("Error fetching menu item:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData = updateMenuItemSchema.parse(body)

    const menuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      message: "Menu item updated successfully",
      menuItem
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating menu item:", error)
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.menuItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: "Menu item deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    )
  }
}
