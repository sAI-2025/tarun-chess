import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, User, Monitor, Layers, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteData } from "@/contexts/SiteDataContext";
import type { Program } from "@/lib/siteData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const iconMap = {
  users: Users,
  user: User,
  monitor: Monitor,
  layers: Layers,
  swords: Swords,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45 },
  }),
};

const Programs = () => {
  useDocumentTitle("Programs | Tarun Chess Academy");
  const { siteData } = useSiteData();

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Our Programs</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From first-time players to aspiring competitors, we have a program designed for every stage of your chess journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {siteData.programs.map((p: Program, i: number) => {
            const IconComponent = iconMap[p.iconType] || Users;
            return (
              <motion.div
                key={p.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{p.description}</p>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link to="/contact">Sign Up</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Programs;
