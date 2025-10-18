'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'

function QRScanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const [showPass, setShowPass] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (!id) {
      router.push('/dashboard')
    }
  }, [id, router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (showPass && id) {
      router.push(`/pass/${id}`)
    }
  }, [showPass, id, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h1>
          <p className="text-gray-600">
            Your bus pass application has been successfully submitted.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mb-6">
          <p className="text-lg font-semibold mb-4 text-gray-800">
            Scan QR Code to Get Your Pass
          </p>
          {origin && id ? (
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode value={`${origin}/pass/${id}`} size={200} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Preparing QR code...</p>
          )}
        </div>

        <button
          onClick={() => setShowPass(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-4"
        >
          View Bus Pass
        </button>

        <Link
          href="/dashboard"
          className="block text-indigo-600 font-semibold hover:underline"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function QRScan() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <QRScanContent />
    </Suspense>
  )
}
