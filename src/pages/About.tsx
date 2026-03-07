import { motion } from "framer-motion";
import { BookOpen, Target, User, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import tarunPhoto from "@/assets/tarun-photo.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const whyReasons = [
  { icon: BookOpen, title: "Fundamentals First", desc: "We teach why positions work — not just what moves to play." },
  { icon: Target, title: "Structured Learning", desc: "Lessons are paced to each student and reinforced through guided play." },
  { icon: Star, title: "Patient Instruction", desc: "Improvement feels exciting, not frustrating. Every student progresses at their own pace." },
  { icon: User, title: "Proven Results", desc: "Students gain confidence, think independently, and genuinely enjoy the game." },
];

const About = () => (
  <>
    {/* Our Story */}
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-8 text-center">Our Story</h1>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              This academy was founded to teach chess clearly, patiently, and with purpose. Through years of competitive play, I noticed a common problem in chess education: students were often overwhelmed too early. Openings were memorized without understanding, tactics were taught without context, and improvement felt frustrating instead of exciting.
            </p>
            <p>
              Our approach is different. We focus on strong fundamentals first, helping students understand <em>why</em> positions work—not just what moves to play. Lessons are structured, paced to the student, and reinforced through guided play so concepts actually stick.
            </p>
            <p>
              In 2024, this philosophy was put into practice through structured programs and chess camps. Watching students gain confidence, think independently, and improve week by week confirmed one thing: when chess is taught the right way, students don't just get better—they start enjoying the game more.
            </p>
            <p className="font-medium text-foreground">
              This academy exists to build confident, thoughtful chess players — one clear idea at a time.
            </p>
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
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-sm text-muted-foreground">
                To make chess education accessible, engaging, and effective for every student — building not just better players, but better thinkers.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">Our Vision</h3>
              <p className="text-sm text-muted-foreground">
                A community where every young chess player has the guidance and encouragement to reach their full potential, on and off the board.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>

    {/* Meet Tarun */}
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Meet the Coach</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="h-40 w-40 rounded-2xl bg-secondary flex items-center justify-center">
                <User className="h-20 w-20 text-muted-foreground/40" />
              </div>
            </div>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <h3 className="font-display text-xl font-semibold text-foreground">Tarun Sai Tubati</h3>
              <p>
                Hi, I'm Tarun — a 10th grader, two-time state chess champion, and dedicated student of the game. I started playing chess at the age of 8, quickly falling in love with the strategy, creativity, and challenge it offers.
              </p>
              <p>
                What began as games with friends and family grew into a competitive pursuit. Today, I train seriously and compete at the state and national levels. I've also served as an assistant tournament director for the Girls State Chess Championship for the past two years.
              </p>
              <p>
                Chess has taught me how to think critically, stay disciplined, and grow through challenge — and those are the same values I bring to my teaching.
              </p>
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
          {whyReasons.map((r, i) => (
            <motion.div
              key={r.title}
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
                    <r.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
