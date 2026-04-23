import React from "react";
import { LandingContent } from "../types";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  content: LandingContent;
  onInquire: () => void;
  onBrochure: () => void;
}

export default function Hero({ content, onInquire, onBrochure }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.hero.imageUrl}
          alt="OAKA Residences Hero"
          className="h-full w-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-oaka-green/40 backdrop-brightness-75" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8 inline-block text-[11px] font-bold uppercase tracking-[0.5em] text-oaka-gold"
          >
            Bukit Jalil Premium Living
          </motion.span>
          <h1 className="mb-8 text-6xl font-serif font-light leading-[1.1] md:text-8xl lg:text-9xl">
            {content.hero.title}
          </h1>
          <p className="mx-auto mb-12 max-w-2xl font-serif italic text-lg text-white/90 md:text-2xl leading-relaxed">
            {content.hero.subtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <button
              onClick={onInquire}
              className="group relative w-full overflow-hidden border border-oaka-gold bg-oaka-gold px-12 py-5 text-xs font-bold uppercase tracking-[0.2em] text-oaka-green transition-all hover:text-white sm:w-auto"
            >
              <span className="relative z-10">Register My Interest</span>
              <div className="absolute inset-0 z-0 h-full w-0 bg-oaka-green transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={onBrochure}
              className="group relative w-full overflow-hidden border border-white/50 bg-white/10 px-12 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all sm:w-auto hover:bg-white hover:text-oaka-green"
            >
              <span className="relative z-10">View Brochure</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-oaka-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
