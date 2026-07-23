import { Monitor, Server, Smartphone } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";
import { Reveal, StaggerGroup, StaggerItem } from "../components/animations/Reveal.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";

const devices = [
  {
    name: "Desktop",
    icon: Monitor,
    specs: [
      "ASUS PRIME A320M-K",
      "AMD Ryzen\u2122 7 2700",
      "16GB DDR4 2666MHz",
      "NVIDIA GeForce GTX 1070",
      "240GB SATA SSD",
      "1TB + 750GB HDD",
      "Windows 11 Pro 25H2",
    ],
  },
  {
    name: "Server",
    icon: Server,
    specs: [
      "BIOSTAR H55 HD",
      "Intel\u00ae Xeon\u00ae X3440",
      "6GB DDR3 1333MHz",
      "AMD Radeon HD 6350",
      "500GB HDD",
      "Ubuntu Server 26.04 LTS",
    ],
  },
  {
    name: "iPhone 11",
    icon: Smartphone,
    specs: ["Apple A13 Bionic", "64GB NVMe", "4GB RAM", "iOS 27 Developer Beta 2"],
  },
];

export default function Devices() {
  return (
    <Layout>
      <section aria-labelledby="devices-title">
        <Reveal>
          <h1 id="devices-title" className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Devices
          </h1>
        </Reveal>
      </section>

      <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Device list">
        {devices.map((device) => (
          <StaggerItem key={device.name}>
            <SpotlightCard className="h-full p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <device.icon size={17} strokeWidth={2.25} />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">{device.name}</h2>
              </div>
              <ul className="mt-5 space-y-2.5 font-mono text-sm text-ink-muted">
                {device.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Layout>
  );
}
