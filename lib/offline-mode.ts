// Offline Mode Implementation for Restaurant Platform
// Handles data synchronization, local storage, and offline functionality

interface OfflineData {
  orders: any[]
  menuItems: any[]
  customers: any[]
  reservations: any[]
  lastSync: Date
  pendingActions: PendingAction[]
}

interface PendingAction {
  id: string
  type: 'CREATE_ORDER' | 'UPDATE_ORDER' | 'CREATE_RESERVATION' | 'UPDATE_MENU'
  data: any
  timestamp: Date
  retryCount: number
}

class OfflineModeManager {
  private static instance: OfflineModeManager
  private isOnline: boolean = navigator.onLine
  private offlineData: OfflineData
  private syncQueue: PendingAction[] = []
  private syncInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.offlineData = this.loadOfflineData()
    this.setupEventListeners()
    this.startSyncInterval()
  }

  public static getInstance(): OfflineModeManager {
    if (!OfflineModeManager.instance) {
      OfflineModeManager.instance = new OfflineModeManager()
    }
    return OfflineModeManager.instance
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.onConnectionRestored()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.onConnectionLost()
    })
  }

  private loadOfflineData(): OfflineData {
    try {
      const stored = localStorage.getItem('restaurant_offline_data')
      if (stored) {
        const data = JSON.parse(stored)
        return {
          ...data,
          lastSync: new Date(data.lastSync),
          pendingActions: data.pendingActions.map((action: any) => ({
            ...action,
            timestamp: new Date(action.timestamp)
          }))
        }
      }
    } catch (error) {
      console.error('Error loading offline data:', error)
    }

    return {
      orders: [],
      menuItems: [],
      customers: [],
      reservations: [],
      lastSync: new Date(),
      pendingActions: []
    }
  }

  private saveOfflineData(): void {
    try {
      localStorage.setItem('restaurant_offline_data', JSON.stringify(this.offlineData))
    } catch (error) {
      console.error('Error saving offline data:', error)
    }
  }

  public isOnlineMode(): boolean {
    return this.isOnline
  }

  public async createOrder(orderData: any): Promise<any> {
    if (this.isOnline) {
      try {
        // Try to create order online
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })
        
        if (response.ok) {
          const order = await response.json()
          this.offlineData.orders.push(order)
          this.saveOfflineData()
          return order
        } else {
          throw new Error('Failed to create order online')
        }
      } catch (error) {
        console.warn('Online order creation failed, switching to offline mode:', error)
        return this.createOrderOffline(orderData)
      }
    } else {
      return this.createOrderOffline(orderData)
    }
  }

  private createOrderOffline(orderData: any): any {
    const offlineOrder = {
      id: `offline_${Date.now()}`,
      ...orderData,
      status: 'PENDING',
      createdAt: new Date(),
      isOffline: true
    }

    this.offlineData.orders.push(offlineOrder)
    
    // Add to pending actions
    this.addPendingAction({
      type: 'CREATE_ORDER',
      data: orderData,
      id: `order_${Date.now()}`,
      timestamp: new Date(),
      retryCount: 0
    })

    this.saveOfflineData()
    return offlineOrder
  }

  public async updateOrder(orderId: string, updates: any): Promise<any> {
    if (this.isOnline) {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        
        if (response.ok) {
          const updatedOrder = await response.json()
          this.updateLocalOrder(orderId, updatedOrder)
          return updatedOrder
        } else {
          throw new Error('Failed to update order online')
        }
      } catch (error) {
        console.warn('Online order update failed, switching to offline mode:', error)
        return this.updateOrderOffline(orderId, updates)
      }
    } else {
      return this.updateOrderOffline(orderId, updates)
    }
  }

  private updateOrderOffline(orderId: string, updates: any): any {
    const orderIndex = this.offlineData.orders.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      this.offlineData.orders[orderIndex] = {
        ...this.offlineData.orders[orderIndex],
        ...updates,
        updatedAt: new Date()
      }
    }

    this.addPendingAction({
      type: 'UPDATE_ORDER',
      data: { orderId, updates },
      id: `update_${Date.now()}`,
      timestamp: new Date(),
      retryCount: 0
    })

    this.saveOfflineData()
    return this.offlineData.orders[orderIndex]
  }

  public async createReservation(reservationData: any): Promise<any> {
    if (this.isOnline) {
      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservationData)
        })
        
        if (response.ok) {
          const reservation = await response.json()
          this.offlineData.reservations.push(reservation)
          this.saveOfflineData()
          return reservation
        } else {
          throw new Error('Failed to create reservation online')
        }
      } catch (error) {
        console.warn('Online reservation creation failed, switching to offline mode:', error)
        return this.createReservationOffline(reservationData)
      }
    } else {
      return this.createReservationOffline(reservationData)
    }
  }

  private createReservationOffline(reservationData: any): any {
    const offlineReservation = {
      id: `offline_reservation_${Date.now()}`,
      ...reservationData,
      status: 'PENDING',
      createdAt: new Date(),
      isOffline: true
    }

    this.offlineData.reservations.push(offlineReservation)
    
    this.addPendingAction({
      type: 'CREATE_RESERVATION',
      data: reservationData,
      id: `reservation_${Date.now()}`,
      timestamp: new Date(),
      retryCount: 0
    })

    this.saveOfflineData()
    return offlineReservation
  }

  public async updateMenu(menuData: any): Promise<any> {
    if (this.isOnline) {
      try {
        const response = await fetch('/api/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menuData)
        })
        
        if (response.ok) {
          const updatedMenu = await response.json()
          this.updateLocalMenu(updatedMenu)
          return updatedMenu
        } else {
          throw new Error('Failed to update menu online')
        }
      } catch (error) {
        console.warn('Online menu update failed, switching to offline mode:', error)
        return this.updateMenuOffline(menuData)
      }
    } else {
      return this.updateMenuOffline(menuData)
    }
  }

  private updateMenuOffline(menuData: any): any {
    // Update local menu data
    this.offlineData.menuItems = menuData

    this.addPendingAction({
      type: 'UPDATE_MENU',
      data: menuData,
      id: `menu_${Date.now()}`,
      timestamp: new Date(),
      retryCount: 0
    })

    this.saveOfflineData()
    return menuData
  }

  private addPendingAction(action: PendingAction): void {
    this.offlineData.pendingActions.push(action)
    this.syncQueue.push(action)
  }

  private updateLocalOrder(orderId: string, updatedOrder: any): void {
    const index = this.offlineData.orders.findIndex(o => o.id === orderId)
    if (index !== -1) {
      this.offlineData.orders[index] = updatedOrder
    }
  }

  private updateLocalMenu(menuData: any): void {
    this.offlineData.menuItems = menuData
  }

  public getOfflineOrders(): any[] {
    return this.offlineData.orders
  }

  public getOfflineReservations(): any[] {
    return this.offlineData.reservations
  }

  public getOfflineMenu(): any[] {
    return this.offlineData.menuItems
  }

  public getPendingActions(): PendingAction[] {
    return this.offlineData.pendingActions
  }

  private startSyncInterval(): void {
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.syncPendingActions()
      }
    }, 30000) // Sync every 30 seconds
  }

  private async syncPendingActions(): Promise<void> {
    const actionsToSync = [...this.syncQueue]
    
    for (const action of actionsToSync) {
      try {
        await this.processPendingAction(action)
        this.removePendingAction(action.id)
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error)
        action.retryCount++
        
        if (action.retryCount >= 3) {
          console.error(`Action ${action.id} failed after 3 retries, removing from queue`)
          this.removePendingAction(action.id)
        }
      }
    }
  }

  private async processPendingAction(action: PendingAction): Promise<void> {
    switch (action.type) {
      case 'CREATE_ORDER':
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        })
        break

      case 'UPDATE_ORDER':
        await fetch(`/api/orders/${action.data.orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data.updates)
        })
        break

      case 'CREATE_RESERVATION':
        await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        })
        break

      case 'UPDATE_MENU':
        await fetch('/api/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        })
        break
    }
  }

  private removePendingAction(actionId: string): void {
    this.offlineData.pendingActions = this.offlineData.pendingActions.filter(
      action => action.id !== actionId
    )
    this.syncQueue = this.syncQueue.filter(action => action.id !== actionId)
    this.saveOfflineData()
  }

  private onConnectionRestored(): void {
    console.log('Connection restored, syncing pending actions...')
    this.syncPendingActions()
    
    // Update last sync time
    this.offlineData.lastSync = new Date()
    this.saveOfflineData()
  }

  private onConnectionLost(): void {
    console.log('Connection lost, switching to offline mode')
  }

  public getLastSyncTime(): Date {
    return this.offlineData.lastSync
  }

  public getSyncStatus(): { isOnline: boolean; pendingActions: number; lastSync: Date } {
    return {
      isOnline: this.isOnline,
      pendingActions: this.offlineData.pendingActions.length,
      lastSync: this.offlineData.lastSync
    }
  }

  public clearOfflineData(): void {
    this.offlineData = {
      orders: [],
      menuItems: [],
      customers: [],
      reservations: [],
      lastSync: new Date(),
      pendingActions: []
    }
    this.syncQueue = []
    this.saveOfflineData()
  }

  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
  }
}

// Export singleton instance
export const offlineManager = OfflineModeManager.getInstance()

// Utility functions for components
export const useOfflineMode = () => {
  return {
    isOnline: offlineManager.isOnlineMode(),
    getSyncStatus: () => offlineManager.getSyncStatus(),
    getOfflineOrders: () => offlineManager.getOfflineOrders(),
    getOfflineReservations: () => offlineManager.getOfflineReservations(),
    getOfflineMenu: () => offlineManager.getOfflineMenu(),
    createOrder: (data: any) => offlineManager.createOrder(data),
    updateOrder: (id: string, updates: any) => offlineManager.updateOrder(id, updates),
    createReservation: (data: any) => offlineManager.createReservation(data),
    updateMenu: (data: any) => offlineManager.updateMenu(data)
  }
}

// Service Worker registration for offline functionality
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}
