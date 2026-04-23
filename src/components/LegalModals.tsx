import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { LandingContent } from "../types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: LandingContent;
}

export function PrivacyModal({ isOpen, onClose, content }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative h-full max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl md:p-12"
          >
            <button onClick={onClose} className="absolute top-6 right-6 rounded-full p-2 text-slate-400 hover:bg-slate-100">
              <X size={24} />
            </button>
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-slate-900">Privacy Policy</h2>
              <p className="text-slate-500 italic">Last updated: April 2026</p>
              
              <p>
                This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make an inquiry on this landing page.
              </p>

              <h3 className="text-xl font-bold mt-8">1. PDPA Compliance</h3>
              <p>
                In accordance with the <strong>Personal Data Protection Act 2010 (PDPA)</strong> of Malaysia, we are committed to protecting your personal data. By submitting your details, you consent to the processing of your personal data by {content.footer.agentName} and {content.footer.agencyName}.
              </p>

              <h3 className="text-xl font-bold mt-8">2. Information We Collect</h3>
              <p>
                When you make an inquiry through our form, we collect certain information from you, including your name, email address, and phone number.
              </p>

              <h3 className="text-xl font-bold mt-8">3. How We Use Your Information</h3>
              <p>
                We use the information that we collect to:
              </p>
              <ul>
                <li>Communicate with you regarding OAKA Residences.</li>
                <li>Provide you with information or advertising relating to our services.</li>
                <li>Fulfill any requests you make through the site.</li>
              </ul>

              <h3 className="text-xl font-bold mt-8">4. Data Security</h3>
              <p>
                We take reasonable precautions to protect your information and ensure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
              </p>

              <h3 className="text-xl font-bold mt-8">5. Contact Us</h3>
              <p>
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us at {content.footer.phone}.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function TermsModal({ isOpen, onClose, content }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative h-full max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl md:p-12"
          >
            <button onClick={onClose} className="absolute top-6 right-6 rounded-full p-2 text-slate-400 hover:bg-slate-100">
              <X size={24} />
            </button>
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-slate-900">Terms & Conditions</h2>
              <p className="text-slate-500 italic">Last updated: April 2026</p>

              <h3 className="text-xl font-bold mt-8">1. Acceptance of Terms</h3>
              <p>
                By accessing this website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              </p>

              <h3 className="text-xl font-bold mt-8">2. Use License</h3>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on this website for personal, non-commercial transitory viewing only.
              </p>

              <h3 className="text-xl font-bold mt-8">3. Disclaimer</h3>
              <p>
                The materials on this website are provided on an 'as is' basis. {content.footer.agentName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h3 className="text-xl font-bold mt-8">4. Accuracy of Materials</h3>
              <p>
                The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials contained on its website at any time without notice.
              </p>

              <h3 className="text-xl font-bold mt-8">5. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Malaysia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
