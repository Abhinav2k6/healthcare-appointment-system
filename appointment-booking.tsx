"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Stethoscope, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/src/supabaseClient" 

interface Doctor {
  id: string
  name: string
  specialization: string
  location: string
  rating: number
  availableSlots: number
}

interface AppointmentBookingProps {
  doctor: Doctor
  onBack: () => void
  onBooked: () => void
}

const availableDates = [
  { date: "Mar 26", day: "Wed", available: true },
  { date: "Mar 27", day: "Thu", available: true },
  { date: "Mar 28", day: "Fri", available: true },
  { date: "Mar 29", day: "Sat", available: false },
  { date: "Mar 30", day: "Sun", available: false },
  { date: "Mar 31", day: "Mon", available: true },
  { date: "Apr 1", day: "Tue", available: true },
]

const timeSlots = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: true },
]

export function AppointmentBooking({ doctor, onBack, onBooked }: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return

    setIsBooking(true)

    // REAL DATABASE CALL
    const { error } = await supabase
      .from('appointment') 
      .insert([
        { 
          doctor_id: Number(doctor.id), // Dynamically use the selected doctor's ID
          date: selectedDate, 
          time: selectedTime,
          status: 'pending' // Default status so it shows as "New Request" on the dashboard
        }
      ])

    setIsBooking(false)

    if (error) {
      console.error("Booking Error:", error.message)
      alert("Booking failed: " + error.message)
    } else {
      setIsBooked(true)
    }
  }

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Booking Confirmed!</h2>
            <p className="text-muted-foreground mt-2">
              Your appointment has been successfully scheduled
            </p>
          </div>
          <Card>
            <CardContent className="p-4 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDate}, 2026
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedTime}
                </div>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full h-14 text-lg" onClick={onBooked}>
            View My Appointments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">Book Appointment</h1>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-32">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{doctor.name}</h2>
                <p className="text-muted-foreground">{doctor.specialization}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{doctor.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Select Date
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {availableDates.map((item) => (
              <button
                key={item.date}
                disabled={!item.available}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center p-3 rounded-xl min-w-[70px] border-2 transition-all ${
                  !item.available
                    ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed"
                    : selectedDate === item.date
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                <span className="text-xs font-medium">{item.day}</span>
                <span className="text-lg font-bold mt-1">{item.date.split(" ")[1]}</span>
                <span className="text-xs">{item.date.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Select Time
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  !slot.available
                    ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed"
                    : selectedTime === slot.time
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t shadow-lg">
        <Button
          className="w-full h-14 text-lg font-semibold"
          disabled={!selectedDate || !selectedTime || isBooking}
          onClick={handleBook}
        >
          {isBooking ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  )
}