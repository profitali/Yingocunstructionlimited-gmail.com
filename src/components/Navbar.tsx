import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShoppingBag, 
  Menu, 
  X, 
  Hammer, 
  Building, 
  MessageSquare,
  Radio
} from "lucide-react";
import { 
  playClickSound, 
  playChimeSound, 
  getSoundEnabled, 
  setSoundEnabled, 
  toggleAmbientSound, 
  isAmbientActive 
} from "../utils/sound";
import { CartItem } from "../types";

interface NavbarProps {
  cart?: CartItem[];
  cartCount?: number;
  onOpenCart: () => void;
  onOpenAiHelper: (initialPrompt?: string) => void;
  onOpenContact?: () => void;
  onOpenBookSurvey?: () => void;
  onNavigate?: (sectionId: string) => void;
  activeSection?: string;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart = [],
  cartCount,
  onOpenCart,
  onOpenAiHelper,
  onOpenContact,
  onOpenBookSurvey,
  onNavigate,
  activeSection = "site-building",
  soundEnabled,
  onToggleSound,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [ambientOn, setAmbientOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof soundEnabled === "boolean") {
      setSoundOn(soundEnabled);
    } else {
      setSoundOn(getSoundEnabled());
    }
    setAmbientOn(isAmbientActive());

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [soundEnabled]);

  const handleToggleSound = () => {
    if (onToggleSound) {
      onToggleSound();
    } else {
      const next = !soundOn;
      setSoundOn(next);
      setSoundEnabled(next);
      if (next) {
        playChimeSound();
      }
    }
  };

  const handleToggleAmbient = () => {
    playClickSound();
    const active = toggleAmbientSound();
    setAmbientOn(active);
  };

  const totalCartCount =
    typeof cartCount === "number"
      ? cartCount
      : Array.isArray(cart)
      ? cart.reduce((sum, item) => sum + (item?.quantity || 0), 0)
      : 0;

  const navLinks = [
    { id: "site-building", label: "Site Building", icon: Building },
    { id: "furniture-catalog", label: "Furniture Store", icon: Hammer },
    { id: "cost-estimator", label: "Cost Estimator" },
    { id: "video-showcase", label: "Watch Us Build" },
    { id: "projects-portfolio", label: "Projects" },
    { id: "about-us", label: "About" },
  ];

  const handleNavClick = (id: string) => {
    playClickSound();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Contact Bar */}
      <div className="bg-zinc-50 border-b border-zinc-200/50 text-xs py-2 px-4 text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-y-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a 
              href="tel:0742644200" 
              onClick={playClickSound}
              className="flex items-center gap-1.5 hover:text-amber-600 transition-colors font-medium text-zinc-900"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>0742 644200</span>
              <span className="text-[10px] bg-black/20 text-amber-600 px-1.5 py-0.2 rounded font-mono">CALL / WHATSAPP</span>
            </a>
            <a 
              href="mailto:yingocunstructionlimited@gmail.com" 
              onClick={playClickSound}
              className="flex items-center gap-1.5 hover:text-amber-600 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>yingocunstructionlimited@gmail.com</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-zinc-500">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>216327 Kampala GPO, Uganda</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Effects Toggle */}
            <button
              id="btn-toggle-sound"
              onClick={handleToggleSound}
              title={soundOn ? "Mute UI Sound Effects" : "Enable UI Sound Effects"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border ${
                soundOn 
                  ? "bg-black/10 border-amber-500/30 text-amber-600" 
                  : "bg-zinc-100 border-zinc-300 text-zinc-500"
              }`}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-mono">{soundOn ? "Sound FX: ON" : "Sound: Muted"}</span>
            </button>

            {/* Subtle Ambient Tone Toggle */}
            <button
              id="btn-toggle-ambient"
              onClick={handleToggleAmbient}
              title={ambientOn ? "Stop Workshop Atmosphere" : "Play Gentle Workshop Atmosphere"}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                ambientOn 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 animate-pulse" 
                  : "bg-zinc-100 border-zinc-300 text-zinc-500"
              }`}
            >
              <Radio className="w-3 h-3" />
              <span className="hidden sm:inline font-mono">{ambientOn ? "Workshop Tone: ON" : "Workshop Tone"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`bg-zinc-50/95 backdrop-blur-md border-b border-zinc-200/80 transition-all ${
        scrolled ? "py-2.5 shadow-2xl shadow-black/10" : "py-3.5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick("hero")}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-950/40 border border-amber-400/30 group-hover:scale-105 transition-transform">
              <span className="text-xl tracking-tighter">Y</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-black group-hover:text-amber-600 transition-colors">
                  YINGO CONTRACTORS
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider bg-zinc-100 text-amber-600 px-1.5 py-0.5 rounded border border-zinc-300">
                  LTD
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                Site Building & Bespoke Hardwood Furniture
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "text-amber-600 bg-black/10 border border-amber-500/30"
                      : "text-zinc-600 hover:text-black hover:bg-white"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Hub (AI Helper, Cart/Quote Basket, WhatsApp, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Quick Launcher */}
            <button
              id="btn-navbar-ai-helper"
              onClick={() => {
                playChimeSound();
                onOpenAiHelper();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/10 hover:bg-black/20 text-amber-600 border border-amber-500/40 text-xs sm:text-sm font-medium transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 animate-spin text-amber-600" style={{ animationDuration: "6s" }} />
              <span className="hidden sm:inline">AI Helper</span>
              <span className="text-[10px] bg-amber-400 text-white font-bold px-1 rounded">UGX</span>
            </button>

            {/* Cart & Quote Basket */}
            <button
              id="btn-navbar-cart"
              onClick={() => {
                playClickSound();
                onOpenCart();
              }}
              className="relative p-2 rounded-sm bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 transition-colors"
              title="View Furniture Quote Basket"
            >
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white font-bold text-xs rounded-full flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Call */}
            <a
              id="btn-navbar-whatsapp"
              href="https://wa.me/256742644200?text=Hello%20Yingo%20Contractors,%20I%20would%20like%20to%20inquire%20about%20site%20building%20and%20furniture."
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-950/40 hover:scale-105"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0742 644200</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-sm bg-white text-zinc-600 border border-zinc-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-50 border-b border-zinc-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-zinc-900 hover:text-amber-600 hover:bg-white flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-zinc-500 font-mono">GO &rarr;</span>
              </button>
            ))}
            <div className="pt-2 border-t border-zinc-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                  if (onOpenContact) {
                    onOpenContact();
                  } else {
                    const el = document.getElementById("about-us");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full py-2.5 px-3 text-center rounded-sm bg-white border border-zinc-200 text-zinc-900 text-sm font-semibold hover:bg-zinc-100"
              >
                Direct Contact & Location
              </button>
              <a
                href="tel:0742644200"
                onClick={playClickSound}
                className="w-full py-2.5 px-3 text-center rounded-sm bg-black text-white text-sm font-bold shadow hover:bg-amber-600"
              >
                Call Hotline: 0742 644200
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
