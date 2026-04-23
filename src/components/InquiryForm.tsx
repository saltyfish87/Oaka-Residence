import React, { useState, useEffect } from "react";
import { LandingContent } from "../types";
import { MessageCircle, CheckCircle, Send, AlertCircle, Loader2 } from "lucide-react";
import { PrivacyModal, TermsModal } from "./LegalModals";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function InquiryForm({ content }: { content: LandingContent }) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const embedRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content.ctaEmbedCode && embedRef.current) {
      embedRef.current.innerHTML = "";
      
      const container = document.createElement('div');
      container.innerHTML = content.ctaEmbedCode;
      
      // Execute scripts manually as innerHTML doesn't run them
      const scripts = container.getElementsByTagName('script');
      const scriptArray = Array.from(scripts);
      
      embedRef.current.appendChild(container);
      
      scriptArray.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [content.ctaEmbedCode]);

  return (
    <section id="inquiry" className="bg-oaka-bg py-24 md:py-32 lg:py-48 min-h-screen flex items-center">
      <div className="mx-auto max-w-7xl w-full px-0 sm:px-6">
        <div className="relative overflow-hidden bg-oaka-green p-4 sm:p-12 lg:p-24 shadow-none sm:shadow-[-40px_40px_0px_0px_rgba(197,169,117,0.1)]">
          <div className="relative z-10 flex flex-col items-center">
            {/* Header section moved to top for focus */}
            <div className="w-full max-w-3xl text-center mb-16 px-4 sm:px-0">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-oaka-gold" />
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-oaka-gold">
                  Registration
                </span>
                <div className="h-[1px] w-12 bg-oaka-gold" />
              </div>
              <h2 className="mb-8 text-4xl font-serif font-light leading-tight text-white md:text-7xl italic">
                Secure Your Vision.
              </h2>
              <p className="text-base text-white/60 font-sans font-light leading-relaxed mx-auto max-w-2xl">
                Register now for exclusive early bird privileges, private viewing appointments, and the latest project updates at OAKA Residences.
              </p>
            </div>

            {/* Form container - now full width of container */}
            <div className="w-full max-w-4xl bg-white/5 p-2 md:p-8 lg:p-12 backdrop-blur-sm border border-white/10 min-h-[600px] flex items-start justify-center rounded-xl">
              {content.ctaEmbedCode ? (
                <div key="embed-container" ref={embedRef} className="w-full h-full crm-embed-container" />
              ) : (
                <div className="p-8 text-center space-y-6 self-center">
                   <div className="h-16 w-16 border-2 border-oaka-gold/30 rounded-full flex items-center justify-center mx-auto text-oaka-gold animate-pulse">
                     <AlertCircle size={32} />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-white font-serif text-xl">Form Connection Pending</h3>
                     <p className="text-white/40 text-[10px] uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                       Please paste your CRM embed code in the Editor panel.
                     </p>
                   </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-16 w-full max-w-xl text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-12">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-oaka-gold/30 text-oaka-gold rounded-full">
                    <CheckCircle size={18} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/80">Priority Selection</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-oaka-gold/30 text-oaka-gold rounded-full">
                    <CheckCircle size={18} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/80">Early Bird Rebates</p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10">
                <a
                  href={`https://wa.me/${content.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(content.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-8 overflow-hidden border border-oaka-gold bg-oaka-gold px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-oaka-green transition-all hover:bg-transparent hover:text-white"
                >
                  <span className="relative z-10">WhatsApp Quick Chat</span>
                  <MessageCircle className="relative z-10 h-4 w-4" />
                  <div className="absolute inset-0 z-0 h-full w-0 bg-oaka-green transition-all duration-300 group-hover:w-full" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Decorative Logo */}
          <div className="absolute -bottom-20 -right-20 opacity-[0.03] select-none pointer-events-none">
            <h4 className="text-[300px] font-serif italic text-white leading-none">O</h4>
          </div>
        </div>
      </div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} content={content} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} content={content} />
    </section>
  );
}
