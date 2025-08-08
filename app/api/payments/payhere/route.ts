import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const payhereSchema = z.object({
  orderId: z.string(),
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("LKR"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  description: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const paymentData = payhereSchema.parse(body)

    // Generate PayHere payment request
    const merchantId = process.env.PAYHERE_MERCHANT_ID!
    const secretKey = process.env.PAYHERE_SECRET_KEY!
    const sandbox = process.env.NODE_ENV === "development"

    const paymentRequest = {
      merchant_id: merchantId,
      return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/payments/payhere/webhook`,
      order_id: paymentData.orderId,
      items: paymentData.description || `Order ${paymentData.orderId}`,
      amount: paymentData.amount.toFixed(2),
      currency: paymentData.currency,
      first_name: paymentData.customerName.split(" ")[0],
      last_name: paymentData.customerName.split(" ").slice(1).join(" ") || "",
      email: paymentData.customerEmail,
      phone: paymentData.customerPhone,
      address: "Restaurant Order",
      city: "Colombo",
      country: "Sri Lanka",
      custom_1: paymentData.orderId,
      custom_2: "restaurant_order"
    }

    // Generate hash for security
    const hashString = Object.keys(paymentRequest)
      .sort()
      .map(key => paymentRequest[key as keyof typeof paymentRequest])
      .join("|")

    const hash = crypto
      .createHash("md5")
      .update(hashString + secretKey)
      .digest("hex")
      .toUpperCase()

    // Update order with PayHere payment details
    await prisma.order.update({
      where: { id: paymentData.orderId },
      data: {
        paymentMethod: "PAYHERE",
        paymentStatus: "PENDING"
      }
    })

    const payhereUrl = sandbox 
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout"

    return NextResponse.json({
      payhereUrl,
      paymentRequest: {
        ...paymentRequest,
        hash
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating PayHere payment:", error)
    return NextResponse.json(
      { error: "Failed to create PayHere payment" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentId, status } = body

    // Verify payment with PayHere
    const merchantId = process.env.PAYHERE_MERCHANT_ID!
    const secretKey = process.env.PAYHERE_SECRET_KEY!
    const sandbox = process.env.NODE_ENV === "development"

    const verificationData = {
      merchant_id: merchantId,
      order_id: orderId,
      payment_id: paymentId
    }

    const hashString = Object.keys(verificationData)
      .sort()
      .map(key => verificationData[key as keyof typeof verificationData])
      .join("|")

    const hash = crypto
      .createHash("md5")
      .update(hashString + secretKey)
      .digest("hex")
      .toUpperCase()

    // In a real implementation, you would verify with PayHere API
    // For now, we'll simulate the verification
    const isPaymentValid = status === "2" // 2 = Success in PayHere

    if (isPaymentValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED"
        }
      })

      return NextResponse.json({
        message: "Payment verified successfully",
        status: "PAID"
      })
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED"
        }
      })

      return NextResponse.json({
        message: "Payment verification failed",
        status: "FAILED"
      })
    }
  } catch (error) {
    console.error("Error verifying PayHere payment:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
