import React, { useState } from "react";
import { FAQS } from "../data/faqs";

/** Frequently asked questions, styled like the other sections. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-oaka-bg py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-oaka-gold" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-oaka-gold">FAQ</span>
        </div>
        <h2 className="mb-12 text-4xl font-serif font-light leading-tight text-oaka-green md:text-6xl">
          Frequently Asked <span className="italic">Questions.</span>
        </h2>
        <div className="divide-y divide-oaka-green/10 border-t border-b border-oaka-green/10">
          {FAQS.map((f, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer"
              >
                <span className="text-lg md:text-xl font-serif text-oaka-green">{f.question}</span>
                <span className="text-oaka-gold text-2xl leading-none shrink-0">{open === i ? "–" : "+"}</span>
              </button>
              {open === i && (
                <p className="pb-6 pr-10 text-base leading-relaxed text-oaka-green/80 font-sans font-light">{f.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
