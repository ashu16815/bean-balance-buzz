
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { currentUser, user, logout } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => cn(
    "px-4 py-2 rounded-md transition-colors", 
    isActive 
      ? "bg-coffee/10 text-coffee font-medium" 
      : "hover:bg-coffee/5 text-foreground/80"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2 mr-4">
          <span className="text-2xl">☕</span>
          <span className="font-bold text-lg tracking-tight">Brew Haven</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2 ml-4">
          <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
          {currentUser && (
            <>
              <NavLink to="/order" className={navLinkClasses}>Order Coffee</NavLink>
              <NavLink to="/my-orders" className={navLinkClasses}>My Orders</NavLink>
              {(currentUser.role === 'barista' || currentUser.role === 'admin') && (
                <NavLink to="/barista" className={navLinkClasses}>Barista View</NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                <span className="mr-2 text-muted-foreground">Credits:</span>
                <span className="font-medium">{currentUser.credits}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {currentUser.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="md:hidden">
                    Credits: <span className="ml-auto font-medium">{currentUser.credits}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Role: <span className="ml-auto capitalize">{currentUser.role}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={logout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="bg-coffee hover:bg-coffee-dark" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
