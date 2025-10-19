'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Student } from '@/types'
import { Bus, User, Mail, MapPin, CheckCircle2, Clock } from 'lucide-react'

export default function Dashboard() {
  const [application, setApplication] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setApplication(data)
        } else if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Failed to load application record', fetchError)
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes('not authenticated')) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 py-12 px-4 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Bus className="text-yellow-400 w-10 h-10" />
            <h1 className="text-4xl font-extrabold text-white tracking-tight">BMTC Smart Pass</h1>
          </div>
          <Link
            href="/logout"
            className="text-white bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-xl font-semibold shadow-md transition"
          >
            Logout
          </Link>
        </header>

        {!application ? (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-10 text-center text-white border border-white/20">
            <div className="text-7xl mb-6">🚌</div>
            <h2 className="text-3xl font-semibold mb-3">No Application Found</h2>
            <p className="text-blue-100 mb-8">
              You haven&apos;t applied for your BMTC student bus pass yet.
            </p>
            <Link
              href="/application"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-xl font-bold transition shadow-md"
            >
              Apply for Bus Pass
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-blue-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-1">Application Details</h2>
                <p className="text-gray-500">Your registered student bus pass information</p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  application.application_status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {application.application_status === 'approved' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {application.application_status.toUpperCase()}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Info label="Name" value={application.name} icon={<User className="w-4 h-4 text-blue-500" />} />
              <Info label="Registration Number" value={application.regno} />
              <Info label="College" value={application.college} />
              <Info label="Email" value={application.email} icon={<Mail className="w-4 h-4 text-blue-500" />} />
              <Info label="From" value={application.destination_from} icon={<MapPin className="w-4 h-4 text-blue-500" />} />
              <Info label="To" value={application.destination_to} icon={<MapPin className="w-4 h-4 text-blue-500" />} />
              {application.via_1 && <Info label="Via 1" value={application.via_1} />}
              {application.via_2 && <Info label="Via 2" value={application.via_2} />}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href={`/qr-scan?id=${application.id}`}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition"
              >
                View QR Code & Bus Pass
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      {icon && <div className="mt-1">{icon}</div>}
      <div>
        <p className="text-xs uppercase text-gray-500 font-medium">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
