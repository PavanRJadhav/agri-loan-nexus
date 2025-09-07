import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield, TrendingUp, CheckCircle, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const LandingPage: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eligibilityData, setEligibilityData] = useState({
    landSize: '',
    annualIncome: '',
    farmingExperience: '',
    previousLoans: ''
  });
  
  const openDialog = (dialogType: string) => {
    setActiveDialog(dialogType);
  };
  
  const closeDialog = () => {
    setActiveDialog(null);
  };
  
  const checkEligibility = () => {
    const landSize = parseFloat(eligibilityData.landSize);
    const annualIncome = parseFloat(eligibilityData.annualIncome);
    const farmingExperience = parseFloat(eligibilityData.farmingExperience);
    const hasPreviousLoans = eligibilityData.previousLoans === 'yes';

    // Basic eligibility criteria
    const isEligible = 
      landSize >= 1 && // At least 1 acre
      annualIncome >= 100000 && // At least ₹1,00,000 annual income
      farmingExperience >= 2 && // At least 2 years of experience
      !hasPreviousLoans; // No previous loans

    if (isEligible) {
      toast({
        title: "You are eligible!",
        description: "Redirecting you to the login page...",
      });
      navigate('/login');
    } else {
      toast({
        title: "Not eligible",
        description: "Based on our criteria, you are not eligible for a loan at this time.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-agriloan-primary" />
              <span className="ml-2 text-xl font-bold text-agriloan-primary">AgriLoan Nexus</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 hover:text-agriloan-primary px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <button 
                onClick={() => openDialog('features')} 
                className="text-gray-500 hover:text-agriloan-primary px-3 py-2 text-sm font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => openDialog('aboutUs')} 
                className="text-gray-500 hover:text-agriloan-primary px-3 py-2 text-sm font-medium"
              >
                About Us
              </button>
              <button 
                onClick={() => openDialog('contact')} 
                className="text-gray-500 hover:text-agriloan-primary px-3 py-2 text-sm font-medium"
              >
                Contact
              </button>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-agriloan-primary hover:bg-agriloan-secondary">Register</Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/farming-hero.jpg"
            alt="Modern farming landscape"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80";
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Empowering Farmers with Smart Credit Solutions
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Access affordable loans, manage your farm finances, and grow your agricultural business with our digital platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-agriloan-primary hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility Check Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Check Your Eligibility</CardTitle>
              <CardDescription>
                Find out if you qualify for our agricultural loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="landSize" className="text-sm font-medium block mb-1">
                    Land Size (acres)
                  </label>
                  <Input
                    id="landSize"
                    type="number"
                    placeholder="Enter your land size"
                    value={eligibilityData.landSize}
                    onChange={(e) => setEligibilityData(prev => ({ ...prev, landSize: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="annualIncome" className="text-sm font-medium block mb-1">
                    Annual Income (₹)
                  </label>
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="Enter your annual income"
                    value={eligibilityData.annualIncome}
                    onChange={(e) => setEligibilityData(prev => ({ ...prev, annualIncome: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="farmingExperience" className="text-sm font-medium block mb-1">
                    Farming Experience (years)
                  </label>
                  <Input
                    id="farmingExperience"
                    type="number"
                    placeholder="Enter your farming experience"
                    value={eligibilityData.farmingExperience}
                    onChange={(e) => setEligibilityData(prev => ({ ...prev, farmingExperience: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="previousLoans" className="text-sm font-medium block mb-1">
                    Previous Loans
                  </label>
                  <Select
                    value={eligibilityData.previousLoans}
                    onValueChange={(value) => setEligibilityData(prev => ({ ...prev, previousLoans: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No previous loans</SelectItem>
                      <SelectItem value="yes">Has previous loans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  onClick={checkEligibility}
                  disabled={!eligibilityData.landSize || !eligibilityData.annualIncome || 
                           !eligibilityData.farmingExperience || !eligibilityData.previousLoans}
                >
                  Check Eligibility
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose AgriLoan Nexus?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed specifically for the unique needs of farmers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 bg-agriloan-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-agriloan-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Flexible Credit Solutions</h3>
                <p className="text-gray-600">
                  Access to customized credit options that adapt to your farming cycle and cash flow needs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 bg-agriloan-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-agriloan-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fair Interest Rates</h3>
                <p className="text-gray-600">
                  Transparent pricing with competitive rates, helping you escape high-interest local lenders.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 bg-agriloan-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-agriloan-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Build Credit History</h3>
                <p className="text-gray-600">
                  Establish and improve your credit score with each successful repayment, expanding future opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              A simple process designed with farmers in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: "Register", 
                description: "Create your account in minutes with basic information" 
              },
              { 
                step: "Apply", 
                description: "Submit your loan application with details about your farming needs" 
              },
              { 
                step: "Get Verified", 
                description: "Our team verifies your information quickly and securely" 
              },
              { 
                step: "Receive Funds", 
                description: "Once approved, receive funds directly in your account" 
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-agriloan-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.step}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register">
              <Button className="bg-agriloan-primary hover:bg-agriloan-secondary">
                Start Your Application
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Farmers Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from farmers who have transformed their operations with our credit solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                location: "Punjab",
                quote: "AgriLoan Nexus helped me purchase new equipment that increased my crop yield by 30%. The application process was simple, and the interest rate was much lower than local lenders."
              },
              {
                name: "Lakshmi Devi",
                location: "Karnataka",
                quote: "As a female farmer, I often faced barriers to credit. This platform gave me equal access to funds for expanding my organic vegetable farm. The flexible repayment options align perfectly with my harvest cycles."
              },
              {
                name: "Mohan Singh",
                location: "Rajasthan",
                quote: "I've been able to improve my irrigation system and switch to drought-resistant crops thanks to timely credit from AgriLoan Nexus. Their support team guided me through each step of the process."
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4 text-agriloan-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-agriloan-secondary flex items-center justify-center text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="agriloan-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to access fair credit for your farm?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of farmers who are growing their operations with accessible financial solutions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-agriloan-primary hover:bg-gray-100">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-agriloan-accent" />
                <span className="ml-2 text-lg font-bold text-white">AgriLoan Nexus</span>
              </div>
              <p className="text-sm">
                Empowering farmers with accessible credit solutions for sustainable agricultural growth.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/" className="hover:text-white">Features</Link></li>
                <li><Link to="/" className="hover:text-white">About Us</Link></li>
                <li><Link to="/" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/" className="hover:text-white">Support</Link></li>
                <li><Link to="/" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: info@agriloan-nexus.com</li>
                <li>Phone: +91 123-456-7890</li>
                <li>Address: Sector 5, Noida, UP, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} AgriLoan Nexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Dialogs for Navigation Items */}
      <Dialog open={activeDialog === 'features'} onOpenChange={() => activeDialog === 'features' && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Our Features</DialogTitle>
            <DialogDescription>
              Discover what makes AgriLoan Nexus the best choice for farmers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="bg-agriloan-primary/10 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-agriloan-primary" />
              </div>
              <div>
                <h4 className="font-medium">Flexible Credit Solutions</h4>
                <p className="text-sm text-muted-foreground">Customized credit options that adapt to your farming cycle and cash flow needs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-agriloan-primary/10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-agriloan-primary" />
              </div>
              <div>
                <h4 className="font-medium">Fair Interest Rates</h4>
                <p className="text-sm text-muted-foreground">Transparent pricing with competitive rates, helping you escape high-interest local lenders.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-agriloan-primary/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-agriloan-primary" />
              </div>
              <div>
                <h4 className="font-medium">Credit History Building</h4>
                <p className="text-sm text-muted-foreground">Establish and improve your credit score with each successful repayment.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'aboutUs'} onOpenChange={() => activeDialog === 'aboutUs' && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>About AgriLoan Nexus</DialogTitle>
            <DialogDescription>
              Our mission and values
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              AgriLoan Nexus was founded in 2023 with a clear mission: to provide accessible and fair financial services to rural farmers across India who have traditionally been underserved by the banking sector.
            </p>
            <p>
              Our team combines expertise in finance, agriculture, and technology to create solutions that truly meet the needs of farmers. We believe that financial inclusion is a right, not a privilege.
            </p>
            <p>
              By connecting farmers directly with verified lenders and using advanced credit scoring models that understand agricultural cycles, we're revolutionizing rural finance.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'contact'} onOpenChange={() => activeDialog === 'contact' && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              We're here to help with any questions or concerns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-medium">Customer Support</h4>
                <p className="text-sm">support@agriloan-nexus.com</p>
                <p className="text-sm">+91 123-456-7890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-medium">Partnerships</h4>
                <p className="text-sm">partners@agriloan-nexus.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-medium">Head Office</h4>
                <p className="text-sm">Sector 5, Noida, UP, India</p>
                <p className="text-sm">Hours: Monday-Friday, 9am-5pm IST</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
