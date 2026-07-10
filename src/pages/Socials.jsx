import { ArrowUpRight } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";
import { Reveal, StaggerGroup, StaggerItem } from "../components/animations/Reveal.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import BrandIcon from "../components/ui/BrandIcon.jsx";

const socials = [
  { name: "Facebook", icon: "facebook", href: "https://facebook.com/nbminh3908/", label: "Open Facebook" },
  { name: "Instagram", icon: "instagram", href: "https://instagram.com/nbminh3908/", label: "Open Instagram" },
  {
    name: "Discord",
    icon: "discord",
    href: "https://discord.com/users/809248459827314689",
    label: "Open Discord",
    meta: "@nbminh3908_",
  },
  { name: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@nbminh3908_", label: "Open TikTok" },
  { name: "GitHub", icon: "github", href: "https://github.com/nbminh3908", label: "Open GitHub" },
  {
    name: "Email",
    icon: "mail",
    href: "mailto:nbminh3908@gmail.com",
    label: "Send email",
    meta: "nbminh3908@gmail.com",
    internal: true,
  },
];

export default function Socials() {
  return (
    <Layout>
      <section aria-labelledby="socials-title">
        <Reveal>
          <h1 id="socials-title" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Socials
          </h1>
        </Reveal>
      </section>

      <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Social links">
        {socials.map((social) => (
          <StaggerItem key={social.name}>
            <SpotlightCard
              as="a"
              href={social.href}
              target={social.internal ? undefined : "_blank"}
              rel={social.internal ? undefined : "noreferrer"}
              aria-label={social.label}
              className="flex h-full flex-col justify-between p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <BrandIcon name={social.icon} size={20} />
                </span>
                <ArrowUpRight size={16} className="text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-6">
                <h2 className="font-display text-base font-semibold text-ink">{social.name}</h2>
                {social.meta ? <span className="mt-1 block text-sm text-ink-muted">{social.meta}</span> : null}
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Layout>
  );
}
