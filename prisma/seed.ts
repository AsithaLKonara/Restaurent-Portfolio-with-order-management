import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Spice Garden",
      description: "Authentic Sri Lankan cuisine with modern twists",
      address: "123 Galle Road, Colombo 03, Sri Lanka",
      phone: "+94 11 234 5678",
      email: "info@spicegarden.lk",
      logo: "/logo.png",
      banner: "/banner.jpg",
      isActive: true,
      vatPercentage: 15.0,
      serviceCharge: 10.0,
      deliveryFee: 200.0,
      minOrderAmount: 500.0,
      maxDeliveryDistance: 10.0
    }
  })

  console.log('✅ Restaurant created:', restaurant.name)

  // Create menu items
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: "Chicken Kottu Roti",
        description: "Traditional stir-fried bread with chicken, vegetables, and aromatic spices",
        price: 18.99,
        image: "/menu/chicken-kottu.jpg",
        category: "Mains",
        isAvailable: true,
        isVegetarian: false,
        isSpicy: true,
        allergens: ["Gluten", "Dairy"],
        preparationTime: 15,
        cost: 8.50,
        profitMargin: 55.2,
        popularity: 95,
        restaurantId: restaurant.id
      }
    }),
    prisma.menuItem.create({
      data: {
        name: "Fish Curry",
        description: "Fresh fish cooked in coconut milk with traditional Sri Lankan spices",
        price: 22.99,
        image: "/menu/fish-curry.jpg",
        category: "Mains",
        isAvailable: true,
        isVegetarian: false,
        isSpicy: true,
        allergens: ["Seafood"],
        preparationTime: 25,
        cost: 12.00,
        profitMargin: 47.8,
        popularity: 88,
        restaurantId: restaurant.id
      }
    }),
    prisma.menuItem.create({
      data: {
        name: "Hoppers (Set of 3)",
        description: "Traditional bowl-shaped pancakes made from fermented rice flour",
        price: 12.99,
        image: "/menu/hoppers.jpg",
        category: "Starters",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["Gluten"],
        preparationTime: 15,
        cost: 4.50,
        profitMargin: 65.4,
        popularity: 92,
        restaurantId: restaurant.id
      }
    }),
    prisma.menuItem.create({
      data: {
        name: "Pol Sambol",
        description: "Spicy coconut relish with chili, onions, and lime",
        price: 8.99,
        image: "/menu/pol-sambol.jpg",
        category: "Sides",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: true,
        allergens: ["Nuts"],
        preparationTime: 10,
        cost: 2.50,
        profitMargin: 72.2,
        popularity: 78,
        restaurantId: restaurant.id
      }
    }),
    prisma.menuItem.create({
      data: {
        name: "Ceylon Tea",
        description: "Premium black tea from the highlands of Sri Lanka",
        price: 4.99,
        image: "/menu/ceylon-tea.jpg",
        category: "Drinks",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: [],
        preparationTime: 5,
        cost: 1.20,
        profitMargin: 75.9,
        popularity: 85,
        restaurantId: restaurant.id
      }
    }),
    prisma.menuItem.create({
      data: {
        name: "Watalappan",
        description: "Traditional coconut custard pudding with jaggery and spices",
        price: 9.99,
        image: "/menu/watalappan.jpg",
        category: "Desserts",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["Dairy", "Eggs"],
        preparationTime: 30,
        cost: 3.50,
        profitMargin: 65.0,
        popularity: 82,
        restaurantId: restaurant.id
      }
    })
  ])

  console.log('✅ Menu items created:', menuItems.length)

  // Create tables
  const tables = await Promise.all([
    prisma.table.create({
      data: {
        number: "1",
        capacity: 4,
        isAvailable: true,
        restaurantId: restaurant.id
      }
    }),
    prisma.table.create({
      data: {
        number: "2",
        capacity: 6,
        isAvailable: true,
        restaurantId: restaurant.id
      }
    }),
    prisma.table.create({
      data: {
        number: "3",
        capacity: 2,
        isAvailable: true,
        restaurantId: restaurant.id
      }
    }),
    prisma.table.create({
      data: {
        number: "4",
        capacity: 8,
        isAvailable: true,
        restaurantId: restaurant.id
      }
    }),
    prisma.table.create({
      data: {
        number: "5",
        capacity: 4,
        isAvailable: true,
        restaurantId: restaurant.id
      }
    })
  ])

  console.log('✅ Tables created:', tables.length)

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@spicegarden.lk",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqG", // admin123
      phone: "+94 77 123 4567",
      role: "ADMIN",
      tier: "GOLD",
      isActive: true
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create staff member
  const staffUser = await prisma.user.create({
    data: {
      name: "Kitchen Staff",
      email: "kitchen@spicegarden.lk",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqG", // admin123
      phone: "+94 77 234 5678",
      role: "STAFF",
      tier: "SILVER",
      isActive: true
    }
  })

  // Create staff record
  await prisma.staff.create({
    data: {
      userId: staffUser.id,
      restaurantId: restaurant.id,
      role: "KITCHEN"
    }
  })

  console.log('✅ Staff user created:', staffUser.email)

  // Create sample customer
  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "customer@example.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqG", // admin123
      phone: "+94 77 345 6789",
      role: "CUSTOMER",
      tier: "BRONZE",
      isActive: true
    }
  })

  console.log('✅ Customer user created:', customer.email)

  // Create sample orders
  const sampleOrders = await Promise.all([
    prisma.order.create({
      data: {
        customerName: "Alice Johnson",
        customerPhone: "+94 77 456 7890",
        customerEmail: "alice@example.com",
        orderType: "DINE_IN",
        paymentMethod: "CASH",
        subtotal: 45.97,
        total: 52.87,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        restaurantId: restaurant.id,
        tableId: tables[0].id,
        items: {
          create: [
            {
              menuItemId: menuItems[0].id,
              quantity: 2,
              price: 18.99,
              specialInstructions: "Extra spicy"
            },
            {
              menuItemId: menuItems[2].id,
              quantity: 1,
              price: 12.99
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        customerName: "Bob Smith",
        customerPhone: "+94 77 567 8901",
        customerEmail: "bob@example.com",
        orderType: "DELIVERY",
        paymentMethod: "CARD",
        deliveryAddress: "123 Lake Drive, Colombo 02",
        deliveryFee: 200.0,
        subtotal: 32.98,
        total: 52.98,
        status: "PREPARING",
        paymentStatus: "PAID",
        restaurantId: restaurant.id,
        items: {
          create: [
            {
              menuItemId: menuItems[1].id,
              quantity: 1,
              price: 22.99
            },
            {
              menuItemId: menuItems[3].id,
              quantity: 1,
              price: 8.99
            }
          ]
        }
      }
    })
  ])

  console.log('✅ Sample orders created:', sampleOrders.length)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
