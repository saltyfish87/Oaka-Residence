import React, { useState } from "react";
import { LandingContent } from "../types";
import { MessageCircle, CheckCircle, Send, AlertCircle, Loader2, Sparkles, Phone, Mail, User, Home, MessageSquare } from "lucide-react";
import { PrivacyModal, TermsModal } from "./LegalModals";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "motion/react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  preferredLayout: string;
  message: string;
  agreed: boolean;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  preferredLayout: "Type A (~882 sq ft)",
  message: "",
  agreed: true,
};

export default function InquiryForm({ content }: { content: LandingContent }) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const recipientEmail = "shyanyeews@gmail.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    if (!formData.agreed) {
      setErrorMessage("Please agree to the privacy policy & terms before submitting.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    let firestoreSaved = false;
    let formsubmitSent = false;

    // 1. Save record into Firebase Firestore
    try {
      if (db) {
        await addDoc(collection(db, "inquiries"), {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          preferredLayout: formData.preferredLayout,
          message: formData.message.trim() || "No additional message provided",
          recipientEmail: recipientEmail,
          createdAt: serverTimestamp(),
          source: "OAKA Residences Website",
        });
        firestoreSaved = true;
      }
    } catch (dbError) {
      console.warn("Firestore record save warning:", dbError);
    }

    // 2. Send email via FormSubmit
    try {
      const formPayload = new URLSearchParams();
      formPayload.append("name", formData.name.trim());
      formPayload.append("email", formData.email.trim());
      formPayload.append("phone", formData.phone.trim());
      formPayload.append("preferredLayout", formData.preferredLayout);
      formPayload.append("message", formData.message.trim() || "No additional message provided");
      formPayload.append("_subject", `New OAKA Residences Inquiry: ${formData.name.trim()}`);
      formPayload.append("_template", "table");
      formPayload.append("_captcha", "false");

      try {
        // Try AJAX JSON submission first
        const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            preferredLayout: formData.preferredLayout,
            message: formData.message.trim() || "No additional message provided",
            _subject: `New OAKA Residences Inquiry: ${formData.name.trim()}`,
            _template: "table",
            _captcha: "false",
          }),
        });

        if (response.ok) {
          formsubmitSent = true;
        } else {
          // Fallback to urlencoded no-cors POST if status is not ok
          await fetch(`https://formsubmit.co/${recipientEmail}`, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formPayload,
          });
          formsubmitSent = true;
        }
      } catch (fetchErr) {
        console.warn("AJAX FormSubmit fetch encountered network/CORS boundary, using no-cors mode:", fetchErr);
        // Fallback to no-cors POST request which circumvents CORS errors in sandboxed origins
        await fetch(`https://formsubmit.co/${recipientEmail}`, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formPayload,
        });
        formsubmitSent = true;
      }
    } catch (formErr) {
      console.warn("FormSubmit send warning:", formErr);
    }

    // If either Firestore saved or FormSubmit dispatched, consider it a successful submission
    if (firestoreSaved || formsubmitSent) {
      setStatus("success");
      setFormData(INITIAL_FORM);
    } else {
      setErrorMessage("An error occurred while submitting. Please try again or reach out via WhatsApp.");
      setStatus("error");
    }
  };

  return (
    <section id="inquiry" className="bg-oaka-bg py-24 md:py-32 lg:py-40 min-h-screen flex items-center">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6">
        <div className="relative overflow-hidden bg-oaka-green p-6 sm:p-12 lg:p-20 shadow-2xl rounded-2xl sm:shadow-[-40px_40px_0px_0px_rgba(197,169,117,0.1)] border border-oaka-gold/20">
          <div className="relative z-10 flex flex-col items-center">
            {/* Header section */}
            <div className="w-full max-w-3xl text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-oaka-gold" />
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-oaka-gold flex items-center gap-2">
                  <Sparkles size={14} /> VIP Registration
                </span>
                <div className="h-[1px] w-12 bg-oaka-gold" />
              </div>
              <h2 className="mb-6 text-4xl font-serif font-light leading-tight text-white md:text-6xl italic">
                Secure Your Vision.
              </h2>
              <p className="text-base text-white/70 font-sans font-light leading-relaxed mx-auto max-w-2xl">
                Register now for early bird privileges, private showroom appointments, and official digital floor plans for OAKA Residences @ Bukit Jalil.
              </p>
            </div>

            {/* Local Form Container */}
            <div className="w-full max-w-3xl bg-white/5 p-6 sm:p-10 lg:p-12 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12 px-4 space-y-6"
                  >
                    <div className="h-20 w-20 border-2 border-oaka-gold bg-oaka-gold/10 rounded-full flex items-center justify-center mx-auto text-oaka-gold">
                      <CheckCircle size={40} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-serif text-white italic">Registration Received</h3>
                      <p className="text-white/80 text-sm font-sans font-light max-w-lg mx-auto leading-relaxed">
                        Thank you for your interest in OAKA Residences. Your details have been sent to our sales representative (<strong>shyanyeews@gmail.com</strong>). We will be in touch shortly.
                      </p>
                    </div>
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => setStatus("idle")}
                        className="w-full sm:w-auto px-8 py-3.5 bg-oaka-gold text-oaka-green font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 transition-all"
                      >
                        Submit Another Inquiry
                      </button>
                      <a
                        href={`https://wa.me/${content.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I just submitted an inquiry for OAKA Residences.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-3.5 border border-oaka-gold/40 text-oaka-gold font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-oaka-gold/10 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} /> Instant WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="inquiry-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {status === "error" && errorMessage && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
                        <AlertCircle size={18} className="shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-oaka-gold/90 flex items-center gap-1.5">
                          <User size={12} /> Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Alex Tan"
                          className="w-full rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-oaka-gold/90 flex items-center gap-1.5">
                          <Mail size={12} /> Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. alex@example.com"
                          className="w-full rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-oaka-gold/90 flex items-center gap-1.5">
                          <Phone size={12} /> Mobile Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. +60123456789"
                          className="w-full rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
                        />
                      </div>

                      {/* Layout Preference */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-oaka-gold/90 flex items-center gap-1.5">
                          <Home size={12} /> Preferred Layout
                        </label>
                        <select
                          name="preferredLayout"
                          value={formData.preferredLayout}
                          onChange={(e) => setFormData((prev) => ({ ...prev, preferredLayout: e.target.value }))}
                          className="w-full rounded-xl border border-white/15 bg-slate-900 p-4 text-sm text-white outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
                        >
                          <option value="Type A (~882 sq ft)">Type A (~882 sq ft - 2 Bedrooms)</option>
                          <option value="Type B (~1,175 sq ft)">Type B (~1,175 sq ft - 2+1 Bedrooms)</option>
                          <option value="Type C (~1,423 sq ft)">Type C (~1,423 sq ft - 3 Bedrooms)</option>
                          <option value="General Inquiry">General Inquiry / All Layouts</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-oaka-gold/90 flex items-center gap-1.5">
                        <MessageSquare size={12} /> Additional Message or Special Requests
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="e.g. Interested in high floor units facing golf course views."
                        className="w-full rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
                      />
                    </div>

                    {/* Checkbox Terms */}
                    <div className="pt-2 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreed"
                        name="agreed"
                        checked={formData.agreed}
                        onChange={(e) => setFormData((prev) => ({ ...prev, agreed: e.target.checked }))}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 text-oaka-gold focus:ring-oaka-gold"
                      />
                      <label htmlFor="agreed" className="text-xs text-white/70 leading-relaxed select-none">
                        I agree to receive communications regarding OAKA Residences and consent to the processing of my personal data in accordance with the{" "}
                        <button
                          type="button"
                          onClick={() => setShowPrivacy(true)}
                          className="text-oaka-gold underline underline-offset-2 hover:text-white"
                        >
                          Privacy Policy
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="text-oaka-gold underline underline-offset-2 hover:text-white"
                        >
                          Terms & Conditions
                        </button>.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group relative w-full flex items-center justify-center gap-4 overflow-hidden border border-oaka-gold bg-oaka-gold py-5 text-xs font-bold uppercase tracking-[0.3em] text-oaka-green transition-all hover:bg-transparent hover:text-white disabled:opacity-50 rounded-xl"
                      >
                        {status === "submitting" ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Submitting Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <span className="relative z-10">Register Interest Now</span>
                            <Send className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            <div className="absolute inset-0 z-0 h-full w-0 bg-oaka-green transition-all duration-300 group-hover:w-full" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Badges & Direct WhatsApp */}
            <div className="mt-16 w-full max-w-xl text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center border border-oaka-gold/30 text-oaka-gold rounded-full bg-oaka-gold/5">
                    <CheckCircle size={16} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Priority Unit Selection</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center border border-oaka-gold/30 text-oaka-gold rounded-full bg-oaka-gold/5">
                    <CheckCircle size={16} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Early Bird Rebates</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <a
                  href={`https://wa.me/${content.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(content.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-6 overflow-hidden border border-oaka-gold/50 bg-transparent px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-oaka-gold transition-all hover:bg-oaka-gold hover:text-oaka-green rounded-xl"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Prefer Direct WhatsApp Chat?</span>
                </a>
              </div>
            </div>
          </div>

          {/* Decorative Background Mark */}
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
