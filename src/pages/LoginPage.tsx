
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate("/order");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to log in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'barista' | 'admin') => {
    setIsLoading(true);
    setError(null);
    
    try {
      let credentials = {
        customer: { email: 'demo.customer@example.com', password: 'demo123' },
        barista: { email: 'demo.barista@example.com', password: 'demo123' },
        admin: { email: 'demo.admin@example.com', password: 'demo123' }
      };
      
      const { email, password } = credentials[role];
      
      await login(email, password);
      navigate("/order");
      toast.success(`Logged in as ${role}`);
    } catch (error: any) {
      console.error(`Demo login error (${role}):`, error);
      setError(`Demo ${role} login failed: ${error.message || "Invalid credentials"}. The demo accounts may need to be created first.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-coffee hover:bg-coffee-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or try a demo account
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('customer')}
                  disabled={isLoading}
                >
                  Customer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('barista')}
                  disabled={isLoading}
                >
                  Barista
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                >
                  Admin
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium mb-1">Demo Account Information</h3>
                <p className="text-sm text-muted-foreground">
                  Demo accounts use the following credentials:
                </p>
                <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                  <li>Email: customer/barista/admin@example.com</li>
                  <li>Password: password123</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-coffee underline hover:text-coffee-dark">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
