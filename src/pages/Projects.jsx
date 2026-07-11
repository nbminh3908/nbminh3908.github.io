import { ArrowUpRight, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import { Reveal, StaggerGroup, StaggerItem } from "../components/animations/Reveal.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";

const projects = [
  {
    name: "Last.fm Now Playing",
    description: "A modern Last.fm now playing app built with React & Vite.",
    href: "/lastfm-now-playing",
    label: "Open Last.fm Now Playing",
  },
];

export default function Projects() {
  return (
    <Layout>
      <section aria-labelledby="projects-title">
        <Reveal>
          <h1 id="projects-title" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Projects
          </h1>
        </Reveal>
      </section>

      <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Project list">
        {projects.map((project) => (
          <StaggerItem key={project.name}>
            <SpotlightCard
              as={Link}
              to={project.href}
              aria-label={project.label}
              className="flex h-full flex-col justify-between p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Music2 size={20} />
                </span>
                <ArrowUpRight size={16} className="text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-6">
                <h2 className="font-display text-base font-semibold text-ink">{project.name}</h2>
                <p className="mt-1.5 text-sm text-ink-muted">{project.description}</p>
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Layout>
  );
}
