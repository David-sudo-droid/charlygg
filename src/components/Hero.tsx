import { Button } from "@/components/ui/button";
import { Search, Car, Home, MapPin, Star, Shield, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Clean professional background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-50 to-white"></div>
      
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex items-center text-muted-foreground text-sm">
              <Shield className="w-4 h-4 mr-1 text-primary" />
              Verified Dealers
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Award className="w-4 h-4 mr-1 text-primary" />
              Best Prices
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1 text-primary" />
              24/7 Support
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Buy & Sell Cars
            <span className="block text-primary mt-2">
              Find Quality Properties
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Kenya's trusted marketplace for verified vehicles and premium properties. 
            <span className="text-primary font-medium"> Start your search below</span>
          </p>

          {/* Clean CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                const searchElement = document.querySelector('[data-search-section]');
                searchElement?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Search className="h-5 w-5 mr-2" />
              Start Your Search
            </Button>
          </div>

          {/* Clean stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
                  <Car className="w-8 h-8 mr-2" />
                  500+
                </div>
                <div className="text-foreground text-lg font-medium">Premium Vehicles</div>
                <div className="text-muted-foreground text-sm mt-1">Carefully inspected & verified</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
                  <Home className="w-8 h-8 mr-2" />
                  200+
                </div>
                <div className="text-foreground text-lg font-medium">Quality Properties</div>
                <div className="text-muted-foreground text-sm mt-1">Prime locations across Kenya</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
                  <Star className="w-8 h-8 mr-2" />
                  1000+
                </div>
                <div className="text-foreground text-lg font-medium">Happy Clients</div>
                <div className="text-muted-foreground text-sm mt-1">5-star ratings & reviews</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;