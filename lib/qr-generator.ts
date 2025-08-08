import QRCode from 'qrcode'

export interface QRCodeData {
  tableId: string
  tableNumber: string
  restaurantId: string
  restaurantName: string
  url: string
}

export async function generateTableQRCode(data: QRCodeData): Promise<string> {
  try {
    const qrData = {
      tableId: data.tableId,
      tableNumber: data.tableNumber,
      restaurantId: data.restaurantId,
      restaurantName: data.restaurantName,
      url: `${data.url}/table/${data.tableId}`,
      timestamp: new Date().toISOString()
    }

    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateRestaurantQRCode(restaurantId: string, restaurantName: string, baseUrl: string): Promise<string> {
  try {
    const qrData = {
      restaurantId,
      restaurantName,
      url: `${baseUrl}/restaurant/${restaurantId}`,
      timestamp: new Date().toISOString()
    }

    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating restaurant QR code:', error)
    throw new Error('Failed to generate restaurant QR code')
  }
}

export function parseQRCodeData(qrData: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrData)
    return {
      tableId: data.tableId,
      tableNumber: data.tableNumber,
      restaurantId: data.restaurantId,
      restaurantName: data.restaurantName,
      url: data.url
    }
  } catch (error) {
    console.error('Error parsing QR code data:', error)
    return null
  }
}
