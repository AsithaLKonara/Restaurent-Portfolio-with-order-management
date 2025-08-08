"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Save } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Spice Garden",
    address: "123 Spice Street, Food District",
    phone: "+1 (555) 123-4567",
    email: "hello@spicegarden.com",
    description: "Authentic Sri Lankan cuisine in the heart of the city.",
    currency: "USD",
    taxRate: 8.5,
    tipSuggestions: [15, 18, 20, 25],
  })

  const [qrSettings, setQrSettings] = useState({
    baseUrl: "https://spicegarden.com/menu",
    tableCount: 20,
  })

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem("businessInfo", JSON.stringify(businessInfo))
    localStorage.setItem("qrSettings", JSON.stringify(qrSettings))
    alert("Settings saved successfully!")
  }

  const generateQRCode = (tableNumber: number) => {
    const url = `${qrSettings.baseUrl}?table=${tableNumber}`
    // In a real app, this would generate actual QR codes
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  }

  const downloadAllQRCodes = () => {
    // In a real app, this would generate and download a PDF with all QR codes
    alert("QR codes would be downloaded as PDF in a real implementation")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your restaurant settings and preferences</p>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="payment">Payment & Tax</TabsTrigger>
          <TabsTrigger value="qr">QR Codes</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your restaurant's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Restaurant Name</Label>
                  <Input
                    id="businessName"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment & Tax Settings</CardTitle>
              <CardDescription>Configure currency, tax rates, and tip suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={businessInfo.currency}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, currency: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={businessInfo.taxRate}
                    onChange={(e) =>
                      setBusinessInfo((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tip Suggestions (%)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {businessInfo.tipSuggestions.map((tip, index) => (
                    <Input
                      key={index}
                      type="number"
                      value={tip}
                      onChange={(e) => {
                        const newTips = [...businessInfo.tipSuggestions]
                        newTips[index] = Number.parseInt(e.target.value) || 0
                        setBusinessInfo((prev) => ({ ...prev, tipSuggestions: newTips }))
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Management</CardTitle>
              <CardDescription>Generate QR codes for your tables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Menu Base URL</Label>
                  <Input
                    id="baseUrl"
                    value={qrSettings.baseUrl}
                    onChange={(e) => setQrSettings((prev) => ({ ...prev, baseUrl: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tableCount">Number of Tables</Label>
                  <Input
                    id="tableCount"
                    type="number"
                    value={qrSettings.tableCount}
                    onChange={(e) =>
                      setQrSettings((prev) => ({ ...prev, tableCount: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Generate QR codes for tables 1-{qrSettings.tableCount}</p>
                <Button onClick={downloadAllQRCodes}>
                  <Download size={16} className="mr-2" />
                  Download All QR Codes
                </Button>
              </div>

              {/* Sample QR Codes */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map((tableNum) => (
                  <div key={tableNum} className="text-center">
                    <div className="border rounded-lg p-4 mb-2">
                      <img
                        src={generateQRCode(tableNum) || "/placeholder.svg"}
                        alt={`Table ${tableNum} QR Code`}
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm font-medium">Table {tableNum}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sounds">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">Play sound when new orders arrive</p>
                </div>
                <Switch id="sounds" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
