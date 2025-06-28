"use client"

import { useState } from "react"
import { ReturnFlow } from "@/components/return-flow"
import { OrderHistory } from "@/components/order-history"
import { SustainabilityDashboard } from "@/components/sustainability-dashboard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Recycle, BarChart3, History, Sparkles } from "lucide-react"
import { motion } from 'framer-motion'

export default function BackLoopApp() {
  const [currentView, setCurrentView] = useState<"home" | "return">("home")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const handleReturnProduct = (product: any) => {
    setSelectedProduct(product)
    setCurrentView("return")
  }

  const handleBackToHome = () => {
    setCurrentView("home")
    setSelectedProduct(null)
  }

  if (currentView === "return") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={handleBackToHome} className="mb-6 hover:bg-white/60 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <ReturnFlow product={selectedProduct} onComplete={handleBackToHome} />
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="container mx-auto px-6 py-16">
         <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <motion.div
                className="bg-emerald-100 rounded-full p-4 shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <Recycle className="w-12 h-12 text-emerald-600 drop-shadow-md" />
              </motion.div>
              <Sparkles className="w-5 h-5 text-sky-400 absolute -top-2 -right-2 animate-ping" />
            </div>

            <motion.h1
              className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-sky-600 bg-clip-text text-transparent drop-shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              BackLoop
            </motion.h1>
          </div>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-2 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Return Better. Recycle Smarter.
          </motion.p>

          <motion.p
            className="text-md md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Creating a circular economy, one return at a time.
          </motion.p>
        </motion.div>

      </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <History className="w-4 h-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger
              value="sustainability"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              Impact
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Recycle className="w-4 h-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <OrderHistory onReturnProduct={handleReturnProduct} />
          </TabsContent>

          <TabsContent value="sustainability" className="mt-0">
            <SustainabilityDashboard />
          </TabsContent>

          <TabsContent value="rewards" className="mt-0">
            <div className="text-center py-20">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/20 shadow-lg">
                <div className="relative mb-6">
                  <Recycle className="w-20 h-20 text-emerald-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Rewards Coming Soon</h3>
                <p className="text-gray-600 leading-relaxed">
                  Earn points for every sustainable return and recycling action!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
