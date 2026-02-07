import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Programs", path: "/programs" },
  { label: "Events", path: "/events" },
  { label: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Crown className="h-7 w-7 text-accent" />
          <span className="font-display text-xl font-bold text-primary">
            Tarun's Chess Academy
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary",
                  pathname === link.path
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-5">
              <Link to="/contact">Join Now</Link>
            </Button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <ul className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.path
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 px-4">
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                <Link to="/contact" onClick={() => setOpen(false)}>Join Now</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
