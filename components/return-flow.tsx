"use client"

import type React from "react"
import { Recycle, CheckCircle, AlertTriangle, Phone, Camera, Receipt, Plus } from "lucide-react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface ReturnFlowProps {
  product: any
  onComplete: () => void
}

type ReturnType = "faulty" | "recycle"
type FlowStep = "instructions" | "problem" | "solution" | "upload" | "estimate" | "confirm" | "complete"

export function ReturnFlow({ product, onComplete }: ReturnFlowProps) {
  const [returnType] = useState<ReturnType>(product.returnType || "recycle")
  const [currentStep, setCurrentStep] = useState<FlowStep>(returnType === "faulty" ? "instructions" : "upload")
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [billNumber, setBillNumber] = useState("")
  const [condition, setCondition] = useState("")
  const [estimatedValue, setEstimatedValue] = useState(0)
  const [cartValue, setCartValue] = useState(1500)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState("")
  const [selectedSolution, setSelectedSolution] = useState("")
  const [problemDescription, setProblemDescription] = useState("")
  const [instructionsAccepted, setInstructionsAccepted] = useState(false)
  const [photoError, setPhotoError] = useState("")
  const [billError, setBillError] = useState("")
  const [showAddItems, setShowAddItems] = useState(false)

  const problems = [
    { id: "wrong-color", label: "Wrong Color Sent", description: "Received different color than ordered", icon: "🎨" },
    { id: "wrong-size", label: "Wrong Size", description: "Size doesn't match the order", icon: "📏" },
    {
      id: "different-product",
      label: "Different Product",
      description: "Completely different item received",
      icon: "📦",
    },
    { id: "damaged", label: "Product Already Damaged", description: "Item arrived with defects or damage", icon: "💔" },
    { id: "not-working", label: "Not Working Properly", description: "Product has functional issues", icon: "⚠️" },
    { id: "other", label: "Other Issue", description: "Describe your specific problem", icon: "💭" },
  ]

const validatePhoto = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    // needed for debug
    console.log(`🖼️ Uploaded file: ${fileName}`);
    console.log(`📄 Detected type: ${fileType}`);

    setTimeout(() => {
      // Accept only if it's literally a .webp file
      const isValidProduct = fileType === 'image/webp';
      console.log(`✅ Validation result: ${isValidProduct}`);
      resolve(isValidProduct);
    }, 1500);
  });
};




  const validateBillNumber = (billNum: string): boolean => {
    // Check format: ECO-YYYY-XXXXXX
    const billFormat = /^ECO-\d{4}-\d{6}$/
    if (!billFormat.test(billNum)) {
      setBillError("Invalid bill format. Use: ECO-YYYY-XXXXXX")
      return false
    }

    // Simulate checking if bill contains this product
    const validBills = ["ECO-2025-001127", "ECO-2025-789012", "ECO-2024-345678"]
    if (!validBills.includes(billNum)) {
      setBillError("This bill number doesn't contain your purchase. You can only return EcoMart items.")
      return false
    }

    setBillError("")
    return true
  }

  const generateEstimate = async () => {
    setIsProcessing(true)
    setPhotoError("")
    
    // again hardcoded so is always true
  
    try {
     
      if (uploadedPhoto) {
      const isValidPhoto = true

      if (!isValidPhoto) {
        setPhotoError("Invalid product detected. Please upload a clear photo of the correct product.")
        setIsProcessing(false)
        return
      }
      }

      // Validate bill if provided
      if (billNumber && !validateBillNumber(billNumber)) {
        setIsProcessing(false)
        return
      }

      setTimeout(() => {
        const baseValue = product.price * 0.3

        // Condition impact on price
        let conditionMultiplier = 1.0
        const conditionLower = condition.toLowerCase()
        if (conditionLower.includes("excellent") || conditionLower.includes("like new")) {
          conditionMultiplier = 1.4
        } else if (conditionLower.includes("good")) {
          conditionMultiplier = 1.2
        } else if (conditionLower.includes("fair") || conditionLower.includes("average")) {
          conditionMultiplier = 1.0
        } else if (conditionLower.includes("poor") || conditionLower.includes("damaged")) {
          conditionMultiplier = 0.6
        }

        // Bill number bonus
        const billBonus = billNumber ? 1.1 : 1.0

        setEstimatedValue(Math.round(baseValue * conditionMultiplier * billBonus))
        setIsProcessing(false)
        setCurrentStep("estimate")
      }, 2000)
    } catch (error) {
      setIsProcessing(false)
      setPhotoError("Error processing image. Please try again.")
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhotoError("")
      setIsProcessing(true)

      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setUploadedPhoto(result)

        // Validate the uploaded photo
        const isValid = await validatePhoto(file)
        setIsProcessing(false)

        if (!isValid) {
          setPhotoError(
            "AI couldn't identify the correct product. Please ensure the whole product is visible and try again.",
          )
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const renderStepIndicator = () => {
    const faultySteps = ["Instructions", "Problem", "Solution", "Confirm", "Complete"]
    const recycleSteps = ["Upload Details", "AI Estimate", "Confirm", "Complete"]
    const steps = returnType === "faulty" ? faultySteps : recycleSteps

    const stepKeys =
      returnType === "faulty"
        ? ["instructions", "problem", "solution", "confirm", "complete"]
        : ["upload", "estimate", "confirm", "complete"]

    const currentIndex = stepKeys.indexOf(currentStep)

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  index <= currentIndex
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                    : "bg-white/60 text-gray-500 border-2 border-gray-200"
                }`}
              >
                {index < currentIndex ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
                    index < currentIndex ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-lg font-semibold text-gray-700">{steps[currentIndex]}</span>
        </div>
      </div>
    )
  }

  // Faulty Product Return Flow (keeping existing implementation)
  if (returnType === "faulty" && currentStep === "instructions") {
    return (
      <div className="max-w-3xl mx-auto">
        {renderStepIndicator()}

        <Card className="mb-8 bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-xl shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-lg text-emerald-600 font-semibold">₹{product.price}</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-600 text-xl">
              <AlertTriangle className="w-6 h-6" />
              Return Instructions
            </CardTitle>
            <CardDescription className="text-base">
              Please read carefully before proceeding with your return
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200">
              <h4 className="font-bold mb-4 text-orange-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Important Guidelines:
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Product seal should not be broken (if applicable)",
                  "Original packaging and tags must be intact",
                  "All accessories and manuals should be included",
                  "Product should be in original condition (unless damaged on arrival)",
                  "Return must be initiated within 14 days of delivery",
                ].map((guideline, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1 font-bold">•</span>
                    <span className="text-gray-700">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-200">
              <h4 className="font-bold mb-3 text-sky-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                What happens next?
              </h4>
              <p className="text-sky-700 leading-relaxed">
                After reporting the issue, you can choose to exchange the product (free) or get a full refund. Our team
                will arrange free pickup within 2-3 business days.
              </p>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-white/30">
              <Checkbox
                id="instructions"
                checked={instructionsAccepted}
                onCheckedChange={(checked: boolean) => setInstructionsAccepted(checked as boolean)}
                className="w-5 h-5"
              />
              <Label htmlFor="instructions" className="text-base font-medium cursor-pointer">
                I have read and understood the return instructions
              </Label>
            </div>

            <Button
              onClick={() => setCurrentStep("problem")}
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
              disabled={!instructionsAccepted}
            >
              Continue to Report Problem
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (returnType === "faulty" && currentStep === "problem") {
    return (
      <div className="max-w-3xl mx-auto">
        {renderStepIndicator()}

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">What's the problem with your order?</CardTitle>
            <CardDescription className="text-base">Select the issue you're experiencing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={selectedProblem} onValueChange={setSelectedProblem}>
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-start space-x-4 p-5 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/90 transition-all duration-200 cursor-pointer"
                >
                  <RadioGroupItem value={problem.id} id={problem.id} className="mt-2 w-5 h-5" />
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{problem.icon}</span>
                    <div>
                      <Label htmlFor={problem.id} className="text-base font-semibold cursor-pointer text-gray-800">
                        {problem.label}
                      </Label>
                      <p className="text-gray-600 mt-1">{problem.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {selectedProblem === "other" && (
              <div className="mt-6">
                <Label htmlFor="description" className="text-base font-medium">
                  Describe the problem
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about the issue you're facing..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="mt-2 bg-white/80 border-white/30 min-h-[100px]"
                />
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setCurrentStep("instructions")} className="px-8">
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("solution")}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
                disabled={!selectedProblem || (selectedProblem === "other" && !problemDescription)}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (returnType === "faulty" && currentStep === "solution") {
    return (
      <div className="max-w-4xl mx-auto">
        {renderStepIndicator()}

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Choose your preferred solution</CardTitle>
            <CardDescription className="text-base">We'll arrange free pickup for either option</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedSolution === "exchange"
                    ? "ring-2 ring-emerald-500 bg-emerald-50/50 shadow-lg"
                    : "bg-white/80 hover:bg-white/90"
                }`}
                onClick={() => setSelectedSolution("exchange")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-emerald-600">
                    <Recycle className="w-6 h-6" />
                    Exchange Product
                  </CardTitle>
                  <CardDescription className="text-base">Get a replacement item</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Processing:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 font-semibold">Free</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pickup:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 font-semibold">Free</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Timeline:</span>
                      <span className="font-medium">3-5 business days</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">Recommended</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedSolution === "refund"
                    ? "ring-2 ring-sky-500 bg-sky-50/50 shadow-lg"
                    : "bg-white/80 hover:bg-white/90"
                }`}
                onClick={() => setSelectedSolution("refund")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-sky-600">
                    <Receipt className="w-6 h-6" />
                    Full Refund
                  </CardTitle>
                  <CardDescription className="text-base">Get your money back</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Refund Amount:</span>
                      <span className="font-bold text-lg">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Processing:</span>
                      <Badge className="bg-sky-100 text-sky-800 font-semibold">Free</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Timeline:</span>
                      <span className="font-medium">5-7 business days</span>
                    </div>
                    <Badge className="bg-sky-100 text-sky-800">Original payment method</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={() => setCurrentStep("problem")} className="px-8">
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep("confirm")}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
                disabled={!selectedSolution}
              >
                Continue with {selectedSolution === "exchange" ? "Exchange" : "Refund"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Enhanced Recycling Flow
  if (currentStep === "upload") {
    return (
      <div className="max-w-3xl mx-auto">
        {renderStepIndicator()}

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Recycle className="w-6 h-6 text-emerald-600" />
              Upload Product Details
            </CardTitle>
            <CardDescription className="text-base">Help our AI estimate the value of your used item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Photo Upload with Enhanced Instructions */}
            <div>
              <Label htmlFor="photo" className="text-base font-medium">
                Product Photo *
              </Label>
              <div className="mt-3">
                {uploadedPhoto ? (
                  <div className="relative">
                    <img
                      src={uploadedPhoto || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm"
                      onClick={() => {
                        setUploadedPhoto(null)
                        setPhotoError("")
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center bg-emerald-50/50">
                    <Camera className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2 text-base font-medium">Upload a clear photo of the item</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Make sure the whole product is visible in good lighting
                    </p>
                    <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("photo")?.click()}
                      className="bg-white/80 hover:bg-white border-emerald-200"
                      disabled={isProcessing}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : "Choose Photo"}
                    </Button>
                  </div>
                )}
              </div>

              {photoError && (
                <Alert className="mt-3 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {photoError}
                    {photoError.includes("couldn't identify") && (
                      <div className="mt-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>Need help? Call: +91 9372665103</span>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Enhanced Bill Upload */}
            <div>
              <Label htmlFor="bill" className="text-base font-medium">
                Original Bill/Receipt (Optional)
              </Label>
              <div className="mt-3 flex gap-3">
                <Input
                  id="bill"
                  placeholder="ECO-2024-123456"
                  value={billNumber}
                  onChange={(e) => {
                    setBillNumber(e.target.value)
                    setBillError("")
                  }}
                  className="bg-white/80 border-white/30"
                />
                <Button variant="outline" size="sm" className="bg-white/80 border-white/30">
                  <Receipt className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Format: ECO-YYYY-XXXXXX • Helps improve AI estimation accuracy (+10% bonus)
              </p>

              {billError && (
                <Alert className="mt-3 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{billError}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Enhanced Condition Description */}
            <div>
              <Label htmlFor="condition" className="text-base font-medium">
                Item Condition * (Affects pricing)
              </Label>
              <Textarea
                id="condition"
                placeholder="Describe condition: Excellent/Good/Fair/Poor. Include details like scratches, wear, functionality..."
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="mt-3 bg-white/80 border-white/30 min-h-[120px]"
              />
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  **Won't be visible to Customers**
                </p> 
                <p>
                  <strong>Excellent/Like New:</strong> +40% value | <strong>Good:</strong> +20% value
                </p>
                <p>
                  <strong>Fair/Average:</strong> Base value | <strong>Poor/Damaged:</strong> -40% value
                </p>
              </div>
            </div>

            <Button
              onClick={generateEstimate}
              className="w-full py-3 text-base bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
              disabled={!uploadedPhoto || !condition || isProcessing || !!photoError}
            >
              {isProcessing ? "Processing..." : "Get AI Estimate"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "estimate") {
    return (
      <div className="max-w-3xl mx-auto">
        {renderStepIndicator()}

        {isProcessing ? (
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-bold mb-3">AI Processing Your Item...</h3>
              <p className="text-gray-600 mb-6 text-base">Analyzing photo and condition details</p>
              <Progress value={75} className="w-full h-2" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  Estimation Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold">Estimated Return Value:</span>
                    <span className="text-3xl font-bold text-emerald-600">₹{estimatedValue}</span>
                  </div>
                  {cartValue < 2000 && (
                    <div className="flex justify-between items-center text-base">
                      <span>Pickup Fee:</span>
                      <span className="text-red-600 font-semibold">-₹99</span>
                    </div>
                  )}
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Final Credit:</span>
                    <span className="text-emerald-600">₹{cartValue < 2000 ? estimatedValue - 99 : estimatedValue}</span>
                  </div>
                </div>

                {/* Add Items to Reach Threshold */}
                {cartValue < 2000 && (
                  <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-orange-800">Avoid Pickup Fee!</h4>
                          <p className="text-orange-700 text-sm">
                            Add ₹{2000 - cartValue} more items to get free pickup
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddItems(!showAddItems)}
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Items
                        </Button>
                      </div>

                      {showAddItems && (
                        <div className="space-y-3 pt-4 border-t border-orange-200">
                          <p className="text-sm text-orange-600 mb-3">Select additional items to recycle:</p>
                          {["Old Phone Case (₹200)", "Used Books (₹300)", "Plastic Containers (₹250)"].map(
                            (item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                                <span className="text-sm">{item}</span>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Add
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-200">
                  <h4 className="font-bold mb-4 text-sky-800 flex items-center gap-2">
                    <Recycle className="w-5 h-5" />
                    Environmental Impact
                  </h4>
                  <div className="space-y-2 text-sky-700">
                    <p>• Diverts ~2.5kg waste from landfills</p>
                    <p>• Saves 15L water in manufacturing</p>
                    <p>• Reduces CO₂ emissions by 3.2kg</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-sky-800">+50 EcoPoints earned</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep("upload")} className="px-8">
                    Back to Edit
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("confirm")}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
                  >
                    Accept Estimate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  if (currentStep === "confirm") {
    return (
      <div className="max-w-3xl mx-auto">
        {renderStepIndicator()}

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {returnType === "faulty" ? "Confirm Your Return" : "Confirm Your Recycling"}
            </CardTitle>
            <CardDescription className="text-base">Review details before scheduling pickup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-xl shadow-md"
              />
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
                <p className="text-gray-600 mt-1">
                  {returnType === "faulty"
                    ? `${selectedSolution === "exchange" ? "Exchange" : "Refund"} - ${problems.find((p) => p.id === selectedProblem)?.label}`
                    : "Recycle Return"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-emerald-600">
                  {returnType === "faulty" ? `₹${product.price}` : `₹${estimatedValue}`}
                </p>
                {returnType === "recycle" && cartValue < 2000 && (
                  <p className="text-sm text-red-600">-₹99 pickup fee</p>
                )}
              </div>
            </div>

            <div className="space-y-4 bg-gray-50/80 p-6 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="font-medium">Pickup Address:</span>
                <span className="text-right text-gray-700">
                  123 Green Street, Eco City
                  <br />
                  Mumbai, 400001
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Preferred Time:</span>
                <span className="text-gray-700">Next 2-3 business days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Processing:</span>
                <Badge className="bg-emerald-100 text-emerald-800">Free</Badge>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("complete")}
              className="w-full py-4 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
              size="lg"
            >
              <Recycle className="w-5 h-5 mr-2" />
              Schedule Pickup
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "complete") {
    return (
      <div className="max-w-3xl mx-auto text-center">
        {renderStepIndicator()}

        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-12">
            <div className="relative mb-6">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {returnType === "faulty" ? "Return Scheduled Successfully!" : "Recycling Scheduled Successfully!"}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Your pickup has been scheduled. You'll receive a confirmation SMS shortly.
            </p>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl mb-8 border border-emerald-200">
              <h3 className="font-bold mb-4 text-lg">
                {returnType === "faulty" ? "Return Summary" : "Recycling Summary"}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Request ID:</span>
                  <span className="font-mono font-semibold">BL-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    {returnType === "faulty"
                      ? selectedSolution === "exchange"
                        ? "Exchange"
                        : "Refund Amount"
                      : "Expected Credit"}
                    :
                  </span>
                  <span className="font-bold text-lg text-emerald-600">
                    {returnType === "faulty"
                      ? `₹${product.price}`
                      : `₹${cartValue < 2000 ? estimatedValue - 99 : estimatedValue}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pickup Window:</span>
                  <span className="font-medium">Next 2-3 business days</span>
                </div>
              </div>
            </div>

            {returnType === "recycle" && (
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl mb-8 border border-sky-200">
                <h3 className="font-bold text-sky-800 mb-3 flex items-center justify-center gap-2">
                  <Recycle className="w-5 h-5" />
                  Thank you for choosing sustainability!
                </h3>
                <p className="text-sky-700">
                  Your return will help create a circular economy and reduce environmental impact.
                </p>
              </div>
            )}

            <Button
              onClick={onComplete}
              size="lg"
              className="px-12 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg"
            >
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
