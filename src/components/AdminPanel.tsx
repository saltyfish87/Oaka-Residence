import React, { useState, useEffect } from "react";
import { motion, useDragControls } from "motion/react";
import { X, LogIn, Save, Plus, Trash2, Image as ImageIcon, Upload, Minimize2, Maximize2, GripHorizontal, Layout } from "lucide-react";
import { auth, googleProvider, storage, handleFirestoreError, OperationType } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { LandingContent } from "../types";
import { cn } from "../lib/utils";

interface AdminPanelProps {
  content: LandingContent;
  initialSection?: keyof LandingContent;
  onClose: () => void;
  onSave: (content: LandingContent) => void;
}

export default function AdminPanel({ content, initialSection, onClose, onSave }: AdminPanelProps) {
  const [user] = useAuthState(auth);
  const [localContent, setLocalContent] = useState<LandingContent>(content);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<keyof LandingContent>(initialSection || "hero");
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
  }, [initialSection]);

  const isAdmin = user?.email === "saltyfish1987@gmail.com";
  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => signOut(auth);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `landing/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const newContent = { ...localContent };
      if (path === "logoUrl") newContent.logoUrl = url;
      else if (path === "hero") newContent.hero.imageUrl = url;
      else if (path === "overview") newContent.overview.imageUrl = url;
      else if (path === "location") newContent.location.imageUrl = url;
      else if (path.startsWith("layout_")) {
        const idx = parseInt(path.split("_")[1]);
        newContent.layouts.types[idx].imageUrl = url;
      }
      
      setLocalContent(newContent);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `storage/landing/${file.name}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const title = file.name.split(".")[0].replace(/_/g, " ");
      
      setLocalContent({
        ...localContent,
        gallery: {
          ...localContent.gallery,
          images: [...localContent.gallery.images, { url, title }]
        }
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `storage/gallery/${file.name}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to ensure all sections are listed even if missing from Firestore doc
  const SECTIONS = [
    { id: "hero", label: "Hero & Branding" },
    { id: "overview", label: "Overview" },
    { id: "keyFeatures", label: "Features" },
    { id: "location", label: "Location" },
    { id: "facilities", label: "Amenities" },
    { id: "layouts", label: "Layout Plans" },
    { id: "gallery", label: "Gallery" },
    { id: "footer", label: "Contact Info" },
    { id: "ctaEmbedCode", label: "Embed Code (CRM)" },
    { id: "seo", label: "SEO & Google" },
  ];

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-oaka-bg text-oaka-green">
            <LogIn size={40} />
          </div>
          <h2 className="mb-4 text-2xl font-bold">Admin Privileges</h2>
          <p className="mb-8 text-slate-600">Please sign in with your authorized Google account to access the site editor.</p>
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-oaka-green py-5 font-bold text-oaka-gold shadow-xl hover:brightness-110 active:scale-95 transition-all"
          >
            Sign in with Google
          </button>
          <button onClick={onClose} className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
            Return to Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ 
        x: 0,
        width: isMinimized ? "80px" : "400px"
      }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "fixed top-0 right-0 z-[100] h-full flex flex-col bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] border-l border-slate-100 transition-all duration-300",
        isMinimized ? "bg-slate-900 border-slate-800" : "bg-white"
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          "flex items-center justify-between border-b px-5 py-6 select-none transition-colors",
          isMinimized ? "border-white/10" : "bg-slate-50/50 border-slate-100"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-oaka-green text-oaka-gold shadow-lg">
            <Layout size={18} />
          </div>
          {!isMinimized && (
            <div className="truncate">
              <h2 className="text-xs font-bold leading-tight text-slate-900 uppercase tracking-widest">
                Content Manager
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-oaka-gold truncate">Section: {activeSection}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className={cn(
              "rounded-lg p-2 transition-colors",
              isMinimized ? "text-white/40 hover:bg-white/10 hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            )}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          {!isMinimized && (
            <button 
              onClick={onClose} 
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between border-b border-slate-50 px-6 py-2.5 bg-white">
            <div className="flex items-center gap-2">
               <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Changes</span>
            </div>
            <button
              onClick={() => onSave(localContent)}
              className="flex items-center gap-2 rounded-lg bg-oaka-green px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-oaka-gold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Save size={14} />
              Save to Site
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-100 bg-white no-scrollbar">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={cn(
                  "px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2",
                  activeSection === section.id 
                    ? "border-oaka-gold text-oaka-green bg-oaka-gold/5" 
                    : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/20">
            {activeSection === "hero" && (
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-oaka-green">Branding & Hero</h3>
                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Name</label>
                    <input
                      type="text"
                      value={localContent.projectName}
                      onChange={(e) => setLocalContent({ ...localContent, projectName: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-oaka-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Logo</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center p-2">
                          {localContent.logoUrl ? (
                            <img src={localContent.logoUrl} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <ImageIcon className="text-slate-300" />
                          )}
                        </div>
                        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-oaka-green shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
                          <Upload size={14} />
                          {isUploading ? "..." : "Upload Logo"}
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "logoUrl")} />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={localContent.logoUrl || ""}
                        onChange={(e) => setLocalContent({ ...localContent, logoUrl: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-[10px] outline-none focus:border-oaka-gold font-mono"
                        placeholder="Logo URL..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Title</label>
              <input
                type="text"
                value={localContent.hero.title}
                onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, title: e.target.value } })}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-serif outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtitle</label>
              <textarea
                rows={3}
                value={localContent.hero.subtitle}
                onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, subtitle: e.target.value } })}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-sans font-light leading-relaxed outline-none transition-all focus:border-oaka-gold focus:ring-1 focus:ring-oaka-gold"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hero Image</label>
              <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                    <img src={localContent.hero.imageUrl} className="h-full w-full object-cover" />
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-oaka-green shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95 text-center">
                    <Upload size={14} />
                    {isUploading ? "..." : "Upload Image"}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "hero")} />
                  </label>
                </div>
                <input
                  type="text"
                  value={localContent.hero.imageUrl}
                  onChange={(e) => setLocalContent({ ...localContent, hero: { ...localContent.hero, imageUrl: e.target.value } })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-[10px] outline-none focus:border-oaka-gold font-mono"
                  placeholder="Image URL..."
                />
              </div>
            </div>
          </div>
        )}

              {activeSection === "overview" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Overview</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                    <textarea
                      rows={5}
                      value={localContent.overview.description}
                      onChange={(e) => setLocalContent({ ...localContent, overview: { ...localContent.overview, description: e.target.value } })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed outline-none focus:border-oaka-gold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Overview Image</label>
                    <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                          <img src={localContent.overview.imageUrl} className="h-full w-full object-cover" />
                        </div>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-oaka-green shadow-sm border border-slate-100 hover:bg-slate-50">
                          <Upload size={14} />
                          {isUploading ? "..." : "Upload Image"}
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "overview")} />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={localContent.overview.imageUrl}
                        onChange={(e) => setLocalContent({ ...localContent, overview: { ...localContent.overview, imageUrl: e.target.value } })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-[10px] outline-none focus:border-oaka-gold font-mono"
                        placeholder="Image URL..."
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Statistics</label>
                    <div className="space-y-3">
                      {localContent.overview.stats.map((stat, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...localContent.overview.stats];
                              newStats[idx].label = e.target.value;
                              setLocalContent({ ...localContent, overview: { ...localContent.overview, stats: newStats } });
                            }}
                            className="flex-1 rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none focus:border-oaka-gold"
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...localContent.overview.stats];
                              newStats[idx].value = e.target.value;
                              setLocalContent({ ...localContent, overview: { ...localContent.overview, stats: newStats } });
                            }}
                            className="flex-1 rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold outline-none focus:border-oaka-gold"
                            placeholder="Value"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "location" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Location</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                    <textarea
                      rows={3}
                      value={localContent.location.description}
                      onChange={(e) => setLocalContent({ ...localContent, location: { ...localContent.location, description: e.target.value } })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-oaka-gold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Map / Location Image</label>
                    <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                          <img src={localContent.location.imageUrl} className="h-full w-full object-cover" />
                        </div>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-oaka-green shadow-sm border border-slate-100 hover:bg-slate-50">
                          <Upload size={14} />
                          {isUploading ? "..." : "Upload Image"}
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "location")} />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={localContent.location.imageUrl}
                        onChange={(e) => setLocalContent({ ...localContent, location: { ...localContent.location, imageUrl: e.target.value } })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-[10px] outline-none focus:border-oaka-gold font-mono"
                        placeholder="Map URL..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "keyFeatures" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Key Features</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Title</label>
                    <input
                      type="text"
                      value={localContent.keyFeatures.title}
                      onChange={(e) => setLocalContent({ ...localContent, keyFeatures: { ...localContent.keyFeatures, title: e.target.value } })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-serif outline-none focus:border-oaka-gold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Feature Items</label>
                    {localContent.keyFeatures.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newItems = [...localContent.keyFeatures.items];
                            newItems[idx] = e.target.value;
                            setLocalContent({ ...localContent, keyFeatures: { ...localContent.keyFeatures, items: newItems } });
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none focus:border-oaka-gold"
                        />
                        <button
                          onClick={() => {
                            const newItems = localContent.keyFeatures.items.filter((_, i) => i !== idx);
                            setLocalContent({ ...localContent, keyFeatures: { ...localContent.keyFeatures, items: newItems } });
                          }}
                          className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setLocalContent({ ...localContent, keyFeatures: { ...localContent.keyFeatures, items: [...localContent.keyFeatures.items, "New Feature"] } })}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                      <Plus size={14} />
                      Add Feature
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "facilities" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Facilities</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Title</label>
                    <input
                      type="text"
                      value={localContent.facilities.title}
                      onChange={(e) => setLocalContent({ ...localContent, facilities: { ...localContent.facilities, title: e.target.value } })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-serif outline-none focus:border-oaka-gold"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {localContent.facilities.items.map((item, idx) => (
                      <div key={idx} className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Facility {idx + 1}</label>
                          <button
                            onClick={() => {
                              const newItems = localContent.facilities.items.filter((_, i) => i !== idx);
                              setLocalContent({ ...localContent, facilities: { ...localContent.facilities, items: newItems } });
                            }}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...localContent.facilities.items];
                              newItems[idx].name = e.target.value;
                              setLocalContent({ ...localContent, facilities: { ...localContent.facilities, items: newItems } });
                            }}
                            className="w-full rounded border border-slate-200 bg-white p-2 text-xs font-bold outline-none focus:border-oaka-gold"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => {
                              const newItems = [...localContent.facilities.items];
                              newItems[idx].icon = e.target.value;
                              setLocalContent({ ...localContent, facilities: { ...localContent.facilities, items: newItems } });
                            }}
                            className="w-full rounded border border-slate-200 bg-white p-2 text-[9px] font-mono outline-none focus:border-oaka-gold"
                            placeholder="Lucide Icon (e.g. Waves)"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setLocalContent({ ...localContent, facilities: { ...localContent.facilities, items: [...localContent.facilities.items, { name: "New Facility", icon: "Check" }] } })}
                      className="flex h-full min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                      <Plus size={20} />
                      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest">Add Facility</span>
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "layouts" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Unit Layouts</h3>
                  <div className="space-y-2 text-center pb-4 border-b border-slate-100">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Title</label>
                    <input
                      type="text"
                      value={localContent.layouts.title}
                      onChange={(e) => setLocalContent({ ...localContent, layouts: { ...localContent.layouts, title: e.target.value } })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-serif text-center outline-none focus:border-oaka-gold"
                    />
                  </div>
                  <div className="space-y-8">
                    {localContent.layouts.types.map((type, idx) => (
                      <div key={idx} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/30 p-5 group">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="font-serif text-oaka-green italic tracking-wide">{type.type || "New Layout"}</h4>
                          <button
                            onClick={() => {
                              const newTypes = localContent.layouts.types.filter((_, i) => i !== idx);
                              setLocalContent({ ...localContent, layouts: { ...localContent.layouts, types: newTypes } });
                            }}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Type</label>
                            <input
                              type="text"
                              value={type.type}
                              onChange={(e) => {
                                const newTypes = [...localContent.layouts.types];
                                newTypes[idx].type = e.target.value;
                                setLocalContent({ ...localContent, layouts: { ...localContent.layouts, types: newTypes } });
                              }}
                              className="w-full rounded border border-slate-200 bg-white p-2 text-xs font-bold outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Size</label>
                            <input
                              type="text"
                              value={type.size}
                              onChange={(e) => {
                                const newTypes = [...localContent.layouts.types];
                                newTypes[idx].size = e.target.value;
                                setLocalContent({ ...localContent, layouts: { ...localContent.layouts, types: newTypes } });
                              }}
                              className="w-full rounded border border-slate-200 bg-white p-2 text-xs outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Config</label>
                            <input
                              type="text"
                              value={type.config}
                              onChange={(e) => {
                                const newTypes = [...localContent.layouts.types];
                                newTypes[idx].config = e.target.value;
                                setLocalContent({ ...localContent, layouts: { ...localContent.layouts, types: newTypes } });
                              }}
                              className="w-full rounded border border-slate-200 bg-white p-2 text-xs outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-white p-3">
                            <div className="flex items-center gap-4">
                              <div className="relative h-14 w-20 overflow-hidden rounded border border-slate-200">
                                <img src={type.imageUrl} className="h-full w-full object-contain bg-slate-50" />
                              </div>
                              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded border border-slate-100 bg-slate-50 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-100">
                                <Upload size={12} />
                                {isUploading ? "..." : "Plan"}
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, `layout_${idx}`)} />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={type.imageUrl}
                              onChange={(e) => {
                                const newTypes = [...localContent.layouts.types];
                                newTypes[idx].imageUrl = e.target.value;
                                setLocalContent({ ...localContent, layouts: { ...localContent.layouts, types: newTypes } });
                              }}
                              className="w-full rounded border border-slate-200 bg-white p-1.5 text-[9px] font-mono outline-none"
                              placeholder="Image Link..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setLocalContent({ ...localContent, layouts: { ...localContent.layouts, types: [...localContent.layouts.types, { type: "New Type", size: "0 sq ft", config: "0 Bedrooms", imageUrl: "https://picsum.photos/seed/layout/800/600" }] } })}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                      <Plus size={16} />
                      Add Unit Type
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "gallery" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-serif text-oaka-green">Experience Gallery</h3>
                    <div className="flex gap-2">
                      <label className="cursor-pointer rounded-lg bg-oaka-green px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-oaka-gold hover:brightness-110 active:scale-95 transition-all">
                        {isUploading ? "..." : "Upload New"}
                        <input type="file" className="hidden" onChange={handleGalleryUpload} />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {localContent.gallery.images.map((img, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50 p-2 shadow-sm">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-slate-200">
                          <img src={img.url} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => {
                              const newImages = [...localContent.gallery.images];
                              newImages[idx].title = e.target.value;
                              setLocalContent({ ...localContent, gallery: { ...localContent.gallery, images: newImages } });
                            }}
                            className="w-full rounded border border-slate-200 bg-white p-1.5 text-[10px] font-bold outline-none"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={img.url}
                            onChange={(e) => {
                              const newImages = [...localContent.gallery.images];
                              newImages[idx].url = e.target.value;
                              setLocalContent({ ...localContent, gallery: { ...localContent.gallery, images: newImages } });
                            }}
                            className="w-full rounded border border-slate-200 bg-white p-1.5 text-[8px] font-mono outline-none"
                            placeholder="URL"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newImages = localContent.gallery.images.filter((_, i) => i !== idx);
                            setLocalContent({ ...localContent, gallery: { ...localContent.gallery, images: newImages } });
                          }}
                          className="absolute top-4 right-4 rounded-full bg-red-500 p-2 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setLocalContent({
                          ...localContent,
                          gallery: {
                            ...localContent.gallery,
                            images: [...localContent.gallery.images, { url: "https://picsum.photos/seed/new/1200/800", title: "New Vision" }]
                          }
                        });
                      }}
                      className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300 hover:bg-slate-50 hover:text-slate-400 transition-all group"
                    >
                      <Plus size={32} className="group-hover:scale-110 transition-transform" />
                      <span className="mt-2 text-[9px] font-bold uppercase tracking-widest">New Slot</span>
                    </button>
                  </div>
                </div>
              )}

              {activeSection === "footer" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Company & Info</h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Agent Name</label>
                        <input
                          type="text"
                          value={localContent.footer.agentName}
                          onChange={(e) => setLocalContent({ ...localContent, footer: { ...localContent.footer, agentName: e.target.value } })}
                          className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">REN Number</label>
                        <input
                          type="text"
                          value={localContent.footer.renNumber}
                          onChange={(e) => setLocalContent({ ...localContent, footer: { ...localContent.footer, renNumber: e.target.value } })}
                          className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">WhatsApp Number</label>
                      <input
                        type="text"
                        value={localContent.whatsappNumber}
                        onChange={(e) => setLocalContent({ ...localContent, whatsappNumber: e.target.value })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Agency Name</label>
                      <input
                        type="text"
                        value={localContent.footer.agencyName}
                        onChange={(e) => setLocalContent({ ...localContent, footer: { ...localContent.footer, agencyName: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Sales Gallery Address</label>
                      <textarea
                        rows={2}
                        value={localContent.footer.address}
                        onChange={(e) => setLocalContent({ ...localContent, footer: { ...localContent.footer, address: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1 pt-4 border-t border-slate-100">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Default WhatsApp Message</label>
                      <textarea
                        rows={3}
                        value={localContent.whatsappMessage}
                        onChange={(e) => setLocalContent({ ...localContent, whatsappMessage: e.target.value })}
                        className="w-full rounded border border-slate-200 p-2 text-xs font-light leading-relaxed outline-none focus:border-oaka-gold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "ctaEmbedCode" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">External Form Embed</h3>
                  <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">GoHighLevel / External Embed Code</label>
                      <textarea
                        rows={10}
                        value={localContent.ctaEmbedCode}
                        onChange={(e) => setLocalContent({ ...localContent, ctaEmbedCode: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs font-mono outline-none focus:border-oaka-gold"
                        placeholder="Paste your <iframe src='...'> or <script> code here..."
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 italic">
                      This code will replace the default inquiry form. Make sure to paste the full HTML embed code provided by GoHighLevel or your CRM.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "seo" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-oaka-green">Search Engine Optimization</h3>
                  <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Search Engine Title</label>
                      <input
                        type="text"
                        value={localContent.seo?.title || ""}
                        onChange={(e) => setLocalContent({ ...localContent, seo: { ...localContent.seo!, title: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Search Engine Description</label>
                      <textarea
                        rows={3}
                        value={localContent.seo?.description || ""}
                        onChange={(e) => setLocalContent({ ...localContent, seo: { ...localContent.seo!, description: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Keywords (Comma separated)</label>
                      <textarea
                        rows={2}
                        value={localContent.seo?.keywords || ""}
                        onChange={(e) => setLocalContent({ ...localContent, seo: { ...localContent.seo!, keywords: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1 pt-4 border-t border-slate-100">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Favicon URL (128x128px recommended)</label>
                      <input
                        type="text"
                        value={localContent.seo?.faviconUrl || ""}
                        onChange={(e) => setLocalContent({ ...localContent, seo: { ...localContent.seo!, faviconUrl: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Social Share Image (OG Image) URL</label>
                      <input
                        type="text"
                        value={localContent.seo?.ogImageUrl || ""}
                        onChange={(e) => setLocalContent({ ...localContent, seo: { ...localContent.seo!, ogImageUrl: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                    </div>
                    <div className="space-y-1 pt-4 border-t border-slate-100">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Google Site Verification Code</label>
                      <input
                        type="text"
                        placeholder="e.g. jf4_5h-g4_k..."
                        value={localContent.seo?.googleVerification || ""}
                        onChange={(e) => setLocalContent({ ...localContent, seo: { ...localContent.seo!, googleVerification: e.target.value } })}
                        className="w-full rounded border border-slate-200 p-2 text-xs outline-none focus:border-oaka-gold"
                      />
                      <p className="text-[8px] text-slate-400 mt-1 italic">
                        Paste the code from Google Search Console (meta tag method).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 mt-8 border-t border-slate-100 flex justify-center pb-12">
                <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 size={12} />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
}
