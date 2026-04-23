import React from "react";
import { LandingContent } from "../types";
import { MessageCircle, Phone, MapPin, Mail } from "lucide-react";

interface FooterProps {
  content: LandingContent;
  onWhatsApp: () => void;
  onLogin?: () => void;
  isLoggedIn?: boolean;
}

export default function Footer({ content, onWhatsApp, onLogin, isLoggedIn }: FooterProps) {
  return (
    <footer className="bg-oaka-green pt-32 pb-16 text-white border-t border-oaka-gold/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-20 border-b border-white/10 pb-20 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-serif font-light tracking-widest text-white">OAKA</h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-oaka-gold">Residences</span>
            </div>
            <p className="text-white/60 font-sans font-light leading-relaxed text-sm">
              A premium freehold residential development by {content.developer} in the heart of Bukit Jalil. Low-density living redefined.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onWhatsApp} 
                className="group flex h-12 w-12 items-center justify-center border border-white/20 transition-all hover:border-oaka-gold hover:text-oaka-gold"
              >
                <MessageCircle size={20} strokeWidth={1} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold">Sales Gallery</h4>
            <ul className="space-y-6 text-sm font-sans font-light text-white/60">
              <li className="flex items-start gap-4 group">
                <MapPin className="mt-1 shrink-0 text-oaka-gold transition-transform group-hover:scale-110" size={18} strokeWidth={1} />
                <span className="leading-relaxed transition-colors group-hover:text-white">{content.footer.address}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <Phone className="shrink-0 text-oaka-gold transition-transform group-hover:scale-110" size={18} strokeWidth={1} />
                <span className="transition-colors group-hover:text-white">{content.footer.phone}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <Mail className="shrink-0 text-oaka-gold transition-transform group-hover:scale-110" size={18} strokeWidth={1} />
                <span className="transition-colors group-hover:text-white">info@oakaresidences.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold">Quick Links</h4>
            <ul className="space-y-4 text-sm font-sans font-light text-white/60">
              {['Home', 'Overview', 'Location', 'Amenities', 'Layouts', 'Gallery'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="hover:text-oaka-gold transition-colors block py-1 uppercase tracking-widest text-[10px]">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-oaka-gold">Consultation</h4>
            <div className="group relative overflow-hidden bg-white/5 p-8 border border-white/10 transition-all hover:border-oaka-gold">
              <p className="font-serif italic text-lg text-white mb-1">{content.footer.agentName}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-oaka-gold mb-6">{content.footer.renNumber}</p>
              
              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{content.footer.agencyName}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-tighter">{content.footer.agencyReg}</p>
              </div>
              
              <button 
                onClick={onWhatsApp}
                className="mt-8 flex w-full items-center justify-center gap-3 border border-oaka-gold/30 bg-transparent py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-oaka-gold transition-all hover:bg-oaka-gold hover:text-oaka-green"
              >
                Request Digital Brochure
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <div className="mx-auto max-w-5xl space-y-6 text-[10px] font-sans font-light leading-relaxed text-white/30 text-center uppercase tracking-widest">
            <p className="font-bold text-oaka-gold/50">Marketing Disclaimer</p>
            <p>
              This digital presentation is professionally managed by {content.footer.agentName} ({content.footer.renNumber}) of {content.footer.agencyName}. 
              It serves marketing purposes exclusively and is independent of the official corporate digital presence of {content.developer}.
            </p>
            <p>
              Specifications and details are subject to architectural refinement and regulatory amendments. 
              Visual representations are artist interpretations designed to evoke the project's essence.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
            <p 
              className="cursor-default select-none"
              onClick={onLogin}
              title="OAKA Residences"
            >
              © {new Date().getFullYear()} OAKA Residences Marketing Portfolio.
            </p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <a href="#" className="hover:text-oaka-gold transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
