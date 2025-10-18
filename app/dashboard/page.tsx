'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Student } from '@/types'

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

        // Check if user has existing application
        const { data, error: fetchError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setApplication(data)
        } else if (fetchError) {
          // Only log non-404 errors
          if (fetchError.code !== 'PGRST116') {
            console.error('Failed to load application record', fetchError)
          }
          // For 404, this is expected for new users
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard</h1>
        
        {!application ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold mb-4">No Application Found</h2>
              <p className="text-gray-600 mb-6">
                You haven&apos;t submitted a bus pass application yet.
              </p>
              <Link
                href="/application"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Apply for Bus Pass
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Application Details</h2>
                  <p className="text-gray-600">Your bus pass application information</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  application.application_status === 'approved' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {application.application_status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold">{application.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                  <p className="font-semibold">{application.regno}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">College</p>
                  <p className="font-semibold">{application.college}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <p className="font-semibold">{application.destination_from}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <p className="font-semibold">{application.destination_to}</p>
                </div>
                {application.via_1 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Via 1</p>
                    <p className="font-semibold">{application.via_1}</p>
                  </div>
                )}
                {application.via_2 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Via 2</p>
                    <p className="font-semibold">{application.via_2}</p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Link
                  href={`/qr-scan?id=${application.id}`}
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  View QR Code & Pass
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
