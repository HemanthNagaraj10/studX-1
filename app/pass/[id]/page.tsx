'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import type { Student } from '@/types'
import QRCode from 'react-qr-code'

export default function BusPass() {
  const params = useParams()
  const id = params.id as string
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', id)
          .single()

        if (data) {
          setStudent(data)
        } else if (error && error.code !== 'PGRST116') {
          console.error('Failed to load pass details', error)
        }
      } catch (error) {
        console.error('Unexpected error loading pass', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStudent()
    }
  }, [id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pass Not Found</h2>
          <p className="text-gray-600">The requested bus pass could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Bus Pass Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm px-8 py-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">🚌 Student Bus Pass</h1>
                <p className="text-white/80 text-sm">Valid for Academic Year 2025-26</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-white/80">Pass ID</p>
                <p className="text-sm font-mono font-bold text-white">{student.regno}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Photo Section */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  {student.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={student.photo_url}
                      alt={student.name}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-6xl">👤</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">{student.name}</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-white/70 text-sm w-24">College:</span>
                      <span className="text-white font-semibold flex-1">{student.college}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-white/70 text-sm w-24">Reg No:</span>
                      <span className="text-white font-semibold flex-1">{student.regno}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-white/70 text-sm w-24">Email:</span>
                      <span className="text-white font-semibold flex-1 break-all">{student.email}</span>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span>🗺️</span> Route Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <p className="text-xs text-white/70">From</p>
                        <p className="text-white font-semibold">{student.destination_from}</p>
                      </div>
                    </div>
                    
                    {student.via_1 && (
                      <div className="flex items-center gap-3 pl-4">
                        <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Via</p>
                          <p className="text-white font-semibold">{student.via_1}</p>
                        </div>
                      </div>
                    )}
                    
                    {student.via_2 && (
                      <div className="flex items-center gap-3 pl-4">
                        <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Via</p>
                          <p className="text-white font-semibold">{student.via_2}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold">
                        B
                      </div>
                      <div>
                        <p className="text-xs text-white/70">To</p>
                        <p className="text-white font-semibold">{student.destination_to}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-8 bg-white rounded-2xl p-6 text-center">
              <p className="text-gray-700 font-semibold mb-4">Scan to Verify</p>
              <div className="inline-block bg-white p-4 rounded-xl">
                <QRCode value={student.qr_code} size={150} />
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Valid until: December 31, 2026
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/10 backdrop-blur-sm px-8 py-4 border-t border-white/20">
            <p className="text-center text-white/80 text-sm">
              This pass is non-transferable and must be carried at all times while traveling
            </p>
          </div>
        </div>

        {/* Download/Print Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Pass
          </button>
        </div>
      </div>
    </div>
  )
}
