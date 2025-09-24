import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export interface Listing {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  price: number
  currency: string
  type: 'car' | 'property'
  location: string
  images: string[]
  features: string[]
  specifications: Record<string, any>
  whatsapp_number: string
  featured: boolean
  user_id: string
  status: 'active' | 'sold' | 'inactive'
}

export interface Profile {
  id: string
  created_at: string
  updated_at: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  phone: string | null
  avatar_url: string | null
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)