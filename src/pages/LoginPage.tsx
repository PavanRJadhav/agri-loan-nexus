
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful!",
        description: "Welcome to AgriLoan Nexus.",
      });
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardTitle className="text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email address</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-agriloan-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-agriloan-primary hover:bg-agriloan-secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm w-full">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-agriloan-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Demo Access</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <Button 
              variant="outline" 
              onClick={() => {
                setEmail("farmer@example.com");
                setPassword("password123");
              }}
              className="text-xs"
            >
              Farmer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setEmail("admin@example.com");
                setPassword("password123");
              }}
              className="text-xs"
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setEmail("verifier@example.com");
                setPassword("password123");
              }}
              className="text-xs"
            >
              Verifier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing icon
import { CreditCard } from "lucide-react";

export default LoginPage;
