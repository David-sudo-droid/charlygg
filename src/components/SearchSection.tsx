import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, Car, Home, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState<'cars' | 'properties'>('cars');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    category: '',
    year: '',
    condition: ''
  });

  return (
    <section className="relative bg-white border-b border-border" data-search-section>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('cars')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'cars'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Car className="w-4 h-4" />
                Buy a Car
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'properties'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="w-4 h-4" />
                Find Property
              </button>
            </div>
          </div>

          {/* Search Form */}
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              {activeTab === 'cars' ? (
                <div className="space-y-6">
                  {/* Main Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search by make, model, or keyword..."
                      className="pl-12 pr-4 py-4 text-lg border-border focus:border-primary focus:ring-primary bg-white"
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                    />
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Location</label>
                      <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="mombasa">Mombasa</SelectItem>
                          <SelectItem value="kisumu">Kisumu</SelectItem>
                          <SelectItem value="nakuru">Nakuru</SelectItem>
                          <SelectItem value="eldoret">Eldoret</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Price Range</label>
                      <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <DollarSign className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-500000">Under KSH 500K</SelectItem>
                          <SelectItem value="500000-1000000">KSH 500K - 1M</SelectItem>
                          <SelectItem value="1000000-2000000">KSH 1M - 2M</SelectItem>
                          <SelectItem value="2000000-5000000">KSH 2M - 5M</SelectItem>
                          <SelectItem value="5000000+">Above KSH 5M</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Year</label>
                      <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Any year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2020">2020</SelectItem>
                          <SelectItem value="older">2019 & Older</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Condition</label>
                      <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <SelectValue placeholder="Any condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="certified">Certified Pre-owned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Property Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search by area, property type, or keyword..."
                      className="pl-12 pr-4 py-4 text-lg border-border focus:border-primary focus:ring-primary bg-white"
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                    />
                  </div>

                  {/* Property Filter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Location</label>
                      <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="mombasa">Mombasa</SelectItem>
                          <SelectItem value="kisumu">Kisumu</SelectItem>
                          <SelectItem value="nakuru">Nakuru</SelectItem>
                          <SelectItem value="eldoret">Eldoret</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Property Type</label>
                      <Select>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <Home className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Price Range</label>
                      <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <DollarSign className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1000000">Under KSH 1M</SelectItem>
                          <SelectItem value="1000000-5000000">KSH 1M - 5M</SelectItem>
                          <SelectItem value="5000000-10000000">KSH 5M - 10M</SelectItem>
                          <SelectItem value="10000000-20000000">KSH 10M - 20M</SelectItem>
                          <SelectItem value="20000000+">Above KSH 20M</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Bedrooms</label>
                      <Select>
                        <SelectTrigger className="h-12 border-border focus:border-primary">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                <Button 
                  size="lg" 
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search {activeTab === 'cars' ? 'Cars' : 'Properties'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-12 px-6 border-border hover:bg-muted"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Cars Available</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Properties Listed</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
