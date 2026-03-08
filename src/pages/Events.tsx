import { useState } from "react";
import { motion } from "framer-motion";
import { Tent, Trophy, Lightbulb, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useSiteData } from "@/contexts/SiteDataContext";
import type { EventSection } from "@/lib/siteData";

const iconMap = {
  tent: Tent,
  trophy: Trophy,
  lightbulb: Lightbulb,
  info: Info,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Events = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { siteData } = useSiteData();

  const eventDates = [new Date(2026, 2, 15), new Date(2026, 5, 22), new Date(2026, 7, 10)];

  return (
    <>
      {/* Summer Camps */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-12 text-center">Events</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {siteData.eventSections.map((e: EventSection) => {
                const IconComponent = iconMap[e.iconType] || Tent;
                return (
                  <Card key={e.id} className="border-none shadow-md text-center">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
                        <IconComponent className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">{e.title}</h3>
                      <p className="text-sm text-muted-foreground">{e.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Event Page Cards (dynamic from admin) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="space-y-6 mb-16">
              {siteData.eventsPageCards.map((card) => (
                <Card key={card.id} className="border-none shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {card.title}
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>{card.description}</p>
                      {card.extraText && <p>{card.extraText}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Registration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to sign up for an upcoming event? Use the link below to register through our Google Form.
                </p>
                <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href="https://forms.gle/bkeWgrhbDyHGckok7" target="_blank" rel="noopener noreferrer">
                    Register Now <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Events;
