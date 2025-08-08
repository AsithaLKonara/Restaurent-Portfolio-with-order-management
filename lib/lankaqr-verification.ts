import { prisma } from './prisma'

export interface LankaQRConfig {
  merchantId: string
  apiKey: string
  secretKey: string
  sandbox: boolean
  webhookUrl: string
}

export interface LankaQRPayment {
  orderId: string
  amount: number
  currency: string
  customerName: string
  customerPhone: string
  qrCodeUrl: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
  transactionId?: string
  paidAmount?: number
  paidAt?: Date
  bankReference?: string
}

export interface LankaQRVerificationResponse {
  success: boolean
  paymentStatus: string
  transactionId?: string
  paidAmount?: number
  paidAt?: Date
  bankReference?: string
  error?: string
}

export class LankaQRVerification {
  private config: LankaQRConfig

  constructor(config: LankaQRConfig) {
    this.config = config
  }

  async createPayment(paymentData: Omit<LankaQRPayment, 'paymentStatus'>): Promise<LankaQRPayment> {
    try {
      // In a real implementation, this would call the LANKAQR API
      const response = await fetch(`${this.config.sandbox ? 'https://sandbox.lankaqr.lk' : 'https://lankaqr.lk'}/api/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Merchant-ID': this.config.merchantId
        },
        body: JSON.stringify({
          order_id: paymentData.orderId,
          amount: paymentData.amount.toFixed(2),
          currency: paymentData.currency,
          customer_name: paymentData.customerName,
          customer_phone: paymentData.customerPhone,
          callback_url: this.config.webhookUrl,
          description: `Order ${paymentData.orderId} - ${paymentData.customerName}`,
          expiry_time: 15 // 15 minutes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create LANKAQR payment')
      }

      const data = await response.json()

      return {
        ...paymentData,
        qrCodeUrl: data.qr_code_url,
        paymentStatus: 'PENDING'
      }
    } catch (error) {
      console.error('Error creating LANKAQR payment:', error)
      throw error
    }
  }

  async verifyPayment(orderId: string): Promise<LankaQRVerificationResponse> {
    try {
      // In a real implementation, this would call the LANKAQR verification API
      const response = await fetch(`${this.config.sandbox ? 'https://sandbox.lankaqr.lk' : 'https://lankaqr.lk'}/api/v1/payments/${orderId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Merchant-ID': this.config.merchantId
        }
      })

      if (!response.ok) {
        return {
          success: false,
          paymentStatus: 'FAILED',
          error: 'Failed to verify payment'
        }
      }

      const data = await response.json()

      return {
        success: true,
        paymentStatus: data.status,
        transactionId: data.transaction_id,
        paidAmount: data.paid_amount,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
        bankReference: data.bank_reference
      }
    } catch (error) {
      console.error('Error verifying LANKAQR payment:', error)
      return {
        success: false,
        paymentStatus: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async processWebhook(webhookData: any): Promise<boolean> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(webhookData)) {
        console.error('Invalid webhook signature')
        return false
      }

      const { order_id, status, transaction_id, paid_amount, paid_at, bank_reference } = webhookData

      // Update order in database
      await prisma.order.update({
        where: { id: order_id },
        data: {
          paymentStatus: status === 'PAID' ? 'PAID' : 'FAILED',
          paymentReference: transaction_id,
          isPaid: status === 'PAID',
          updatedAt: new Date()
        }
      })

      // If payment is successful, update order status
      if (status === 'PAID') {
        await prisma.order.update({
          where: { id: order_id },
          data: {
            status: 'PREPARING'
          }
        })

        // Send notification to kitchen
        // This would integrate with the WebSocket system
        console.log(`Order ${order_id} payment confirmed - sending to kitchen`)
      }

      return true
    } catch (error) {
      console.error('Error processing LANKAQR webhook:', error)
      return false
    }
  }

  private verifyWebhookSignature(webhookData: any): boolean {
    // In a real implementation, this would verify the webhook signature
    // to ensure it's coming from LANKAQR
    const signature = webhookData.signature
    const payload = JSON.stringify(webhookData.data)
    
    // This is a simplified verification - in real app, you'd use proper crypto
    const expectedSignature = this.generateSignature(payload, this.config.secretKey)
    
    return signature === expectedSignature
  }

  private generateSignature(payload: string, secretKey: string): string {
    // In a real implementation, this would use proper HMAC
    const crypto = require('crypto')
    return crypto.createHmac('sha256', secretKey).update(payload).digest('hex')
  }

  async startPaymentMonitoring(orderId: string, maxAttempts: number = 30): Promise<LankaQRVerificationResponse> {
    // Poll for payment status every 10 seconds for up to 5 minutes
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const verification = await this.verifyPayment(orderId)
      
      if (verification.success && verification.paymentStatus === 'PAID') {
        return verification
      }
      
      if (verification.paymentStatus === 'FAILED' || verification.paymentStatus === 'EXPIRED') {
        return verification
      }
      
      // Wait 10 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
    
    return {
      success: false,
      paymentStatus: 'EXPIRED',
      error: 'Payment verification timeout'
    }
  }

  async generateQRCode(orderId: string, amount: number): Promise<string> {
    try {
      const payment = await this.createPayment({
        orderId,
        amount,
        currency: 'LKR',
        customerName: 'Customer',
        customerPhone: '+94700000000',
        qrCodeUrl: ''
      })

      return payment.qrCodeUrl
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw error
    }
  }

  async getPaymentHistory(restaurantId: string, startDate: Date, endDate: Date): Promise<LankaQRPayment[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          restaurantId,
          paymentMethod: 'LANKAQR',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          total: true,
          paymentStatus: true,
          paymentReference: true,
          customerName: true,
          customerPhone: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return orders.map(order => ({
        orderId: order.id,
        amount: order.total,
        currency: 'LKR',
        customerName: order.customerName || 'Customer',
        customerPhone: order.customerPhone || '',
        qrCodeUrl: '',
        paymentStatus: order.paymentStatus as any,
        transactionId: order.paymentReference,
        paidAmount: order.paymentStatus === 'PAID' ? order.total : undefined,
        paidAt: order.paymentStatus === 'PAID' ? order.updatedAt : undefined
      }))
    } catch (error) {
      console.error('Error getting payment history:', error)
      return []
    }
  }

  async refundPayment(orderId: string, amount: number, reason: string): Promise<boolean> {
    try {
      // In a real implementation, this would call the LANKAQR refund API
      const response = await fetch(`${this.config.sandbox ? 'https://sandbox.lankaqr.lk' : 'https://lankaqr.lk'}/api/v1/payments/${orderId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Merchant-ID': this.config.merchantId
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          reason: reason
        })
      })

      if (!response.ok) {
        return false
      }

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'REFUNDED',
          updatedAt: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('Error refunding payment:', error)
      return false
    }
  }
}

// Default LANKAQR configuration
export const defaultLankaQRConfig: LankaQRConfig = {
  merchantId: process.env.LANKAQR_MERCHANT_ID!,
  apiKey: process.env.LANKAQR_API_KEY!,
  secretKey: process.env.LANKAQR_SECRET_KEY!,
  sandbox: process.env.NODE_ENV === 'development',
  webhookUrl: `${process.env.NEXTAUTH_URL}/api/payments/lankaqr/webhook`
}

// Payment verification service
export class PaymentVerificationService {
  private lankaQR: LankaQRVerification

  constructor() {
    this.lankaQR = new LankaQRVerification(defaultLankaQRConfig)
  }

  async verifyLankaQRPayment(orderId: string): Promise<LankaQRVerificationResponse> {
    return await this.lankaQR.verifyPayment(orderId)
  }

  async monitorLankaQRPayment(orderId: string): Promise<LankaQRVerificationResponse> {
    return await this.lankaQR.startPaymentMonitoring(orderId)
  }

  async processLankaQRWebhook(webhookData: any): Promise<boolean> {
    return await this.lankaQR.processWebhook(webhookData)
  }

  async createLankaQRPayment(orderId: string, amount: number, customerName: string, customerPhone: string): Promise<LankaQRPayment> {
    return await this.lankaQR.createPayment({
      orderId,
      amount,
      currency: 'LKR',
      customerName,
      customerPhone,
      qrCodeUrl: ''
    })
  }

  async getLankaQRPaymentHistory(restaurantId: string, startDate: Date, endDate: Date): Promise<LankaQRPayment[]> {
    return await this.lankaQR.getPaymentHistory(restaurantId, startDate, endDate)
  }

  async refundLankaQRPayment(orderId: string, amount: number, reason: string): Promise<boolean> {
    return await this.lankaQR.refundPayment(orderId, amount, reason)
  }
}
