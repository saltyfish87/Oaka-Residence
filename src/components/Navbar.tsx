import React from "react";
import { LandingContent } from "../types";
import { Building2, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

interface NavbarProps {
  content: LandingContent;
  onInquire: () => void;
  onLogin?: () => void;
  isLoggedIn?: boolean;
}

export default function Navbar({ content, onInquire, onLogin, isLoggedIn }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Overview", href: "#overview" },
    { name: "Location", href: "#location" },
    { name: "Facilities", href: "#facilities" },
    { name: "Layouts", href: "#layouts" },
    { name: "Gallery", href: "#gallery" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 z-40 w-full transition-all duration-500",
        isScrolled ? "bg-oaka-bg/95 py-3 shadow-sm backdrop-blur-md" : "bg-transparent py-8"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          {content.logoUrl ? (
            <img 
              src={content.logoUrl} 
              alt={content.projectName} 
              className="h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center border transition-colors",
                isScrolled ? "border-oaka-green bg-oaka-green text-oaka-gold" : "border-white bg-white/10 text-oaka-gold backdrop-blur-sm"
              )}>
                <Building2 size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className={cn("text-2xl font-serif font-bold tracking-[0.2em] uppercase transition-colors", isScrolled ? "text-oaka-green" : "text-white")}>
                  OAKA
                </span>
                <span className={cn("text-[10px] font-sans tracking-[0.3em] uppercase transition-opacity", isScrolled ? "text-oaka-green/60" : "text-white/60")}>
                  Residences
                </span>
              </div>
            </>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "group relative text-xs font-semibold uppercase tracking-[0.15em] transition-colors",
                isScrolled ? "text-oaka-green/70 hover:text-oaka-green" : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-oaka-gold transition-all group-hover:w-full" />
            </a>
          ))}
          {!isLoggedIn && onLogin && (
            <button 
              onClick={onLogin}
              className={cn(
                "px-6 py-2 border rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/10",
                isScrolled ? "border-oaka-green text-oaka-green" : "border-white text-white"
              )}
            >
              Admin Access
            </button>
          )}
          <button
            onClick={onInquire}
            className={cn(
              "border px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all hover:bg-oaka-gold hover:text-white active:scale-95",
              isScrolled ? "border-oaka-green text-oaka-green" : "border-white text-white"
            )}
          >
            Inquire Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-slate-900" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-slate-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white p-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-600 hover:text-amber-600"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                onInquire();
                setIsMobileMenuOpen(false);
              }}
              className="mt-2 w-full rounded-xl bg-amber-600 py-4 text-center font-bold text-white"
            >
              WhatsApp Inquiry
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
