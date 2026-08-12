import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
const logoUrl = "/logo.png";

const slides = [
  {
    tag: "Digital Studio",
    title: "Brands built sharp.",
    subtitle: "Websites built fast.",
    desc: "Mario Studio is a full-service digital partner: identity, design, development, video and marketing — delivered by one team.",
    cta: "Get a free brand audit",
    ctaLink: "/contact",
    image: logoUrl,
  },
  {
    tag: "UI/UX Design",
    title: "Interfaces that",
    subtitle: "drive conversion.",
    desc: "We build user experiences that don't just look good, they perform. From SaaS platforms to e-commerce storefronts.",
    cta: "View our process",
    ctaLink: "/services/ui-ux-design",
    image: logoUrl,
  },
  {
    tag: "Identity Branding",
    title: "Symbols that",
    subtitle: "last a decade.",
    desc: "Visual identities built to scale. We don't just make logos; we create systems that grow with your business.",
    cta: "Start your brand",
    ctaLink: "/services/identity-branding",
    image: logoUrl,
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const { scrollY } = useScroll();
  // Parallax for the whole hero container
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  // Parallax for the logo image
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const rotate = useTransform(scrollY, [0, 500], [0, 5]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Background Parallax Element */}
      <motion.div 
        style={{ y: y1 }}
        className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-brand-soft/30 blur-3xl" 
      />
      
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide min-w-0 flex-[0_0_100%]">
              <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-32">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={selectedIndex === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    {slide.tag}
                  </span>
                  <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                    {slide.title}
                    <br />
                    <span className="text-brand">{slide.subtitle}</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                    {slide.desc}
                  </p>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
                    >
                      {slide.cta} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/services"
                      className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-colors hover:border-brand"
                    >
                      See all services
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div 
                  style={{ y: y2, rotate }}
                  className="relative hidden md:block rounded-3xl border border-border bg-secondary p-10"
                >
                  <motion.img 
                    src={slide.image} 
                    alt={slide.tag} 
                    className="mx-auto w-full max-w-xs"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={selectedIndex === index ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 md:left-6 md:translate-x-0">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 transition-all ${
                selectedIndex === i ? "w-8 bg-brand" : "w-2 bg-muted hover:bg-muted-foreground"
              } rounded-full`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={scrollPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:border-brand hover:text-brand"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:border-brand hover:text-brand"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
