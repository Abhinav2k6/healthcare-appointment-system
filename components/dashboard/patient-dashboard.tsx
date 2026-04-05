"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/src/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, LogOut } from "lucide-react"
import { AppointmentBooking } from "@/components/booking/appointment-booking"

export function PatientDashboard({ onLogout }: { onLogout: () => void }) {
  const [doctors, setDoctors] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('*')
      if (error) console.error("Error:", error.message)
      else setDoctors(data || [])
      setLoading(false)
    }
    fetchDoctors()
  }, [])

  if (selectedDoctor) {
    return (
      <AppointmentBooking 
        doctor={selectedDoctor} 
        onBack={() => setSelectedDoctor(null)} 
        onBooked={() => setSelectedDoctor(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, Patient</h1>
            <p className="text-slate-500 text-lg">Find and book your doctor</p>
          </div>
          <Button variant="ghost" onClick={onLogout} className="text-red-500 hover:text-red-700">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Button>
        </header>

        <div className="grid gap-6">
          <h2 className="font-semibold text-xl text-slate-800">Available Doctors</h2>
          {loading ? (
            <p className="text-center text-slate-500 py-10 italic">Connecting to database...</p>
          ) : (
            doctors.map((doc) => (
              <Card key={doc.id} className="p-6 flex items-center justify-between hover:shadow-md transition-shadow border-slate-200">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{doc.name}</h3>
                    <p className="text-blue-600 font-medium">{doc.specialization}</p>
                    <p className="text-sm text-slate-500 mt-1">{doc.availability}</p>
                  </div>
                </div>
                <Button size="lg" className="px-8" onClick={() => setSelectedDoctor(doc)}>Book</Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}