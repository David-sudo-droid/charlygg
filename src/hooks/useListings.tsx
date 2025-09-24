import { useState, useEffect } from 'react'
import { supabase, Listing } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from './use-toast'

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast({
        title: "Error",
        description: "Failed to load listings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create listings",
        variant: "destructive",
      })
      return null
    }

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([{
          ...listingData,
          user_id: user.id,
        }])
        .select()
        .single()

      if (error) throw error

      setListings(prev => [data, ...prev])
      toast({
        title: "Success",
        description: "Listing created successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error creating listing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      })
      return null
    }
  }

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setListings(prev => prev.map(listing => 
        listing.id === id ? data : listing
      ))
      
      toast({
        title: "Success",
        description: "Listing updated successfully!",
      })
      return data
    } catch (error: any) {
      console.error('Error updating listing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update listing",
        variant: "destructive",
      })
      return null
    }
  }

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setListings(prev => prev.filter(listing => listing.id !== id))
      toast({
        title: "Success",
        description: "Listing deleted successfully!",
      })
    } catch (error: any) {
      console.error('Error deleting listing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete listing",
        variant: "destructive",
      })
    }
  }

  return {
    listings,
    loading,
    createListing,
    updateListing,
    deleteListing,
    refetch: fetchListings,
  }
}