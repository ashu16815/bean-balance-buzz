
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  requiresAuth?: boolean;
  allowedRoles?: Array<'customer' | 'barista' | 'admin'>;
}

const Layout = ({ children, requiresAuth = false, allowedRoles }: LayoutProps) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle text-coffee">Loading...</div>
      </div>
    );
  }
  
  // If auth is required but not logged in, redirect to login
  if (requiresAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If specific roles are required but user doesn't have permission
  if (currentUser && allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="py-4 border-t text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} Cafe Ordering System
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
