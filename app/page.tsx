"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { OTPVerification } from "@/components/auth/otp-verification"
import { PatientDashboard } from "@/components/dashboard/patient-dashboard"
import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard"
import { Heart } from "lucide-react"

export type UserRole = "patient" | "doctor"

export default function Home() {
  const [step, setStep] = useState<"login" | "otp" | "dashboard">("login")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState<UserRole>("patient")

  const handleLoginSubmit = (phone: string, selectedRole: UserRole) => {
    setPhoneNumber(phone)
    setRole(selectedRole)
    setStep("otp")
  }

  const handleOTPVerified = () => {
    setStep("dashboard")
  }

  const handleLogout = () => {
    setStep("login")
    setPhoneNumber("")
  }

  if (step === "dashboard") {
    return role === "patient" ? (
      <PatientDashboard onLogout={handleLogout} />
    ) : (
      <DoctorDashboard onLogout={handleLogout} />
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">HealthCare</h1>
            <p className="text-muted-foreground text-lg mt-1">
              Smart Appointment System
            </p>
          </div>
        </div>

        {step === "login" && <LoginForm onSubmit={handleLoginSubmit} />}

        {step === "otp" && (
          <OTPVerification
            phoneNumber={phoneNumber}
            onVerified={handleOTPVerified}
            onBack={() => setStep("login")}
          />
        )}
      </div>
    </main>
  )
}
