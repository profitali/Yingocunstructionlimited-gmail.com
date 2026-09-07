import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ShoppingBag, 
  HardHat, 
  Hammer,
  Check
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SiteBuildingSection } from "./components/SiteBuildingSection";
import { FurnitureStoreSection } from "./components/FurnitureStoreSection";
import { CostEstimatorSection } from "./components/CostEstimatorSection";
import { VideoGallerySection } from "./components/VideoGallerySection";
import { ProjectsPortfolioSection } from "./components/ProjectsPortfolioSection";
import { AboutAndContactSection } from "./components/AboutAndContactSection";
import { Footer } from "./components/Footer";
import { AiHelperModal } from "./components/AiHelperModal";
import { QuoteDrawer } from "./components/QuoteDrawer";
import { BookSurveyModal } from "./components/BookSurveyModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartItem, FurnitureProduct } from "./types";
import { 
  initAudioOnUserGesture, 
  playClickSound, 
  playChimeSound, 
  toggleSoundEnabled, 
  getSoundEnabled 
} from "./utils/sound";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("yingo_quote_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAiHelperOpen, setIsAiHelperOpen] = useState<boolean>(false);
  const [aiHelperInitialPrompt, setAiHelperInitialPrompt] = useState<string>("");
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState<boolean>(false);
  const [isBookSurveyOpen, setIsBookSurveyOpen] = useState<boolean>(false);
  const [activeProductModal, setActiveProductModal] = useState<FurnitureProduct | null>(null);
  const [customSiteEstimate, setCustomSiteEstimate] = useState<{
    type: "site_building" | "furniture_custom";
    estimatedTotalUGX: number;
    description: string;
  } | null>(null);

  // Initialize sound preference & global user audio unlock
  useEffect(() => {
    setSoundEnabled(getSoundEnabled());
    const unlock = () => {
      initAudioOnUserGesture();
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem("yingo_quote_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

  const handleToggleSound = () => {
    const next = toggleSoundEnabled();
    setSoundEnabled(next);
  };

  const handleAddToCart = (product: FurnitureProduct, quantity = 1, customNotes?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (customNotes) {
          updated[existingIndex].customNotes = customNotes;
        }
        return updated;
      }
      return [...prev, { product, quantity, customNotes }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenAiHelper = (prompt?: string) => {
    setAiHelperInitialPrompt(prompt || "");
    setIsAiHelperOpen(true);
  };

  const handleOpenQuoteWithDetails = (details: {
    type: "site_building" | "furniture_custom";
    estimatedTotalUGX: number;
    description: string;
  }) => {
    setCustomSiteEstimate(details);
    setIsQuoteDrawerOpen(true);
  };

  return (
    <div className="min-w-[320px] min-h-screen bg-zinc-50 text-black flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        cart={Array.isArray(cart) ? cart : []}
        cartCount={Array.isArray(cart) ? cart.reduce((sum, i) => sum + (i?.quantity || 0), 0) : 0}
        onOpenCart={() => {
          playClickSound();
          setIsQuoteDrawerOpen(true);
        }}
        onOpenAiHelper={() => {
          playChimeSound();
          handleOpenAiHelper();
        }}
        onOpenBookSurvey={() => {
          playClickSound();
          setIsBookSurveyOpen(true);
        }}
        onOpenContact={() => {
          const el = document.getElementById("about-us");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        onNavigate={(sectionId) => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1">
        {/* Dynamic Dual-Mode Hero */}
        <Hero
          onOpenAiHelper={handleOpenAiHelper}
          onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
        />

        {/* Site Building & Civil Construction Section */}
        <SiteBuildingSection
          onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
          onOpenAiHelper={handleOpenAiHelper}
        />

        {/* Bespoke Furniture Catalog & Showroom Section */}
        <FurnitureStoreSection
          onAddToCart={handleAddToCart}
          onOpenAiHelper={handleOpenAiHelper}
          onOpenProductModal={(product) => setActiveProductModal(product)}
        />

        {/* Interactive Cost & BOQ Estimator */}
        <CostEstimatorSection
          onOpenAiHelper={handleOpenAiHelper}
          onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
        />

        {/* Real Construction & Carpentry Video Gallery */}
        <VideoGallerySection
          onOpenAiHelper={handleOpenAiHelper}
          onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
        />

        {/* Completed Projects Showcase */}
        <ProjectsPortfolioSection
          onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
          onOpenAiHelper={handleOpenAiHelper}
        />

        {/* Credentials, Contacts & Direct Message */}
        <AboutAndContactSection
          onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
          onOpenAiHelper={handleOpenAiHelper}
        />
      </main>

      {/* Global Footer */}
      <Footer
        onOpenAiHelper={handleOpenAiHelper}
        onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
        onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Floating Action Shortcuts */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 items-end">
        {/* Floating WhatsApp Quick Connect */}
        <a
          href="https://wa.me/256742644200?text=Hello%20Yingo%20Contractors,%20I%20am%20inquiring%20about%20site%20building%20and%20furniture."
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClickSound}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-black/10 hover:scale-105 transition-all group relative border-2 border-emerald-400/50"
          title="Chat with Yingo Contractors on WhatsApp (+256 742 644200)"
        >
          <Phone className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-white/95 text-zinc-900 text-xs font-mono px-2.5 py-1 rounded-sm border border-zinc-200 shadow-xl shadow-black/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            WhatsApp: 0742 644200
          </span>
        </a>

        {/* Floating AI Helper Button */}
        <button
          id="btn-floating-ai-helper"
          onClick={() => {
            playChimeSound();
            handleOpenAiHelper();
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-800 text-white flex items-center justify-center shadow-2xl shadow-black/10 hover:scale-105 transition-all group relative border-2 border-amber-300"
          title="Talk to Yingo AI Engineering & Carpentry Assistant"
        >
          <Sparkles className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-950 animate-pulse" />
          <span className="absolute right-full mr-3 bg-white/95 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-sm border border-zinc-200 shadow-xl shadow-black/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Yingo AI Assistant</span>
          </span>
        </button>
      </div>

      {/* Interactive Modals & Drawers */}
      <AiHelperModal
        isOpen={isAiHelperOpen}
        onClose={() => setIsAiHelperOpen(false)}
        initialPrompt={aiHelperInitialPrompt}
        onOpenBookSurvey={() => setIsBookSurveyOpen(true)}
        onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
      />

      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        customSiteEstimate={customSiteEstimate}
        onClearEstimate={() => setCustomSiteEstimate(null)}
      />

      <BookSurveyModal
        isOpen={isBookSurveyOpen}
        onClose={() => setIsBookSurveyOpen(false)}
      />

      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
        onOpenAiHelper={handleOpenAiHelper}
      />
    </div>
  );
}
