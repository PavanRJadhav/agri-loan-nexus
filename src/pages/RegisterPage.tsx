
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, ArrowLeft, User, Lock, Mail, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "verifier">("farmer");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("agriculture");
  const [farmSize, setFarmSize] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateAadhar = (aadhar: string) => {
    // Check if Aadhar is 12 digits
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // For farmers, validate financial information and Aadhar
    if (role === "farmer" && currentPage === 1) {
      setCurrentPage(2);
      return;
    }

    if (role === "farmer") {
      if (!currentBalance) {
        setError("Please enter your current balance");
        return;
      }

      if (!loanAmount) {
        setError("Please enter desired loan amount");
        return;
      }

      if (!aadharNumber) {
        setError("Please enter your Aadhar number");
        return;
      }

      if (!validateAadhar(aadharNumber)) {
        setError("Please enter a valid 12-digit Aadhar number");
        return;
      }
    }
    
    // Check if user already exists
    const existingUserData = localStorage.getItem(`agriloan_userdata_${email}`);
    if (existingUserData) {
      setError("An account with this email already exists. Please sign in instead.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Save user data to localStorage to simulate database storage
      const userData = {
        name,
        email,
        role,
        currentBalance: role === "farmer" ? parseFloat(currentBalance) : 0,
        loanAmount: role === "farmer" ? parseFloat(loanAmount) : 0,
        incomeSource: role === "farmer" ? incomeSource : "",
        farmSize: role === "farmer" ? farmSize : "",
        aadharNumber: role === "farmer" ? aadharNumber : "",
        registrationDate: new Date().toISOString(),
        loans: [],
        transactions: []
      };

      // Store in localStorage as a simple database simulation
      localStorage.setItem(`agriloan_userdata_${email}`, JSON.stringify(userData));
      
      await register(name, email, password, role);
      toast({
        title: "Registration successful!",
        description: "Welcome to AgriLoan Nexus.",
      });
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(1);
  };

  const incomeSourceOptions = [
    { value: "agriculture", label: "Agriculture" },
    { value: "livestock", label: "Livestock" },
    { value: "mixed_farming", label: "Mixed Farming" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-agriloan-primary flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AgriLoan Nexus
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digital credit solutions for farmers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="auth-card">
          <CardHeader>
            <CardTitle className="text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              {currentPage === 1 
                ? "Join our platform to access digital credit services" 
                : "Please provide your financial information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentPage === 1 ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="name" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password" className="flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label>I am a:</Label>
                    <RadioGroup 
                      value={role} 
                      onValueChange={(value) => setRole(value as "farmer" | "verifier")}
                      className="flex gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="farmer" id="farmer" />
                        <Label htmlFor="farmer">Farmer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="verifier" id="verifier" />
                        <Label htmlFor="verifier">Verifier</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="aadharNumber" className="flex items-center gap-1">
                      <Shield className="h-4 w-4" /> 
                      Aadhar Number
                    </Label>
                    <Input
                      id="aadharNumber"
                      type="text" 
                      placeholder="Enter your 12-digit Aadhar number"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').substring(0, 12))}
                      required
                      maxLength={12}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Your 12-digit Aadhar number will be used for verification</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="currentBalance">Current Balance (₹)</Label>
                    <Input
                      id="currentBalance"
                      type="number"
                      placeholder="Enter your current balance"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="loanAmount">Desired Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="Enter how much loan you need"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="incomeSource">Primary Income Source</Label>
                    <Select value={incomeSource} onValueChange={setIncomeSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary income source" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeSourceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="farmSize">Farm Size (in acres)</Label>
                    <Input
                      id="farmSize"
                      type="text"
                      placeholder="Enter your farm size"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-agriloan-primary hover:bg-agriloan-secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : currentPage === 1 && role === "farmer" ? "Next" : "Create account"}
              </Button>

              {currentPage === 2 && (
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm w-full">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-agriloan-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 flex justify-center">
          <Link to="/" className="flex items-center text-sm font-medium text-agriloan-primary">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
