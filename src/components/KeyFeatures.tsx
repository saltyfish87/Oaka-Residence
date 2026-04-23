import React from "react";
import { LandingContent } from "../types";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function KeyFeatures({ content }: { content: LandingContent }) {
  return (
    <section className="bg-oaka-green py-32 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-24 flex flex-col items-center text-center">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold/80">
            Key Features
          </span>
          <h2 className="text-4xl font-serif font-light md:text-6xl">{content.keyFeatures.title}</h2>
          <div className="mt-8 h-[1px] w-24 bg-oaka-gold" />
        </div>

        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {content.keyFeatures.items.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group flex flex-col items-start"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center border border-oaka-gold/30 bg-white/5 transition-colors group-hover:bg-oaka-gold group-hover:text-oaka-green">
                <CheckCircle2 size={24} strokeWidth={1} />
              </div>
              <p className="text-xl font-serif font-light leading-relaxed tracking-wide transition-colors group-hover:text-oaka-gold">
                {feature}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
