import Stripe from 'stripe'

export interface PaymentMethod {
  id: string
  name: string
  type: 'cash' | 'card' | 'payhere' | 'lankaqr' | 'bank_transfer'
  isAvailable: boolean
  icon: string
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Cash on Delivery',
    type: 'cash',
    isAvailable: true,
    icon: '💵'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    isAvailable: true,
    icon: '💳'
  },
  {
    id: 'payhere',
    name: 'PayHere',
    type: 'payhere',
    isAvailable: true,
    icon: '🏦'
  },
  {
    id: 'lankaqr',
    name: 'LANKAQR',
    type: 'lankaqr',
    isAvailable: true,
    icon: '📱'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    isAvailable: true,
    icon: '🏛️'
  }
]

// Stripe configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// PayHere configuration (Sri Lankan payment gateway)
export interface PayHereConfig {
  merchantId: string
  secretKey: string
  sandbox: boolean
}

export const payHereConfig: PayHereConfig = {
  merchantId: process.env.PAYHERE_MERCHANT_ID!,
  secretKey: process.env.PAYHERE_SECRET_KEY!,
  sandbox: process.env.NODE_ENV === 'development'
}

// LANKAQR configuration
export interface LankaQRConfig {
  merchantId: string
  apiKey: string
  sandbox: boolean
}

export const lankaQRConfig: LankaQRConfig = {
  merchantId: process.env.LANKAQR_MERCHANT_ID!,
  apiKey: process.env.LANKAQR_API_KEY!,
  sandbox: process.env.NODE_ENV === 'development'
}

// Payment processing functions
export async function processStripePayment(amount: number, currency: string = 'lkr') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    return {
      success: false,
      error: 'Payment processing failed'
    }
  }
}

export async function processPayHerePayment(orderData: any) {
  try {
    // PayHere payment processing logic
    const payHereData = {
      merchant_id: payHereConfig.merchantId,
      return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/payments/payhere/webhook`,
      first_name: orderData.customerName?.split(' ')[0] || 'Customer',
      last_name: orderData.customerName?.split(' ').slice(1).join(' ') || '',
      email: orderData.customerEmail || '',
      phone: orderData.customerPhone || '',
      address: orderData.customerAddress || '',
      city: 'Colombo',
      country: 'Sri Lanka',
      order_id: orderData.orderId,
      items: orderData.items.map((item: any) => item.name).join(', '),
      currency: 'LKR',
      amount: orderData.total.toFixed(2),
      custom_1: orderData.orderId,
      custom_2: orderData.restaurantId,
    }

    return {
      success: true,
      payHereData,
      redirectUrl: payHereConfig.sandbox 
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout'
    }
  } catch (error) {
    console.error('PayHere payment error:', error)
    return {
      success: false,
      error: 'PayHere payment processing failed'
    }
  }
}

export async function processLankaQRPayment(orderData: any) {
  try {
    // LANKAQR payment processing logic
    const lankaQRData = {
      merchantId: lankaQRConfig.merchantId,
      amount: orderData.total.toFixed(2),
      currency: 'LKR',
      orderId: orderData.orderId,
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail || '',
      description: `Order ${orderData.orderId} - ${orderData.items.map((item: any) => item.name).join(', ')}`,
      returnUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      notifyUrl: `${process.env.NEXTAUTH_URL}/api/payments/lankaqr/webhook`,
    }

    return {
      success: true,
      lankaQRData,
      qrCodeUrl: `${lankaQRConfig.sandbox ? 'https://sandbox.lankaqr.lk' : 'https://lankaqr.lk'}/qr/${lankaQRData.orderId}`
    }
  } catch (error) {
    console.error('LANKAQR payment error:', error)
    return {
      success: false,
      error: 'LANKAQR payment processing failed'
    }
  }
}

export async function processBankTransferPayment(orderData: any) {
  try {
    // Bank transfer payment processing logic
    const bankTransferData = {
      orderId: orderData.orderId,
      amount: orderData.total.toFixed(2),
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '1234567890',
      accountName: 'Spice Garden Restaurant',
      reference: `ORDER-${orderData.orderId}`,
      instructions: `Please include order reference: ORDER-${orderData.orderId} in your transfer description`
    }

    return {
      success: true,
      bankTransferData,
      instructions: [
        'Transfer the amount to the provided bank account',
        `Include reference: ORDER-${orderData.orderId}`,
        'Upload payment proof after transfer',
        'Order will be confirmed once payment is verified'
      ]
    }
  } catch (error) {
    console.error('Bank transfer payment error:', error)
    return {
      success: false,
      error: 'Bank transfer processing failed'
    }
  }
}

// Payment verification functions
export async function verifyPayment(paymentId: string, method: string) {
  try {
    switch (method) {
      case 'stripe':
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
        return {
          success: paymentIntent.status === 'succeeded',
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100
        }
      
      case 'payhere':
        // PayHere verification logic
        return {
          success: true,
          status: 'verified',
          amount: 0
        }
      
      case 'lankaqr':
        // LANKAQR verification logic
        return {
          success: true,
          status: 'verified',
          amount: 0
        }
      
      default:
        return {
          success: false,
          error: 'Invalid payment method'
        }
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      error: 'Payment verification failed'
    }
  }
}
