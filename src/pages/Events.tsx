import { useState } from "react";
import { motion } from "framer-motion";
import { Tent, Trophy, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import EventRegistrationForm from "@/components/EventRegistrationForm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Events = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventDates = [new Date(2026, 2, 15), new Date(2026, 5, 22), new Date(2026, 7, 10)];

  return (
    <>
      {/* Summer Camps */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-12 text-center">Events</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Tent, title: "Summer Camps", desc: "Immersive multi-day chess bootcamps with structured lessons, guided play, and fun activities." },
                { icon: Trophy, title: "Tournaments", desc: "Competitive events for students to test their skills and gain real tournament experience." },
                { icon: Lightbulb, title: "Workshops", desc: "Focused sessions on specific topics like endgames, openings, and competitive mindset." },
              ].map((e) => (
                <Card key={e.title} className="border-none shadow-md text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
                      <e.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{e.title}</h3>
                    <p className="text-sm text-muted-foreground">{e.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Past Bootcamp */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Card className="border-none shadow-md mb-16">
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">Past Bootcamp: VTSEVA Chess Camp 2024</h3>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    As an active VTSEVA volunteer, Tarun ran a 4-week chess bootcamp starting June 24, 2024. Students learned fundamental and intermediate chess strategies in a fun, supportive environment.
                  </p>
                  <p>
                    The complete bootcamp cost was $15, with all proceeds going toward visually impaired kids at Netra Vidyalaya.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar & Registration */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Event Calendar</h3>
                <Card className="border-none shadow-md inline-block">
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      modifiers={{ event: eventDates }}
                      modifiersClassNames={{ event: "bg-accent/20 text-accent-foreground font-bold" }}
                    />
                  </CardContent>
                </Card>
              </div>
              <EventRegistrationForm />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Events;
