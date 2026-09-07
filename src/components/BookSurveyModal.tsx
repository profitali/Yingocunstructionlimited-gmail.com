import React, { useState } from "react";
import { 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  HardHat,
  Clock,
  Send
} from "lucide-react";
import { playClickSound, playSuccessSound } from "../utils/sound";

interface BookSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookSurveyModal: React.FC<BookSurveyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [plotSize, setPlotSize] = useState("50x100 ft (Standard Plot)");
  const [preferredDate, setPreferredDate] = useState("");
  const [projectBrief, setProjectBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format WhatsApp message
    const waMessage = `*Request for Site Survey & Inspection* 🗺️🏗️

Hello Yingo Contractors engineering team! 

My name is *${name}* and I would like to schedule a professional site survey for my property located in *${location}*.

*📍 Property Details:*
- Plot Size: ${plotSize}
- Preferred Survey Date: ${preferredDate}

*🏗️ Project Vision & Brief:*
${projectBrief}

*📞 My Contact Info:*
Phone/WhatsApp: ${phone}

Please let me know your availability for the survey, the consultation fee (if any), and how we can proceed to evaluate the land for structural readiness.`;

    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/256742644200?text=${encodedMessage}`;
    
    // Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
    
    playSuccessSound();
    setSubmitted(true);
    setLoading(false);
    
    setTimeout(() => {
      setSubmitted(false);
      setName(""); setPhone(""); setLocation(""); setPlotSize("50x100 ft (Standard Plot)"); setPreferredDate(""); setProjectBrief("");
      onClose();
    }, 5000);
  };

  if (!isOpen) return null;

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-100/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-50 border border-zinc-200 rounded-none max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-black/10 relative">
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-sm bg-white text-zinc-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-black">Site Survey Scheduled!</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
              Our lead surveying engineer from Yingo Construction Limited will contact <strong>{phone}</strong> to confirm the exact GPS coordinates and inspection time in <strong>{location}</strong>. You can also email site drawings to <strong>yingocunstructionlimited@gmail.com</strong>.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/256742644200?text=Hello%20Yingo%20Contractors,%20I%20scheduled%20a%20site%20survey%20for%20my%20plot%20in%20${encodeURIComponent(location)}.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs shadow"
              >
                <Phone className="w-4 h-4" />
                <span>Confirm on WhatsApp (0742 644200)</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <HardHat className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-black">Book an On-Site Engineering Survey</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              We send a registered structural engineer to inspect soil compaction, boundary pegs, gradient slopes, and drainage anywhere in Uganda (Central, Western, Eastern, and Northern regions).
            </p>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Your Full Name <span className="text-amber-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eng. Patrick Mugerwa"
                className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  Phone / WhatsApp <span className="text-amber-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0742 644200"
                  className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  Site Location / District <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mukono, Mbarara, Jinja, Gulu, Kyanja..."
                  className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  Estimated Plot Dimensions
                </label>
                <select
                  value={plotSize}
                  onChange={(e) => setPlotSize(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black focus:outline-none focus:border-amber-500"
                >
                  <option value="50x100 ft (Standard Plot)">50x100 ft (Standard Plot)</option>
                  <option value="100x100 ft (Double Plot)">100x100 ft (Double Plot)</option>
                  <option value="Half Acre / 50 Decimals">Half Acre / 50 Decimals</option>
                  <option value="1 to 5 Acres (Estate / Farm)">1 to 5 Acres (Estate / Farm)</option>
                  <option value="Commercial Town Plot">Commercial Town Plot</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  Preferred Inspection Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Project Type &amp; Special Site Conditions
              </label>
              <textarea
                rows={2}
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                placeholder="Mention if it's a residential villa, multi-storey, steep gradient, murram, or boundary fencing project..."
                className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-sm bg-black hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Booking Survey..." : "Confirm Site Survey Booking"}</span>
            </button>
            <p className="text-[10px] text-zinc-500 text-center">
              Direct hotline: 0742 644200 • Yingo Construction Limited (216327 Kampala GPO)
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
