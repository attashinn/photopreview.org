import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Calendar,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookingModal } from "@/components/BookingModal";
import { ClientShootsSection } from "@/components/ClientShootsSection";
import { type MediaItem } from "@/components/AdminPortalModal";
import ahmedEvent from "@/assets/ahmed-event.png.asset.json";
import ahmedWorking from "@/assets/ahmed-working.png.asset.json";
import clientWall from "@/assets/client-wall.png.asset.json";
import concertSinger from "@/assets/concert-singer.jpg.asset.json";
import concertStage from "@/assets/concert-stage.jpg.asset.json";
import corporatePanel from "@/assets/corporate-panel.jpg.asset.json";
import documentaryCommunity from "@/assets/documentary-community.jpg.asset.json";
import documentaryWorkers from "@/assets/documentary-workers.jpg.asset.json";
import logo from "@/assets/photo-preview-logo-dark.png.asset.json";
import portraitEditorial from "@/assets/portrait-editorial.jpg.asset.json";
import portraitFashion from "@/assets/portrait-fashion.jpg.asset.json";
import signingGroup from "@/assets/summit-signing-group.jpeg.asset.json";
import signingHandshake from "@/assets/summit-signing-handshake.jpeg.asset.json";
import yunusPortrait from "@/assets/summit-yunus-portrait.jpeg.asset.json";
import yunusWide from "@/assets/summit-yunus-wide.jpeg.asset.json";

const services = [
  "Corporate event coverage",
  "Corporate portrait, thematic & headshots",
  "Corporate e-commerce",
  "Social media coverage",
  "Commercial photography",
  "Green screen photography",
  "Product photography",
  "Concert & entertainment",
  "Fashion photography",
  "International event coverage",
  "Time-lapse creation",
  "Architectural photography",
  "On-site printing",
  "Documentary & NGO",
  "Family & children",
  "Television commercials",
];

const clients = [
  "Government of Bangladesh",
  "Inter-Parliamentary Union",
  "UNICEF",
  "British Council",
  "ActionAid",
  "UNDP",
  "British American Tobacco",
  "Unilever",
  "Nestlé",
  "Grameenphone",
  "DHL",
  "BMW",
  "bKash",
  "The Daily Star",
  "HSBC",
  "Coca-Cola",
];

const galleryGroups = [
  {
    label: "01 / Corporate & summits",
    title: "Institutions in motion",
    copy: "Decisive moments, protocol and human connection—photographed without interrupting the room.",
    images: [
      { src: yunusPortrait.url, alt: "Dr. Muhammad Yunus speaking at the Bangladesh Investment Summit 2025", className: "md:col-span-7 md:row-span-2" },
      { src: "/portfolio/extracted/corp-towards-tomorrow.jpg", alt: "Towards A Better Tomorrow — Official Corporate Group Photography by Ahmed Taj", className: "md:col-span-5" },
      { src: signingHandshake.url, alt: "Signing ceremony handshake at the Bangladesh Investment Summit 2025", className: "md:col-span-5" },
      { src: "/portfolio/extracted/corp-boishakh-group.jpg", alt: "Corporate Official Group Photography at Pohela Boishakh celebration by Ahmed Taj", className: "md:col-span-7" },
      { src: corporatePanel.url, alt: "Corporate panel discussion photographed by Ahmed Taj", className: "md:col-span-5" },
    ],
  },
  {
    label: "02 / Concerts & entertainment",
    title: "Energy, held still",
    copy: "Live performance, spectacle and atmosphere shaped into images that keep the pulse of the room.",
    images: [
      { src: concertStage.url, alt: "Singer performing beneath warm stage lights", className: "md:col-span-7" },
      { src: "/portfolio/extracted/concert-folkfest.jpg", alt: "Dhaka International FolkFest live stage photographed by Ahmed Taj", className: "md:col-span-5" },
      { src: "/portfolio/extracted/concert-tango-dance.jpg", alt: "Live tango and salsa performance photography by Ahmed Taj", className: "md:col-span-5" },
      { src: concertSinger.url, alt: "Concert vocalist photographed in dramatic monochrome light", className: "md:col-span-7" },
    ],
  },
  {
    label: "03 / Documentary & NGO",
    title: "Every subject is a story",
    copy: "Social documentary work grounded in dignity, context and the decisive moments of everyday Bangladesh.",
    images: [
      { src: documentaryWorkers.url, alt: "Documentary portrait of workers in Bangladesh", className: "md:col-span-6" },
      { src: documentaryCommunity.url, alt: "Community documentary programme in Bangladesh", className: "md:col-span-6" },
    ],
  },
  {
    label: "04 / Fashion & runway",
    title: "Character, not a pose",
    copy: "Runway shows and editorial commissions shaped with precision lighting and authentic expression.",
    images: [
      { src: "/portfolio/extracted/fashion-runway-lumiere.jpg", alt: "Lumière fashion show runway photography by Ahmed Taj", className: "md:col-span-7" },
      { src: "/portfolio/extracted/fashion-pageant-winners.jpg", alt: "Beauty pageant winners crowned on stage photographed by Ahmed Taj", className: "md:col-span-5" },
      { src: portraitFashion.url, alt: "Editorial fashion portrait photographed by Ahmed Taj", className: "md:col-span-6" },
      { src: "/portfolio/extracted/fashion-streetwear.jpg", alt: "Streetwear fashion campaign photographed by Ahmed Taj", className: "md:col-span-6" },
    ],
  },
  {
    label: "05 / Commercial & advertising",
    title: "The right image sells",
    copy: "High-impact advertising imagery, television commercials, and campaign visuals that convey a clear, concise message.",
    images: [
      { src: "/portfolio/extracted/commercial-fashion-boutique.jpg", alt: "Commercial denim and retail fashion campaign by Ahmed Taj", className: "md:col-span-6" },
      { src: "/portfolio/extracted/commercial-desert-walk.jpg", alt: "Cinematic commercial TVC still photography by Ahmed Taj", className: "md:col-span-6" },
      { src: "/portfolio/extracted/commercial-tvc-table.jpg", alt: "National television commercial still photography by Ahmed Taj", className: "md:col-span-7" },
      { src: "/portfolio/extracted/commercial-moody-lounge.jpg", alt: "Atmospheric commercial interior photography by Ahmed Taj", className: "md:col-span-5" },
    ],
  },
  {
    label: "06 / Product & studio photography",
    title: "Aesthetics, lighting & perfection",
    copy: "Studio setups utilizing best-in-class lighting systems, macro precision, and meticulous detail for brands and gastronomy.",
    images: [
      { src: "/portfolio/extracted/product-food-karahi.jpg", alt: "Gourmet culinary photography photographed by Ahmed Taj", className: "md:col-span-6" },
      { src: "/portfolio/extracted/product-yarn-cones.jpg", alt: "Textile and commercial product photography by Ahmed Taj", className: "md:col-span-6" },
      { src: "/portfolio/extracted/product-leather-boots.jpg", alt: "Footwear and leather goods studio photography by Ahmed Taj", className: "md:col-span-6" },
      { src: "/portfolio/extracted/product-food-crisp.jpg", alt: "Food product packaging and commercial photography by Ahmed Taj", className: "md:col-span-6" },
    ],
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ahmed Taj — Professional Photographer in Dhaka | Photo Preview" },
      { name: "description", content: "Corporate, event, documentary and commercial photography by Ahmed Taj in Dhaka, Bangladesh." },
      { property: "og:title", content: "Ahmed Taj — Photo Preview" },
      { property: "og:description", content: "Corporate, event, documentary and commercial photography from Dhaka, Bangladesh." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-10 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-5 border-t border-border pt-4 md:mb-16 md:gap-10">
      <span className="font-mono text-[0.65rem] uppercase text-muted-foreground">{number}</span>
      <h2 className="font-display text-4xl leading-none md:text-6xl">{title}</h2>
    </div>
  );
}

const heroSlides = [
  {
    id: "summits",
    number: "01",
    tag: "Corporate & World Summits",
    title: "Stories at the decisive moment.",
    subtitle: "High-level state protocol, executive leadership, and decisive summit moments photographed without interrupting the room.",
    subject: "Dr. Muhammad Yunus — Bangladesh Investment Summit",
    location: "Dhaka, Bangladesh",
    year: "2025",
    image: yunusPortrait.url,
    alt: "Dr. Muhammad Yunus speaking at the Bangladesh Investment Summit 2025",
    discipline: "Summits & Protocol",
  },
  {
    id: "concerts",
    number: "02",
    tag: "Concerts & Live Entertainment",
    title: "The electric pulse of live spectacle.",
    subtitle: "Freezing stage atmosphere, dynamic lighting, and the raw sonic rhythm of stadium performances.",
    subject: "Headline Performance — National Concert Stage",
    location: "Dhaka Live Arena",
    year: "2024",
    image: concertStage.url,
    alt: "Concert performer beneath warm stage lights",
    discipline: "Concerts & Festivals",
  },
  {
    id: "documentary",
    number: "03",
    tag: "Social Documentary & NGO",
    title: "Every subject is an individual story.",
    subtitle: "Field photo-documentation across 19 districts grounded in dignity, human context, and everyday Bangladesh.",
    subject: "Community Livelihoods & Social Documentation",
    location: "19 Districts, Bangladesh",
    year: "2024",
    image: documentaryWorkers.url,
    alt: "Documentary portrait of workers in Bangladesh",
    discipline: "Documentary & NGO",
  },
  {
    id: "portraits",
    number: "04",
    tag: "Portraits & Commercial",
    title: "Character and presence, never a pose.",
    subtitle: "A world away from outdated formal headshots—meticulous lighting where personality and professionalism shine.",
    subject: "Editorial Fashion & Studio Series",
    location: "Studio Commission, Dhaka",
    year: "2025",
    image: portraitFashion.url,
    alt: "Editorial fashion portrait photographed by Ahmed Taj",
    discipline: "Commercial & Editorial",
  },
  {
    id: "protocol",
    number: "05",
    tag: "Bilateral Signing & State Accord",
    title: "History in motion, held forever.",
    subtitle: "From the 136th IPU Assembly to bilateral investment accords, trusted inside the room for decisive milestones.",
    subject: "Bilateral Diplomatic Signing Ceremony",
    location: "State Assembly",
    year: "2025",
    image: signingHandshake.url,
    alt: "Signing ceremony handshake at the Bangladesh Investment Summit 2025",
    discipline: "Diplomatic Accords",
  },
];

function HeroSection({ onOpenBooking }: { onOpenBooking: (service?: string) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((curr) => (curr + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const active = heroSlides[currentSlide];

  return (
    <section
      id="top"
      className="relative flex min-h-[94svh] flex-col justify-between overflow-hidden pt-28 pb-8 md:pt-32 md:pb-12"
    >
      {/* Background crossfading photography showcase */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              idx === currentSlide ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={cn(
                "size-full object-cover object-center transition-transform duration-7000 ease-out",
                idx === currentSlide ? "scale-105" : "scale-100"
              )}
            />
          </div>
        ))}
        {/* Multi-stop cinematic gradient scrim to ensure crystal-clear text readability */}
        <div className="hero-scrim absolute inset-0 z-10" />
      </div>

      {/* Main hero typography and call to actions */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 md:px-10 lg:px-16">
        <div className="max-w-4xl">
          {/* Left column: Badge, Display Title, Bio, Action Buttons */}
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-amber-300/90 font-medium">
            Ahmed Taj / Dhaka, Bangladesh
          </p>

          <h1 className="font-display text-[clamp(2.8rem,7vw,6.8rem)] leading-[0.86] text-white tracking-tight drop-shadow-md">
            {active.title}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-200/90 md:text-base md:leading-7 drop-shadow">
            {active.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#work"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-none bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary/90"
            >
              <span>Explore Selected Work</span>
              <ArrowDown className="size-4" />
            </a>

            <button
              type="button"
              onClick={() => onOpenBooking(active.discipline)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-none border border-white/40 bg-black/40 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white/15 cursor-pointer"
            >
              <span>Book Assignment</span>
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Bottom thumbnail strip for fast discipline selection */}
        <div className="mt-10 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center justify-between font-mono text-[0.68rem] uppercase text-white/60">
            <span>Curated Disciplines (Select to Preview)</span>
            <span>0{currentSlide + 1} / 0{heroSlides.length}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 md:gap-3">
            {heroSlides.map((slide, index) => {
              const isSelected = index === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleSelectSlide(index)}
                  className={cn(
                    "group relative flex items-center gap-3 overflow-hidden rounded-md border p-2 text-left transition-all duration-200",
                    isSelected
                      ? "border-amber-400/80 bg-white/15 shadow-md ring-1 ring-amber-400/50"
                      : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/10"
                  )}
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded">
                    <img
                      src={slide.image}
                      alt={slide.discipline}
                      className={cn(
                        "size-full object-cover transition-transform duration-300",
                        isSelected ? "scale-110" : "group-hover:scale-105"
                      )}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-400/20 mix-blend-overlay" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.62rem] font-medium text-amber-300/80">
                      {slide.number}
                    </span>
                    <span className="block truncate text-xs font-medium text-white group-hover:text-amber-200">
                      {slide.discipline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<string | undefined>(undefined);
  const [customMedia, setCustomMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    const loadCustomMedia = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("ahmed_taj_media") || "[]");
        setCustomMedia(stored.filter((item: MediaItem) => item.featured !== false));
      } catch {
        // Storage access fallback
      }
    };
    loadCustomMedia();
    window.addEventListener("portfolio_updated", loadCustomMedia);
    window.addEventListener("storage", loadCustomMedia);
    return () => {
      window.removeEventListener("portfolio_updated", loadCustomMedia);
      window.removeEventListener("storage", loadCustomMedia);
    };
  }, []);

  const handleOpenBooking = (service?: string) => {
    setSelectedBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3.5 md:px-10 lg:px-16">
          <a href="#top" aria-label="Photo Preview home" className="flex items-center gap-3">
            <img
              src={logo.url}
              alt="Photo Preview by Ahmed Taj"
              className="h-9 w-auto max-w-[170px] object-contain object-left md:h-11 md:max-w-[210px]"
            />
            <div className="hidden border-l border-white/20 pl-3 sm:block">
              <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-white/90">Taj Uddin Ahmed</span>
              <span className="block text-[0.6rem] text-white/60">Dhaka, Bangladesh</span>
            </div>
          </a>
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-xs font-medium uppercase tracking-wider text-white/80 md:flex">
            <a className="transition-colors hover:text-white hover:border-b hover:border-white pb-0.5" href="#work">Work</a>
            <a className="transition-colors hover:text-white hover:border-b hover:border-white pb-0.5" href="#about">About</a>
            <a className="transition-colors hover:text-white hover:border-b hover:border-white pb-0.5" href="#services">Services</a>
            <a className="transition-colors hover:text-white hover:border-b hover:border-white pb-0.5" href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="inline-flex min-h-9 items-center gap-1.5 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <span>Book Shoot</span>
              <Calendar className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      <HeroSection onOpenBooking={handleOpenBooking} />

      {/* Credibility & Experience Metric Strip */}
      <section className="relative z-20 border-y border-border bg-card/60 backdrop-blur-sm text-card-foreground">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y sm:divide-y-0 sm:grid-cols-4 divide-border">
          <div className="p-5 sm:p-7 flex flex-col justify-center">
            <span className="font-display text-3xl font-semibold md:text-4xl text-foreground">15+ Years</span>
            <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">In-Field Experience Since 2002</span>
          </div>
          <div className="p-5 sm:p-7 flex flex-col justify-center">
            <span className="font-display text-3xl font-semibold md:text-4xl text-foreground">100+ Shows</span>
            <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">UNICEF, Map & British Council</span>
          </div>
          <div className="p-5 sm:p-7 flex flex-col justify-center">
            <span className="font-display text-3xl font-semibold md:text-4xl text-foreground">136th IPU</span>
            <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">World Assembly & Diplomatic Accords</span>
          </div>
          <div className="p-5 sm:p-7 flex flex-col justify-center">
            <span className="font-display text-3xl font-semibold md:text-4xl text-foreground">Dhanmondi, Dhaka</span>
            <span className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">House 28, Rd 11 • Bangladesh & Global</span>
          </div>
        </div>
      </section>

      {/* Client Shoots & Commissioned Assignments */}
      <ClientShootsSection onOpenBooking={handleOpenBooking} />

      <section id="work" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36 lg:px-16">
        <SectionHeading number="Selected work / 2025" title="Recent commissions" />
        <div className="mb-24 grid gap-6 md:grid-cols-12 md:gap-4">
          <figure className="md:col-span-8">
            <div className="aspect-[4/3] overflow-hidden bg-muted"><img src={yunusPortrait.url} alt="Dr. Muhammad Yunus speaking at Bangladesh Investment Summit 2025" className="size-full object-cover" /></div>
            <figcaption className="mt-3 flex justify-between gap-4 text-xs uppercase text-muted-foreground"><span>Bangladesh Investment Summit</span><span>Dhaka / 2025</span></figcaption>
          </figure>
          <div className="grid gap-6 md:col-span-4 md:pt-32">
            <figure>
              <div className="aspect-[3/2] overflow-hidden bg-muted"><img src={signingHandshake.url} alt="International signing ceremony at Bangladesh Investment Summit 2025" className="size-full object-cover" /></div>
              <figcaption className="mt-3 text-xs uppercase text-muted-foreground">Signing ceremony / 2025</figcaption>
            </figure>
            <p className="max-w-sm font-display text-2xl leading-snug md:text-3xl">“Everything in front of me is not only a subject, but an individual story.”</p>
          </div>
        </div>

        <div className="space-y-28 md:space-y-40">
          {galleryGroups.map((group) => (
            <article key={group.label}>
              <div className="mb-8 grid gap-4 border-t border-border pt-4 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-[0.65rem] uppercase text-muted-foreground md:col-span-3">{group.label}</p>
                <h3 className="font-display text-4xl leading-none md:col-span-5 md:text-5xl">{group.title}</h3>
                <p className="max-w-md text-sm leading-6 text-muted-foreground md:col-span-4">{group.copy}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-12">
                {group.images.map((image) => (
                  <figure key={image.src} className={image.className}>
                    <div className="aspect-[3/2] overflow-hidden bg-muted">
                      <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover transition-transform duration-700 hover:scale-[1.015]" />
                    </div>
                  </figure>
                ))}
              </div>
            </article>
          ))}

          {/* Live Studio Archive / Uploaded Works from Admin */}
          {customMedia.length > 0 && (
            <article>
              <div className="mb-8 grid gap-4 border-t border-border pt-4 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-[0.65rem] uppercase text-muted-foreground md:col-span-3">Live Studio Vault</p>
                <h3 className="font-display text-4xl leading-none md:col-span-5 md:text-5xl">Curated Field Archives</h3>
                <p className="max-w-md text-sm leading-6 text-muted-foreground md:col-span-4">
                  Freshly cataloged photographs and event assignments uploaded directly from the studio console.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customMedia.map((item) => (
                  <figure key={item.id} className="group overflow-hidden rounded-none border border-border bg-card">
                    <div className="aspect-[3/2] overflow-hidden bg-muted">
                      <img
                        src={item.url}
                        alt={item.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="p-4">
                      <div className="flex items-center justify-between font-mono text-[0.65rem] text-primary">
                        <span>{item.category}</span>
                        <span>{item.year}</span>
                      </div>
                      <h4 className="mt-1 font-display text-xl font-medium leading-snug text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground font-mono">{item.client}</p>
                      {item.caption && (
                        <p className="mt-2 text-xs text-muted-foreground italic border-t border-border/60 pt-2">
                          “{item.caption}”
                        </p>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </article>
          )}
        </div>
      </section>

      <section id="about" className="bg-contrast text-contrast-foreground">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36 lg:px-16">
          <div className="md:col-span-5">
            <img src={ahmedEvent.url} alt="Ahmed Taj at a cultural event with fellow artists" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-3 text-xs uppercase text-contrast-muted">Ahmed Taj / Photographer</p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="mb-10 font-mono text-[0.65rem] uppercase text-contrast-muted">About / Photo Preview</p>
            <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">A wide-angle eye for the whole story.</h2>
            <div className="mt-10 space-y-5 text-base leading-7 text-contrast-muted md:max-w-xl md:text-lg md:leading-8">
              <p>Ahmed Taj is a Dhaka-based professional photographer working across corporate events, commercial commissions and social documentary photography.</p>
              <p>Since 2009, he has built photographic solutions for companies, institutions, schools, charities and private clients—from intimate occasions to major international assemblies.</p>
              <p>His mission is direct: to earn client satisfaction through creativity, and to preserve every event’s milestone moments with care.</p>
            </div>
            <div className="mt-14 grid gap-7 border-t border-contrast-border pt-6 sm:grid-cols-3">
              <div><strong className="block font-display text-4xl">100</strong><span className="text-xs uppercase text-contrast-muted">Exhibitions coordinated</span></div>
              <div><strong className="block font-display text-4xl">19</strong><span className="text-xs uppercase text-contrast-muted">Districts / Positive Lives</span></div>
              <div><strong className="block font-display text-4xl">136th</strong><span className="text-xs uppercase text-contrast-muted">IPU Assembly covered</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36 lg:px-16">
        <SectionHeading number="Experience / Since 2002" title="A practice built in the field" />
        <div className="grid border-t border-border md:grid-cols-12">
          <div className="border-b border-border py-7 md:col-span-3 md:border-r md:px-6"><p className="text-xs uppercase text-muted-foreground">2002 — 2008</p><h3 className="mt-2 font-display text-2xl">Map Photo Agency</h3></div>
          <div className="border-b border-border py-7 md:col-span-5 md:border-r md:px-6"><p className="text-xs uppercase text-muted-foreground">Exhibition coordinator</p><p className="mt-2 text-sm leading-6">100 shows for Map, UNICEF, Save the Children, British Council and ActionAid Bangladesh.</p></div>
          <div className="border-b border-border py-7 md:col-span-4 md:px-6"><p className="text-xs uppercase text-muted-foreground">Positive Lives</p><p className="mt-2 text-sm leading-6">Campaign resource person and organiser across 19 districts, addressing HIV/AIDS and anti-trafficking.</p></div>
        </div>
      </section>

      <section id="services" className="bg-surface">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36 lg:px-16">
          <SectionHeading number="What I photograph" title="Services" />
          <ol className="grid md:grid-cols-2">
            {services.map((service, index) => (
              <li key={service} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 border-t border-border py-4 md:px-5 md:py-5">
                <span className="font-mono text-[0.65rem] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl md:text-2xl">{service}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36 lg:px-16">
          <SectionHeading number="Specialized solutions" title="Capabilities in the field" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between border border-border bg-card p-6 md:p-7">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">01 / Solution</span>
                <h3 className="mt-2 font-display text-2xl text-foreground">Official Corporate Groups</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Precise choreography, formal lighting, and protocol for leadership boards, government ministries, and corporate celebrations.
                </p>
              </div>
              <div className="mt-5 aspect-[4/3] overflow-hidden bg-muted">
                <img src="/portfolio/extracted/corp-towards-tomorrow.jpg" alt="Official corporate group photography by Ahmed Taj" className="size-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            </div>

            <div className="flex flex-col justify-between border border-border bg-card p-6 md:p-7">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">02 / Solution</span>
                <h3 className="mt-2 font-display text-2xl text-foreground">On-Site Instant Printing</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  High-speed attendee accreditation, ID card issuance, and souvenir photo printing tested at world gatherings like the 136th IPU Assembly.
                </p>
              </div>
              <div className="mt-5 aspect-[4/3] overflow-hidden bg-muted">
                <img src="/portfolio/extracted/corp-boishakh-group.jpg" alt="On-site event photography by Ahmed Taj" className="size-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            </div>

            <div className="flex flex-col justify-between border border-border bg-card p-6 md:p-7">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">03 / Solution</span>
                <h3 className="mt-2 font-display text-2xl text-foreground">Product & Culinary Studio</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Studio setups with best-in-class lighting, color-accurate calibration, and macro precision for culinary cuisine and commercial goods.
                </p>
              </div>
              <div className="mt-5 aspect-[4/3] overflow-hidden bg-muted">
                <img src="/portfolio/extracted/product-food-karahi.jpg" alt="Culinary and product photography by Ahmed Taj" className="size-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            </div>

            <div className="flex flex-col justify-between border border-border bg-card p-6 md:p-7">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">04 / Solution</span>
                <h3 className="mt-2 font-display text-2xl text-foreground">Commercial & Activations</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Green screen technology, TVC commercial stills, and brand activations that start organic conversations centered on your event.
                </p>
              </div>
              <div className="mt-5 aspect-[4/3] overflow-hidden bg-muted">
                <img src="/portfolio/extracted/commercial-desert-walk.jpg" alt="Commercial campaign still by Ahmed Taj" className="size-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36 lg:px-16">
        <SectionHeading number="Selected relationships" title="Trusted in the room" />
        <div className="grid gap-10 md:grid-cols-12">
          <div className="grid grid-cols-2 border-l border-t border-border md:col-span-7 md:grid-cols-4">
            {clients.map((client) => <div key={client} className="flex min-h-24 items-center border-b border-r border-border p-4 text-sm leading-tight">{client}</div>)}
          </div>
          <figure className="md:col-span-5">
            <div className="bg-muted p-3 md:p-6"><img src={clientWall.url} alt="Client logos from the Photo Preview portfolio" loading="lazy" className="w-full grayscale" /></div>
            <figcaption className="mt-3 text-xs uppercase text-muted-foreground">Selected clients and collaborators</figcaption>
          </figure>
        </div>
      </section>

      <section id="contact" className="bg-signature text-signature-foreground">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28 lg:px-16">
          <p className="mb-7 font-mono text-[0.65rem] uppercase">Available for assignments in Bangladesh & beyond</p>
          <h2 className="max-w-5xl font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.85]">Let’s make the moment last.</h2>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-none bg-signature-foreground px-7 text-xs font-semibold uppercase tracking-wider text-signature hover:bg-signature-foreground/90 transition-colors shadow-md cursor-pointer"
            >
              <Calendar className="size-4" />
              <span>Schedule Shoot / Meeting</span>
            </button>
            <a className={cn(buttonVariants({ size: "lg", variant: "outline" }), "min-h-12 rounded-none border-signature-foreground bg-transparent px-6 text-signature-foreground hover:bg-signature-foreground hover:text-signature")} href="https://wa.me/8801730440068" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp Ahmed</a>
            <a className={cn(buttonVariants({ size: "lg", variant: "outline" }), "min-h-12 rounded-none border-signature-foreground bg-transparent px-6 text-signature-foreground hover:bg-signature-foreground hover:text-signature")} href="mailto:photo.ahmedtaj@gmail.com"><Mail /> Send an email</a>
            <a className={cn(buttonVariants({ size: "lg", variant: "outline" }), "min-h-12 rounded-none border-signature-foreground bg-transparent px-6 text-signature-foreground hover:bg-signature-foreground hover:text-signature")} href="tel:+8801968465799"><Phone /> Call now</a>
          </div>
        </div>
      </section>

      <footer className="bg-contrast text-contrast-foreground">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-12 md:px-10 lg:px-16">
          <div className="md:col-span-4"><img src={logo.url} alt="Photo Preview by Ahmed Taj" className="h-24 w-auto max-w-full object-contain object-left" /></div>
          <address className="not-italic text-sm leading-7 text-contrast-muted md:col-span-4">House 28 (4th Floor), Road 11 (old 32)<br />Dhanmondi-1209, Dhaka, Bangladesh</address>
          <div className="space-y-2 text-sm md:col-span-4 md:text-right">
            <a className="footer-link" href="mailto:photo.ahmedtaj@gmail.com">photo.ahmedtaj@gmail.com <ArrowUpRight /></a>
            <a className="footer-link" href="tel:+8801968465799">+880 1968465799 <ArrowUpRight /></a>
            <a className="footer-link" href="https://www.photopreview.org" target="_blank" rel="noreferrer">photopreview.org <ArrowUpRight /></a>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1600px] justify-between items-center border-t border-contrast-border px-5 py-5 text-[0.65rem] uppercase text-contrast-muted md:px-10 lg:px-16">
          <span>© {new Date().getFullYear()} Photo Preview • Taj Uddin Ahmed</span>
          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[0.68rem] tracking-wider text-contrast-muted"
            >
              <Shield className="size-3 text-amber-300" />
              <span>Studio Portal</span>
            </a>
            <a href="#top" className="hover:text-contrast-foreground transition-colors">Back to top</a>
          </div>
        </div>
      </footer>

      {/* Booking and Meeting Scheduler Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultService={selectedBookingService}
      />
    </main>
  );
}
