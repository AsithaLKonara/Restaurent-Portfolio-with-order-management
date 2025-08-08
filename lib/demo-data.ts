// Initialize demo data for testing
export const initializeDemoData = () => {
  // Create demo user if not exists
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  if (users.length === 0) {
    const demoUser = {
      id: "demo-user-1",
      name: "John Doe",
      email: "user@example.com",
      password: "password123",
      phone: "+1 (555) 123-4567",
      joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      totalOrders: 8,
      totalSpent: 156.75,
      loyaltyPoints: 157,
      tier: "Bronze",
      lastOrderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    }

    localStorage.setItem("users", JSON.stringify([demoUser]))

    // Create demo orders for the user
    const demoOrders = [
      {
        id: "order-1",
        userId: "demo-user-1",
        items: [
          { id: "1", name: "Chicken Kottu Roti", price: 18.99, quantity: 1 },
          { id: "5", name: "Ceylon Tea", price: 4.99, quantity: 2 },
        ],
        tableNumber: "5",
        total: 28.97,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "delivered",
        specialInstructions: "Extra spicy please",
      },
      {
        id: "order-2",
        userId: "demo-user-1",
        items: [
          { id: "2", name: "Fish Curry", price: 22.99, quantity: 1 },
          { id: "4", name: "Pol Sambol", price: 8.99, quantity: 1 },
        ],
        tableNumber: "3",
        total: 31.98,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "delivered",
      },
      {
        id: "order-3",
        userId: "demo-user-1",
        items: [
          { id: "3", name: "Hoppers (Set of 3)", price: 12.99, quantity: 2 },
          { id: "6", name: "Watalappan", price: 9.99, quantity: 1 },
        ],
        tableNumber: "7",
        total: 35.97,
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "delivered",
      },
      {
        id: "order-4",
        userId: "demo-user-1",
        items: [
          { id: "1", name: "Chicken Kottu Roti", price: 18.99, quantity: 2 },
          { id: "5", name: "Ceylon Tea", price: 4.99, quantity: 3 },
        ],
        tableNumber: "2",
        total: 52.95,
        timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: "delivered",
      },
    ]

    localStorage.setItem("userOrders", JSON.stringify(demoOrders))
  }
}
