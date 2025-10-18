export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          regno: string
          college: string
          address: string
          destination_from: string
          destination_to: string
          via_1?: string | null
          via_2?: string | null
          photo_url?: string | null
          qr_code: string
          application_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          regno: string
          college: string
          address: string
          destination_from: string
          destination_to: string
          via_1?: string | null
          via_2?: string | null
          photo_url?: string | null
          qr_code: string
          application_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          regno?: string
          college?: string
          address?: string
          destination_from?: string
          destination_to?: string
          via_1?: string | null
          via_2?: string | null
          photo_url?: string | null
          qr_code?: string
          application_status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}