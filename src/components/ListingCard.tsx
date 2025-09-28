import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Home, MessageCircle, Star, Eye, Heart } from "lucide-react";
import { Listing } from "@/data/listings";
import { useState } from "react";

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
}

const ListingCard = ({ listing, onViewDetails }: ListingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSH');
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hi! I'm interested in the ${listing.title} listed for ${formatPrice(listing.price, listing.currency)}. Could you provide more information?`;
    const whatsappUrl = `https://wa.me/${listing.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card 
      className="listing-card cursor-pointer group relative overflow-hidden bg-white border-border shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clean badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {listing.featured && (
          <Badge className="bg-primary text-primary-foreground font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
          {listing.type === 'car' ? (
            <>
              <Car className="w-3 h-3 mr-1" />
              Vehicle
            </>
          ) : (
            <>
              <Home className="w-3 h-3 mr-1" />
              Property
            </>
          )}
        </Badge>
      </div>

      {/* Favorite button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white border border-border/20"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} 
        />
      </button>
      
      {/* Enhanced image section */}
      <div 
        className="relative h-56 bg-slate-100 overflow-hidden transition-transform duration-300"
        onClick={() => onViewDetails(listing)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        {/* Image placeholder with better styling */}
        {listing.images && listing.images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {listing.type === 'car' ? (
                <Car className="h-16 w-16 text-primary/70" />
              ) : (
                <Home className="h-16 w-16 text-primary/70" />
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                +{listing.images.length - 1} more
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            {listing.type === 'car' ? (
              <Car className="h-16 w-16 text-primary/70" />
            ) : (
              <Home className="h-16 w-16 text-primary/70" />
            )}
          </div>
        )}

        {/* Hover overlay with view button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/90 backdrop-blur-sm text-primary hover:bg-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Enhanced content section */}
      <CardContent className="p-6" onClick={() => onViewDetails(listing)}>
        <div className="mb-4">
          <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300 mb-2">
            {listing.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPrice(listing.price, listing.currency)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.location}
            </div>
          </div>
        </div>

        {/* Features with better styling */}
        {listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
              >
                {feature}
              </Badge>
            ))}
            {listing.features.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{listing.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}
      </CardContent>

      {/* Enhanced footer */}
      <CardFooter className="px-6 pb-6 pt-0 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(listing);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-green-600/25"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;