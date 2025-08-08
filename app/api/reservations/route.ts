import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reservationSchema = z.object({
  date: z.string().datetime("Invalid date format"),
  time: z.string().min(1, "Time is required"),
  partySize: z.number().min(1, "Party size must be at least 1"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  customerEmail: z.string().email("Invalid email address").optional(),
  specialRequests: z.string().optional(),
  depositAmount: z.number().min(0, "Deposit amount must be positive"),
  depositPaid: z.boolean().default(false),
  tableId: z.string().optional(),
  restaurantId: z.string()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (restaurantId) where.restaurantId = restaurantId
    if (date) where.date = new Date(date)
    if (status) where.status = status

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          table: true,
          restaurant: true
        },
        orderBy: { date: "desc" },
        skip,
        take: limit
      }),
      prisma.reservation.count({ where })
    ])

    return NextResponse.json({
      reservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const reservationData = reservationSchema.parse(body)

    // Check if table is available for the requested time
    if (reservationData.tableId) {
      const conflictingReservation = await prisma.reservation.findFirst({
        where: {
          tableId: reservationData.tableId,
          date: new Date(reservationData.date),
          status: {
            in: ["PENDING", "CONFIRMED"]
          }
        }
      })

      if (conflictingReservation) {
        return NextResponse.json(
          { error: "Table is not available for the requested time" },
          { status: 400 }
        )
      }
    }

    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(reservationData.date),
        time: reservationData.time,
        partySize: reservationData.partySize,
        customerName: reservationData.customerName,
        customerPhone: reservationData.customerPhone,
        customerEmail: reservationData.customerEmail,
        specialRequests: reservationData.specialRequests,
        depositAmount: reservationData.depositAmount,
        depositPaid: reservationData.depositPaid,
        status: "PENDING",
        tableId: reservationData.tableId,
        restaurantId: reservationData.restaurantId
      },
      include: {
        table: true,
        restaurant: true
      }
    })

    return NextResponse.json(
      { 
        message: "Reservation created successfully",
        reservation 
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

    console.error("Error creating reservation:", error)
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    )
  }
}
