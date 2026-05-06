import React, { useState } from "react";
import { LandingContent } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Bed, Bath } from "lucide-react";
import { cn } from "../lib/utils";

export default function Layouts({ content }: { content: LandingContent }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="layouts" className="bg-oaka-bg py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-24 flex flex-col items-center text-center">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold/80">
            Unit Plans
          </span>
          <h2 className="text-4xl font-serif font-light text-oaka-green md:text-6xl">{content.layouts.title}</h2>
          <div className="mt-8 h-[1px] w-24 bg-oaka-gold" />
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-20 border-b border-oaka-green/10 pb-8">
          {content.layouts.types.map((layout, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "group relative px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all",
                activeTab === idx ? "text-oaka-green" : "text-oaka-green/40 hover:text-oaka-green"
              )}
            >
              {layout.type}
              {activeTab === idx && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[33px] left-0 h-[2px] w-full bg-oaka-gold"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="grid gap-20 lg:grid-cols-2 lg:items-start"
          >
            <div className="relative group overflow-hidden bg-white p-12 lg:p-20 shadow-xl border border-oaka-green/5">
              <img
                src={content.layouts.types[activeTab].imageUrl}
                alt={content.layouts.types[activeTab].type}
                loading="lazy"
                decoding="async"
                className="mx-auto max-h-[600px] w-auto object-contain transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold/40">
                Floor Plan / {content.layouts.types[activeTab].type}
              </div>
            </div>

            <div className="space-y-12">
              <div className="border-l-4 border-oaka-gold pl-8">
                <h3 className="mb-4 text-5xl font-serif font-light text-oaka-green">
                  {content.layouts.types[activeTab].type}
                </h3>
                <p className="text-xl italic font-serif text-oaka-green/60 uppercase tracking-widest text-sm">
                  {content.layouts.types[activeTab].config}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-oaka-gold">Total Area</span>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-serif text-oaka-green">{content.layouts.types[activeTab].size.split(" ")[0]}</p>
                    <p className="text-xs uppercase tracking-widest text-oaka-green/40 mb-1">{content.layouts.types[activeTab].size.split(" ").slice(1).join(" ")}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-oaka-gold">Configuration</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Bed size={16} strokeWidth={1} className="text-oaka-gold" />
                      <p className="text-xl font-serif text-oaka-green">{content.layouts.types[activeTab].config.split(",")[0].trim()}</p>
                    </div>
                    {content.layouts.types[activeTab].config.includes("Bathroom") && (
                      <div className="flex items-center gap-2">
                        <Bath size={16} strokeWidth={1} className="text-oaka-gold" />
                        <p className="text-xl font-serif text-oaka-green">{content.layouts.types[activeTab].config.split(",")[1]?.trim()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-oaka-green/10">
                <a 
                  href={`https://wa.me/60195598932?text=${encodeURIComponent(`[OAKA] Hi, i am interested in ${content.layouts.types[activeTab].type}, please contact me.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between overflow-hidden border border-oaka-gold bg-oaka-gold px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-oaka-green transition-all hover:bg-transparent hover:text-white"
                >
                  <span className="relative z-10">Inquire about {content.layouts.types[activeTab].type}</span>
                  <div className="absolute inset-0 z-0 h-full w-0 bg-oaka-green transition-all duration-300 group-hover:w-full" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
