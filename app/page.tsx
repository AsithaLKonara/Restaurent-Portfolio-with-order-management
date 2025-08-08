import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Phone, Mail, Facebook, Instagram, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

export default function LandingPage() {
  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing authentic Sri Lankan food! The kottu roti was incredible.",
      date: "2 days ago",
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "Best curry in the city. Great atmosphere and friendly staff.",
      date: "1 week ago",
    },
    {
      name: "Priya Patel",
      rating: 5,
      text: "Felt like home! Authentic flavors and generous portions.",
      date: "2 weeks ago",
    },
  ]

  const galleryImages = [
    { src: "/placeholder.svg?height=300&width=400", alt: "Signature Curry" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Restaurant Interior" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Kottu Roti" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Our Chef" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Dining Experience" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Traditional Desserts" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SG</span>
            </div>
            <span className="text-xl font-bold">Spice Garden</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Restaurant Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Modern Sri Lankan Cuisine</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Experience authentic flavors crafted with passion and tradition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                View Menu
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg bg-transparent"
            >
              Reserve Table
            </Button>
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg bg-transparent"
              >
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Founded in 2018, Spice Garden brings the authentic taste of Sri Lanka to your table. Our head chef,
                Kumari Perera, trained in Colombo and brings over 20 years of culinary expertise.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                We use traditional recipes passed down through generations, combined with modern presentation and the
                freshest local ingredients.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Award Winner 2023</Badge>
                <Badge variant="secondary">Best Sri Lankan Restaurant</Badge>
                <Badge variant="secondary">Michelin Recommended</Badge>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Chef Kumari Perera"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="mb-4 text-muted-foreground">"{review.text}"</p>
                  <p className="font-semibold">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SG</span>
                </div>
                <span className="text-lg font-bold">Spice Garden</span>
              </div>
              <p className="text-muted-foreground">Authentic Sri Lankan cuisine in the heart of the city.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>123 Spice Street, Food District</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>hello@spicegarden.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hours</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Mon-Thu: 11AM-10PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Fri-Sat: 11AM-11PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Sunday: 12PM-9PM</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon">
                  <Facebook size={16} />
                </Button>
                <Button variant="outline" size="icon">
                  <Instagram size={16} />
                </Button>
                <Button variant="outline" size="icon">
                  <Camera size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Spice Garden. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
