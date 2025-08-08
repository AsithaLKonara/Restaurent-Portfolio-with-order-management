import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'
import { prisma } from './prisma'

export interface ServerToClientEvents {
  orderUpdate: (order: any) => void
  orderNew: (order: any) => void
  orderStatusChange: (data: { orderId: string; status: string }) => void
  kitchenNotification: (message: string) => void
  waiterNotification: (message: string) => void
}

export interface ClientToServerEvents {
  joinKitchen: (restaurantId: string) => void
  joinWaiter: (restaurantId: string) => void
  orderStatusUpdate: (data: { orderId: string; status: string }) => void
  orderReady: (orderId: string) => void
  orderServed: (orderId: string) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
  restaurantId: string
  role: string
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >
    }
  }
}

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join kitchen room
    socket.on('joinKitchen', (restaurantId) => {
      socket.join(`kitchen-${restaurantId}`)
      socket.data.restaurantId = restaurantId
      socket.data.role = 'kitchen'
      console.log(`Kitchen staff joined restaurant: ${restaurantId}`)
    })

    // Join waiter room
    socket.on('joinWaiter', (restaurantId) => {
      socket.join(`waiter-${restaurantId}`)
      socket.data.restaurantId = restaurantId
      socket.data.role = 'waiter'
      console.log(`Waiter joined restaurant: ${restaurantId}`)
    })

    // Handle order status updates
    socket.on('orderStatusUpdate', async (data) => {
      try {
        const { orderId, status } = data

        // Update order in database
        await prisma.order.update({
          where: { id: orderId },
          data: { status: status as any }
        })

        // Get updated order
        const updatedOrder = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            user: true,
            table: true
          }
        })

        if (updatedOrder) {
          // Notify kitchen
          socket.to(`kitchen-${updatedOrder.restaurantId}`).emit('orderStatusChange', {
            orderId,
            status
          })

          // Notify waiters
          socket.to(`waiter-${updatedOrder.restaurantId}`).emit('orderStatusChange', {
            orderId,
            status
          })

          // Send specific notifications based on status
          if (status === 'ready') {
            socket.to(`waiter-${updatedOrder.restaurantId}`).emit('waiterNotification', 
              `Order #${orderId} is ready for pickup`
            )
          } else if (status === 'preparing') {
            socket.to(`kitchen-${updatedOrder.restaurantId}`).emit('kitchenNotification',
              `Order #${orderId} is being prepared`
            )
          }
        }
      } catch (error) {
        console.error('Error updating order status:', error)
      }
    })

    // Handle order ready notification
    socket.on('orderReady', async (orderId) => {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { table: true }
        })

        if (order) {
          socket.to(`waiter-${order.restaurantId}`).emit('waiterNotification',
            `Order #${orderId} is ready for table ${order.table?.number || 'N/A'}`
          )
        }
      } catch (error) {
        console.error('Error handling order ready:', error)
      }
    })

    // Handle order served notification
    socket.on('orderServed', async (orderId) => {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { table: true }
        })

        if (order) {
          // Update order status to served
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'SERVED' }
          })

          socket.to(`kitchen-${order.restaurantId}`).emit('orderStatusChange', {
            orderId,
            status: 'SERVED'
          })
        }
      } catch (error) {
        console.error('Error handling order served:', error)
      }
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

// Helper function to emit order updates
export const emitOrderUpdate = (io: SocketIOServer, restaurantId: string, order: any) => {
  io.to(`kitchen-${restaurantId}`).emit('orderUpdate', order)
  io.to(`waiter-${restaurantId}`).emit('orderUpdate', order)
}

// Helper function to emit new order
export const emitNewOrder = (io: SocketIOServer, restaurantId: string, order: any) => {
  io.to(`kitchen-${restaurantId}`).emit('orderNew', order)
  io.to(`waiter-${restaurantId}`).emit('orderNew', order)
}
