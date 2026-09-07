import React, { useState } from "react";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  Phone, 
  Building, 
  Hammer, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Mail
} from "lucide-react";
import { CartItem } from "../types";
import { playClickSound, playChimeSound, playSuccessSound } from "../utils/sound";

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  customSiteEstimate?: {
    type: "site_building" | "furniture_custom";
    estimatedTotalUGX: number;
    description: string;
  } | null;
  onClearEstimate?: () => void;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customSiteEstimate,
  onClearEstimate,
}) => {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Kampala, Uganda");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const safeCart = Array.isArray(cart) ? cart : [];

  const furnitureTotalUGX = safeCart.reduce(
    (sum, item) => sum + (item?.product?.priceUGX || 0) * (item?.quantity || 1),
    0
  );

  const siteTotalUGX = customSiteEstimate ? customSiteEstimate.estimatedTotalUGX : 0;
  const grandTotalUGX = furnitureTotalUGX + siteTotalUGX;
  const grandTotalUSD = Math.round(grandTotalUGX / 3750);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build cart items summary
    const cartSummary = cart.map(item => `- ${item.quantity}x ${item.product.name} (UGX ${item.product.priceUGX.toLocaleString()})`).join('\n');
    
    // Format WhatsApp message
    let message = `*Official Quote Request: Yingo Construction & Joinery* 🏗️🪚

Hello Yingo Contractors team! 

My name is *${clientName}* and I am reaching out to request a formal quotation and next steps for a project I am planning in *${location}*.
`;

    if (customSiteEstimate) {
      message += `
*🏗️ Construction & Civil Works:*
I used your cost estimator for a *${customSiteEstimate.type}*. 
My rough estimated budget is UGX ${customSiteEstimate.estimatedTotalUGX.toLocaleString()}.
Project Scope: ${customSiteEstimate.description}
`;
    }

    if (cart.length > 0) {
      message += `
*🪚 Handcrafted Hardwood Furniture:*
I would like to order the following solid wood pieces:
${cartSummary}

*Estimated Furniture Total:* UGX ${furnitureTotalUGX.toLocaleString()}
`;
    }
    
    if (notes) {
      message += `
*📝 Additional Context & Requirements:*
${notes}
`;
    }

    message += `
*📞 Contact Information:*
Phone/WhatsApp: ${phone}
Email: ${email || 'Not provided'}

Please review my requirements and let me know the availability, precise costing, and the next steps to proceed. I look forward to building with Yingo!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256742644200?text=${encodedMessage}`;
    
    // Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
    
    playSuccessSound();
    setSubmittedQuoteId("YINGO-" + Math.floor(100000 + Math.random() * 900000));
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmittedQuoteId(null);
      setClientName(""); setPhone(""); setEmail(""); setLocation("Kampala, Uganda"); setNotes("");
      if (onClearCart) onClearCart();
      if (onClearEstimate) onClearEstimate();
      onClose();
    }, 5000);
  };


  
  const getWhatsAppMessage = () => {
    const lines = [
      `*YINGO CONTRACTORS QUOTATION INQUIRY*`,
      `Quote Ref: ${submittedQuoteId || "New Request"}`,
      `Client: ${clientName}`,
      `Phone: ${phone}`,
      `Location: ${location}`,
    ];

    if (customSiteEstimate) {
      lines.push(`\n*Site Estimate:* ${customSiteEstimate.description}`);
    }

    if (safeCart.length > 0) {
      lines.push(`\n*Furniture Items:*`);
      safeCart.forEach((item) => {
        lines.push(`- ${item.quantity}x ${item.product.name} (UGX ${(item.product.priceUGX * item.quantity).toLocaleString()})`);
      });
    }

    lines.push(`\n*Total Estimated:* UGX ${grandTotalUGX.toLocaleString()} (~$${grandTotalUSD.toLocaleString()} USD)`);
    if (notes) lines.push(`Notes: ${notes}`);

    return encodeURIComponent(lines.join("\n"));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-100/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-50 border-l border-zinc-200 w-full max-w-xl h-full flex flex-col shadow-2xl shadow-black/10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-white/90 border-b border-zinc-200 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-black text-white font-bold flex items-center justify-center">
              Y
            </div>
            <div>
              <h3 className="text-base font-bold text-black">Project Quote &amp; Order Basket</h3>
              <p className="text-xs text-zinc-500">Yingo Contractors • 216327 Kampala GPO</p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {submittedQuoteId ? (
            /* Successful Submission View */
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-black/10 text-amber-600 font-mono text-xs font-bold border border-amber-500/30">
                Reference ID: {submittedQuoteId}
              </div>
              <h3 className="text-2xl font-bold text-black">Quotation Request Received!</h3>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{clientName}</strong>. Our senior site engineer and master carpenter team at Yingo Construction Limited will review your specifications and contact you on <strong>{phone}</strong>.
              </p>

              {/* Direct WhatsApp and Email Quick Share */}
              <div className="pt-4 space-y-3 max-w-sm mx-auto">
                <a
                  href={`https://wa.me/256742644200?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="w-full py-3 px-4 rounded-sm bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>Send Quote Directly to WhatsApp (0742 644200)</span>
                </a>

                <a
                  href={`mailto:yingocunstructionlimited@gmail.com?subject=${encodeURIComponent(`Quotation Request Ref ${submittedQuoteId} - ${clientName}`)}&body=${encodeURIComponent(`Hello Yingo Construction Limited,\n\nI have submitted a quotation request through the website.\nReference ID: ${submittedQuoteId}\nClient: ${clientName}\nPhone: ${phone}\nLocation: ${location}\nTotal Estimate: UGX ${grandTotalUGX.toLocaleString()} (~$${grandTotalUSD.toLocaleString()} USD)\nNotes / Specifications: ${notes || "None provided"}\n\nPlease review and email me back an official signed quotation and payment milestones.`)}`}
                  onClick={playClickSound}
                  className="w-full py-3 px-4 rounded-sm bg-black/15 hover:bg-black/25 border border-amber-500/30 text-amber-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>Email: yingocunstructionlimited@gmail.com</span>
                </a>

                <button
                  onClick={() => {
                    playClickSound();
                    setSubmittedQuoteId(null);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-sm bg-white hover:bg-zinc-100 text-zinc-600 text-xs font-semibold"
                >
                  Close &amp; Return to Store
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Site Building Estimate Attachment */}
              {customSiteEstimate && (
                <div className="p-4 rounded-sm bg-black/10 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1.5 uppercase">
                      <Building className="w-3.5 h-3.5" />
                      Attached Site Building Estimate
                    </span>
                    {onClearEstimate && (
                      <button
                        onClick={() => {
                          playClickSound();
                          onClearEstimate();
                        }}
                        className="text-zinc-500 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {customSiteEstimate.description}
                  </p>
                  <div className="text-sm font-mono font-bold text-amber-600 pt-1">
                    UGX {customSiteEstimate.estimatedTotalUGX.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Furniture Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-amber-600" />
                    Furniture Items ({safeCart.length})
                  </h4>
                  {safeCart.length > 0 && (
                    <button
                      onClick={() => {
                        playClickSound();
                        onClearCart();
                      }}
                      className="text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {safeCart.length === 0 && !customSiteEstimate ? (
                  <div className="text-center py-8 bg-white/40 rounded-sm border border-zinc-200/80">
                    <p className="text-xs text-zinc-500">
                      Your quote basket is currently empty.
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Browse our furniture catalog or use the cost estimator to add items!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {safeCart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 rounded-sm bg-white border border-zinc-200 flex gap-3 items-center"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-sm object-cover bg-zinc-50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-black truncate">
                            {item.product.name}
                          </h5>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {item.product.timber}
                          </div>
                          <div className="text-xs font-bold text-amber-600 font-mono mt-0.5">
                            UGX {(item.product.priceUGX * item.quantity).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              playClickSound();
                              onUpdateQuantity(item.product.id, -1);
                            }}
                            className="p-1 rounded bg-zinc-100 text-zinc-600 hover:bg-stone-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-zinc-900 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              playClickSound();
                              onUpdateQuantity(item.product.id, 1);
                            }}
                            className="p-1 rounded bg-zinc-100 text-zinc-600 hover:bg-stone-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              onRemoveItem(item.product.id);
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400 ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Summary */}
              {(cart.length > 0 || customSiteEstimate) && (
                <div className="p-4 rounded-sm bg-white border border-zinc-200 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Estimated Subtotal (UGX)</span>
                    <span className="font-mono text-zinc-900">UGX {grandTotalUGX.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Approx. USD Equivalent</span>
                    <span className="font-mono text-zinc-900">${grandTotalUSD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Site Delivery &amp; Assembly</span>
                    <span className="font-mono text-emerald-400 font-semibold">Available Across All Uganda</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase font-mono text-zinc-600">Grand Total Estimate</span>
                    <span className="text-lg font-bold text-amber-600 font-mono">
                      UGX {grandTotalUGX.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact Information Form */}
              <form onSubmit={handleSubmitQuote} className="space-y-4 pt-2 border-t border-zinc-200">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-500">
                  Client &amp; Site Details
                </h4>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Your Full Name / Business <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Mukasa"
                    className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Phone / WhatsApp Number <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0772 000000"
                      className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Site or Delivery Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kampala, Wakiso, Jinja, Mbarara, Gulu, Mukono..."
                    className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    Specific Requirements or Custom Measurements
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any room dimensions, wood species preferences, or architectural plan notes..."
                    className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-sm bg-black hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Transmitting..." : "Submit Quote to Yingo Contractors"}</span>
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center mt-2">
                    Official quotation issued by Yingo Construction Limited (Address: 216327 Kampala GPO, Tel: 0742 644200)
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
