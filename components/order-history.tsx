"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Recycle, Package, Truck, Calendar } from "lucide-react"
import Image from "next/image"

interface Order {
  id: string
  date: string
  items: {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    returnable: boolean
    returnDeadline?: string
  }[]
  status: "delivered" | "shipped" | "processing"
  total: number
}

const orders: Order[] = [
  {
    id: "ORD-2025-002",
    date: "2025-06-28",
    status: "delivered",
    total: 2398,
    items: [
      {
        id: "1",
        name: "MERCAPE® - 100% Pure Copper Water Bottle | Eco Friendly Water Bottle (900 ml)",
        price: 899,
        image: "https://m.media-amazon.com/images/I/51gO-y0DDBL._SX300_SY300_QL70_FMwebp_.jpg",
        quantity: 1,
        returnable: true,
        returnDeadline: "2025-06-30",
      },
      {
        id: "2",
        name: "NOBERO Men's Solid Regular Fit Cotton T-Shirt with Round Neck (Pack of 3)",
        price: 1499,
        image: "https://m.media-amazon.com/images/I/41xlIZwU5KL._SX679_.jpg",
        quantity: 1,
        returnable: true,
        returnDeadline: "2025-06-30",
      },
    ],
  },
  {
    id: "ORD-2024-001",
    date: "2024-12-15",
    status: "delivered",
    total: 5498,
    items: [
      {
        id: "3",
        name: "CreateYourTaste - Bamboo Storage Box/Jar with lid (Set of 2, 6 * 6 * 10 inches)",
        price: 2199,
        image: "https://m.media-amazon.com/images/I/81MVWnfXnXL._SY879_.jpg",
        quantity: 1,
        returnable: false,
        returnDeadline: undefined,
      },
      {
        id: "4",
        name: "New Backpack | Water-resistant, Lightweight| Travel, School, Casual, Laptop",
        price: 3299,
        image: "https://m.media-amazon.com/images/I/51hHVqAl2CL.jpg",
        quantity: 1,
        returnable: false,
        returnDeadline: undefined,
      },
    ],
  },
]

interface OrderHistoryProps {
  onReturnProduct: (product: any) => void
}

export function OrderHistory({ onReturnProduct }: OrderHistoryProps) {
  const isWithinReturnWindow = (deadline?: string) => {
    if (!deadline) return false
    return new Date(deadline) > new Date()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package className="w-4 h-4 text-emerald-500" />
      case "shipped":
        return <Truck className="w-4 h-4 text-sky-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "shipped":
        return "bg-sky-100 text-sky-800 border-sky-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Your Orders</h2>
        <p className="text-gray-600 text-lg">Manage returns and track your sustainability impact</p>
      </div>

      {orders.map((order) => (
        <Card
          key={order.id}
          className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  {getStatusIcon(order.status)}
                  <span className="font-bold">Order {order.id}</span>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(order.date).toLocaleString("default", { month: "short" })}{" "}
                      {new Date(order.date).getDate()}, {new Date(order.date).getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">₹{order.total}</span>
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/90 transition-all duration-200"
                >
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-xl shadow-md"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-lg text-gray-800">{item.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-semibold text-gray-800">₹{item.price}</span>
                    </div>

                    {item.returnable && item.returnDeadline && (
                      <div className="mt-3">
                        {isWithinReturnWindow(item.returnDeadline) ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Return by {new Date(item.returnDeadline).toLocaleDateString()}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600 border-gray-300">
                            Return window expired
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {item.returnable && isWithinReturnWindow(item.returnDeadline) ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReturnProduct({ ...item, returnType: "faulty" })}
                          className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Return
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReturnProduct({ ...item, returnType: "recycle" })}
                          className="flex items-center gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                        >
                          <Recycle className="w-4 h-4" />
                          Recycle
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReturnProduct({ ...item, returnType: "recycle" })}
                        className="flex items-center gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                      >
                        <Recycle className="w-4 h-4" />
                        Recycle Only
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
