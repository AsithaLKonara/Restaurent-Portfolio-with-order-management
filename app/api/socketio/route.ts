import { NextRequest, NextResponse } from "next/server"
import { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

interface SocketServer extends NetServer {
  io?: SocketIOServer
}

interface SocketWithIO extends NextApiResponse {
  socket: {
    server: SocketServer
  }
}

export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.next() as any

    if (!res.socket.server.io) {
      console.log("Initializing Socket.IO server...")
      const io = new SocketIOServer(res.socket.server, {
        cors: {
          origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      })

      // Store io instance on server
      res.socket.server.io = io

      // Socket.IO event handlers
      io.on("connection", (socket) => {
        console.log("Client connected:", socket.id)

        // Join kitchen room
        socket.on("join-kitchen", (restaurantId: string) => {
          socket.join(`kitchen-${restaurantId}`)
          console.log(`Kitchen joined for restaurant: ${restaurantId}`)
        })

        // Join waiter room
        socket.on("join-waiter", (restaurantId: string) => {
          socket.join(`waiter-${restaurantId}`)
          console.log(`Waiter joined for restaurant: ${restaurantId}`)
        })

        // Handle new order
        socket.on("new-order", async (orderData: any) => {
          try {
            // Save order to database
            const order = await prisma.order.create({
              data: {
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                customerEmail: orderData.customerEmail,
                specialInstructions: orderData.specialInstructions,
                orderType: orderData.orderType,
                paymentMethod: orderData.paymentMethod,
                deliveryAddress: orderData.deliveryAddress,
                deliveryFee: orderData.deliveryFee || 0,
                subtotal: orderData.subtotal,
                total: orderData.total,
                status: "PENDING",
                restaurantId: orderData.restaurantId,
                tableId: orderData.tableId,
                items: {
                  create: orderData.items.map((item: any) => ({
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

            // Emit to kitchen
            io.to(`kitchen-${orderData.restaurantId}`).emit("order-received", {
              type: "NEW_ORDER",
              order
            })

            // Emit to waiters
            io.to(`waiter-${orderData.restaurantId}`).emit("order-received", {
              type: "NEW_ORDER",
              order
            })

            console.log(`New order created: ${order.id}`)
          } catch (error) {
            console.error("Error creating order:", error)
            socket.emit("order-error", {
              message: "Failed to create order"
            })
          }
        })

        // Handle order status update
        socket.on("update-order-status", async (data: any) => {
          try {
            const { orderId, status, restaurantId } = data

            const updatedOrder = await prisma.order.update({
              where: { id: orderId },
              data: { status },
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

            // Emit to all connected clients
            io.to(`kitchen-${restaurantId}`).emit("order-updated", {
              type: "STATUS_UPDATE",
              order: updatedOrder
            })

            io.to(`waiter-${restaurantId}`).emit("order-updated", {
              type: "STATUS_UPDATE",
              order: updatedOrder
            })

            console.log(`Order ${orderId} status updated to: ${status}`)
          } catch (error) {
            console.error("Error updating order status:", error)
            socket.emit("update-error", {
              message: "Failed to update order status"
            })
          }
        })

        // Handle payment status update
        socket.on("update-payment-status", async (data: any) => {
          try {
            const { orderId, paymentStatus, restaurantId } = data

            const updatedOrder = await prisma.order.update({
              where: { id: orderId },
              data: { paymentStatus },
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

            // Emit to all connected clients
            io.to(`kitchen-${restaurantId}`).emit("payment-updated", {
              type: "PAYMENT_UPDATE",
              order: updatedOrder
            })

            io.to(`waiter-${restaurantId}`).emit("payment-updated", {
              type: "PAYMENT_UPDATE",
              order: updatedOrder
            })

            console.log(`Order ${orderId} payment status updated to: ${paymentStatus}`)
          } catch (error) {
            console.error("Error updating payment status:", error)
            socket.emit("update-error", {
              message: "Failed to update payment status"
            })
          }
        })

        // Handle kitchen ready notification
        socket.on("kitchen-ready", (data: any) => {
          const { orderId, restaurantId } = data
          
          io.to(`waiter-${restaurantId}`).emit("kitchen-notification", {
            type: "ORDER_READY",
            orderId,
            message: "Order is ready for pickup"
          })

          console.log(`Kitchen ready notification for order: ${orderId}`)
        })

        // Handle delivery pickup
        socket.on("delivery-pickup", (data: any) => {
          const { orderId, restaurantId, riderId } = data
          
          io.to(`kitchen-${restaurantId}`).emit("delivery-notification", {
            type: "DELIVERY_PICKUP",
            orderId,
            riderId,
            message: "Order picked up for delivery"
          })

          console.log(`Delivery pickup for order: ${orderId} by rider: ${riderId}`)
        })

        // Handle disconnect
        socket.on("disconnect", () => {
          console.log("Client disconnected:", socket.id)
        })
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Socket.IO setup error:", error)
    return NextResponse.json(
      { error: "Socket.IO setup failed" },
      { status: 500 }
    )
  }
}
