import { motion } from "motion/react";
import React, { useState } from "react";
import { 
  Hammer, 
  Search, 
  Filter, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Star, 
  SlidersHorizontal, 
  Maximize2, 
  ArrowRight, 
  Phone,
  Layers,
  Ruler,
  Clock
} from "lucide-react";
import { FurnitureProduct, CartItem } from "../types";
import { FURNITURE_PRODUCTS } from "../data/furnitureData";
import { playClickSound, playChimeSound, playWoodTapSound } from "../utils/sound";

interface FurnitureStoreSectionProps {
  onAddToCart: (product: FurnitureProduct, quantity?: number, customNotes?: string) => void;
  onOpenAiHelper: (prompt?: string) => void;
  onOpenProductModal: (product: FurnitureProduct) => void;
}

export const FurnitureStoreSection: React.FC<FurnitureStoreSectionProps> = ({
  onAddToCart,
  onOpenAiHelper,
  onOpenProductModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimber, setSelectedTimber] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currency, setCurrency] = useState<"UGX" | "USD">("UGX");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "dining", label: "Dining Suites" },
    { id: "office", label: "Executive Office" },
    { id: "living", label: "Living & Media" },
    { id: "bedroom", label: "Bedrooms & Beds" },
    { id: "kitchen", label: "Kitchen & Islands" },
    { id: "outdoor", label: "Outdoor Teak" },
  ];

  const timberTypes = [
    { id: "all", label: "All Timbers" },
    { id: "Mvule (African Teak)", label: "Solid Mvule" },
    { id: "Ugandan Mahogany", label: "Mahogany" },
    { id: "Plantation Teak", label: "Teak" },
    { id: "Steel & Hardwood Hybrid", label: "Steel Hybrid" },
  ];

  const filteredProducts = FURNITURE_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesTimber = selectedTimber === "all" || product.timber === selectedTimber;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.timber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTimber && matchesSearch;
  });

  const handleAddToCart = (product: FurnitureProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    playWoodTapSound();
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const formatPrice = (ugx: number, usd: number) => {
    if (currency === "USD") {
      return `$${usd.toLocaleString()}`;
    }
    return `UGX ${ugx.toLocaleString()}`;
  };

  return (
    <section id="furniture-catalog" className="py-20 px-4 bg-zinc-50">
      <div className="max-w-6xl mx-auto">
        {/* Header with Title & Value Highlights */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 text-amber-600 text-xs font-bold tracking-wider uppercase mb-3 border border-amber-500/20">
              <Hammer className="w-3.5 h-3.5" />
              <span>Yingo Master Woodworking Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Handcrafted Solid Hardwood Furniture
            </h2>
            <p className="text-zinc-600 max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
              Every table, desk, and cabinetry piece is handcrafted in our specialized joinery studio using kiln-seasoned Ugandan Mvule, 
              Mahogany, and Plantation Teak. Built with traditional mortise-and-tenon joints, sold directly, and delivered nationwide across Uganda.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-sm border border-zinc-200 self-start md:self-end">
            <span className="text-xs text-zinc-500 px-2 font-mono">Currency:</span>
            <button
              id="btn-currency-ugx"
              onClick={() => {
                playClickSound();
                setCurrency("UGX");
              }}
              className={`px-3 py-1 rounded-sm text-xs font-bold font-mono transition-all ${
                currency === "UGX"
                  ? "bg-black text-white shadow"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              UGX
            </button>
            <button
              id="btn-currency-usd"
              onClick={() => {
                playClickSound();
                setCurrency("USD");
              }}
              className={`px-3 py-1 rounded-sm text-xs font-bold font-mono transition-all ${
                currency === "USD"
                  ? "bg-black text-white shadow"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/80 rounded-none border border-zinc-200 p-4 mb-8 space-y-4 shadow-xl shadow-black/5">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-furniture-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dining, desks, Mvule, beds..."
                className="w-full bg-zinc-50 border border-zinc-300/80 rounded-sm pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-900"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Timber Type Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs text-zinc-500 mr-1 flex items-center gap-1 font-mono">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Timber:
              </span>
              {timberTypes.map((timber) => (
                <button
                  key={timber.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedTimber(timber.id);
                  }}
                  className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-all ${
                    selectedTimber === timber.id
                      ? "bg-black text-white font-bold"
                      : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {timber.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-zinc-200/80 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-sm text-xs sm:text-sm whitespace-nowrap transition-all font-medium ${
                  selectedCategory === cat.id
                    ? "bg-black/20 border border-amber-500/50 text-amber-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-none border border-zinc-200">
            <Hammer className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-bold text-zinc-900">No matching furniture pieces found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              We build custom pieces according to your exact specifications! Let our master carpenters quote your custom design.
            </p>
            <button
              onClick={() => {
                playChimeSound();
                onOpenAiHelper(`I am looking for custom furniture with specifications: "${searchQuery}". What can Yingo Contractors build?`);
              }}
              className="mt-4 px-5 py-3 rounded-none uppercase tracking-widest text-[11px] bg-black hover:bg-amber-600 text-white font-bold text-xs inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Carpenter for Custom Quote</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProducts.map((product, index) => {
              const isJustAdded = justAddedId === product.id;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={product.id}
                  onClick={() => {
                    playClickSound();
                    onOpenProductModal(product);
                  }}
                  className="group cursor-pointer rounded-none bg-white border border-zinc-200/50 shadow-xl shadow-black/5 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl shadow-black/10 hover:shadow-amber-500/5"
                >
                  <div>
                    {/* Image with In-Stock / Lead Time Badge */}
                    <div className="relative h-56 w-full overflow-hidden bg-zinc-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md border ${
                          product.inStock
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-black/20 border-amber-500/40 text-amber-600"
                        }`}>
                          {product.inStock ? "Ready in Showroom" : "Bespoke Made-to-Order"}
                        </span>
                        <span className="text-[10px] font-mono bg-zinc-50/80 text-zinc-600 px-2 py-0.5 rounded border border-zinc-300/80">
                          {product.timber}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onOpenProductModal(product);
                        }}
                        className="absolute bottom-3 right-3 p-2 rounded-sm bg-white/90 text-zinc-900 hover:text-amber-600 hover:bg-zinc-100 border border-zinc-300 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity"
                        title="View Full Gallery & Specifications"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-black group-hover:text-amber-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-amber-600 mb-2.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold">{product.rating}</span>
                        <span className="text-zinc-500">({product.reviewCount} client reviews)</span>
                      </div>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                        {product.description}
                      </p>

                      <div className="space-y-1 text-[11px] text-zinc-500 mb-4 bg-zinc-50/60 p-2 rounded-sm border border-zinc-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 flex items-center gap-1">
                            <Ruler className="w-3 h-3 text-amber-600" /> Size:
                          </span>
                          <span className="text-zinc-900 font-mono text-[10px]">{product.dimensions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" /> Lead time:
                          </span>
                          <span className="text-zinc-900 font-mono text-[10px]">{product.leadTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Strip */}
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-200/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-zinc-500">Direct Price</div>
                      <div className="text-base font-bold text-amber-600 font-mono">
                        {formatPrice(product.priceUGX, product.priceUSD)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-add-cart-${product.id}`}
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          isJustAdded
                            ? "bg-emerald-700 text-white"
                            : "bg-black hover:bg-amber-600 text-white shadow"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Custom Furniture Order Callout Banner */}
        <div className="rounded-none bg-gradient-to-r from-white via-white to-amber-50/30 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-black/10">
          <div className="max-w-xl">
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-black/20 text-amber-600 border border-amber-500/30 mb-2">
              Custom Architectural Joinery
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              Need Custom Dimensions, Fitted Wardrobes, or Commercial Fit-Out?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              We send master carpenters to take exact laser measurements, or craft strictly to your architectural drawings with insured delivery and installation across all districts of Uganda. You can also email blueprints directly to <strong>yingocunstructionlimited@gmail.com</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                playChimeSound();
                onOpenAiHelper("I have a custom furniture design project. How can I submit my measurements or email specifications to yingocunstructionlimited@gmail.com for delivery in Uganda?");
              }}
              className="px-6 py-4 rounded-none uppercase tracking-widest text-[11px] bg-black hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Design Assistant</span>
            </button>
            <a
              href="https://wa.me/256742644200?text=Hello%20Yingo%20Contractors,%20I%20want%20a%20custom%20hardwood%20furniture%20quote."
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="px-6 py-4 rounded-none uppercase tracking-widest text-[11px] bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Workshop (0742 644200)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
