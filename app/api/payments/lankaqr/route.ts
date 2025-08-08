import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const lankaqrSchema = z.object({
  orderId: z.string(),
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("LKR"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  description: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const paymentData = lankaqrSchema.parse(body)

    // Generate LANKAQR payment request
    const merchantId = process.env.LANKAQR_MERCHANT_ID!
    const apiKey = process.env.LANKAQR_API_KEY!
    const sandbox = process.env.NODE_ENV === "development"

    const paymentRequest = {
      merchant_id: merchantId,
      order_id: paymentData.orderId,
      amount: paymentData.amount.toFixed(2),
      currency: paymentData.currency,
      customer_name: paymentData.customerName,
      customer_phone: paymentData.customerPhone,
      description: paymentData.description || `Order ${paymentData.orderId}`,
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/lankaqr/webhook`,
      expiry_time: 15 // 15 minutes
    }

    // In a real implementation, this would call the LANKAQR API
    // For now, we'll simulate the API call
    const qrCodeUrl = `https://lankaqr.lk/qr/${paymentData.orderId}`
    const paymentId = `lq_${Date.now()}`

    // Update order with LANKAQR payment details
    await prisma.order.update({
      where: { id: paymentData.orderId },
      data: {
        paymentMethod: "LANKAQR",
        paymentStatus: "PENDING",
        paymentIntentId: paymentId
      }
    })

    return NextResponse.json({
      qrCodeUrl,
      paymentId,
      paymentRequest
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating LANKAQR payment:", error)
    return NextResponse.json(
      { error: "Failed to create LANKAQR payment" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      )
    }

    // In a real implementation, this would check LANKAQR API for payment status
    // For now, we'll simulate the status check
    const paymentStatus = await checkLankaQRPaymentStatus(paymentId)

    return NextResponse.json({
      paymentId,
      status: paymentStatus
    })
  } catch (error) {
    console.error("Error checking LANKAQR payment status:", error)
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    )
  }
}

async function checkLankaQRPaymentStatus(paymentId: string) {
  // Simulate API call to LANKAQR
  // In real implementation, this would call the LANKAQR status API
  const statuses = ["PENDING", "PAID", "FAILED", "EXPIRED"]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return randomStatus
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentId, status } = body

    // Update order based on payment status
    if (status === "PAID") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED"
        }
      })

      return NextResponse.json({
        message: "Payment confirmed successfully",
        status: "PAID"
      })
    } else if (status === "FAILED" || status === "EXPIRED") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED"
        }
      })

      return NextResponse.json({
        message: "Payment failed or expired",
        status: "FAILED"
      })
    } else {
      return NextResponse.json({
        message: "Payment still pending",
        status: "PENDING"
      })
    }
  } catch (error) {
    console.error("Error updating LANKAQR payment:", error)
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    )
  }
}
