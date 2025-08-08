// Festival Menu Management for Sri Lankan Restaurants
// Handles special festival menus, pricing, and availability

interface Festival {
  id: string
  name: string
  nameSinhala: string
  nameTamil: string
  startDate: Date
  endDate: Date
  isActive: boolean
  description: string
  specialMenuItems: FestivalMenuItem[]
  pricingMultiplier: number
  isDeliveryAvailable: boolean
  isDineInAvailable: boolean
  specialInstructions: string
}

interface FestivalMenuItem {
  id: string
  name: string
  nameSinhala: string
  nameTamil: string
  description: string
  price: number
  originalPrice: number
  category: string
  isVegetarian: boolean
  isSpicy: boolean
  allergens: string[]
  preparationTime: number
  image: string
  isAvailable: boolean
  festivalId: string
}

class FestivalMenuManager {
  private static instance: FestivalMenuManager
  private festivals: Festival[] = []
  private currentFestival: Festival | null = null

  private constructor() {
    this.initializeFestivals()
  }

  public static getInstance(): FestivalMenuManager {
    if (!FestivalMenuManager.instance) {
      FestivalMenuManager.instance = new FestivalMenuManager()
    }
    return FestivalMenuManager.instance
  }

  private initializeFestivals(): void {
    this.festivals = [
      {
        id: "1",
        name: "Sinhala and Tamil New Year",
        nameSinhala: "සිංහල සහ දෙමළ අලුත් අවුරුද්ද",
        nameTamil: "சிங்கள மற்றும் தமிழ் புத்தாண்டு",
        startDate: new Date("2024-04-13"),
        endDate: new Date("2024-04-15"),
        isActive: true,
        description: "Special traditional menu for the Sinhala and Tamil New Year celebrations",
        specialMenuItems: [
          {
            id: "1",
            name: "Milk Rice with Curry",
            nameSinhala: "කිරිබත් සහ කරවල",
            nameTamil: "பால் சோறு மற்றும் கறி",
            description: "Traditional milk rice served with curry",
            price: 450,
            originalPrice: 350,
            category: "Traditional",
            isVegetarian: false,
            isSpicy: false,
            allergens: ["milk", "rice"],
            preparationTime: 20,
            image: "/images/milk-rice.jpg",
            isAvailable: true,
            festivalId: "1"
          },
          {
            id: "2",
            name: "Kokis",
            nameSinhala: "කොකිස්",
            nameTamil: "கொக்கிஸ்",
            description: "Traditional crispy sweet snack",
            price: 150,
            originalPrice: 120,
            category: "Dessert",
            isVegetarian: true,
            isSpicy: false,
            allergens: ["flour", "sugar"],
            preparationTime: 15,
            image: "/images/kokis.jpg",
            isAvailable: true,
            festivalId: "1"
          }
        ],
        pricingMultiplier: 1.2,
        isDeliveryAvailable: true,
        isDineInAvailable: true,
        specialInstructions: "Pre-orders recommended for New Year"
      },
      {
        id: "2",
        name: "Vesak",
        nameSinhala: "වෙසක්",
        nameTamil: "வேசாக்",
        startDate: new Date("2024-05-23"),
        endDate: new Date("2024-05-25"),
        isActive: true,
        description: "Buddhist festival with special vegetarian menu",
        specialMenuItems: [
          {
            id: "3",
            name: "Dhal Curry",
            nameSinhala: "පරිප්පු කරවල",
            nameTamil: "தால் கறி",
            description: "Traditional dhal curry",
            price: 200,
            originalPrice: 180,
            category: "Vegetarian",
            isVegetarian: true,
            isSpicy: false,
            allergens: ["lentils"],
            preparationTime: 25,
            image: "/images/dhal-curry.jpg",
            isAvailable: true,
            festivalId: "2"
          },
          {
            id: "4",
            name: "Rice and Curry Set",
            nameSinhala: "බත් සහ කරවල",
            nameTamil: "சோறு மற்றும் கறி",
            description: "Complete vegetarian rice and curry set",
            price: 350,
            originalPrice: 300,
            category: "Main Course",
            isVegetarian: true,
            isSpicy: false,
            allergens: ["rice"],
            preparationTime: 30,
            image: "/images/rice-curry.jpg",
            isAvailable: true,
            festivalId: "2"
          }
        ],
        pricingMultiplier: 1.1,
        isDeliveryAvailable: true,
        isDineInAvailable: true,
        specialInstructions: "Vegetarian menu only during Vesak"
      },
      {
        id: "3",
        name: "Ramadan",
        nameSinhala: "රමාදාන්",
        nameTamil: "ரமலான்",
        startDate: new Date("2024-03-10"),
        endDate: new Date("2024-04-09"),
        isActive: true,
        description: "Islamic fasting month with special iftar menu",
        specialMenuItems: [
          {
            id: "5",
            name: "Haleem",
            nameSinhala: "හලීම්",
            nameTamil: "ஹலீம்",
            description: "Traditional meat and wheat porridge",
            price: 400,
            originalPrice: 350,
            category: "Main Course",
            isVegetarian: false,
            isSpicy: false,
            allergens: ["wheat", "meat"],
            preparationTime: 45,
            image: "/images/haleem.jpg",
            isAvailable: true,
            festivalId: "3"
          },
          {
            id: "6",
            name: "Dates and Milk",
            nameSinhala: "ඉඳි සහ කිරි",
            nameTamil: "பேரீச்சம் பழம் மற்றும் பால்",
            description: "Traditional iftar starter",
            price: 100,
            originalPrice: 80,
            category: "Dessert",
            isVegetarian: true,
            isSpicy: false,
            allergens: ["dates", "milk"],
            preparationTime: 5,
            image: "/images/dates-milk.jpg",
            isAvailable: true,
            festivalId: "3"
          }
        ],
        pricingMultiplier: 1.15,
        isDeliveryAvailable: true,
        isDineInAvailable: true,
        specialInstructions: "Iftar packages available for breaking fast"
      },
      {
        id: "4",
        name: "Deepavali",
        nameSinhala: "දීපාවලි",
        nameTamil: "தீபாவளி",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2024-11-03"),
        isActive: true,
        description: "Hindu festival of lights with special sweets",
        specialMenuItems: [
          {
            id: "7",
            name: "Gulab Jamun",
            nameSinhala: "ගුලාබ් ජමුන්",
            nameTamil: "குலாப் ஜாமூன்",
            description: "Traditional Indian sweet",
            price: 120,
            originalPrice: 100,
            category: "Dessert",
            isVegetarian: true,
            isSpicy: false,
            allergens: ["milk", "sugar"],
            preparationTime: 20,
            image: "/images/gulab-jamun.jpg",
            isAvailable: true,
            festivalId: "4"
          },
          {
            id: "8",
            name: "Biryani",
            nameSinhala: "බිරියානි",
            nameTamil: "பிரியாணி",
            description: "Special festival biryani",
            price: 500,
            originalPrice: 450,
            category: "Main Course",
            isVegetarian: false,
            isSpicy: true,
            allergens: ["rice", "spices"],
            preparationTime: 40,
            image: "/images/biryani.jpg",
            isAvailable: true,
            festivalId: "4"
          }
        ],
        pricingMultiplier: 1.25,
        isDeliveryAvailable: true,
        isDineInAvailable: true,
        specialInstructions: "Special sweets and savories available"
      }
    ]

    this.updateCurrentFestival()
  }

  private updateCurrentFestival(): void {
    const today = new Date()
    this.currentFestival = this.festivals.find(festival => 
      festival.isActive && 
      today >= festival.startDate && 
      today <= festival.endDate
    ) || null
  }

  public getCurrentFestival(): Festival | null {
    this.updateCurrentFestival()
    return this.currentFestival
  }

  public getAllFestivals(): Festival[] {
    return this.festivals
  }

  public getUpcomingFestivals(): Festival[] {
    const today = new Date()
    return this.festivals.filter(festival => 
      festival.isActive && festival.startDate > today
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }

  public getFestivalById(id: string): Festival | undefined {
    return this.festivals.find(festival => festival.id === id)
  }

  public getFestivalMenuItems(festivalId: string): FestivalMenuItem[] {
    const festival = this.getFestivalById(festivalId)
    return festival ? festival.specialMenuItems : []
  }

  public getCurrentFestivalMenuItems(): FestivalMenuItem[] {
    const currentFestival = this.getCurrentFestival()
    return currentFestival ? currentFestival.specialMenuItems : []
  }

  public isFestivalActive(festivalId: string): boolean {
    const festival = this.getFestivalById(festivalId)
    if (!festival) return false

    const today = new Date()
    return festival.isActive && 
           today >= festival.startDate && 
           today <= festival.endDate
  }

  public getFestivalPricingMultiplier(): number {
    const currentFestival = this.getCurrentFestival()
    return currentFestival ? currentFestival.pricingMultiplier : 1.0
  }

  public applyFestivalPricing(basePrice: number): number {
    const multiplier = this.getFestivalPricingMultiplier()
    return Math.round(basePrice * multiplier)
  }

  public getFestivalAvailability(): { delivery: boolean; dineIn: boolean } {
    const currentFestival = this.getCurrentFestival()
    if (!currentFestival) {
      return { delivery: true, dineIn: true }
    }

    return {
      delivery: currentFestival.isDeliveryAvailable,
      dineIn: currentFestival.isDineInAvailable
    }
  }

  public getFestivalInstructions(): string {
    const currentFestival = this.getCurrentFestival()
    return currentFestival ? currentFestival.specialInstructions : ""
  }

  public addFestival(festival: Festival): void {
    this.festivals.push(festival)
    this.updateCurrentFestival()
  }

  public updateFestival(id: string, updates: Partial<Festival>): void {
    const index = this.festivals.findIndex(f => f.id === id)
    if (index !== -1) {
      this.festivals[index] = { ...this.festivals[index], ...updates }
      this.updateCurrentFestival()
    }
  }

  public deleteFestival(id: string): void {
    this.festivals = this.festivals.filter(f => f.id !== id)
    this.updateCurrentFestival()
  }

  public addFestivalMenuItem(festivalId: string, menuItem: FestivalMenuItem): void {
    const festival = this.getFestivalById(festivalId)
    if (festival) {
      festival.specialMenuItems.push(menuItem)
    }
  }

  public updateFestivalMenuItem(festivalId: string, menuItemId: string, updates: Partial<FestivalMenuItem>): void {
    const festival = this.getFestivalById(festivalId)
    if (festival) {
      const index = festival.specialMenuItems.findIndex(item => item.id === menuItemId)
      if (index !== -1) {
        festival.specialMenuItems[index] = { ...festival.specialMenuItems[index], ...updates }
      }
    }
  }

  public deleteFestivalMenuItem(festivalId: string, menuItemId: string): void {
    const festival = this.getFestivalById(festivalId)
    if (festival) {
      festival.specialMenuItems = festival.specialMenuItems.filter(item => item.id !== menuItemId)
    }
  }

  public getFestivalStats(): {
    totalFestivals: number
    activeFestivals: number
    upcomingFestivals: number
    currentFestival: string | null
  } {
    const today = new Date()
    const activeFestivals = this.festivals.filter(f => 
      f.isActive && today >= f.startDate && today <= f.endDate
    ).length

    const upcomingFestivals = this.festivals.filter(f => 
      f.isActive && f.startDate > today
    ).length

    return {
      totalFestivals: this.festivals.length,
      activeFestivals,
      upcomingFestivals,
      currentFestival: this.currentFestival?.name || null
    }
  }

  public getFestivalCalendar(): Array<{
    date: Date
    festivals: Festival[]
  }> {
    const calendar: { [key: string]: Festival[] } = {}
    
    this.festivals.forEach(festival => {
      if (!festival.isActive) return
      
      const start = new Date(festival.startDate)
      const end = new Date(festival.endDate)
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0]
        if (!calendar[dateKey]) {
          calendar[dateKey] = []
        }
        calendar[dateKey].push(festival)
      }
    })

    return Object.entries(calendar).map(([date, festivals]) => ({
      date: new Date(date),
      festivals
    })).sort((a, b) => a.date.getTime() - b.date.getTime())
  }
}

// Export singleton instance
export const festivalManager = FestivalMenuManager.getInstance()

// Utility functions for components
export const useFestivalMenu = () => {
  return {
    getCurrentFestival: () => festivalManager.getCurrentFestival(),
    getAllFestivals: () => festivalManager.getAllFestivals(),
    getUpcomingFestivals: () => festivalManager.getUpcomingFestivals(),
    getCurrentFestivalMenuItems: () => festivalManager.getCurrentFestivalMenuItems(),
    isFestivalActive: (id: string) => festivalManager.isFestivalActive(id),
    applyFestivalPricing: (price: number) => festivalManager.applyFestivalPricing(price),
    getFestivalAvailability: () => festivalManager.getFestivalAvailability(),
    getFestivalInstructions: () => festivalManager.getFestivalInstructions(),
    getFestivalStats: () => festivalManager.getFestivalStats(),
    getFestivalCalendar: () => festivalManager.getFestivalCalendar()
  }
}

// Festival menu component helper
export const getFestivalDisplayName = (festival: Festival, language: 'en' | 'si' | 'ta' = 'en'): string => {
  switch (language) {
    case 'si':
      return festival.nameSinhala
    case 'ta':
      return festival.nameTamil
    default:
      return festival.name
  }
}

export const getFestivalMenuItemDisplayName = (item: FestivalMenuItem, language: 'en' | 'si' | 'ta' = 'en'): string => {
  switch (language) {
    case 'si':
      return item.nameSinhala
    case 'ta':
      return item.nameTamil
    default:
      return item.name
  }
}
