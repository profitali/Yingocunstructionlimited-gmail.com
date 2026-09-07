import React from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Home, 
  ShieldAlert, 
  Tractor, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Phone, 
  ArrowRight,
  HardHat,
  Ruler
} from "lucide-react";
import { CONSTRUCTION_SERVICES } from "../data/constructionData";
import { playClickSound, playChimeSound } from "../utils/sound";

interface SiteBuildingSectionProps {
  onOpenBookSurvey: () => void;
  onOpenAiHelper: (prompt?: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const SiteBuildingSection: React.FC<SiteBuildingSectionProps> = ({
  onOpenBookSurvey,
  onOpenAiHelper,
  onNavigate,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Home": return <Home className="w-5 h-5 text-amber-600" />;
      case "Building2": return <Building2 className="w-5 h-5 text-amber-600" />;
      case "Tractor": return <Tractor className="w-5 h-5 text-amber-600" />;
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      default: return <HardHat className="w-5 h-5 text-amber-600" />;
    }
  };

  const workflowSteps = [
    {
      step: "01",
      title: "Site Survey & Soil Assessment",
      desc: "Topographical surveying, soil bearing capacity tests across Uganda (Central, Western, Eastern & Northern), and boundary verification."
    },
    {
      step: "02",
      title: "Architectural & BOQ Pricing",
      desc: "Structural calculations, BS 8110 concrete design, and a fully itemized transparent Bill of Quantities in UGX."
    },
    {
      step: "03",
      title: "Foundation & Superstructure",
      desc: "Engineered strip, pad, or raft foundations with DPC membranes, vibrated C25/C30 concrete, and high-yield rebar."
    },
    {
      step: "04",
      title: "Roofing, Finishes & Handover",
      desc: "Fabricated structural steel trusses, certified electrical/plumbing conduits, flawless tiling, and lifetime warranty."
    }
  ];

  return (
    <section id="site-building" className="py-20 px-4 bg-white/40 border-t border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 text-amber-600 text-xs font-bold tracking-wider uppercase mb-3 border border-amber-500/20">
              <HardHat className="w-3.5 h-3.5" />
              <span>Civil &amp; Architectural Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Turnkey Site Building Across Uganda
            </h2>
            <p className="text-zinc-600 max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
              From residential homes and hillside villas to commercial plazas, boundary walls, and heavy steel warehouses. 
              Delivered with strict engineering compliance, high-grade materials, and on-schedule execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-site-book-survey"
              onClick={() => {
                playChimeSound();
                onOpenBookSurvey();
              }}
              className="px-5 py-2.5 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Site Survey</span>
            </button>
            <button
              id="btn-site-ask-ai"
              onClick={() => {
                playChimeSound();
                onOpenAiHelper("I need advice on site building in Uganda. What are the foundation requirements and cost breakdown per square meter?");
              }}
              className="px-4 py-2.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-900 border border-zinc-300 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Ask Construction AI</span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {CONSTRUCTION_SERVICES.map((service, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={service.id}
              className="group rounded-none bg-zinc-50 border-none overflow-hidden shadow-xl shadow-black/5 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl shadow-black/10 hover:shadow-amber-500/5 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/40 to-transparent" />
                <div className="absolute top-4 left-4 p-2.5 rounded-sm bg-zinc-50/90 border border-zinc-300 backdrop-blur-md">
                  {getIcon(service.icon)}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 bg-zinc-50/90 px-3 py-1 rounded-md border border-zinc-200">
                    {service.startingPriceUGX}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black group-hover:text-amber-600 transition-colors mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-amber-600/80 mb-3 font-mono">
                    {service.subtitle}
                  </p>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      playChimeSound();
                      onOpenBookSurvey();
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Request BOQ for this service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="tel:0742644200"
                    onClick={playClickSound}
                    className="text-xs font-mono text-zinc-500 hover:text-black flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>0742 644200</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* All Uganda Soil & Terrain Engineering Card */}
        <div className="rounded-none bg-gradient-to-r from-white to-stone-50 border border-amber-500/20 p-6 sm:p-8 mb-16 shadow-xl shadow-black/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                <Ruler className="w-4 h-4" />
                <span>All-Uganda Terrain &amp; Soil Engineering</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                Overcoming Murram, Red Clay, Slopes &amp; Low-Lying Sites Across Uganda
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Building in Uganda requires specialized geological insight. From steep hillside retaining walls in Kampala, 
                Kabale, and Fort Portal to expansive clays in Eastern Uganda and lakeside soils in Entebbe and Jinja, Yingo Contractors employs 
                proven stepped footings, French subsoil drains, raft slabs, and certified high-yield rebar reinforcement to guarantee structural stability.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => {
                  playClickSound();
                  onNavigate("cost-estimator");
                }}
                className="px-6 py-4 rounded-none uppercase tracking-widest text-[11px] bg-black hover:bg-amber-600 text-white font-bold text-sm text-center transition-all shadow"
              >
                Estimate Site Costs (UGX)
              </button>
              <button
                onClick={() => {
                  playChimeSound();
                  onOpenAiHelper("How should I plan a foundation on a sloping plot or difficult terrain in Uganda? What retaining walls or deep footings are required?");
                }}
                className="px-4 py-3 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-900 border border-zinc-300 font-semibold text-sm text-center transition-colors"
              >
                Consult on Plot Terrain
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Construction Workflow */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-black tracking-tight">Our Structured Construction Lifecycle</h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              From contract signing to final key handover, every milestone is verified with daily site logs and engineer sign-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step) => (
              <div key={step.step} className="p-5 rounded-sm bg-zinc-50 border border-zinc-200 relative group hover:border-amber-500/40 transition-colors">
                <span className="text-3xl font-bold text-amber-600/20 group-hover:text-amber-600/40 transition-colors font-mono">
                  {step.step}
                </span>
                <h4 className="text-base font-bold text-black mt-2 mb-1">{step.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
