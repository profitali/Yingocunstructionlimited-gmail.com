import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Hammer,
  Sparkles
} from "lucide-react";
import { playClickSound, playSuccessSound } from "../utils/sound";

interface AboutAndContactSectionProps {
  onOpenBookSurvey: () => void;
  onOpenAiHelper: (prompt?: string) => void;
}

export const AboutAndContactSection: React.FC<AboutAndContactSectionProps> = ({
  onOpenBookSurvey,
  onOpenAiHelper,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Site Building Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format WhatsApp message
    const waMessage = `*Website Inquiry: ${subject}* 📩

Hello Yingo Contractors!

My name is *${name}* and I am reaching out to your team regarding: *${subject}*.

*📝 My Message:*
${message}

*📞 How to reach me:*
Phone: ${phone}
Email: ${email || 'Not provided'}

Looking forward to your professional guidance and discussing how we can work together.`;

    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/256742644200?text=${encodedMessage}`;
    
    // Open WhatsApp immediately
    window.open(whatsappUrl, '_blank');
    
    playSuccessSound();
    setSubmitted(true);
    setLoading(false);
    
    setTimeout(() => {
      setSubmitted(false);
      setName(""); setPhone(""); setEmail(""); setSubject("Site Building Inquiry"); setMessage("");
    }, 5000);
  };
  
  return (
    <section id="about-us" className="py-20 px-4 bg-zinc-50 border-t border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        {/* About Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 text-amber-600 text-xs font-bold tracking-wider uppercase mb-3 border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Yingo Construction Limited</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
              Building Enduring Structures &amp; Master Handcrafted Woodwork
            </h2>
            <p className="text-zinc-600 mt-4 text-sm sm:text-base leading-relaxed">
              Yingo Contractors brings together certified civil engineers, site project managers, 
              and traditional Ugandan master joiners. Headquartered with postal dispatch at <strong>216327 Kampala GPO</strong>, 
              we pride ourselves on structural integrity, strict contract timelines, and zero compromise on materials.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-sm bg-white border-none rounded-none shadow-sm flex items-start gap-3">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-black">Turnkey Site Building</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Turnkey villas, commercial developments, reinforced foundations, and civil works.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-sm bg-white border-none rounded-none shadow-sm flex items-start gap-3">
                <Hammer className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-black">Hardwood Furniture</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Sustainable Mvule, Teak &amp; Mahogany dining suites, boardroom tables &amp; cabinetry.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  playClickSound();
                  onOpenBookSurvey();
                }}
                className="px-6 py-4 rounded-none uppercase tracking-widest text-[11px] bg-black hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow"
              >
                Schedule Site Inspection
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onOpenAiHelper("Tell me about Yingo Contractors credentials, workshop location in Kampala, and quality guarantees.");
                }}
                className="px-6 py-4 rounded-none uppercase tracking-widest text-[11px] bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 font-semibold text-xs sm:text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ask AI About Our Company</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-none overflow-hidden border border-zinc-200 shadow-2xl shadow-black/10 relative h-96">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                alt="Yingo Contractors Kampala Site"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-sm bg-zinc-50/90 border border-zinc-200 backdrop-blur-md">
                <div className="text-xs font-mono font-bold text-amber-600 uppercase">
                  Contractor Credentials &amp; Standards
                </div>
                <div className="text-sm font-bold text-black mt-0.5">
                  BS 8110 Structural Concrete • Seasoned Ugandan Hardwood
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Mailing Address: 216327 Kampala GPO, Uganda • Tel: 0742 644200
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Inquiry Section */}
        <div className="rounded-none bg-white/70 border border-zinc-200 p-6 sm:p-10 shadow-2xl shadow-black/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-amber-600 tracking-wider mb-1">
                  Get in Touch Directly
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                  Contact Our Team
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                  Call our engineers directly, send an email, or visit our site office. 
                  We respond to all quote inquiries within 2 to 4 business hours.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone / WhatsApp */}
                <a
                  href="tel:0742644200"
                  onClick={playClickSound}
                  className="p-4 rounded-sm bg-zinc-50 border border-zinc-200 hover:border-amber-500/40 flex items-center gap-4 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-sm bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-zinc-500">
                      Direct Hotline &amp; WhatsApp
                    </div>
                    <div className="text-base font-bold text-black group-hover:text-amber-600 transition-colors font-mono">
                      0742 644200
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Click to Call / WhatsApp (+256 742 644200)
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:yingocunstructionlimited@gmail.com"
                  onClick={playClickSound}
                  className="p-4 rounded-sm bg-zinc-50 border border-zinc-200 hover:border-amber-500/40 flex items-center gap-4 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-sm bg-black/20 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-mono text-zinc-500">
                      Official Inquiries Email
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-black group-hover:text-amber-600 transition-colors truncate">
                      yingocunstructionlimited@gmail.com
                    </div>
                  </div>
                </a>

                {/* Postal & Office Address */}
                <div className="p-4 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-zinc-500">
                      Registered Postal &amp; Dispatch
                    </div>
                    <div className="text-sm font-bold text-black">
                      216327 Kampala GPO
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Kampala, Uganda • Central Service Hub
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-4 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-zinc-500">
                      Site &amp; Workshop Operating Hours
                    </div>
                    <div className="text-xs font-bold text-zinc-900">
                      Monday – Saturday: 8:00 AM – 6:00 PM
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Emergency Site Consultations Available 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-zinc-50 rounded-none border border-zinc-200 p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-black">Message Received!</h4>
                  <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                    Thank you. A contractor from Yingo Construction Limited will contact you shortly on your provided phone number.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-3 rounded-none uppercase tracking-widest text-[11px] bg-white text-zinc-600 text-xs font-bold hover:bg-zinc-100"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h4 className="text-base font-bold text-black mb-2">
                    Send Direct Message to Yingo Contractors
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">
                        Your Name <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Grace Nakato"
                        className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2.5 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
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
                        className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2.5 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2.5 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">
                        Subject of Inquiry
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2.5 text-xs text-black focus:outline-none focus:border-amber-500"
                      >
                        <option value="Site Building Inquiry">Site Building &amp; Civil Works</option>
                        <option value="Custom Furniture Order">Custom Hardwood Furniture Order</option>
                        <option value="Site Survey Request">Site Survey &amp; Soil Inspection</option>
                        <option value="Commercial BOQ Review">Commercial BOQ Review</option>
                        <option value="General Question">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Project Details / Message <span className="text-amber-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your site location, building floor plan, or desired furniture dimensions..."
                      className="w-full bg-white border border-zinc-300 rounded-none px-4 py-2.5 text-xs text-black placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-sm bg-black hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Sending Message..." : "Send Message to Yingo Contractors"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
