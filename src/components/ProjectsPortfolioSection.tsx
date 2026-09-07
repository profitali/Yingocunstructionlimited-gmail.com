import React, { useState } from "react";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Ruler, 
  CheckCircle2, 
  Maximize2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { CONSTRUCTION_PROJECTS } from "../data/constructionData";
import { ConstructionProject } from "../types";
import { playClickSound, playChimeSound } from "../utils/sound";

interface ProjectsPortfolioSectionProps {
  onOpenBookSurvey: () => void;
  onOpenAiHelper: (prompt?: string) => void;
}

export const ProjectsPortfolioSection: React.FC<ProjectsPortfolioSectionProps> = ({
  onOpenBookSurvey,
  onOpenAiHelper,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProjectModal, setActiveProjectModal] = useState<ConstructionProject | null>(null);

  const categories = ["All", "Residential Villa", "Commercial Complex", "Structural Steel"];

  const filteredProjects = CONSTRUCTION_PROJECTS.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="projects-portfolio" className="py-20 px-4 bg-white/40 border-t border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 text-amber-600 text-xs font-bold tracking-wider uppercase mb-3 border border-amber-500/20">
              <Building className="w-3.5 h-3.5" />
              <span>Proven Track Record • Kampala &amp; Beyond</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Featured Construction &amp; Fit-Out Projects
            </h2>
            <p className="text-zinc-600 max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
              Explore our portfolio of completed turn-key villas, multi-storey commercial developments, 
              and custom timber fit-outs across Kampala, Wakiso, Entebbe, and Jinja.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-black text-white font-bold shadow"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                playClickSound();
                setActiveProjectModal(project);
              }}
              className="group cursor-pointer rounded-none bg-zinc-50 border border-zinc-200 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl shadow-black/10 hover:shadow-amber-500/5"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden bg-white">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-mono font-bold bg-black/90 text-white px-2.5 py-1 rounded-md shadow">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono bg-zinc-50/80 text-zinc-600 px-2.5 py-1 rounded-md border border-zinc-300 backdrop-blur-md">
                      {project.year}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-900">
                    <span className="flex items-center gap-1.5 bg-zinc-50/80 px-2.5 py-1 rounded-md border border-zinc-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1.5 bg-zinc-50/80 px-2.5 py-1 rounded-md border border-zinc-200 font-mono">
                      <Ruler className="w-3.5 h-3.5 text-amber-600" />
                      {project.areaSqMeters} m²
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black group-hover:text-amber-600 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                    {project.scope}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {project.keyHighlights.slice(0, 3).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">
                  Client: <strong className="text-zinc-600">{project.client}</strong>
                </span>
                <span className="text-amber-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Full Specs &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {activeProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-100/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-50 border border-zinc-200 rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl shadow-black/10">
              <div className="relative h-64 rounded-sm overflow-hidden mb-6">
                <img
                  src={activeProjectModal.image}
                  alt={activeProjectModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveProjectModal(null);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 text-zinc-900 hover:text-black flex items-center justify-center border border-zinc-300"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono text-amber-600 font-bold uppercase">
                    {activeProjectModal.category} • Handed Over {activeProjectModal.year}
                  </div>
                  <h3 className="text-2xl font-bold text-black mt-1">
                    {activeProjectModal.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs text-zinc-500 mt-2 font-mono">
                    <span>Location: {activeProjectModal.location}</span>
                    <span>Duration: {activeProjectModal.duration}</span>
                    <span>Area: {activeProjectModal.areaSqMeters} m²</span>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed">
                  {activeProjectModal.scope}
                </p>

                <div className="bg-white/80 p-4 rounded-sm border border-zinc-200">
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                    Key Engineering &amp; Woodwork Specifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-600">
                    {activeProjectModal.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200">
                  <button
                    onClick={() => {
                      playChimeSound();
                      setActiveProjectModal(null);
                      onOpenBookSurvey();
                    }}
                    className="flex-1 py-3 px-4 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-xs sm:text-sm text-center"
                  >
                    Schedule Survey for Similar Project
                  </button>
                  <button
                    onClick={() => {
                      playChimeSound();
                      const projName = activeProjectModal.title;
                      setActiveProjectModal(null);
                      onOpenAiHelper(`I am interested in the engineering details of "${projName}". How does Yingo Contractors execute such projects in Kampala?`);
                    }}
                    className="py-3 px-4 rounded-sm bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Ask AI About This Build</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
