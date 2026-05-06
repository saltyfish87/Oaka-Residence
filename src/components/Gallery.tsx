import React from "react";
import { LandingContent } from "../types";
import { motion } from "motion/react";

export default function Gallery({ content }: { content: LandingContent }) {
  return (
    <section id="gallery" className="bg-white py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-24 flex flex-col items-center text-center">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold/80">
            Gallery
          </span>
          <h2 className="text-4xl font-serif font-light text-oaka-green md:text-6xl italic">The Experience</h2>
          <div className="mt-8 h-[1px] w-24 bg-oaka-gold" />
        </div>

        <div className="columns-1 gap-12 space-y-12 sm:columns-2 lg:columns-3">
          {content.gallery.images.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative overflow-hidden bg-oaka-green"
            >
              <img
                src={image.url}
                alt={image.title}
                loading="lazy"
                decoding="async"
                className="w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold">OAKA Residences</span>
                <p className="text-2xl font-serif font-light text-white italic">{image.title}</p>
                <div className="mt-4 h-px w-0 bg-oaka-gold transition-all duration-500 group-hover:w-12" />
              </div>
              <div className="absolute inset-0 border-[10px] border-white/10 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
