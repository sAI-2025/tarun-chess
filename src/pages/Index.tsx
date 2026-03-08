import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Tent, Trophy, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloatingChessPieces from "@/components/FloatingChessPieces";
import heroBanner from "@/assets/chess-hero-banner.jpg";
import { useRef } from "react";
import { useSiteData } from "@/contexts/SiteDataContext";

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

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.8]);
  
  const { siteData } = useSiteData();

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0 -top-10 -bottom-10"
          style={{ y: bgY }}
        >
          <img
            src={heroBanner}
            alt="Chess pieces on a warm wooden board"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-foreground/70 via-foreground/50 to-primary/40"
          style={{ opacity: overlayOpacity }}
        />

        {/* Floating chess pieces */}
        <FloatingChessPieces />

        {/* Decorative chessboard grid */}
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative z-10 py-20 md:py-32">
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
              {siteData.homePage.heroTagline}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl drop-shadow-lg"
            >
              {siteData.homePage.heroTitle}{" "}
              <span className="text-accent">{siteData.homePage.heroTitleAccent}</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-lg text-primary-foreground/85 drop-shadow"
            >
              {siteData.homePage.heroDescription}
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 shadow-lg">
                <a href={siteData.homePage.ctaLink} target="_blank" rel="noopener noreferrer">{siteData.homePage.ctaText}</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full px-8 border border-primary-foreground/30 bg-transparent text-primary-foreground hover:border-accent hover:text-accent hover:bg-transparent"
              >
                <Link to="/programs">
                  {siteData.homePage.secondaryCtaText} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
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
            {siteData.upcomingEvents.map((ev, i) => (
              <motion.div
                key={ev.id}
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
            <a href="https://api.whatsapp.com/send/?phone=%2B19846876038&text=Hi%21+I%27m+interested+in+learning+more+about+Tarun's+Chess+Academy.+Please+share+details+about+your+chess+coaching+programs.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">Get Started Today</a>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
