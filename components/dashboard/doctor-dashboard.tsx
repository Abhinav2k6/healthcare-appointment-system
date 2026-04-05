"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/src/supabaseClient"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Clock, Calendar } from "lucide-react"

export function DoctorDashboard({ onLogout }: { onLogout: () => void }) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Function to fetch appointments
  const fetchAppointments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointment')
      .select('*')
      .eq('doctor_id', 1)
      .order('id', { ascending: false })

    if (error) {
      console.error("Error fetching:", error.message);
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }

  // 2. Function to update status
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('appointment')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      // Re-fetch data to show the updated status immediately
      fetchAppointments();
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900">Doctor Dashboard</h1>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Calendar className="text-primary" /> Upcoming Appointments
          </h2>
          {loading ? (
            <p className="text-slate-500">Loading data...</p>
          ) : appointments.length === 0 ? (
            <Card className="p-10 text-center text-slate-500 bg-white">
              No appointments have been booked yet.
            </Card>
          ) : (
            appointments.map((apt) => (
              <Card key={apt.id} className="p-6 flex items-center justify-between bg-white shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center gap-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <Clock className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Patient for Doctor #{apt.doctor_id}</p>
                    <p className="text-slate-600 text-md">
                      Scheduled for: <span className="font-medium">{apt.date}</span> at <span className="font-medium">{apt.time}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                      apt.status === 'confirmed' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {apt.status || 'New Request'}
                    </span>
                  </div>
                  
                  {/* --- CONFIRM BUTTON --- */}
                  {apt.status !== 'confirmed' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}