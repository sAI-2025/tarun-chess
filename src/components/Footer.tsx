import { Link } from "react-router-dom";
import { Crown, Mail, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { useSiteData } from "@/contexts/SiteDataContext";

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

const Footer = () => {
  const { siteData } = useSiteData();
  const footer = siteData.footer;

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Crown className="h-6 w-6 text-accent" />
              <span className="font-display text-lg font-bold text-primary">{footer.brandName}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">{footer.tagline}</p>
            {footer.socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {footer.socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform.toLowerCase()] || Mail;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={link.platform}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {footer.quickLinks.length > 0 && (
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {footer.quickLinks.map((l) => (
                  <li key={l.id}>
                    <Link to={l.path} className="text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Get in Touch</h4>
            <a
              href={`mailto:${footer.contactEmail}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              {footer.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {footer.copyrightText}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
