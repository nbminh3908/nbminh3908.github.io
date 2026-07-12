import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, ArrowRight, Share2 } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";
import { Eyebrow } from "../components/ui/SectionHeader.jsx";
import { Reveal } from "../components/animations/Reveal.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import MagneticButton from "../components/ui/MagneticButton.jsx";
import portrait from "../assets/nbm.jpg";

export default function Home() {
  return (
    <Layout>
      <section aria-labelledby="home-title" className="grid grid-cols-1 items-center gap-10 py-6 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow icon={Sparkles}>Welcome</Eyebrow>
          </Reveal>

          <motion.h1
            id="home-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-ink text-balance sm:text-5xl lg:text-6xl"
          >
            Oh hi!
          </motion.h1>

          <Reveal delay={0.15} className="mt-6 max-w-lg space-y-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            <p>My name is Ngo Bao Minh, but I usually go by Bao on social media.</p>
          </Reveal>

          <Reveal delay={0.24} className="mt-8">
            <MagneticButton
              as={Link}
              to="/socials"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform"
            >
              <Share2 size={15} />
              Socials
              <ArrowRight size={15} />
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative mx-auto w-full max-w-xs lg:max-w-sm">
          <div
            className="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-60 blur-2xl"
            style={{ background: "radial-gradient(circle, var(--color-accent-soft), transparent 70%)" }}
          />
          <aside
            aria-label="me :D"
            className="overflow-hidden rounded-[2rem] border border-base-border glass-panel p-2 shadow-glass"
          >
            <img
              src={portrait}
              alt="Ngo Bao Minh"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </aside>
        </Reveal>
      </section>

      <section aria-label="About me" className="mt-4 sm:mt-8">
        <Reveal>
          <Eyebrow icon={MapPin}>About me</Eyebrow>
        </Reveal>

        <Reveal delay={0.1} className="mt-5">
          <SpotlightCard className="p-6 sm:p-8">
            <div className="space-y-3 text-base leading-relaxed text-ink sm:text-lg">
              <p>I was born on September 3, 2008 and I live in Hanoi, Vietnam.</p>
              <p>
                My hobbies revolve around tech tinkering, casual (or competitive) gaming, and socializing irl (I'm
                an extrovert once you know me well :D).
              </p>
              <p>
                I mainly play{" "}
                <Link to="/valorant-stats" className="font-medium text-accent underline underline-offset-2 hover:text-accent/80">
                  VALORANT
                </Link>{" "}
                in my free time, you can also find my Tracker.gg stats{" "}
                <a
                  href="https://tracker.gg/valorant/profile/riot/Nanashi%20Mumei%23baooo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
                >
                  here
                </a>
                .
              </p>
              <p>
                I also play a bit of{" "}
                <a
                  href="https://namemc.com/profile/Baooo_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
                >
                  Minecraft
                </a>{" "}
                and{" "}
                <a
                  href="https://roblox.com/users/722175181/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
                >
                  Roblox
                </a>{" "}
                too.
              </p>
            </div>
          </SpotlightCard>
        </Reveal>
      </section>
    </Layout>
  );
}