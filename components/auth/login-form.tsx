"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Stethoscope, Phone } from "lucide-react"
import type { UserRole } from "@/app/page"

interface LoginFormProps {
  onSubmit: (phone: string, role: UserRole) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState<UserRole>("patient")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    onSubmit(phoneNumber, role)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription className="text-base">
          Sign in to manage your appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-base font-medium text-foreground">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                role === "patient"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  role === "patient" ? "bg-primary" : "bg-muted"
                }`}
              >
                <User
                  className={`w-7 h-7 ${
                    role === "patient" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-lg font-medium ${
                  role === "patient" ? "text-primary" : "text-foreground"
                }`}
              >
                Patient
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                role === "doctor"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  role === "doctor" ? "bg-primary" : "bg-muted"
                }`}
              >
                <Stethoscope
                  className={`w-7 h-7 ${
                    role === "doctor" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-lg font-medium ${
                  role === "doctor" ? "text-primary" : "text-foreground"
                }`}
              >
                Doctor
              </span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-base font-medium text-foreground">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-semibold">
            Get OTP
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm">
          A one-time password will be sent to your phone
        </p>
      </CardContent>
    </Card>
  )
}
