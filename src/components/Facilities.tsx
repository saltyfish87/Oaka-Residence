import React from "react";
import { LandingContent } from "../types";
import * as Icons from "lucide-react";
import { motion } from "motion/react";

export default function Facilities({ content }: { content: LandingContent }) {
  return (
    <section id="facilities" className="bg-white py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-24 flex flex-col items-center text-center">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold/80">
            Amenities
          </span>
          <h2 className="text-4xl font-serif font-light text-oaka-green md:text-6xl italic">The Lifestyle</h2>
          <div className="mt-8 h-[1px] w-24 bg-oaka-gold" />
          <p className="mt-8 max-w-2xl font-sans font-light text-oaka-green/60 uppercase tracking-widest text-xs">
            Designed for modern living and holistic wellness
          </p>
        </div>

        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {content.facilities.items.map((facility, idx) => {
            const IconComponent = (Icons as any)[facility.icon] || Icons.Circle;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.8 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center border border-oaka-gold/20 rounded-full transition-all duration-500 group-hover:bg-oaka-green group-hover:border-oaka-green group-hover:scale-110">
                  <IconComponent size={28} strokeWidth={1} className="text-oaka-gold transition-colors duration-500 group-hover:text-white" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-[0.2em] text-oaka-green transition-colors group-hover:text-oaka-gold">
                  {facility.name}
                </h3>
                <div className="mt-4 h-[1px] w-8 bg-oaka-gold/30 transition-all duration-500 group-hover:w-16" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
