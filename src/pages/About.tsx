import { motion } from "framer-motion";
import { BookOpen, Target, User, Star, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteData } from "@/contexts/SiteDataContext";
import tarunPhoto from "@/assets/tarun-photo.jpeg";
import type { AboutFeature } from "@/lib/siteData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const iconMap: Record<AboutFeature['iconType'], LucideIcon> = {
  book: BookOpen,
  target: Target,
  star: Star,
  user: User,
};

const About = () => {
  const { siteData } = useSiteData();
  const about = siteData.aboutPage;

  return (
    <>
      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-8 text-center">{about.storyTitle}</h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {about.storyParagraphs.map((p, i) => (
                <p key={i} className={i === about.storyParagraphs.length - 1 ? "font-medium text-foreground" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-secondary/40">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{about.missionTitle}</h3>
                <p className="text-sm text-muted-foreground">{about.missionText}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{about.visionTitle}</h3>
                <p className="text-sm text-muted-foreground">{about.visionText}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Meet the Coach */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">{about.coachSectionTitle}</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="shrink-0 mx-auto md:mx-0">
                  <div className="h-48 w-40 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={about.coachPhotoUrl || tarunPhoto}
                      alt={`${about.coachName} — Chess Coach`}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
               </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <h3 className="font-display text-xl font-semibold text-foreground">{about.coachName}</h3>
                {about.coachParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary/40">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">Why Choose Us</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {about.features.map((r, i) => {
              const Icon = iconMap[r.iconType] || BookOpen;
              return (
                <motion.div
                  key={r.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } },
                  }}
                >
                  <Card className="h-full text-center border-none shadow-md">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground mb-1">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
