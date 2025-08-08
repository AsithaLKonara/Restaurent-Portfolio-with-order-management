import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  max: number
  windowMs: number
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig = { max: 100, windowMs: 900000 }) {
  return function middleware(request: NextRequest) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    const record = rateLimitStore.get(ip)
    
    if (!record || now > record.resetTime) {
      // First request or window expired
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return NextResponse.next()
    }
    
    if (record.count >= config.max) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': record.resetTime.toString(),
            'Retry-After': Math.ceil(config.windowMs / 1000).toString()
          }
        }
      )
    }
    
    // Increment count
    record.count++
    rateLimitStore.set(ip, record)
    
    return NextResponse.next()
  }
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip)
    }
  }
}, 5 * 60 * 1000)

export const defaultRateLimit = rateLimit({
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
})
