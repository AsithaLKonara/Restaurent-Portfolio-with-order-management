import { NextRequest } from 'next/server'
import { initSocket } from '@/lib/socket'

export async function GET(req: NextRequest) {
  // This route is for Socket.IO handshake
  return new Response('Socket.IO endpoint', { status: 200 })
}

export async function POST(req: NextRequest) {
  // This route is for Socket.IO handshake
  return new Response('Socket.IO endpoint', { status: 200 })
}
