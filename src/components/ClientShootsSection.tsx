import React, { useState } from "react";
import { ArrowUpRight, Building, Calendar, ChevronRight, Image as ImageIcon, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import yunusPortrait from "@/assets/summit-yunus-portrait.jpeg.asset.json";
import signingHandshake from "@/assets/summit-signing-handshake.jpeg.asset.json";
import documentaryWorkers from "@/assets/documentary-workers.jpg.asset.json";
import documentaryCommunity from "@/assets/documentary-community.jpg.asset.json";
import concertStage from "@/assets/concert-stage.jpg.asset.json";
import corporatePanel from "@/assets/corporate-panel.jpg.asset.json";

export interface ClientShoot {
  id: string;
  name: string;
  category: string;
  year: string;
  location: string;
  tagline: string;
  overview: string;
  deliverables: string[];
  images: {
    src: string;
    caption: string;
  }[];
}

export const CLIENT_SHOOTS: ClientShoot[] = [
  {
    id: "gov-bangladesh",
    name: "Government of Bangladesh",
    category: "Diplomatic & State Summits",
    year: "2025",
    location: "Dhaka, Bangladesh",
    tagline: "Bangladesh Investment Summit 2025",
    overview:
      "Commissioned to document official state sessions, keynote address by Dr. Muhammad Yunus, bilateral delegations, and ministerial signing ceremonies. Photographed with discreet presence and strict adherence to diplomatic protocol.",
    deliverables: ["Keynote Address Coverage", "Bilateral Accord Signings", "Executive Delegate Portraits", "Archival Press Kit"],
    images: [
      {
        src: yunusPortrait.url,
        caption: "Dr. Muhammad Yunus addressing global delegates at the Bangladesh Investment Summit 2025",
      },
      {
        src: signingHandshake.url,
        caption: "Historic international bilateral agreement handshake",
      },
      {
        src: "/portfolio/extracted/corp-towards-tomorrow.jpg",
        caption: "Towards A Better Tomorrow — Official delegation and leadership group",
      },
    ],
  },
  {
    id: "ipu-assembly",
    name: "136th IPU Assembly",
    category: "World Parliamentary Summit",
    year: "2017",
    location: "BICC, Dhaka",
    tagline: "Inter-Parliamentary Union & ID Accreditation",
    overview:
      "Led official photo documentation and on-site instant credentialing section for hundreds of international parliamentarians and global dignitaries. Successfully issued accredited ID photos immediately as members registered, concluding with executive presidential coverage alongside the IPU President.",
    deliverables: ["Live On-Site ID Photo Issuance", "Plenary Assembly Coverage", "Meeting with IPU President", "VIP Bilateral Accords"],
    images: [
      {
        src: signingHandshake.url,
        caption: "State protocol signing and bilateral meeting at the IPU Assembly",
      },
      {
        src: "/portfolio/extracted/corp-towards-tomorrow.jpg",
        caption: "High-level delegation and assembly committee session",
      },
      {
        src: corporatePanel.url,
        caption: "Assembly symposium and ministerial discussion panel",
      },
    ],
  },
  {
    id: "unicef-savechildren",
    name: "UNICEF & Save the Children",
    category: "Humanitarian & NGO Documentary",
    year: "2005 — 2024",
    location: "Nationwide, Bangladesh",
    tagline: "Child Welfare & 100+ Coordinated Exhibitions",
    overview:
      "Long-term documentary practice capturing human dignity, youth livelihood, and community development across rural and peri-urban Bangladesh. Coordinated over 100 exhibition photo shows for UNICEF, Save the Children, and British Council.",
    deliverables: ["Field Photo Documentation", "100+ Curated Public Exhibitions", "Advocacy Campaign Imagery", "Humanitarian Stories"],
    images: [
      {
        src: documentaryWorkers.url,
        caption: "Documentary portrait of artisanal workers and community livelihoods in Bangladesh",
      },
      {
        src: documentaryCommunity.url,
        caption: "Community development and social progress programme documentation",
      },
    ],
  },
  {
    id: "actionaid",
    name: "ActionAid Bangladesh",
    category: "Social Rights & Campaign Documentaries",
    year: "2002 — 2008",
    location: "19 Districts, Bangladesh",
    tagline: "Positive Lives Campaign & Anti-Trafficking",
    overview:
      "Key conductor and resource person during the Positive Lives Campaign on HIV/AIDS and Anti-Trafficking partnership between ActionAid & Map Photo Agency. Traveled across 19 districts organizing photo shows and awareness workshops.",
    deliverables: ["19 Districts Fieldwork", "Community Awareness Workshops", "Social Impact Photo Series", "National Photo Agency Coordination"],
    images: [
      {
        src: documentaryCommunity.url,
        caption: "Positive Lives awareness gathering and community workshop session",
      },
      {
        src: documentaryWorkers.url,
        caption: "Field documentary capturing human rights and social justice stories",
      },
    ],
  },
  {
    id: "grameenphone",
    name: "Grameenphone & Corporate Brands",
    category: "Corporate Events & Activations",
    year: "2023 — 2025",
    location: "Corporate HQ, Dhaka",
    tagline: "Official Group & Pohela Boishakh Celebrations",
    overview:
      "Comprehensive corporate event coverage capturing executive leadership, milestone celebrations, and vibrant festive activations. Produced official corporate official group compositions that preserve team pride and company culture.",
    deliverables: ["Official Corporate Group Photography", "Brand Event Activation Staging", "Festive Campaign Portfolios", "Executive Headshots"],
    images: [
      {
        src: "/portfolio/extracted/corp-boishakh-group.jpg",
        caption: "Grameenphone Pohela Boishakh corporate group and stage celebration",
      },
      {
        src: "/portfolio/extracted/corp-towards-tomorrow.jpg",
        caption: "Executive board and official leadership group composition",
      },
    ],
  },
  {
    id: "folkfest",
    name: "Dhaka International FolkFest",
    category: "Concerts & Live Entertainment",
    year: "2024",
    location: "National Live Stadium",
    tagline: "Live Arena & World Music Spectacle",
    overview:
      "Front-of-stage and dynamic pit coverage capturing world-class musicians, dramatic arena beam lighting, and international performance arts under demanding live stage conditions.",
    deliverables: ["Mainstage Stadium Coverage", "Artist Performance In-Motion", "Arena Lighting Visuals", "Live Audience Atmosphere"],
    images: [
      {
        src: "/portfolio/extracted/concert-folkfest.jpg",
        caption: "Dhaka International FolkFest live stage performance",
      },
      {
        src: concertStage.url,
        caption: "Dynamic headline concert artist beneath warm stage lights",
      },
      {
        src: "/portfolio/extracted/concert-tango-dance.jpg",
        caption: "Live stage tango performance holding the electric pulse of the room",
      },
    ],
  },
  {
    id: "lumiere",
    name: "Lumière & Fashion Commercial",
    category: "Fashion Runway & TVC Commercials",
    year: "2024 — 2025",
    location: "Dhaka Fashion Week & Studios",
    tagline: "Runway Shows & Advertising Campaigns",
    overview:
      "Editorial runway and commercial advertising imagery created with bespoke lighting setups. From the Lumière catwalk on illuminated turf to national television commercial stills and beauty pageant crowns.",
    deliverables: ["Runway Catwalk Coverage", "Commercial TVC Stills", "Pageant Coronation Photography", "Boutique Retail Campaigns"],
    images: [
      {
        src: "/portfolio/extracted/fashion-runway-lumiere.jpg",
        caption: "Lumière fashion show runway walking down the illuminated catwalk",
      },
      {
        src: "/portfolio/extracted/commercial-fashion-boutique.jpg",
        caption: "Commercial denim and retail boutique fashion photoshoot",
      },
      {
        src: "/portfolio/extracted/fashion-pageant-winners.jpg",
        caption: "Beauty pageant winners crowned on stage by Ahmed Taj",
      },
      {
        src: "/portfolio/extracted/commercial-desert-walk.jpg",
        caption: "Cinematic commercial TVC still captured with atmospheric lighting",
      },
    ],
  },
];

interface ClientShootsSectionProps {
  onOpenBooking: (serviceName?: string) => void;
}

export function ClientShootsSection({ onOpenBooking }: ClientShootsSectionProps) {
  const [selectedShoot, setSelectedShoot] = useState<ClientShoot | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleOpenClient = (shoot: ClientShoot) => {
    setSelectedShoot(shoot);
    setActiveImageIndex(0);
  };

  const handleClose = () => {
    setSelectedShoot(null);
  };

  return (
    <section className="border-t border-border bg-card/40 py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              Trusted Commissions
            </span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl text-foreground font-medium">
              Client Shoots & Agency Assignments
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
            Click on any client or institution below to view the decisive moments, delegations, and photos captured for their campaign.
          </p>
        </div>

        {/* Client Logos / Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {CLIENT_SHOOTS.map((shoot) => (
            <button
              key={shoot.id}
              type="button"
              onClick={() => handleOpenClient(shoot)}
              className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div>
                <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider">
                    {shoot.year}
                  </span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-3 font-display text-xl sm:text-2xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {shoot.name}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground font-mono truncate">
                  {shoot.tagline}
                </p>
              </div>

              {/* Photo count indicator */}
              <div className="mt-5 flex items-center gap-1.5 pt-3 border-t border-border/60 text-[0.72rem] text-muted-foreground">
                <ImageIcon className="size-3.5 text-primary" />
                <span>{shoot.images.length} shoot photos</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Client Shoot Details Modal */}
      {selectedShoot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in-0 duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-white/20 bg-background text-foreground shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border bg-muted/40 p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                    {selectedShoot.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {selectedShoot.location} • {selectedShoot.year}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-foreground">
                  {selectedShoot.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground font-mono">
                  {selectedShoot.tagline}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close dialog"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Main Featured Photo View */}
              <div className="space-y-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-black">
                  <img
                    src={selectedShoot.images[activeImageIndex]?.src}
                    alt={selectedShoot.images[activeImageIndex]?.caption}
                    className="size-full object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-mono italic px-1">
                  Photo {activeImageIndex + 1} of {selectedShoot.images.length}:{" "}
                  {selectedShoot.images[activeImageIndex]?.caption}
                </p>
              </div>

              {/* Thumbnails of this shoot */}
              {selectedShoot.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {selectedShoot.images.map((img, idx) => (
                    <button
                      key={img.src + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                        idx === activeImageIndex
                          ? "border-primary ring-2 ring-primary/40 scale-105"
                          : "border-border opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img.src} alt={img.caption} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Assignment Narrative & Deliverables */}
              <div className="grid gap-6 md:grid-cols-12 border-t border-border pt-5">
                <div className="md:col-span-8">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-medium">
                    Assignment Scope & Execution
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {selectedShoot.overview}
                  </p>
                </div>

                <div className="md:col-span-4 border-l border-border md:pl-6">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-mono font-medium">
                    Delivered Assets
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {selectedShoot.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-primary" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA within Modal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-5">
                <span className="text-xs text-muted-foreground">
                  Ready to produce an assignment with Ahmed Taj?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onOpenBooking(selectedShoot.category);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <span>Schedule Similar Shoot</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
