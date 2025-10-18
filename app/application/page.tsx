'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function Application() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regno: '',
    college: '',
    address: '',
    destination_from: '',
    destination_to: '',
    via_1: '',
    via_2: '',
  })
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
        setUser(user)
        setFormData(prev => ({ ...prev, email: user.email || '' }))
      } catch (error) {
        console.error('Failed to load user session', error)
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  if (!user) {
    console.error('No authenticated user')
    setLoading(false)
    router.push('/login')
    return
  }

  try {
    let photoUrl = ''

    // Upload photo to Supabase Storage
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Upload with proper options
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-photos')
        .upload(fileName, photoFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Failed to upload photo: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-photos')
        .getPublicUrl(fileName)

      photoUrl = publicUrl
    }

    // Generate QR code data
    const qrData = JSON.stringify({
      id: user.id,
      name: formData.name,
      regno: formData.regno,
      timestamp: Date.now()
    })

    // Insert application data
    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          user_id: user.id,
          ...formData,
          photo_url: photoUrl,
          qr_code: qrData,
          application_status: 'approved'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Failed to save application: ${error.message}`)
    }

    router.push(`/qr-scan?id=${data.id}`)
  } catch (error: any) {
    console.error('Submission error:', error)
    alert('Error submitting application: ' + error.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Bus Pass Application
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  required
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50"
                required
                readOnly
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.regno}
                onChange={(e) => setFormData({ ...formData, regno: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                rows={3}
                required
              />
            </div>

            {/* Destination From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (Starting Point) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destination_from}
                onChange={(e) => setFormData({ ...formData, destination_from: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Destination To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (Destination) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destination_to}
                onChange={(e) => setFormData({ ...formData, destination_to: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Via 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Via 1 (Optional)
              </label>
              <input
                type="text"
                value={formData.via_1}
                onChange={(e) => setFormData({ ...formData, via_1: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Via 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Via 2 (Optional)
              </label>
              <input
                type="text"
                value={formData.via_2}
                onChange={(e) => setFormData({ ...formData, via_2: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
