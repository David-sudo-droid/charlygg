import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Car, Home } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { Listing } from "@/lib/supabase";
import ListingCard from "./ListingCard";
import ListingModal from "./ListingModal";

const ListingsGrid = () => {
  const { listings, loading } = useListings();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'car' | 'property'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading listings...</p>
          </div>
        </div>
      </section>
    );
  }

  const filteredListings = listings.filter(listing => {
    const matchesType = filterType === 'all' || listing.type === filterType;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const featuredListings = filteredListings.filter(listing => listing.featured);
  const regularListings = filteredListings.filter(listing => !listing.featured);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Premium <span className="text-accent">Listings</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover quality vehicles and properties at competitive prices
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'car' ? 'default' : 'outline'}
              onClick={() => setFilterType('car')}
            >
              <Car className="h-4 w-4 mr-2" />
              Cars
            </Button>
            <Button
              variant={filterType === 'property' ? 'default' : 'outline'}
              onClick={() => setFilterType('property')}
            >
              <Home className="h-4 w-4 mr-2" />
              Properties
            </Button>
          </div>
        </div>

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-bold">Featured Listings</h3>
              <Badge className="bg-accent text-accent-foreground">Premium</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Listings */}
        {regularListings.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">All Listings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-muted-foreground mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Listing Modal */}
      <ListingModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ListingsGrid;