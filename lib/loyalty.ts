import { prisma } from './prisma'

export interface LoyaltyTier {
  name: string
  minPoints: number
  maxPoints: number
  discountPercentage: number
  benefits: string[]
  color: string
}

export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    discountPercentage: 5,
    benefits: [
      '5% discount on all orders',
      'Birthday month double points',
      'Monthly newsletter'
    ],
    color: 'bg-orange-600'
  },
  {
    name: 'Silver',
    minPoints: 500,
    maxPoints: 999,
    discountPercentage: 10,
    benefits: [
      '10% discount on all orders',
      'Priority customer support',
      'Exclusive menu previews',
      'Free dessert on birthday'
    ],
    color: 'bg-gray-400'
  },
  {
    name: 'Gold',
    minPoints: 1000,
    maxPoints: Infinity,
    discountPercentage: 15,
    benefits: [
      '15% discount on all orders',
      'VIP table reservations',
      'Exclusive events access',
      'Personal account manager',
      'Free appetizer with every order'
    ],
    color: 'bg-yellow-500'
  }
]

export function calculateTier(points: number): LoyaltyTier {
  return loyaltyTiers.find(tier => points >= tier.minPoints && points <= tier.maxPoints) || loyaltyTiers[0]
}

export function calculatePointsToNextTier(points: number): { pointsNeeded: number; nextTier: string } {
  const currentTier = calculateTier(points)
  const nextTier = loyaltyTiers.find(tier => tier.minPoints > points)
  
  if (!nextTier) {
    return { pointsNeeded: 0, nextTier: 'Maximum tier reached' }
  }
  
  return {
    pointsNeeded: nextTier.minPoints - points,
    nextTier: nextTier.name
  }
}

export function calculatePointsEarned(amount: number, tier: LoyaltyTier): number {
  // Base points: 1 point per LKR spent
  let basePoints = Math.floor(amount)
  
  // Tier multipliers
  switch (tier.name) {
    case 'Bronze':
      return basePoints
    case 'Silver':
      return Math.floor(basePoints * 1.2) // 20% bonus
    case 'Gold':
      return Math.floor(basePoints * 1.5) // 50% bonus
    default:
      return basePoints
  }
}

// SMS Integration
export interface SMSConfig {
  apiKey: string
  senderId: string
  provider: 'dialog' | 'mobitel' | 'etisalat'
}

export const smsConfig: SMSConfig = {
  apiKey: process.env.SMS_GATEWAY_API_KEY!,
  senderId: process.env.SMS_GATEWAY_SENDER_ID!,
  provider: 'dialog'
}

export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    // In a real implementation, this would call the SMS gateway API
    const response = await fetch('https://api.smsgateway.lk/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${smsConfig.apiKey}`
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        sender_id: smsConfig.senderId
      })
    })

    return response.ok
  } catch (error) {
    console.error('SMS sending failed:', error)
    return false
  }
}

// WhatsApp Integration
export interface WhatsAppConfig {
  apiKey: string
  phoneNumberId: string
  businessAccountId: string
}

export const whatsAppConfig: WhatsAppConfig = {
  apiKey: process.env.WHATSAPP_API_KEY!,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    // In a real implementation, this would call the WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v17.0/${whatsAppConfig.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${whatsAppConfig.apiKey}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      })
    })

    return response.ok
  } catch (error) {
    console.error('WhatsApp sending failed:', error)
    return false
  }
}

// Automated Offers System
export interface AutomatedOffer {
  id: string
  type: 'birthday' | 'anniversary' | 'loyalty_milestone' | 'seasonal' | 'win_back'
  title: string
  description: string
  discountPercentage: number
  minSpend?: number
  validDays: number
  conditions: string[]
}

export const automatedOffers: AutomatedOffer[] = [
  {
    id: 'birthday-special',
    type: 'birthday',
    title: 'Happy Birthday! 🎉',
    description: 'Enjoy a special birthday discount on your special day!',
    discountPercentage: 25,
    validDays: 7,
    conditions: ['Valid only on birthday', 'Cannot be combined with other offers']
  },
  {
    id: 'loyalty-milestone-500',
    type: 'loyalty_milestone',
    title: '500 Points Milestone! 🎯',
    description: 'Congratulations on reaching 500 loyalty points!',
    discountPercentage: 15,
    minSpend: 50,
    validDays: 30,
    conditions: ['Minimum spend of LKR 50', 'Valid for 30 days']
  },
  {
    id: 'loyalty-milestone-1000',
    type: 'loyalty_milestone',
    title: '1000 Points Milestone! 🏆',
    description: 'You\'ve reached Gold tier! Enjoy exclusive benefits!',
    discountPercentage: 20,
    minSpend: 100,
    validDays: 60,
    conditions: ['Minimum spend of LKR 100', 'Valid for 60 days', 'Gold tier exclusive']
  },
  {
    id: 'seasonal-avurudu',
    type: 'seasonal',
    title: 'Avurudu Special! 🌸',
    description: 'Celebrate the Sinhala New Year with special discounts!',
    discountPercentage: 10,
    validDays: 14,
    conditions: ['Valid during Avurudu season', 'Limited time offer']
  },
  {
    id: 'win-back',
    type: 'win_back',
    title: 'We Miss You! 💝',
    description: 'Come back and enjoy a special welcome back offer!',
    discountPercentage: 20,
    minSpend: 30,
    validDays: 7,
    conditions: ['For returning customers', 'Valid for 7 days']
  }
]

export async function generateAutomatedOffers(userId: string): Promise<AutomatedOffer[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) return []

    const offers: AutomatedOffer[] = []
    const now = new Date()
    const userBirthday = new Date(user.joinDate) // In real app, this would be actual birthday
    const isBirthdayMonth = now.getMonth() === userBirthday.getMonth()
    const daysSinceLastOrder = user.orders[0] 
      ? Math.floor((now.getTime() - new Date(user.orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Birthday offer
    if (isBirthdayMonth) {
      offers.push(automatedOffers.find(o => o.id === 'birthday-special')!)
    }

    // Loyalty milestone offers
    if (user.loyaltyPoints >= 1000) {
      offers.push(automatedOffers.find(o => o.id === 'loyalty-milestone-1000')!)
    } else if (user.loyaltyPoints >= 500) {
      offers.push(automatedOffers.find(o => o.id === 'loyalty-milestone-500')!)
    }

    // Win-back offer for inactive customers
    if (daysSinceLastOrder > 30) {
      offers.push(automatedOffers.find(o => o.id === 'win-back')!)
    }

    // Seasonal offers (Avurudu, etc.)
    const avuruduMonth = 3 // April
    if (now.getMonth() === avuruduMonth) {
      offers.push(automatedOffers.find(o => o.id === 'seasonal-avurudu')!)
    }

    return offers
  } catch (error) {
    console.error('Error generating automated offers:', error)
    return []
  }
}

export async function sendLoyaltyNotification(userId: string, offer: AutomatedOffer): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.phone) return

    const message = `🎉 ${offer.title}\n\n${offer.description}\n\nDiscount: ${offer.discountPercentage}% off\nValid for ${offer.validDays} days\n\nReply STOP to unsubscribe`

    // Send SMS
    await sendSMS(user.phone, message)

    // Send WhatsApp if available
    if (user.phone.startsWith('+94')) {
      await sendWhatsAppMessage(user.phone, message)
    }
  } catch (error) {
    console.error('Error sending loyalty notification:', error)
  }
}

// Points calculation for different activities
export const pointsActivities = {
  order: (amount: number, tier: LoyaltyTier) => calculatePointsEarned(amount, tier),
  review: 10,
  referral: 50,
  birthday: 100,
  social_share: 5,
  check_in: 2
}

export async function awardPoints(userId: string, activity: keyof typeof pointsActivities, amount?: number): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return 0

    const tier = calculateTier(user.loyaltyPoints)
    let pointsToAward = 0

    switch (activity) {
      case 'order':
        if (amount) {
          pointsToAward = calculatePointsEarned(amount, tier)
        }
        break
      case 'review':
        pointsToAward = pointsActivities.review
        break
      case 'referral':
        pointsToAward = pointsActivities.referral
        break
      case 'birthday':
        pointsToAward = pointsActivities.birthday
        break
      case 'social_share':
        pointsToAward = pointsActivities.social_share
        break
      case 'check_in':
        pointsToAward = pointsActivities.check_in
        break
    }

    if (pointsToAward > 0) {
      const newTier = calculateTier(user.loyaltyPoints + pointsToAward)
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: user.loyaltyPoints + pointsToAward,
          tier: newTier.name as any
        }
      })

      // Check if tier changed
      if (newTier.name !== tier.name) {
        await sendLoyaltyNotification(userId, {
          id: `tier-upgrade-${newTier.name.toLowerCase()}`,
          type: 'loyalty_milestone',
          title: `Congratulations! You're now ${newTier.name}! 🎉`,
          description: `You've been upgraded to ${newTier.name} tier with ${newTier.discountPercentage}% discount!`,
          discountPercentage: newTier.discountPercentage,
          validDays: 30,
          conditions: [`${newTier.name} tier benefits`]
        })
      }
    }

    return pointsToAward
  } catch (error) {
    console.error('Error awarding points:', error)
    return 0
  }
}
