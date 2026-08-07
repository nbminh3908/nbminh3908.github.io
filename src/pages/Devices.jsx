import { useState } from "react";
import { ArrowUpRight, Monitor, Server, Smartphone } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";
import { Reveal, StaggerGroup, StaggerItem } from "../components/animations/Reveal.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import ServerStatusDetail from "../components/ui/ServerStatusDetail.jsx";

const devices = [
  {
    name: "Desktop",
    icon: Monitor,
    specs: [
      "ASUS PRIME A320M-K",
      "AMD Ryzen™ 7 2700",
      "16GB DDR4 2666MHz",
      "NVIDIA GeForce GTX 1070",
      "240GB SATA SSD",
      "1TB + 750GB HDD",
    ],
    os: [
      "Windows 10 IoT LTSC 2021",
      "Linux Mint 22.3 LTS",
    ],
  },
  {
    name: "Server",
    icon: Server,
    interactive: true,
    specs: [
      "BIOSTAR H55 HD",
      "Intel® Xeon® X3440",
      "6GB DDR3 1333MHz",
      "AMD Radeon HD 6350",
      "500GB HDD",
    ],
    os: [
      "Ubuntu 26.04 LTS",
    ],
  },
  {
    name: "iPhone 11",
    icon: Smartphone,
    specs: [
      "Apple A13 Bionic",
      "4GB LPDDR4X",
      "64GB NVMe",
    ],
    os: [
      "iOS 27 Developer Beta 4",
    ],
  },
];

export default function Devices() {
  const [serverDetailOpen, setServerDetailOpen] = useState(false);

  function openServerDetail() {
    setServerDetailOpen(true);
  }

  function handleServerKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openServerDetail();
    }
  }

  return (
    <Layout>
      <section aria-labelledby="devices-title">
        <Reveal>
          <h1
            id="devices-title"
            className="font-display text-3xl font-semibold text-ink sm:text-4xl"
          >
            Devices
          </h1>
        </Reveal>
      </section>

      <StaggerGroup
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Device list"
      >
        {devices.map((device) => (
          <StaggerItem key={device.name}>
            <SpotlightCard
              className={`h-full p-6 transition-transform hover:-translate-y-1 ${
                device.interactive ? "cursor-pointer" : ""
              }`}
              {...(device.interactive
                ? {
                    role: "button",
                    tabIndex: 0,
                    "aria-haspopup": "dialog",
                    "aria-expanded": serverDetailOpen,
                    "aria-label": "View live server uptime status",
                    onClick: openServerDetail,
                    onKeyDown: handleServerKeyDown,
                  }
                : {})}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <device.icon size={17} strokeWidth={2.25} />
                </span>

                <h2 className="font-display text-lg font-semibold text-ink">
                  {device.name}
                </h2>

                {device.interactive ? (
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
                    Uptime
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </span>
                ) : null}
              </div>

              <ul className="mt-5 space-y-2.5 font-mono text-sm text-ink-muted">
                {device.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                    <span>{spec}</span>
                  </li>
                ))}

                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />

                  <div className="space-y-2.5">
                    {device.os.map((os) => (
                      <div key={os}>{os}</div>
                    ))}
                  </div>
                </li>
              </ul>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <ServerStatusDetail
        open={serverDetailOpen}
        onClose={() => setServerDetailOpen(false)}
      />
    </Layout>
  );
}
