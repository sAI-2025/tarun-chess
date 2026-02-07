import { Link } from "react-router-dom";
import { Crown, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Crown className="h-6 w-6 text-accent" />
            <span className="font-display text-lg font-bold text-primary">Tarun's Chess Academy</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Building confident, thoughtful chess players — one clear idea at a time.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "About Us", path: "/about" },
              { label: "Programs", path: "/programs" },
              { label: "Events", path: "/events" },
              { label: "Contact Us", path: "/contact" },
            ].map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Get in Touch</h4>
          <a
            href="mailto:taruntubati9@gmail.com"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" />
            taruntubati9@gmail.com
          </a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tarun's Chess Academy. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
