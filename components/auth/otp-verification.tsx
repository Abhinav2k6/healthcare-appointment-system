"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface OTPVerificationProps {
  phoneNumber: string
  onVerified: () => void
  onBack: () => void
}

export function OTPVerification({ phoneNumber, onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 4) {
      setError("Please enter the complete OTP")
      return
    }

    setIsVerifying(true)
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsVerifying(false)

    // For demo, accept any 4-digit OTP
    onVerified()
  }

  const handleResend = () => {
    setCountdown(30)
    setOtp(["", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  const maskedPhone = phoneNumber.slice(0, 3) + "****" + phoneNumber.slice(-3)

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute left-4 top-4 p-2 h-auto"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <CardDescription className="text-base">
          Enter the code sent to {maskedPhone}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-2xl font-bold border-2 rounded-xl bg-background focus:border-primary focus:outline-none transition-colors"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-center text-sm">{error}</p>
        )}

        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full h-14 text-lg font-semibold"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verify & Continue
            </span>
          )}
        </Button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-muted-foreground">
              Resend OTP in <span className="font-semibold text-foreground">{countdown}s</span>
            </p>
          ) : (
            <Button variant="link" onClick={handleResend} className="text-primary">
              Resend OTP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
