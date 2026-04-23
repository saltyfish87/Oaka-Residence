import React from "react";
import { LandingContent } from "../types";
import { motion } from "motion/react";

export default function Overview({ content }: { content: LandingContent }) {
  return (
    <section id="overview" className="bg-oaka-bg py-24 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-[1px] w-12 bg-oaka-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-oaka-gold">
                The Project
              </span>
            </div>
            
            <h2 className="mb-10 text-5xl font-serif font-light leading-tight text-oaka-green md:text-7xl">
              Elevated Living <br />
              <span className="italic">Redefined.</span>
            </h2>
            
            <p className="mb-12 text-lg leading-relaxed text-oaka-green/80 font-sans font-light">
              {content.overview.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-oaka-green/10 pt-12">
              {content.overview.stats.map((stat, idx) => (
                <div key={idx} className="group">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-oaka-gold mb-2 transition-transform group-hover:translate-x-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-serif text-oaka-green">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden shadow-[30px_30px_0px_0px_rgba(197,169,117,0.1)]">
              <img
                src={content.overview.imageUrl}
                alt="OAKA Residences Overview"
                className="h-full w-full object-cover grayscale-[0.2] contrast-[1.1]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
            </div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-10 -left-10 hidden bg-oaka-green p-10 text-oaka-gold shadow-2xl md:block"
            >
              <p className="text-5xl font-serif font-light">350</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mt-2">Limited Units</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
