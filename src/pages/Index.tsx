import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Tent, Trophy, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const features = [
  {
    icon: GraduationCap,
    title: "Classes",
    desc: "Structured group and private lessons for all levels, from beginner to tournament-ready.",
  },
  {
    icon: Tent,
    title: "Camps",
    desc: "Immersive summer chess bootcamps that build skills, friendships, and confidence.",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    desc: "Competitive play opportunities that put your training to the test.",
  },
];

const upcomingEvents = [
  { date: "Mar 15, 2026", title: "Spring Group Classes Begin", type: "Classes" },
  { date: "Jun 22, 2026", title: "Summer Chess Bootcamp", type: "Camp" },
  { date: "Aug 10, 2026", title: "City Championship Prep Workshop", type: "Workshop" },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent"
            >
              Welcome to Tarun's Chess Academy
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Build Confidence,{" "}
              <span className="text-primary">One Move at a Time</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg text-muted-foreground"
            >
              Patient, fundamentals-first chess instruction that helps students
              think clearly, play confidently, and love the game.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                <Link to="/contact">Join Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link to="/programs">
                  Explore Programs <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-secondary/40">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
            What We Offer
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="h-full text-center border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <f.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
            Upcoming Events
          </h2>
          <div className="mx-auto max-w-2xl space-y-4">
            {upcomingEvents.map((ev, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                      <CalendarDays className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{ev.title}</p>
                      <p className="text-sm text-muted-foreground">{ev.date}</p>
                    </div>
                    <span className="hidden sm:inline-block text-xs font-medium rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                      {ev.type}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/events">View All Events <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Chess Journey?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Whether you're a complete beginner or preparing for competition, we have a program for you.
          </p>
          <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8">
            <Link to="/contact">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
