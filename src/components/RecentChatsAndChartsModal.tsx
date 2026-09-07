import React, { useState } from "react";
import { 
  History, 
  BarChart3, 
  X, 
  MessageSquare, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Building, 
  Hammer, 
  Sliders,
  DollarSign,
  Layers,
  Sparkles
} from "lucide-react";
import { ChatSession } from "../types";
import { playClickSound, playChimeSound } from "../utils/sound";

interface RecentChatsAndChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onInsertChartData: (chartSummary: string) => void;
}

export const RecentChatsAndChartsModal: React.FC<RecentChatsAndChartsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onInsertChartData,
}) => {
  const [activeTab, setActiveTab] = useState<"history" | "charts">("history");
  
  // Interactive Chart State for Cost Estimator
  const [villaAreaSqM, setVillaAreaSqM] = useState<number>(250);
  const [buildingStandard, setBuildingStandard] = useState<"standard" | "premium" | "luxury">("premium");

  if (!isOpen) return null;

  // Rate calculations
  const ratesUGX = {
    standard: 1100000,
    premium: 1650000,
    luxury: 2200000,
  };

  const currentRateUGX = ratesUGX[buildingStandard];
  const totalCostUGX = villaAreaSqM * currentRateUGX;
  const totalCostUSD = Math.round(totalCostUGX / 3750);

  // Construction cost breakdown percentages
  const breakdown = [
    { stage: "Substructure & Excavation in Red Clay", pct: 22, color: "bg-black", note: "Excavation, DPC, strip footings & termite protection" },
    { stage: "Reinforced Concrete Frame & Walls", pct: 32, color: "bg-blue-500", note: "BS 4449 TMT rebar, C25 columns, ring beams & masonry" },
    { stage: "Roofing, Trusses & Standing Seam", pct: 18, color: "bg-emerald-500", note: "Engineered timber/steel trusses & clay/stone metal tiles" },
    { stage: "Solid Mvule/Hardwood Joinery & Finishes", pct: 18, color: "bg-amber-400", note: "Bespoke doors, frames, kitchen cabinetry & wardrobes" },
    { stage: "MEP (Electrical & Plumbing Services)", pct: 10, color: "bg-purple-500", note: "Conduit piping, 3-phase DB, sanitaryware & drainage" },
  ];

  const handleApplyChartToChat = () => {
    playClickSound();
    const summary = `📊 **PROJECT COST & STAGE BREAKDOWN CHART REQUEST**
• Target Floor Area: ${villaAreaSqM} m² (${buildingStandard.toUpperCase()} Turnkey Specification)
• Estimated Project Total: UGX ${totalCostUGX.toLocaleString()} (~$${totalCostUSD.toLocaleString()} USD)
• Stage Allocations:
  - Substructure & Ground Foundation: UGX ${Math.round(totalCostUGX * 0.22).toLocaleString()} (22%)
  - Concrete Framing & Superstructure: UGX ${Math.round(totalCostUGX * 0.32).toLocaleString()} (32%)
  - Roofing Structure & Cladding: UGX ${Math.round(totalCostUGX * 0.18).toLocaleString()} (18%)
  - Hardwood Architectural Joinery: UGX ${Math.round(totalCostUGX * 0.18).toLocaleString()} (18%)
  - MEP Services & Piping: UGX ${Math.round(totalCostUGX * 0.10).toLocaleString()} (10%)

Please provide engineering site advice, milestone mobilization timeline, and current material rates across Uganda.`;

    onInsertChartData(summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-100/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-50 border border-zinc-200 rounded-none w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-black/10 overflow-hidden">
        {/* Header with Navigation Tabs */}
        <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("history");
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "history"
                  ? "bg-black text-white shadow"
                  : "bg-zinc-100 text-zinc-500 hover:text-black"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Recent Consultations ({sessions.length})</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setActiveTab("charts");
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "charts"
                  ? "bg-black text-white shadow"
                  : "bg-zinc-100 text-zinc-500 hover:text-black"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cost &amp; Project Charts</span>
            </button>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-500 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === "history" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <p className="text-xs text-zinc-500">
                  Select a previous consultation thread or start a fresh inquiry:
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    onNewSession();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-sm bg-black/15 hover:bg-black/25 border border-amber-500/30 text-amber-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Chat</span>
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs">No saved chat sessions yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.map((session) => {
                    const isCurrent = session.id === currentSessionId;
                    const messageCount = session.messages.length;
                    const lastMessage = session.messages[session.messages.length - 1];

                    return (
                      <div
                        key={session.id}
                        className={`p-3.5 rounded-sm border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? "bg-black/10 border-amber-500/40"
                            : "bg-white/60 border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div
                          onClick={() => {
                            playClickSound();
                            onSelectSession(session.id);
                            onClose();
                          }}
                          className="flex-1 cursor-pointer min-w-0"
                        >
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-black truncate">
                              {session.title}
                            </h4>
                            {isCurrent && (
                              <span className="text-[9px] font-mono bg-black text-white font-bold px-1.5 py-0.2 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                            {lastMessage ? lastMessage.content.slice(0, 90) : "Consultation in progress..."}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(session.updatedAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{messageCount} message{messageCount !== 1 ? "s" : ""}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              playClickSound();
                              onSelectSession(session.id);
                              onClose();
                            }}
                            className="p-2 rounded-sm bg-zinc-100 hover:bg-black hover:text-white text-zinc-600 transition-colors"
                            title="Open Chat"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          {sessions.length > 1 && (
                            <button
                              onClick={() => {
                                playClickSound();
                                onDeleteSession(session.id);
                              }}
                              className="p-2 rounded-sm bg-zinc-100/80 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                              title="Delete Session"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Visual Charts & Cost Breakdown View */
            <div className="space-y-6">
              {/* Interactive Construction Estimator */}
              <div className="bg-white border border-zinc-200 rounded-sm p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-black flex items-center gap-2">
                      <Building className="w-4 h-4 text-amber-600" />
                      Interactive Ugandan Building Cost Estimator
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Based on current 2024–2026 material and labor indices across Uganda
                    </p>
                  </div>

                  <div className="flex rounded-sm bg-zinc-50 p-1 border border-zinc-200">
                    {(["standard", "premium", "luxury"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          playClickSound();
                          setBuildingStandard(lvl);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono capitalize transition-colors ${
                          buildingStandard === lvl
                            ? "bg-black text-white font-bold"
                            : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider for area */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Total Built Footprint:</span>
                    <span className="font-mono text-amber-600 font-bold">{villaAreaSqM} m² (~{(villaAreaSqM * 10.76).toFixed(0)} sq ft)</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="600"
                    step="10"
                    value={villaAreaSqM}
                    onChange={(e) => setVillaAreaSqM(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-50 rounded-sm appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>80 m² (Bungalow)</span>
                    <span>250 m² (Standard Villa)</span>
                    <span>600 m² (Grand Estate)</span>
                  </div>
                </div>

                {/* Calculated Result Card */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wide text-zinc-500">
                      Estimated Turnkey Budget
                    </span>
                    <div className="text-lg sm:text-xl font-mono font-extrabold text-black">
                      UGX {totalCostUGX.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500">International Reference:</span>
                    <div className="text-sm font-mono font-bold text-amber-600">
                      ~${totalCostUSD.toLocaleString()} USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Breakdown Bars */}
              <div className="bg-white border border-zinc-200 rounded-sm p-4 space-y-3">
                <h5 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wide">
                  Stage Allocation &amp; Material Chart
                </h5>

                {/* Segmented Bar */}
                <div className="h-4 w-full bg-zinc-50 rounded-full overflow-hidden flex border border-zinc-200">
                  {breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${item.pct}%` }}
                      className={`${item.color} h-full transition-all duration-500`}
                      title={`${item.stage}: ${item.pct}%`}
                    />
                  ))}
                </div>

                {/* Detailed Stage Rows */}
                <div className="space-y-2 pt-2">
                  {breakdown.map((item, idx) => {
                    const stageCostUGX = Math.round((totalCostUGX * item.pct) / 100);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 rounded-sm bg-zinc-50/60 border border-zinc-200/80"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                          <div className="truncate">
                            <span className="font-semibold text-zinc-900">{item.stage}</span>
                            <span className="text-[10px] text-zinc-500 block truncate">{item.note}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-2 font-mono">
                          <span className="text-black font-bold">{item.pct}%</span>
                          <span className="text-[10px] text-zinc-500 block">UGX {stageCostUGX.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timber Species Comparison Chart */}
              <div className="bg-white border border-zinc-200 rounded-sm p-4 space-y-3">
                <h5 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wide flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-amber-600" />
                  Hardwood Joinery &amp; Timber Lifespan Matrix
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-sm bg-zinc-50 border border-amber-500/30">
                    <div className="flex justify-between font-bold text-amber-600">
                      <span>Ugandan Mvule (African Teak)</span>
                      <span className="font-mono">Premium Grade</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Naturally impervious to termites &amp; rot. Moisture seasoned to 12%. 60+ year durability.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-sm bg-zinc-50 border border-zinc-200">
                    <div className="flex justify-between font-bold text-zinc-900">
                      <span>East African Mahogany</span>
                      <span className="font-mono text-emerald-400">High Value</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Rich lustrous reddish grain, highly stable for interior doors, cabinetry, and dining suites.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleApplyChartToChat}
                  className="w-full py-2.5 px-4 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Send This Chart Breakdown to AI Engineer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
