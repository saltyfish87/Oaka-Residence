import React from "react";
import { LandingContent } from "../types";
import { MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";

export default function Location({ content }: { content: LandingContent }) {
  return (
    <section id="location" className="bg-white py-32 lg:py-48 overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-oaka-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-oaka-gold">
                The Location
              </span>
            </div>
            
            <h2 className="mb-10 text-5xl font-serif font-light leading-tight text-oaka-green md:text-7xl">
              Connected to <br />
              <span className="italic whitespace-nowrap">Everything.</span>
            </h2>
            
            <p className="mb-16 text-lg leading-relaxed text-oaka-green/70 font-sans font-light max-w-xl">
              {content.location.description}
            </p>

            <div className="space-y-10">
              {content.location.nearby.map((group, idx) => (
                <div key={idx} className="group border-b border-oaka-green/5 pb-8 last:mb-0">
                  <h3 className="mb-6 flex items-center text-lg font-serif tracking-wide text-oaka-green group-hover:text-oaka-gold transition-colors">
                    <MapPin size={18} strokeWidth={1.5} className="mr-4 text-oaka-gold" />
                    {group.category}
                  </h3>
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {group.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-3 text-sm text-oaka-green/60 font-sans">
                        <div className="h-1 w-1 rounded-full bg-oaka-gold/40" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="pt-4">
                <h3 className="mb-6 flex items-center text-lg font-serif tracking-wide text-oaka-green">
                  <Navigation size={18} strokeWidth={1.5} className="mr-4 text-oaka-gold" />
                  Accessibility
                </h3>
                <ul className="space-y-3">
                  {content.location.accessibility.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-sm text-oaka-green/60 font-sans">
                      <div className="h-1 w-1 rounded-full bg-oaka-gold/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative h-full min-h-[500px] lg:min-h-full"
          >
            <div className="sticky top-32">
              <div className="relative group overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-oaka-green/5 transition-opacity group-hover:opacity-0 z-10" />
                <img
                  src={content.location.imageUrl}
                  alt="Location Map"
                  loading="lazy"
                  decoding="async"
                  className="h-[600px] w-full object-cover grayscale-[0.3] contrast-[1.1] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none z-20" />
                <div className="absolute bottom-10 left-10 z-30 bg-white p-6 shadow-xl hidden lg:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-oaka-gold mb-2">Prime Address</p>
                  <p className="text-xs text-oaka-green font-serif italic">Bukit Jalil, Kuala Lumpur</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
