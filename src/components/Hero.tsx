import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building, 
  Hammer, 
  Sparkles, 
  Phone, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck,
  Play
} from "lucide-react";
import { playClickSound, playChimeSound } from "../utils/sound";
import { COMPANY_STATS } from "../data/constructionData";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenAiHelper: (prompt?: string) => void;
  onOpenBookSurvey: () => void;
  onOpenVideoModal?: (videoId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenAiHelper,
  onOpenBookSurvey,
  onOpenVideoModal,
}) => {
  const [activeTab, setActiveTab] = useState<"site" | "furniture">("site");

  const handleTabChange = (tab: "site" | "furniture") => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-16 px-4 bg-zinc-50">
      {/* Background Media with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={
            activeTab === "site"
              ? "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=2000&q=85"
              : "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=2000&q=85"
          }
          alt="Yingo Contractors Kampala"
          className="w-full h-full object-cover object-center transition-all duration-[20s] ease-in-out transform scale-110 opacity-30 grayscale brightness-75 hover:scale-105 hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/85 to-stone-50/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-amber-500/30 text-amber-600 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Yingo Construction Limited • 216327 Kampala GPO</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/80 border border-zinc-300 text-zinc-600 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Serving All of Uganda • Central, Western, Eastern &amp; Northern</span>
          </div>
        </div>

        {/* Dynamic Dual Category Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 p-1.5 rounded-sm border border-zinc-200 flex items-center gap-2 shadow-2xl shadow-black/10">
            <button
              id="btn-hero-tab-site"
              onClick={() => handleTabChange("site")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-bold transition-all ${
                activeTab === "site"
                  ? "bg-black text-white shadow-lg shadow-amber-500/25"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-100"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Site Building & Civil Works</span>
            </button>
            <button
              id="btn-hero-tab-furniture"
              onClick={() => handleTabChange("furniture")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-bold transition-all ${
                activeTab === "furniture"
                  ? "bg-black text-white shadow-lg shadow-amber-500/25"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-100"
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>Bespoke Hardwood Furniture</span>
            </button>
          </div>
        </div>

        {/* Main Headline & Value Proposition */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          {activeTab === "site" ? (
            <>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-semibold tracking-tight text-black tracking-tight leading-[1.1] mb-6">
                Engineered Site Building <br className="hidden sm:inline" />
                <span className="text-amber-600 font-serif">
                  Built for Lifetimes in Uganda
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Full site building, excavation, soil engineering, structural concrete, and turnkey residential &amp; commercial construction mobilized across all districts of Uganda. Supervised by certified engineers with transparent BOQs.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-semibold tracking-tight text-black tracking-tight leading-[1.1] mb-6">
                Master Woodworking &amp; <br className="hidden sm:inline" />
                <span className="text-amber-600 font-serif">
                  Handcrafted Solid Furniture
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Seasoned Ugandan Mvule, Teak, and African Mahogany crafted into bespoke dining suites, 
                executive boardroom tables, built-in kitchen cabinetry, and luxury bedroom sets. Buy directly online or order custom sizes with secure delivery across all of Uganda.
              </p>
            </>
          )}

          {/* Interactive CTAs */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
            {activeTab === "site" ? (
              <>
                <button
                  id="btn-hero-book-survey"
                  onClick={() => {
                    playChimeSound();
                    onOpenBookSurvey();
                  }}
                  className="px-8 py-4 rounded-none bg-black hover:bg-amber-600 text-white font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"
                >
                  <Building className="w-5 h-5" />
                  <span>Book Site Survey &amp; BOQ</span>
                </button>
                <button
                  id="btn-hero-calc-cost"
                  onClick={() => {
                    playClickSound();
                    onNavigate("cost-estimator");
                  }}
                  className="px-8 py-4 rounded-none bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"
                >
                  <Calculator className="w-5 h-5 text-amber-600" />
                  <span>Calculate Building Cost (UGX)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="btn-hero-explore-catalog"
                  onClick={() => {
                    playClickSound();
                    onNavigate("furniture-catalog");
                  }}
                  className="px-8 py-4 rounded-none bg-black hover:bg-amber-600 text-white font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"
                >
                  <Hammer className="w-5 h-5" />
                  <span>Explore Furniture Store</span>
                </button>
                <button
                  id="btn-hero-custom-order"
                  onClick={() => {
                    playChimeSound();
                    onOpenAiHelper("I want to order custom hardwood furniture with delivery in Uganda. Can you guide me on Mvule/Teak options, dimensions, and prices?");
                  }}
                  className="px-8 py-4 rounded-none bg-white hover:bg-black hover:text-white text-black border-2 border-black font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>AI Custom Furniture Design</span>
                </button>
              </>
            )}

            {/* Direct Calling Hotline */}
            <a
              id="btn-hero-call"
              href="tel:0742644200"
              onClick={playClickSound}
              className="px-6 py-4 rounded-none bg-zinc-900 hover:bg-emerald-600 text-white font-bold tracking-widest uppercase text-[11px] flex items-center gap-2 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>0742 644200</span>
            </a>

            {/* Watch Us Build Video Button */}
            {onOpenVideoModal && (
              <button
                id="btn-hero-watch-video"
                onClick={() => {
                  playClickSound();
                  onOpenVideoModal();
                }}
                className="px-4 py-3.5 rounded-sm bg-white/80 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 text-amber-600 fill-amber-400" />
                <span>Watch Video</span>
              </button>
            )}
          </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 pt-10 border-t border-zinc-200/50"
        >
          <div className="p-3.5 rounded-sm bg-white/60 border border-zinc-200/80 backdrop-blur-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Site Supervision</h4>
              <p className="text-[11px] text-zinc-500 leading-tight">Strict quality control on every foundation pour</p>
            </div>
          </div>
          <div className="p-3.5 rounded-sm bg-white/60 border border-zinc-200/80 backdrop-blur-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Solid Mvule &amp; Teak</h4>
              <p className="text-[11px] text-zinc-500 leading-tight">Kiln-seasoned hardwood with zero termite risk</p>
            </div>
          </div>
          <div className="p-3.5 rounded-sm bg-white/60 border border-zinc-200/80 backdrop-blur-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Accurate BOQs</h4>
              <p className="text-[11px] text-zinc-500 leading-tight">Transparent pricing in UGX &amp; USD with no hidden cuts</p>
            </div>
          </div>
          <div className="p-3.5 rounded-sm bg-white/60 border border-zinc-200/80 backdrop-blur-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-zinc-900">Direct Delivery</h4>
              <p className="text-[11px] text-zinc-500 leading-tight">Handled delivery &amp; on-site installation across Uganda</p>
            </div>
          </div>
        </motion.div>

        {/* Live Company Stats Strip */}
        <div className="border-t border-zinc-200/80 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {COMPANY_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight font-mono">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-900">
                {stat.label}
              </div>
              <div className="text-[11px] text-zinc-500">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
