import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Leaf, Droplets, Zap, Recycle, Award, TrendingUp, TreePine, Factory } from "lucide-react"

export function SustainabilityDashboard() {
  const impactStats = {
    totalReturns: 8,
    wasteReduced: 28.5,
    waterSaved: 180,
    co2Reduced: 42.3,
    ecoPoints: 350,
    level: "Eco Warrior",
  }

  const monthlyImpact = [
    { month: "Jan", returns: 2, waste: 7.2 },
    { month: "Feb", returns: 1, waste: 6.8 },
    { month: "Mar", returns: 0, waste: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Sustainability Impact</h2>
        <p className="text-gray-600">Track how your returns are helping the planet</p>
      </div>

      {/* Level and Points */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{impactStats.level}</h3>
              <p className="opacity-90">Level 3 • {impactStats.ecoPoints} EcoPoints</p>
            </div>
            <Award className="w-12 h-12 opacity-80" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to next level</span>
              <span>350/1000</span>
            </div>
            <Progress value={35} className="bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Recycle className="w-4 h-4 text-green-500" />
              Total Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats.totalReturns}</div>
            <p className="text-xs text-muted-foreground">Items recycled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="w-4 h-4 text-orange-500" />
              Waste Reduced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats.wasteReduced}kg</div>
            <p className="text-xs text-muted-foreground">Diverted from landfills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Water Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats.waterSaved}L</div>
            <p className="text-xs text-muted-foreground">Manufacturing water</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              CO₂ Reduced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactStats.co2Reduced}kg</div>
            <p className="text-xs text-muted-foreground">Carbon emissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Impact Trend
          </CardTitle>
          <CardDescription>Your sustainability journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyImpact.map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{month.month}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{month.returns} returns</span>
                    <span>{month.waste}kg waste reduced</span>
                  </div>
                  <Progress value={(month.returns / 5) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <TreePine className="w-8 h-8 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-800">Tree Saver</h4>
                <p className="text-sm text-green-600">Saved equivalent of 2 trees</p>
              </div>
              <Badge className="ml-auto bg-green-500">New!</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Droplets className="w-8 h-8 text-blue-500" />
              <div>
                <h4 className="font-semibold text-blue-800">Water Guardian</h4>
                <p className="text-sm text-blue-600">Saved 100+ liters of water</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Equivalents */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Equivalents</CardTitle>
          <CardDescription>Your impact in everyday terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <TreePine className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold">2.1 Trees</div>
              <div className="text-sm text-gray-600">Worth of CO₂ absorbed</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold">320 Bottles</div>
              <div className="text-sm text-gray-600">Of water saved (500ml each)</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-bold">107 kWh</div>
              <div className="text-sm text-gray-600">Energy saved in production</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
