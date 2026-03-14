import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSiteData } from "@/contexts/SiteDataContext";
import { z } from "zod";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Contact = () => {
  const { toast } = useToast();
  const { siteData } = useSiteData();
  const contact = siteData.contactPage;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    const mailtoLink = `mailto:${contact.formRecipientEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");

    toast({
      title: "Opening your email client",
      description: "Please send the pre-filled email to complete your message.",
    });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4 text-center">{contact.pageTitle}</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
          {contact.pageSubtitle}
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="rounded-lg"
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="rounded-lg"
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help?"
                      rows={5}
                      className="rounded-lg"
                    />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">{contact.email}</span>
                </a>
                <a href={`tel:${contact.phoneRaw}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">{contact.phone}</span>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(contact.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">Message on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
