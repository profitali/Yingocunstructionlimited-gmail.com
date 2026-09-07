import React, { useState } from "react";
import { 
  X, 
  ShoppingBag, 
  Check, 
  Star, 
  Ruler, 
  Clock, 
  Layers, 
  Sparkles, 
  ShieldCheck,
  Phone
} from "lucide-react";
import { FurnitureProduct } from "../types";
import { playClickSound, playChimeSound, playWoodTapSound } from "../utils/sound";

interface ProductDetailModalProps {
  product: FurnitureProduct | null;
  onClose: () => void;
  onAddToCart: (product: FurnitureProduct, quantity?: number, customNotes?: string) => void;
  onOpenAiHelper: (prompt?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenAiHelper,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customDimensionNote, setCustomDimensionNote] = useState("");
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  const handleAdd = () => {
    playWoodTapSound();
    onAddToCart(product, quantity, customDimensionNote);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-100/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-50 border border-zinc-200 rounded-none max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl shadow-black/10 relative">
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-sm bg-white text-zinc-500 hover:text-black z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery Column */}
          <div>
            <div className="relative h-72 rounded-sm overflow-hidden bg-white mb-3 border border-zinc-200">
              <img
                src={images[selectedImgIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-zinc-50/80 text-amber-600 border border-zinc-200 backdrop-blur-sm">
                {product.timber}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setSelectedImgIndex(idx);
                    }}
                    className={`relative w-16 h-16 rounded-sm overflow-hidden border transition-all ${
                      idx === selectedImgIndex
                        ? "border-amber-500 scale-105"
                        : "border-zinc-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 rounded-sm bg-white/60 border border-zinc-200/80 text-[11px] text-zinc-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Seasoned Hardwood Guarantee</span>
              </div>
              <p>Kiln-dried to 10-12% moisture content to prevent warping under Uganda's climate.</p>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-600 font-bold">
                {product.category.toUpperCase()} COLLECTION
              </div>
              <h3 className="text-xl font-bold text-black mt-1">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-600">
                <div className="flex items-center">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold ml-1">{product.rating}</span>
                </div>
                <span className="text-zinc-500">({product.reviewCount} client reviews)</span>
                <span className="text-zinc-600">•</span>
                <span className={product.inStock ? "text-emerald-400 font-bold" : "text-amber-600"}>
                  {product.inStock ? "Showroom Ready" : "Made-to-Order"}
                </span>
              </div>

              <div className="my-3 py-2 border-y border-zinc-200">
                <div className="text-2xl font-bold text-amber-600 font-mono">
                  UGX {product.priceUGX.toLocaleString()}
                </div>
                <div className="text-xs font-mono text-zinc-500">
                  Approx. ${product.priceUSD.toLocaleString()} USD
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                {product.description}
              </p>

              <div className="space-y-1.5 bg-white/80 p-3 rounded-sm border border-zinc-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Dimensions:</span>
                  <span className="text-zinc-900 font-mono font-semibold">{product.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Timber Material:</span>
                  <span className="text-zinc-900 font-semibold">{product.timber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Finish:</span>
                  <span className="text-zinc-900">{product.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Crafting Lead Time:</span>
                  <span className="text-zinc-900 font-mono">{product.leadTime}</span>
                </div>
              </div>

              {/* Custom Dimension Notes Input */}
              <div className="mt-3">
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                  Custom Size Request (Optional)
                </label>
                <input
                  type="text"
                  value={customDimensionNote}
                  onChange={(e) => setCustomDimensionNote(e.target.value)}
                  placeholder="e.g. Need length reduced to 260cm for apartment..."
                  className="w-full bg-white border border-zinc-300 rounded-sm px-3 py-1.5 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-zinc-200">
              <div className="flex gap-2">
                <div className="flex items-center border border-zinc-300 rounded-sm bg-white px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-600 hover:text-black p-1 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono text-xs font-bold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-600 hover:text-black p-1 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    added
                      ? "bg-emerald-700 text-white"
                      : "bg-black hover:bg-amber-600 text-white shadow"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Quote Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Quote / Order</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playChimeSound();
                    const pName = product.name;
                    onClose();
                    onOpenAiHelper(`I am inquiring about the "${pName}". Can you advise on customization options, delivery in Kampala, and timber durability?`);
                  }}
                  className="flex-1 py-2 rounded-sm bg-white hover:bg-zinc-100 text-amber-600 border border-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI About This Piece</span>
                </button>
                <a
                  href={`https://wa.me/256742644200?text=Hello%20Yingo%20Contractors,%20I%20am%20interested%20in%20ordering%20the%20${encodeURIComponent(product.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="px-5 py-3 rounded-none uppercase tracking-widest text-[11px] bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
