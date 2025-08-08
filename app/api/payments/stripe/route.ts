import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { z } from "zod"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia"
})

const paymentIntentSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("lkr"),
  orderId: z.string(),
  customerEmail: z.string().email("Invalid email address"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  description: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const paymentData = paymentIntentSchema.parse(body)

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentData.amount * 100, // Convert to cents
      currency: paymentData.currency,
      metadata: {
        orderId: paymentData.orderId,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName
      },
      description: paymentData.description || `Order ${paymentData.orderId}`,
      receipt_email: paymentData.customerEmail
    })

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: paymentData.orderId },
      data: {
        paymentIntentId: paymentIntent.id,
        paymentStatus: "PENDING"
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get("paymentIntentId")

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      paymentIntent
    })
  } catch (error) {
    console.error("Error retrieving payment intent:", error)
    return NextResponse.json(
      { error: "Failed to retrieve payment intent" },
      { status: 500 }
    )
  }
}
