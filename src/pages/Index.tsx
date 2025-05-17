
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="space-y-6 max-w-3xl">
          <div className="flex justify-center">
            <div className="text-6xl mb-4">☕</div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-coffee-dark sm:text-5xl">
            Welcome to Brew Haven
          </h1>
          <p className="text-xl text-muted-foreground">
            The easiest way to order your favorite coffee and have it ready when you arrive.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {currentUser ? (
              <Button size="lg" className="bg-coffee hover:bg-coffee-dark" asChild>
                <Link to="/order">Order Coffee Now</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild variant="outline">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="lg" className="bg-coffee hover:bg-coffee-dark" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="text-3xl mb-4">🥛</div>
            <h3 className="text-xl font-semibold mb-2">Custom Orders</h3>
            <p className="text-muted-foreground">
              Choose from our variety of drinks and customize with your preferred milk option.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Credit System</h3>
            <p className="text-muted-foreground">
              Simple credit-based payment system. No need for cash or cards.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Ready Notifications</h3>
            <p className="text-muted-foreground">
              Get notified as soon as your order is ready for pickup.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
