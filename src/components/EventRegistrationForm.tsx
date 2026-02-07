import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  event: z.string().min(1, "Please select an event"),
  notes: z.string().trim().max(500).optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const upcomingEvents = [
  { value: "summer-camp-2026", label: "Summer Camp — Mar 15, 2026" },
  { value: "tournament-jun-2026", label: "Tournament — Jun 22, 2026" },
  { value: "workshop-aug-2026", label: "Workshop — Aug 10, 2026" },
];

const RECIPIENT_EMAIL = "taruntubati9@gmail.com";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EventRegistrationForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    phone: "",
    event: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof RegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registrationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const eventLabel =
      upcomingEvents.find((ev) => ev.value === form.event)?.label ?? form.event;

    const subject = encodeURIComponent(
      `Event Registration: ${eventLabel}`
    );

    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : null,
        `Event: ${eventLabel}`,
        form.notes ? `Notes: ${form.notes}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.open(`mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`, "_self");

    toast({
      title: "Opening your email client",
      description: "Please send the pre-filled email to complete your registration.",
    });

    setForm({ name: "", email: "", phone: "", event: "", notes: "" });
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Register for an Event
      </h3>
      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Name *
              </label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
                className="rounded-lg"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email *
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                className="rounded-lg"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone (optional)
              </label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="rounded-lg"
              />
            </div>

            {/* Event Select */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Event *
              </label>
              <Select
                value={form.event}
                onValueChange={(val) => handleChange("event", val)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent>
                  {upcomingEvents.map((ev) => (
                    <SelectItem key={ev.value} value={ev.value}>
                      {ev.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.event && (
                <p className="text-sm text-destructive mt-1">{errors.event}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Additional Notes (optional)
              </label>
              <Textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Anything else we should know?"
                rows={3}
                className="rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Send className="mr-2 h-4 w-4" /> Register via Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventRegistrationForm;
