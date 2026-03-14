import { useState } from "react";
import { motion } from "framer-motion";
import { Tent, Trophy, Lightbulb, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useSiteData } from "@/contexts/SiteDataContext";
import type { EventSection, EventPageCard } from "@/lib/siteData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

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
  useDocumentTitle("Events | Tarun Chess Academy");

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

          {/* Event Cards */}
          {siteData.eventsPageCards.map((card: EventPageCard) => (
            <motion.div key={card.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="border-none shadow-md mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  {card.extraText && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{card.extraText}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

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
                  {siteData.eventsPage.registrationDescription}
                </p>
                <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href={siteData.eventsPage.registerLink} target="_blank" rel="noopener noreferrer">
                    {siteData.eventsPage.registerText} <ExternalLink className="ml-1 h-4 w-4" />
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
