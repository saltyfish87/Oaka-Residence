import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { LandingContent, DEFAULT_CONTENT } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import KeyFeatures from "./components/KeyFeatures";
import Location from "./components/Location";
import Facilities from "./components/Facilities";
import Layouts from "./components/Layouts";
import Gallery from "./components/Gallery";
import InquiryForm from "./components/InquiryForm";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import Editable from "./components/Editable";
import ErrorBoundary from "./components/ErrorBoundary";
import { MessageCircle, Edit3, Save, Layout } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { handleFirestoreError, OperationType } from "./firebase";
import { cn } from "./lib/utils";

export default function App() {
  const [content, setContent] = useState<LandingContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminSection, setAdminSection] = useState<keyof LandingContent>("hero");
  const [isEditMode, setIsEditMode] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const path = "settings/content";
    const unsub = onSnapshot(doc(db, "settings", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setContent(docSnap.data() as LandingContent);
      } else {
        if (auth.currentUser?.email === "saltyfish1987@gmail.com") {
          setDoc(doc(db, "settings", "content"), DEFAULT_CONTENT).catch(err => {
            handleFirestoreError(err, OperationType.WRITE, path);
          });
        }
      }
      setIsLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, path);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Update SEO Meta Tags
    if (content.seo) {
      document.title = content.seo.title;
      
      const updateMeta = (name: string, content: string, attr: string = "name") => {
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      const updateLink = (rel: string, href: string) => {
        let el = document.querySelector(`link[rel="${rel}"]`);
        if (!el) {
          el = document.createElement("link");
          el.setAttribute("rel", rel);
          document.head.appendChild(el);
        }
        el.setAttribute("href", href);
      };

      updateMeta("description", content.seo.description);
      updateMeta("keywords", content.seo.keywords);
      
      // OG Tags
      updateMeta("og:title", content.seo.title, "property");
      updateMeta("og:description", content.seo.description, "property");
      updateMeta("og:image", content.seo.ogImageUrl || content.hero.imageUrl, "property");
      
      // Favicon
      if (content.seo.faviconUrl) {
        updateLink("icon", content.seo.faviconUrl);
        updateLink("apple-touch-icon", content.seo.faviconUrl);
      }

      // Google Verification
      if (content.seo.googleVerification) {
        updateMeta("google-site-verification", content.seo.googleVerification);
      }
    }
  }, [content.seo, content.hero.imageUrl]);

  const isAdmin = user?.email === "saltyfish1987@gmail.com";

  // Auto-open panel on login if admin
  useEffect(() => {
    if (isAdmin) {
      setIsAdminOpen(true);
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${content.whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent(content.whatsappMessage)}`;
    window.open(url, "_blank");
  };

  const startEditing = (section: keyof LandingContent) => {
    setAdminSection(section);
    setIsAdminOpen(true);
  };

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-oaka-bg"
          >
            <div className="h-16 w-16 border-4 border-oaka-gold border-t-transparent rounded-full animate-spin mb-4" />
            <h1 className="text-oaka-green font-serif text-2xl tracking-widest animate-pulse">OAKA</h1>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "min-h-screen font-sans transition-all duration-300",
              isAdminOpen ? "pr-[400px]" : ""
            )}
          >
            {/* Top Admin Bar */}
            {isAdmin && (
              <div className="fixed top-0 left-0 right-0 z-[60] bg-slate-900 text-white px-6 py-2 flex items-center justify-between border-b border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logged in as Administrator</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                      isEditMode ? "bg-oaka-gold text-oaka-green" : "bg-white/10 hover:bg-white/20"
                    )}
                  >
                    <Edit3 size={14} />
                    {isEditMode ? "Edit Mode ON" : "Turn On EDIT Mode"}
                  </button>
                  <button 
                    onClick={() => setIsAdminOpen(!isAdminOpen)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-oaka-gold text-oaka-green rounded text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
                  >
                    <Layout size={14} />
                    Open Content Manager
                  </button>
                </div>
              </div>
            )}

            <div className={cn("bg-oaka-bg text-oaka-green selection:bg-oaka-gold selection:text-oaka-green", isAdmin ? "pt-10" : "")}>
              <Navbar 
                content={content} 
                onInquire={openWhatsApp} 
                onLogin={handleLogin}
                isLoggedIn={!!user}
              />
              
              <main>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("hero")}>
                  <Hero content={content} onInquire={openWhatsApp} />
                </Editable>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("overview")}>
                  <Overview content={content} />
                </Editable>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("keyFeatures")}>
                  <KeyFeatures content={content} />
                </Editable>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("location")}>
                  <Location content={content} />
                </Editable>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("facilities")}>
                  <Facilities content={content} />
                </Editable>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("layouts")}>
                  <Layouts content={content} />
                </Editable>
                <Editable isEditMode={isEditMode} onEdit={() => startEditing("gallery")}>
                  <Gallery content={content} />
                </Editable>
                <InquiryForm content={content} />
              </main>

              <Editable isEditMode={isEditMode} onEdit={() => startEditing("footer")}>
                <Footer 
                  content={content} 
                  onWhatsApp={openWhatsApp} 
                  onLogin={handleLogin}
                  isLoggedIn={!!user}
                />
              </Editable>

              {/* Floating Buttons */}
              <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
                {isAdmin && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all",
                        isEditMode ? "bg-oaka-gold text-oaka-green" : "bg-slate-900 text-white"
                      )}
                      title={isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
                    >
                      <Edit3 size={24} />
                    </motion.button>
                    
                    {isEditMode && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsAdminOpen(!isAdminOpen)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-oaka-green text-oaka-gold shadow-xl"
                        title="Open Sidebar Editor"
                      >
                        <Save size={24} />
                      </motion.button>
                    )}
                  </>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={openWhatsApp}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition-colors hover:bg-green-600"
                  title="WhatsApp Us"
                >
                  <MessageCircle size={28} />
                </motion.button>
              </div>

              <AnimatePresence>
                {isAdminOpen && (
                  <AdminPanel 
                    content={content} 
                    initialSection={adminSection}
                    onClose={() => setIsAdminOpen(false)} 
                    onSave={(newContent) => {
                      const path = "settings/content";
                      setDoc(doc(db, "settings", "content"), newContent).catch(err => {
                        handleFirestoreError(err, OperationType.WRITE, path);
                      });
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
