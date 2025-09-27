import { Button } from "@/components/ui/button";
import { Search, Car, Home, MapPin, Star, Shield, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Modern background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-accent/20"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex items-center text-white/90 text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Verified Dealers
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <Award className="w-4 h-4 mr-1" />
              Best Prices
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              24/7 Support
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-accent via-accent/90 to-accent/70 bg-clip-text text-transparent">
              Car or Property
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover premium automotive and real estate solutions across Kenya. 
            <span className="text-accent font-medium"> Quality guaranteed</span>, 
            competitive prices, and exceptional service.
          </p>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 bg-accent hover:bg-accent/90 text-white font-semibold shadow-2xl hover:shadow-accent/25 transition-all duration-300 transform hover:scale-105"
              onClick={() => scrollToSection('cars')}
            >
              <Car className="h-5 w-5 mr-2" />
              Browse Premium Cars
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-7 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold shadow-lg transition-all duration-300"
              onClick={() => scrollToSection('properties')}
            >
              <Home className="h-5 w-5 mr-2" />
              Explore Properties
            </Button>
          </div>

          {/* Enhanced stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2 flex items-center justify-center">
                  <Car className="w-8 h-8 mr-2" />
                  500+
                </div>
                <div className="text-white/90 text-lg font-medium">Premium Vehicles</div>
                <div className="text-white/70 text-sm mt-1">Carefully inspected & verified</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2 flex items-center justify-center">
                  <Home className="w-8 h-8 mr-2" />
                  200+
                </div>
                <div className="text-white/90 text-lg font-medium">Quality Properties</div>
                <div className="text-white/70 text-sm mt-1">Prime locations across Kenya</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2 flex items-center justify-center">
                  <Star className="w-8 h-8 mr-2" />
                  1000+
                </div>
                <div className="text-white/90 text-lg font-medium">Happy Clients</div>
                <div className="text-white/70 text-sm mt-1">5-star ratings & reviews</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;