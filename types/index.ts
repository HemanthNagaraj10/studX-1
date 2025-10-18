export interface Student {
  id: string
  user_id: string
  name: string
  email: string
  regno: string
  college: string
  address: string
  destination_from: string
  destination_to: string
  via_1?: string
  via_2?: string
  photo_url?: string
  qr_code: string
  application_status: string
  created_at: string
  updated_at: string
}

export interface ApplicationFormData {
  name: string
  email: string
  regno: string
  college: string
  address: string
  destination_from: string
  destination_to: string
  via_1?: string
  via_2?: string
  photo: File | null
}
