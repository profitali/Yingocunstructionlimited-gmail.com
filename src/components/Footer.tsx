import React from "react";
import { 
  Building, 
  Hammer, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  ArrowUp, 
  Volume2, 
  VolumeX, 
  ShieldCheck
} from "lucide-react";
import { playClickSound, playChimeSound } from "../utils/sound";

interface FooterProps {
  onOpenAiHelper: (prompt?: string) => void;
  onOpenBookSurvey: () => void;
  onOpenQuoteDrawer: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAiHelper,
  onOpenBookSurvey,
  onOpenQuoteDrawer,
  soundEnabled,
  onToggleSound,
}) => {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 text-zinc-500 text-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-4 px-4 font-semibold text-center text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              <strong>Ready to Start Your Construction or Custom Furniture Project?</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:0742644200"
              onClick={playClickSound}
              className="px-4 py-1.5 rounded-sm bg-zinc-50 text-amber-600 text-xs font-mono font-bold hover:bg-white transition-colors"
            >
              Call 0742 644200
            </a>
            <button
              onClick={() => {
                playChimeSound();
                onOpenBookSurvey();
              }}
              className="px-4 py-1.5 rounded-sm bg-white text-black text-xs font-bold hover:bg-zinc-100 transition-colors"
            >
              Schedule Survey
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                Y
              </div>
              <div>
                <span className="text-lg font-bold text-black tracking-wider block">
                  YINGO CONTRACTORS
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-600">
                  Yingo Construction Limited
                </span>
              </div>
            </div>

            <p className="text-zinc-500 leading-relaxed text-xs max-w-sm">
              Premier general building contractor and artisan hardwood joinery studio serving all regions of Uganda (Central, Western, Eastern, and Northern). Specializing in turnkey residential &amp; commercial site construction, foundation engineering, and bespoke solid wood furniture building and direct sales.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Postal Address: <strong>216327 Kampala GPO, Uganda</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="tel:0742644200" className="hover:text-amber-600 font-mono font-bold">
                  0742 644200 (Hotline &amp; WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="mailto:yingocunstructionlimited@gmail.com" className="hover:text-amber-600">
                  yingocunstructionlimited@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links: Site Building */}
          <div>
            <h4 className="text-black font-bold text-xs uppercase font-mono tracking-wider mb-3">
              Site Building
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#site-building" onClick={playClickSound} className="hover:text-amber-600">
                  Residential Villas
                </a>
              </li>
              <li>
                <a href="#site-building" onClick={playClickSound} className="hover:text-amber-600">
                  Commercial Complexes
                </a>
              </li>
              <li>
                <a href="#site-building" onClick={playClickSound} className="hover:text-amber-600">
                  Deep Foundations &amp; Piling
                </a>
              </li>
              <li>
                <a href="#site-building" onClick={playClickSound} className="hover:text-amber-600">
                  Structural Steel Works
                </a>
              </li>
              <li>
                <a href="#site-building" onClick={playClickSound} className="hover:text-amber-600">
                  Roofing Trusses &amp; Tiles
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenBookSurvey();
                  }}
                  className="text-amber-600 hover:underline text-left font-semibold"
                >
                  Book Site Inspection &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Furniture Studio */}
          <div>
            <h4 className="text-black font-bold text-xs uppercase font-mono tracking-wider mb-3">
              Hardwood Furniture
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#furniture-catalog" onClick={playClickSound} className="hover:text-amber-600">
                  Mvule Dining Suites
                </a>
              </li>
              <li>
                <a href="#furniture-catalog" onClick={playClickSound} className="hover:text-amber-600">
                  Executive Office Desks
                </a>
              </li>
              <li>
                <a href="#furniture-catalog" onClick={playClickSound} className="hover:text-amber-600">
                  Platform Bed Suites
                </a>
              </li>
              <li>
                <a href="#furniture-catalog" onClick={playClickSound} className="hover:text-amber-600">
                  Fitted Wardrobes &amp; Kitchens
                </a>
              </li>
              <li>
                <a href="#furniture-catalog" onClick={playClickSound} className="hover:text-amber-600">
                  Outdoor Teak Furniture
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenQuoteDrawer();
                  }}
                  className="text-amber-600 hover:underline text-left font-semibold"
                >
                  View Quote Basket &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: AI & Media */}
          <div>
            <h4 className="text-black font-bold text-xs uppercase font-mono tracking-wider mb-3">
              Interactive Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    playChimeSound();
                    onOpenAiHelper();
                  }}
                  className="text-amber-600 hover:underline flex items-center gap-1 font-semibold text-left"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch AI Helper</span>
                </button>
              </li>
              <li>
                <a href="#cost-estimator" onClick={playClickSound} className="hover:text-amber-600">
                  Cost Estimator (UGX/USD)
                </a>
              </li>
              <li>
                <a href="#video-showcase" onClick={playClickSound} className="hover:text-amber-600">
                  Watch Construction Videos
                </a>
              </li>
              <li>
                <a href="#projects-portfolio" onClick={playClickSound} className="hover:text-amber-600">
                  Completed Projects
                </a>
              </li>
              <li>
                <a href="#about-us" onClick={playClickSound} className="hover:text-amber-600">
                  Company Background
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onToggleSound}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-black"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>UI Audio Feedback: {soundEnabled ? "ON" : "OFF"}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-zinc-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Yingo Contractors (Yingo Construction Limited). All rights reserved. 
            <span className="block sm:inline sm:ml-2 text-zinc-500">
              Address: 216327 Kampala GPO • Contact: 0742 644200 • yingocunstructionlimited@gmail.com
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-amber-600 transition-colors p-2 rounded-sm bg-white border border-zinc-200"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
