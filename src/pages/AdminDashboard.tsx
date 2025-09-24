import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useListings } from '@/hooks/useListings'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Car, Home, Edit, Trash2, Eye, LogOut } from 'lucide-react'
import CreateListingModal from '@/components/admin/CreateListingModal'
import EditListingModal from '@/components/admin/EditListingModal'
import { Listing } from '@/lib/supabase'

const AdminDashboard = () => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { listings, loading, deleteListing } = useListings()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/auth')
    }
  }, [user, isAdmin, navigate])

  if (!user || !isAdmin) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const carListings = listings.filter(l => l.type === 'car')
  const propertyListings = listings.filter(l => l.type === 'property')
  const featuredListings = listings.filter(l => l.featured)

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Car className="h-6 w-6 text-primary" />
              <Home className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground -mt-1">Charly Motors & Properties</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{carListings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propertyListings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Badge className="h-4 w-4 bg-accent text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredListings.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Listings</h2>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </div>

        {/* Listings Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Listings ({listings.length})</TabsTrigger>
            <TabsTrigger value="cars">Cars ({carListings.length})</TabsTrigger>
            <TabsTrigger value="properties">Properties ({propertyListings.length})</TabsTrigger>
            <TabsTrigger value="featured">Featured ({featuredListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ListingsGrid 
              listings={listings} 
              formatPrice={formatPrice}
              onEdit={setEditingListing}
              onDelete={deleteListing}
            />
          </TabsContent>
          
          <TabsContent value="cars">
            <ListingsGrid 
              listings={carListings} 
              formatPrice={formatPrice}
              onEdit={setEditingListing}
              onDelete={deleteListing}
            />
          </TabsContent>
          
          <TabsContent value="properties">
            <ListingsGrid 
              listings={propertyListings} 
              formatPrice={formatPrice}
              onEdit={setEditingListing}
              onDelete={deleteListing}
            />
          </TabsContent>
          
          <TabsContent value="featured">
            <ListingsGrid 
              listings={featuredListings} 
              formatPrice={formatPrice}
              onEdit={setEditingListing}
              onDelete={deleteListing}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Edit Listing Modal */}
      <EditListingModal
        listing={editingListing}
        isOpen={!!editingListing}
        onClose={() => setEditingListing(null)}
      />
    </div>
  )
}

const ListingsGrid = ({ 
  listings, 
  formatPrice, 
  onEdit, 
  onDelete 
}: {
  listings: Listing[]
  formatPrice: (price: number, currency: string) => string
  onEdit: (listing: Listing) => void
  onDelete: (id: string) => void
}) => {
  if (listings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl text-muted-foreground mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No listings found</h3>
          <p className="text-muted-foreground">Create your first listing to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <CardDescription>{listing.location}</CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                {listing.featured && (
                  <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                )}
                <Badge variant={listing.type === 'car' ? 'default' : 'secondary'}>
                  {listing.type === 'car' ? <Car className="h-3 w-3 mr-1" /> : <Home className="h-3 w-3 mr-1" />}
                  {listing.type}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-accent">
                {formatPrice(listing.price, listing.currency)}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {listing.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {listing.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {listing.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{listing.features.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(listing)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this listing?')) {
                      onDelete(listing.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default AdminDashboard