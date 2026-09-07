import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Phone, 
  Building, 
  Hammer, 
  RotateCcw,
  ExternalLink, 
  Mail,
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  Video,
  History,
  BarChart3,
  Volume2,
  VolumeX,
  Globe,
  Tag,
  Check,
  Play,
  ZoomIn,
  DollarSign
} from "lucide-react";
import { ChatMessage, ChatSession } from "../types";
import { playClickSound, playChimeSound } from "../utils/sound";
import { CameraCaptureModal } from "./CameraCaptureModal";
import { RecentChatsAndChartsModal } from "./RecentChatsAndChartsModal";
import { ImageLightboxModal } from "./ImageLightboxModal";

interface AiHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onOpenBookSurvey: () => void;
  onOpenQuoteDrawer: () => void;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: "msg-welcome",
  role: "assistant",
  content: `Hello! I am the Senior Estimating Engineer & Craftsmanship Advisor for **Yingo Contractors Limited** (Yingo Construction Limited • 216327 Kampala GPO).

We operate across **ALL OF UGANDA** (Central, Western, Eastern, and Northern regions):

1. **Construction Site Building & Civil Engineering**:
• Foundation engineering, retaining walls & soil bearing testing across Uganda
• Residential villas, commercial plazas, warehouses, and structural concrete framing
• Bill of Quantities (BOQ) preparation & architectural site supervision

2. **Hardwood Furniture Building & Direct Selling**:
• Kiln-dried Ugandan Mvule (African Teak), Mahogany, and Teak joinery
• Executive desks, 6-12 seater dining suites, fitted wardrobes, and custom orders
• Insured nationwide delivery and assembly across all districts of Uganda

✨ **New Capabilities Active**:
🎤 **Mic & Voice**: Speak to dictate or listen to answers
📷 **Camera & Images**: Snap or attach site/furniture photos for AI visual inspection
🎥 **Video Showcase**: Review construction & joinery video reels
📊 **Recent Chats & Charts**: View conversation history or interactive cost charts
🌐 **Private Market Intelligence**: Live Ugandan market rates for cement, rebar, & fuel
🤝 **Proper Bargaining Engine**: Friendly commercial negotiation & tailored discounts

📧 **Email Handling**: Send site drawings & BOQs directly to **yingocunstructionlimited@gmail.com** for formal stamped estimates within 24 hours. For direct calls or WhatsApp, reach our lead engineers at **0742 644200**.

How can we assist your project today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export const AiHelperModal: React.FC<AiHelperModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onOpenBookSurvey,
  onOpenQuoteDrawer,
}) => {
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Session & History Management
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`);

  // Modals State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isHistoryAndChartsOpen, setIsHistoryAndChartsOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);

  // Attachment State
  const [pendingImage, setPendingImage] = useState<{ data: string; mimeType: string; previewUrl: string } | null>(null);
  const [pendingVideo, setPendingVideo] = useState<{ title: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Voice Speech-to-Text State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text-to-Speech State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    "Estimate 4-bedroom villa cost in Uganda",
    "Show me real photos of 10-seater Mvule dining tables",
    "Do you offer discounts or bargaining on furniture?",
    "Do you build & deliver to Mbarara, Gulu & Jinja?",
    "How to email architectural drawings & BOQs?",
    "Current Tororo cement and 16mm rebar prices in Uganda",
  ];

  // Sample Yingo Verified Construction & Woodwork Videos
  const sampleVideos = [
    {
      title: "Villa Foundation Excavation & Rebar Footing",
      url: "https://assets.mixkit.co/videos/preview/mixkit-construction-site-with-workers-and-cranes-42173-large.mp4",
    },
    {
      title: "Artisan Kiln-Dried Mvule Planing & Joinery",
      url: "https://assets.mixkit.co/videos/preview/mixkit-carpenter-measuring-and-cutting-wood-42183-large.mp4",
    },
  ];

  // Load saved sessions from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem("yingo_chat_sessions_v2");
      if (savedSessions) {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          const first = parsed[0];
          setCurrentSessionId(first.id);
          setMessages(first.messages);
        }
      }
    } catch (e) {
      console.warn("Could not load saved chat sessions:", e);
    }
  }, []);

  // Sync current messages to sessions and localStorage
  useEffect(() => {
    if (messages.length === 0) return;

    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === currentSessionId);
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg 
        ? firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? "..." : "")
        : "Uganda Construction & Joinery";

      const updatedSession: ChatSession = {
        id: currentSessionId,
        title,
        updatedAt: new Date().toISOString(),
        messages,
      };

      let newSessions: ChatSession[];
      if (existingIdx >= 0) {
        newSessions = [...prev];
        newSessions[existingIdx] = updatedSession;
      } else {
        newSessions = [updatedSession, ...prev];
      }

      try {
        localStorage.setItem("yingo_chat_sessions_v2", JSON.stringify(newSessions.slice(0, 15)));
      } catch (err) {
        console.warn("Failed saving sessions:", err);
      }

      return newSessions;
    });
  }, [messages, currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (initialPrompt && initialPrompt.trim() !== "") {
        handleSendMessage(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Recognition (Speech-to-Text)
  const toggleVoiceRecording = () => {
    playClickSound();

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-UG"; // English (Uganda)
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        playChimeSound();
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsRecording(false);
    }
  };

  // Text to Speech
  const toggleSpeakMessage = (msgId: string, text: string) => {
    playClickSound();

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner pronunciation
    const cleanText = text
      .replace(/[*#_~`\[\]()]/g, " ")
      .replace(/!\[.*?\]\(.*?\)/g, " ")
      .slice(0, 800);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Handle local file image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClickSound();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const [header, base64] = dataUrl.split(",");
      const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
      setPendingImage({
        data: base64,
        mimeType,
        previewUrl: dataUrl,
      });
      playChimeSound();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle local file video upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClickSound();
    const videoUrl = URL.createObjectURL(file);
    setPendingVideo({
      title: file.name,
      url: videoUrl,
    });
    playChimeSound();
    e.target.value = "";
  };

  // Switch or create chat sessions
  const handleSelectSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setCurrentSessionId(target.id);
      setMessages(target.messages);
    }
  };

  const handleStartNewSession = () => {
    const newId = `session-${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: "assistant",
        content: `Fresh consultation initialized! We are ready to assist with construction site building, foundation engineering, and custom kiln-dried hardwood furniture orders across all districts of Uganda.\n\nEmail your drawings to **yingocunstructionlimited@gmail.com** or call **0742 644200**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== sessionId);
      try {
        localStorage.setItem("yingo_chat_sessions_v2", JSON.stringify(updated));
      } catch (err) {}
      if (sessionId === currentSessionId && updated.length > 0) {
        setCurrentSessionId(updated[0].id);
        setMessages(updated[0].messages);
      } else if (updated.length === 0) {
        handleStartNewSession();
      }
      return updated;
    });
  };

  // Sending chat messages
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if ((!messageContent && !pendingImage && !pendingVideo) || loading) return;

    playClickSound();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent || "Please inspect this media for my Uganda project.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      imageAttachment: pendingImage ? pendingImage.previewUrl : undefined,
      videoAttachment: pendingVideo ? pendingVideo : undefined,
    };

    const imageToSend = pendingImage
      ? { data: pendingImage.data, mimeType: pendingImage.mimeType }
      : null;

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setPendingImage(null);
    setPendingVideo(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent || "Analyze this image for my Uganda project",
          imageAttachment: imageToSend,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      playChimeSound();

      const assistantReply: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "We are ready to inspect your site or craft your furniture across Uganda. Contact 0742 644200 or yingocunstructionlimited@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingSources: data.groundingSources || [],
        isBargain: data.isBargain || false,
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (error) {
      console.error("AI Assistant request error:", error);
      playChimeSound();
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I received your request! For immediate personalized pricing on site building or custom furniture across Uganda, our lead contractor is reachable on **0742 644200** or email **yingocunstructionlimited@gmail.com**. You can also schedule a site survey directly using the button below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChatConversation = () => {
    playClickSound();
    const emailTo = "yingocunstructionlimited@gmail.com";
    const subject = encodeURIComponent("Project Inquiry & Specs - Yingo Contractors Uganda");
    const conversationSummary = messages
      .map((m) => `[${m.role === "assistant" ? "YINGO ADVISOR" : "CLIENT"}]:\n${m.content}`)
      .join("\n\n---\n\n");
    const bodyText = `Hello Yingo Construction Limited Engineering & Carpentry Team,\n\nI am contacting you regarding a project in Uganda (Construction Site Building / Furniture Order).\n\nInquiry Details & Consultation:\n${conversationSummary}\n\nClient Contact Details:\nName:\nPhone / WhatsApp:\nSite / Delivery Location in Uganda:\nProject Scope / Notes:\n\nPlease review and send an official quote or contact me back.\nAddress: 216327 Kampala GPO | Email: yingocunstructionlimited@gmail.com | Phone: 0742 644200`;
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  // Helper to render message content with real images, markdown and bargaining blocks
  const renderMessageContent = (msg: ChatMessage) => {
    const isAssistant = msg.role === "assistant";
    const text = msg.content;

    // Split text to extract Markdown images: ![alt](url)
    const imageRegex = /!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = imageRegex.lastIndex;

      // Text before image
      if (matchStart > lastIndex) {
        parts.push(
          <span key={`txt-${lastIndex}`} className="whitespace-pre-wrap">
            {text.slice(lastIndex, matchStart)}
          </span>
        );
      }

      const alt = match[1] || "Yingo Project Image";
      const src = match[2];

      // Embedded Real Image Card
      parts.push(
        <div 
          key={`img-${matchStart}`} 
          className="my-3 rounded-sm overflow-hidden border border-zinc-200 bg-zinc-50 group relative shadow-lg max-w-md"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-white cursor-pointer"
               onClick={() => {
                 playClickSound();
                 setLightboxImage({ url: src, alt });
               }}
          >
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-50/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-xs font-semibold text-black truncate drop-shadow">
                {alt}
              </span>
              <span className="px-2 py-1 rounded bg-black text-white text-[10px] font-bold flex items-center gap-1 shadow">
                <ZoomIn className="w-3 h-3" /> Zoom
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-white/90 border-t border-zinc-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-600 truncate max-w-[200px]">{alt}</span>
            <button
              onClick={() => {
                playClickSound();
                handleSendMessage(`I am interested in this design: "${alt}". What are the custom sizing, timeline, and delivery options to my district?`);
              }}
              className="px-2.5 py-1 rounded-sm bg-black/20 hover:bg-black text-amber-600 hover:text-white text-[11px] font-bold transition-colors shrink-0"
            >
              Inquire About This
            </button>
          </div>
        </div>
      );

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`txt-${lastIndex}`} className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return (
      <div className="space-y-2">
        <div>{parts}</div>

        {/* Render User Attached Image */}
        {msg.imageAttachment && (
          <div className="mt-2 rounded-sm overflow-hidden border border-amber-500/30 max-w-sm bg-zinc-50">
            <img 
              src={msg.imageAttachment} 
              alt="Attached Media" 
              className="w-full h-auto max-h-60 object-cover cursor-pointer hover:opacity-95"
              onClick={() => setLightboxImage({ url: msg.imageAttachment!, alt: "Attached Media" })}
            />
            <div className="p-1.5 bg-white text-[10px] font-mono text-amber-600 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>Camera / Gallery Snapshot</span>
            </div>
          </div>
        )}

        {/* Render User Attached Video */}
        {msg.videoAttachment && (
          <div className="mt-2 rounded-sm overflow-hidden border border-amber-500/40 max-w-sm bg-zinc-50">
            <video 
              src={msg.videoAttachment.url} 
              controls 
              className="w-full h-auto max-h-52 bg-zinc-100"
            />
            <div className="p-2 bg-white text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-amber-600" />
              <span className="truncate">{msg.videoAttachment.title}</span>
            </div>
          </div>
        )}

        {/* Structured Bargaining Callout Card */}
        {(msg.isBargain || text.includes("YINGO NEGOTIATED OFFER")) && isAssistant && (
          <div className="mt-3 p-3.5 rounded-sm bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 border-2 border-amber-500/60 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5 font-mono">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                Special Yingo Negotiated Offer
              </span>
              <span className="text-[10px] font-mono bg-black text-white font-extrabold px-2 py-0.5 rounded">
                BARGAIN ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-600">
              This commercial offer has been customized for your project specifications across Uganda.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://wa.me/256742644200?text=Hello%20Yingo%20Contractors%2C%20I%20would%20like%20to%20seal%20the%20AI%20negotiated%20bargain%20offer%20for%20my%20project."
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="px-3 py-1.5 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Claim via WhatsApp (0742 644200)</span>
              </a>
              <button
                onClick={handleEmailChatConversation}
                className="px-3 py-1.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-amber-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Official Invoice</span>
              </button>
            </div>
          </div>
        )}

        {/* Google Search Grounding Citations */}
        {msg.groundingSources && msg.groundingSources.length > 0 && isAssistant && (
          <div className="mt-3 pt-2.5 border-t border-zinc-200 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-amber-600/90 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Grounded Web Citations:
            </span>
            {msg.groundingSources.map((source, sIdx) => (
              <a
                key={sIdx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-amber-600 border border-zinc-200 transition-colors flex items-center gap-1"
              >
                <span>{source.title.slice(0, 24)}</span>
                <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-100/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-50 border border-zinc-200 w-full h-full sm:w-[95vw] sm:h-[95vh] sm:rounded-none flex flex-col shadow-2xl shadow-black/10 overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-white/95 border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-black/20 border border-amber-500/40 flex items-center justify-center text-amber-600">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-black">Yingo AI Project Advisor</h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                  ONLINE
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono bg-black/15 text-amber-600 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  ALL UGANDA
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Nationwide Site Building &amp; Solid Hardwood Furniture • 216327 Kampala GPO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* History & Charts Toggle Button */}
            <button
              onClick={() => {
                playClickSound();
                setIsHistoryAndChartsOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-900 hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-300"
              title="Recent Chats and Interactive Building Cost Charts"
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Recent &amp; Charts</span>
              <span className="text-[10px] font-mono bg-black text-white font-bold px-1.5 rounded-full">
                {sessions.length}
              </span>
            </button>

            {/* Email Conversation */}
            <button
              onClick={handleEmailChatConversation}
              className="px-2.5 py-1.5 rounded-sm bg-black/10 hover:bg-black/20 border border-amber-500/30 text-amber-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Email this discussion to yingocunstructionlimited@gmail.com"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Email Team</span>
            </button>

            {/* New Session Button */}
            <button
              onClick={() => {
                playClickSound();
                handleStartNewSession();
              }}
              className="p-2 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-500 hover:text-black transition-colors"
              title="New Consultation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-500 hover:text-black transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white/40 border-b border-zinc-200/80 px-4 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] font-mono text-amber-600 font-bold uppercase shrink-0">
            Quick Ask:
          </span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-black/20 text-zinc-600 hover:text-amber-600 border border-zinc-200 hover:border-amber-500/40 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isAssistant = msg.role === "assistant";
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="w-7 h-7 rounded-sm bg-black text-white flex items-center justify-center shrink-0 mt-1 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-none p-4 text-xs sm:text-sm leading-relaxed shadow ${
                    isAssistant
                      ? "bg-white/90 border border-zinc-200 text-zinc-900"
                      : "bg-black text-white font-medium"
                  }`}
                >
                  {renderMessageContent(msg)}

                  <div className="flex items-center justify-between mt-2 pt-1">
                    {isAssistant && (
                      <button
                        onClick={() => toggleSpeakMessage(msg.id, msg.content)}
                        className={`text-[10px] flex items-center gap-1 font-mono transition-colors ${
                          isSpeaking ? "text-amber-600 font-bold animate-pulse" : "text-zinc-500 hover:text-zinc-600"
                        }`}
                        title="Listen to this response"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? "Mute Voice" : "Read Aloud"}</span>
                      </button>
                    )}
                    <div
                      className={`text-[9px] font-mono ml-auto ${
                        isAssistant ? "text-zinc-500" : "text-zinc-900"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>

                {!isAssistant && (
                  <div className="w-7 h-7 rounded-sm bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-sm bg-black text-white flex items-center justify-center shrink-0 shadow">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-zinc-200 rounded-none px-4 py-3 text-xs text-zinc-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-200" />
                <span className="text-[11px] font-mono ml-1">
                  Querying Yingo Contractors private engineering archives...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Shortcuts Strip */}
        <div className="bg-white/70 border-t border-zinc-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onClose();
                onOpenBookSurvey();
              }}
              className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Book Site Survey</span>
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={() => {
                playClickSound();
                onClose();
                onOpenQuoteDrawer();
              }}
              className="text-[11px] text-zinc-600 hover:text-black flex items-center gap-1 font-medium"
            >
              <Hammer className="w-3.5 h-3.5 text-amber-600" />
              <span>Quote Drawer</span>
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={handleEmailChatConversation}
              className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-mono"
            >
              <Mail className="w-3 h-3 text-amber-600" />
              <span>yingocunstructionlimited@gmail.com</span>
            </button>
          </div>

          <a
            href="tel:0742644200"
            onClick={playClickSound}
            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
          >
            <Phone className="w-3 h-3" />
            <span>Call 0742 644200</span>
          </a>
        </div>

        {/* Media Preview Strip (If image or video attached) */}
        {(pendingImage || pendingVideo) && (
          <div className="px-4 py-2 bg-zinc-50 border-t border-amber-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 min-w-0">
              {pendingImage && (
                <div className="flex items-center gap-2">
                  <img
                    src={pendingImage.previewUrl}
                    alt="Pending Upload"
                    className="w-10 h-10 object-cover rounded-sm border border-amber-500/50"
                  />
                  <div>
                    <span className="text-xs font-semibold text-black block">Photo Attached</span>
                    <span className="text-[10px] text-amber-600 font-mono">Ready for AI visual inspection</span>
                  </div>
                </div>
              )}

              {pendingVideo && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-sm bg-black/20 border border-amber-500/40 flex items-center justify-center text-amber-600">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-black block truncate">{pendingVideo.title}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Video Reel Attached</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                playClickSound();
                setPendingImage(null);
                setPendingVideo(null);
              }}
              className="p-1.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-500 hover:text-black"
              title="Remove Attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar with Mic, Camera, Image, Video Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-zinc-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            {/* Input Tools Toolbar (Mobile & Desktop) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mic Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2.5 rounded-sm border transition-all flex items-center justify-center ${
                  isRecording
                    ? "bg-red-500 text-black border-red-400 animate-pulse shadow-lg shadow-red-500/30"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-zinc-300"
                }`}
                title={isRecording ? "Listening... Click to stop" : "Voice Dictation (Mic)"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-600" />}
              </button>

              {/* Camera Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsCameraOpen(true);
                }}
                className="p-2.5 rounded-sm bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-amber-600 border border-zinc-200 hover:border-zinc-300 transition-colors"
                title="Snap Site Photo with Camera"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Image Picker Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  fileInputRef.current?.click();
                }}
                className="p-2.5 rounded-sm bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-amber-600 border border-zinc-200 hover:border-zinc-300 transition-colors"
                title="Attach Picture from Gallery"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Video Picker Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  // Offer sample video or upload
                  if (confirm("Would you like to attach Yingo's verified construction site video reel? (Cancel to select your own video file)")) {
                    setPendingVideo(sampleVideos[0]);
                    playChimeSound();
                  } else {
                    videoInputRef.current?.click();
                  }
                }}
                className="p-2.5 rounded-sm bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-amber-600 border border-zinc-200 hover:border-zinc-300 transition-colors"
                title="Attach Video Clip"
              >
                <Video className="w-4 h-4" />
              </button>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
              />
            </div>

            {/* Text Input and Send Button */}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isRecording 
                    ? "Listening to your voice..." 
                    : "Ask about building, solid furniture, prices, bargaining across Uganda..."
                }
                className={`flex-1 bg-zinc-50 border rounded-sm px-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-zinc-500 focus:outline-none transition-colors ${
                  isRecording ? "border-red-500/80 ring-1 ring-red-500/40" : "border-zinc-300 focus:border-amber-500"
                }`}
              />
              <button
                type="submit"
                disabled={loading || (!inputMessage.trim() && !pendingImage && !pendingVideo)}
                className="px-4 py-2.5 rounded-sm bg-black hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64Data, mimeType) => {
          setPendingImage({
            data: base64Data,
            mimeType,
            previewUrl: `data:${mimeType};base64,${base64Data}`,
          });
        }}
      />

      {/* Recent Chats & Interactive Charts Modal */}
      <RecentChatsAndChartsModal
        isOpen={isHistoryAndChartsOpen}
        onClose={() => setIsHistoryAndChartsOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleStartNewSession}
        onDeleteSession={handleDeleteSession}
        onInsertChartData={(chartSummary) => {
          handleSendMessage(chartSummary);
        }}
      />

      {/* Fullscreen High-Resolution Image Lightbox */}
      <ImageLightboxModal
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage?.url || null}
        imageAlt={lightboxImage?.alt}
        onInquire={(title) => {
          handleSendMessage(`I would like to order or inspect this: "${title}". Can you give me pricing in UGX and delivery times to my district?`);
        }}
      />
    </div>
  );
};
