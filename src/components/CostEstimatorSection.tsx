import React, { useState } from "react";
import { 
  Calculator, 
  Building, 
  Hammer, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Send,
  Info
} from "lucide-react";
import { playClickSound, playChimeSound, playWoodTapSound } from "../utils/sound";

interface CostEstimatorSectionProps {
  onOpenAiHelper: (prompt?: string) => void;
  onOpenQuoteWithDetails: (details: {
    type: "site_building" | "furniture_custom";
    estimatedTotalUGX: number;
    description: string;
  }) => void;
}

export const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({
  onOpenAiHelper,
  onOpenQuoteWithDetails,
}) => {
  const [calculatorMode, setCalculatorMode] = useState<"construction" | "furniture">("construction");

  // Construction State
  const [buildingType, setBuildingType] = useState<string>("villa");
  const [areaSqMeters, setAreaSqMeters] = useState<number>(250);
  const [finishLevel, setFinishLevel] = useState<"shell" | "standard" | "luxury">("standard");
  const [plotTerrain, setPlotTerrain] = useState<"flat" | "sloping">("flat");

  // Furniture Custom State
  const [furnitureType, setFurnitureType] = useState<string>("dining_table");
  const [timberChoice, setTimberChoice] = useState<string>("mvule");
  const [seaterCapacity, setSeaterCapacity] = useState<number>(8);
  const [finishType, setFinishType] = useState<string>("satin_oil");

  // Construction Rates (UGX per sqm based on Ugandan market realistic figures)
  const baseRatePerSqm = {
    bungalow: 950000,
    villa: 1350000,
    commercial: 1650000,
    warehouse: 850000,
    wall: 250000, // per meter run
  }[buildingType] || 1200000;

  const finishMultiplier = {
    shell: 0.7,
    standard: 1.0,
    luxury: 1.45,
  }[finishLevel];

  const terrainMultiplier = plotTerrain === "sloping" ? 1.15 : 1.0;

  const calculatedConstructionUGX = Math.round(areaSqMeters * baseRatePerSqm * finishMultiplier * terrainMultiplier);
  const calculatedConstructionUSD = Math.round(calculatedConstructionUGX / 3750);

  // Furniture Calculation
  const furnitureBaseCost = {
    dining_table: 3200000 + (seaterCapacity - 6) * 450000,
    boardroom_table: 4500000 + (seaterCapacity - 8) * 550000,
    bed_suite: 3500000,
    wardrobe_linear: 1200000 * Math.max(2, Math.round(seaterCapacity / 2)),
    kitchen_cabinet: 1400000 * Math.max(3, Math.round(seaterCapacity / 2)),
  }[furnitureType] || 3000000;

  const timberMultiplier = {
    mvule: 1.15,
    mahogany: 1.05,
    teak: 1.25,
    musizi: 0.9,
  }[timberChoice] || 1.0;

  const calculatedFurnitureUGX = Math.round(furnitureBaseCost * timberMultiplier);
  const calculatedFurnitureUSD = Math.round(calculatedFurnitureUGX / 3750);

  const handleApplyToQuote = () => {
    playChimeSound();
    if (calculatorMode === "construction") {
      onOpenQuoteWithDetails({
        type: "site_building",
        estimatedTotalUGX: calculatedConstructionUGX,
        description: `Construction estimate for ${buildingType.toUpperCase()} of ${areaSqMeters} m² (${finishLevel} finishes, ${plotTerrain} plot). Estimated: UGX ${calculatedConstructionUGX.toLocaleString()} ($${calculatedConstructionUSD.toLocaleString()})`,
      });
    } else {
      onOpenQuoteWithDetails({
        type: "furniture_custom",
        estimatedTotalUGX: calculatedFurnitureUGX,
        description: `Custom furniture estimate for ${furnitureType.replace("_", " ").toUpperCase()} in ${timberChoice.toUpperCase()} (${seaterCapacity} capacity/units). Estimated: UGX ${calculatedFurnitureUGX.toLocaleString()} ($${calculatedFurnitureUSD.toLocaleString()})`,
      });
    }
  };

  const handleAskAiAboutEstimate = () => {
    playChimeSound();
    if (calculatorMode === "construction") {
      onOpenAiHelper(
        `I am planning a ${buildingType} of ${areaSqMeters} square meters with ${finishLevel} finishes on a ${plotTerrain} plot in Uganda. The calculator gave approx UGX ${calculatedConstructionUGX.toLocaleString()}. Can you break down the foundation, superstructure, roofing, and schedule?`
      );
    } else {
      onOpenAiHelper(
        `I am calculating a custom ${furnitureType.replace("_", " ")} made of ${timberChoice} with capacity ${seaterCapacity}. The estimated cost is UGX ${calculatedFurnitureUGX.toLocaleString()}. What are the craftsmanship guarantees and delivery times across Uganda?`
      );
    }
  };

  return (
    <section id="cost-estimator" className="py-20 px-4 bg-zinc-50 border-t border-zinc-200/80">
      <div className="max-w-5xl mx-auto">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 text-amber-600 text-xs font-bold tracking-wider uppercase mb-3 border border-amber-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Project Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            Estimate Your Construction or Furniture Project
          </h2>
          <p className="text-zinc-600 mt-2 text-sm sm:text-base">
            Get instant transparent ballpark figures in Ugandan Shillings (UGX) and USD based on real Uganda engineering and joinery benchmarks.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-sm border border-zinc-200 flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setCalculatorMode("construction");
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-sm text-xs sm:text-sm font-bold transition-all ${
                calculatorMode === "construction"
                  ? "bg-black text-white shadow"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Building &amp; Civil Works</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setCalculatorMode("furniture");
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-sm text-xs sm:text-sm font-bold transition-all ${
                calculatorMode === "furniture"
                  ? "bg-black text-white shadow"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>Custom Hardwood Furniture</span>
            </button>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (7 cols) */}
          <div className="lg:col-span-7 rounded-none bg-white/70 border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xl shadow-black/5">
            {calculatorMode === "construction" ? (
              <>
                {/* Building Type */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 font-bold mb-2">
                    1. Select Structure Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "villa", label: "Multi-Storey Villa" },
                      { id: "bungalow", label: "Suburban Bungalow" },
                      { id: "commercial", label: "Commercial Plaza" },
                      { id: "warehouse", label: "Steel Warehouse" },
                      { id: "wall", label: "Boundary Wall" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playClickSound();
                          setBuildingType(item.id);
                        }}
                        className={`p-2.5 rounded-sm text-xs font-semibold text-left border transition-all ${
                          buildingType === item.id
                            ? "bg-black/20 border-amber-500/60 text-amber-600 font-bold"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Square Meters Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono uppercase text-zinc-500 font-bold">
                      2. Floor / Site Area (m²)
                    </label>
                    <span className="text-sm font-mono font-bold text-amber-600 bg-zinc-50 px-2.5 py-0.5 rounded border border-zinc-200">
                      {areaSqMeters} m² (~{(areaSqMeters * 10.764).toFixed(0)} sq ft)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1200}
                    step={10}
                    value={areaSqMeters}
                    onChange={(e) => setAreaSqMeters(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-50 rounded-sm"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                    <span>50 m² (Small)</span>
                    <span>300 m² (Standard)</span>
                    <span>1,200 m² (Estate/Commercial)</span>
                  </div>
                </div>

                {/* Finishing Quality */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 font-bold mb-2">
                    3. Finishing &amp; Material Standard
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "shell", label: "Shell Only", sub: "Walls, Roof & Slab" },
                      { id: "standard", label: "Standard Turnkey", sub: "Complete Ready-to-Live" },
                      { id: "luxury", label: "Executive Luxury", sub: "High-End Tile & Fittings" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playClickSound();
                          setFinishLevel(item.id as any);
                        }}
                        className={`p-3 rounded-sm text-left border transition-all ${
                          finishLevel === item.id
                            ? "bg-black/20 border-amber-500/60 text-amber-600 font-bold"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terrain Condition */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 font-bold mb-2">
                    4. Plot Slope / Foundation Condition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "flat", label: "Flat / Standard Firm Murram" },
                      { id: "sloping", label: "Steep Slope / Requires Retaining" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playClickSound();
                          setPlotTerrain(item.id as any);
                        }}
                        className={`p-2.5 rounded-sm text-xs font-medium border text-left transition-all ${
                          plotTerrain === item.id
                            ? "bg-black/20 border-amber-500/60 text-amber-600 font-bold"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Furniture Controls */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 font-bold mb-2">
                    1. Furniture Item Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "dining_table", label: "Dining Suite" },
                      { id: "boardroom_table", label: "Executive Boardroom" },
                      { id: "bed_suite", label: "Platform Bed Suite" },
                      { id: "wardrobe_linear", label: "Fitted Wardrobe" },
                      { id: "kitchen_cabinet", label: "Kitchen Island Cabinet" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playClickSound();
                          setFurnitureType(item.id);
                        }}
                        className={`p-2.5 rounded-sm text-xs font-semibold text-left border transition-all ${
                          furnitureType === item.id
                            ? "bg-black/20 border-amber-500/60 text-amber-600 font-bold"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timber Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 font-bold mb-2">
                    2. Wood Species (Kiln Seasoned)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "mvule", label: "Mvule (African Teak)", badge: "Most Durable" },
                      { id: "mahogany", label: "Ugandan Mahogany", badge: "Rich Grain" },
                      { id: "teak", label: "Plantation Teak", badge: "Equatorial Weather" },
                      { id: "musizi", label: "Musizi Hardwood", badge: "Eco-Grade" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playWoodTapSound();
                          setTimberChoice(item.id);
                        }}
                        className={`p-2.5 rounded-sm text-left border transition-all ${
                          timberChoice === item.id
                            ? "bg-black/20 border-amber-500/60 text-amber-600 font-bold"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[9px] text-amber-600/80 font-mono mt-0.5">{item.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity or Length */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono uppercase text-zinc-500 font-bold">
                      3. Seating Capacity / Meters
                    </label>
                    <span className="text-sm font-mono font-bold text-amber-600 bg-zinc-50 px-2.5 py-0.5 rounded border border-zinc-200">
                      {seaterCapacity} {furnitureType.includes("wardrobe") ? "Linear Meters" : "Persons / Units"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={16}
                    step={1}
                    value={seaterCapacity}
                    onChange={(e) => setSeaterCapacity(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-50 rounded-sm"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                    <span>4 (Compact)</span>
                    <span>8 (Standard)</span>
                    <span>16 (Boardroom / Large)</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Result Card (5 cols) */}
          <div className="lg:col-span-5 rounded-none bg-gradient-to-b from-white to-stone-50 border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs uppercase font-mono tracking-wider font-bold text-amber-600">
                  Estimated Project Total
                </span>
                <span className="text-[10px] font-mono bg-zinc-50 text-zinc-500 px-2 py-0.5 rounded border border-zinc-200">
                  Uganda Benchmark
                </span>
              </div>

              {/* Huge Price Display */}
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-amber-600 font-mono tracking-tight">
                  UGX {(calculatorMode === "construction" ? calculatedConstructionUGX : calculatedFurnitureUGX).toLocaleString()}
                </div>
                <div className="text-sm font-mono text-zinc-500 mt-1">
                  Approx. ${(calculatorMode === "construction" ? calculatedConstructionUSD : calculatedFurnitureUSD).toLocaleString()} USD
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-3 mb-6 bg-zinc-50/80 p-4 rounded-sm border border-zinc-200">
                <div className="text-xs font-bold text-zinc-600 mb-2">Cost Distribution:</div>
                {calculatorMode === "construction" ? (
                  <>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Foundation &amp; Substructure</span>
                      <span className="font-mono text-zinc-900">25%</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Reinforced Concrete Frame &amp; Walls</span>
                      <span className="font-mono text-zinc-900">35%</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Roofing, Trusses &amp; Gutters</span>
                      <span className="font-mono text-zinc-900">18%</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Finishes, Tiling &amp; MEP</span>
                      <span className="font-mono text-zinc-900">22%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Seasoned Hardwood Timber Material</span>
                      <span className="font-mono text-zinc-900">45%</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Master Joinery &amp; Planar Crafting</span>
                      <span className="font-mono text-zinc-900">35%</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Multi-Layer Protective Finish &amp; Seal</span>
                      <span className="font-mono text-zinc-900">20%</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-start gap-2 text-[11px] text-zinc-500 mb-6">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Final quote will be finalized after on-site inspection, architectural drawing analysis, and customized material specification.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                id="btn-apply-estimator-quote"
                onClick={handleApplyToQuote}
                className="w-full py-3 px-4 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Lock In Estimate &amp; Request BOQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleAskAiAboutEstimate}
                className="w-full py-2.5 px-4 rounded-sm bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Discuss Calculation with AI Helper</span>
              </button>

              <a
                href={`https://wa.me/256742644200?text=Hello%20Yingo%20Contractors,%20I%20used%20your%20estimator%20and%20got%20an%20estimate%20of%20UGX%20${(calculatorMode === "construction" ? calculatedConstructionUGX : calculatedFurnitureUGX).toLocaleString()}%20for%20my%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="w-full py-2.5 px-4 rounded-sm bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Send Estimate via WhatsApp (0742 644200)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
