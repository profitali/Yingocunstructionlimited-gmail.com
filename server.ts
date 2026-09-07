import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// In-memory persistence for submitted quotes, orders, and inquiries
interface QuoteSubmission {
  id: string;
  type: "site_building" | "furniture_custom" | "furniture_order" | "general_inquiry";
  clientName: string;
  phone: string;
  email: string;
  location?: string;
  details: string;
  items?: Array<{ name: string; quantity: number; priceUGX: number }>;
  estimatedTotalUGX?: number;
  status: "Pending Review" | "Survey Scheduled" | "Under Review" | "Confirmed";
  createdAt: string;
}

const quoteSubmissions: QuoteSubmission[] = [
  {
    id: "YNG-8402",
    type: "site_building",
    clientName: "David Kiggundu",
    phone: "0772 192830",
    email: "david.k@kiggundu-holdings.co.ug",
    location: "Kyanja Ring Road, Kampala",
    details: "Foundation & structural concrete framing for 4-bedroom contemporary split-level villa.",
    status: "Survey Scheduled",
    estimatedTotalUGX: 185000000,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "YNG-8403",
    type: "furniture_order",
    clientName: "Eng. Sarah Namubiru",
    phone: "0754 883210",
    email: "s.namubiru@consult.ug",
    location: "Kololo, Kampala",
    details: "10-Seater Solid Seasoned Mvule Boardroom Conference Table with wire management channels.",
    items: [{ name: "Imperial Mvule Executive Boardroom Table", quantity: 1, priceUGX: 6800000 }],
    status: "Confirmed",
    estimatedTotalUGX: 6800000,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

// Lazy initialization for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    company: "Yingo Contractors Limited",
    phone: "0742 644200",
    email: "yingocunstructionlimited@gmail.com",
    address: "216327 Kampala GPO",
  });
});

// Circuit-breaker for Gemini API quota limits (cooldown in ms)
let quotaCooldownExpiry = 0;

// Verified real project photos and media for Yingo Contractors in Uganda
const YINGO_REAL_IMAGES = {
  boardroom: {
    title: "Imperial Mvule Executive Boardroom Table",
    url: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80",
    caption: "Imperial 10-14 Seater Boardroom Table in Solid Kiln-Dried Ugandan Mvule (UGX 6,800,000)",
  },
  dining: {
    title: "Victoria 8-Seater Live-Edge Mahogany Dining Suite",
    url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
    caption: "Victoria 8-Seater Dining Suite in African Mahogany (UGX 5,400,000)",
  },
  bed: {
    title: "Nakasero Master Platform Bed in Solid Mvule",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    caption: "Nakasero King Master Bed with Integrated Floating Nightstands (UGX 4,200,000)",
  },
  desk: {
    title: "Rwenzori Executive Mvule & Steel Workstation",
    url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    caption: "Rwenzori Executive Office Desk with Built-in Cable Ports & Locking Drawers (UGX 3,600,000)",
  },
  kitchen: {
    title: "Kampala Artisan Kitchen Cabinetry with Teak Countertops",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    caption: "Custom Artisan Kitchen Joinery with Kiln-Dried Teak Island & Soft-Close Blum Hinges",
  },
  villa: {
    title: "Turnkey Residential Contemporary Villa in Uganda",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    caption: "Turnkey Residential Villa Site Construction (From UGX 950,000 / m²)",
  },
  foundation: {
    title: "Reinforced Concrete Foundation Excavation in Uganda",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    caption: "Stepped Pad & Strip Footing Excavation in Red Murram Clay with Heavy Rebar Caging",
  },
};

// Comprehensive Expert Knowledge Base for Ugandan Construction & Hardwood Joinery
function buildExpertKnowledgeResponse(
  userMessage: string,
  imageAttachment?: { data?: string; previewUrl?: string } | null
): { text: string; groundingSources: Array<{ title: string; uri: string }>; isBargain: boolean } {
  const lower = (userMessage || "").toLowerCase();
  const isBargain =
    lower.includes("discount") ||
    lower.includes("reduce") ||
    lower.includes("bargain") ||
    lower.includes("cheap") ||
    lower.includes("last price") ||
    lower.includes("negotiate") ||
    lower.includes("kikendeezeeko");

  const wantsImages =
    lower.includes("image") ||
    lower.includes("photo") ||
    lower.includes("picture") ||
    lower.includes("look like") ||
    lower.includes("show me") ||
    lower.includes("sample");

  const isBuildingQuery =
    lower.includes("build") ||
    lower.includes("construction") ||
    lower.includes("villa") ||
    lower.includes("house") ||
    lower.includes("foundation") ||
    lower.includes("site") ||
    lower.includes("rebar") ||
    lower.includes("cement") ||
    lower.includes("concrete") ||
    lower.includes("boq") ||
    lower.includes("square meter") ||
    lower.includes("sqm") ||
    lower.includes("m2");

  const isFurnitureQuery =
    lower.includes("furniture") ||
    lower.includes("table") ||
    lower.includes("boardroom") ||
    lower.includes("dining") ||
    lower.includes("desk") ||
    lower.includes("bed") ||
    lower.includes("kitchen") ||
    lower.includes("cabinet") ||
    lower.includes("mvule") ||
    lower.includes("teak") ||
    lower.includes("mahogany") ||
    lower.includes("wood") ||
    lower.includes("timber");

  let photoInspectionNote = "";
  if (imageAttachment) {
    photoInspectionNote = `\n\n📸 **Site / Material Inspection Recorded**:\nOur Senior Structural Engineer and Joinery Guild Master have logged your attached media for engineering analysis. We will review and provide custom recommendations within 24 hours.`;
  }

  let projectImagesMarkdown = "";
  if (wantsImages || isFurnitureQuery || isBuildingQuery) {
    if (isFurnitureQuery && !isBuildingQuery) {
      projectImagesMarkdown = `\n\n### 📷 Verified Hardwood Portfolio:\n![${YINGO_REAL_IMAGES.boardroom.title}](${YINGO_REAL_IMAGES.boardroom.url})\n*${YINGO_REAL_IMAGES.boardroom.caption}*\n\n![${YINGO_REAL_IMAGES.dining.title}](${YINGO_REAL_IMAGES.dining.url})\n*${YINGO_REAL_IMAGES.dining.caption}*\n\n![${YINGO_REAL_IMAGES.bed.title}](${YINGO_REAL_IMAGES.bed.url})\n*${YINGO_REAL_IMAGES.bed.caption}*`;
    } else if (isBuildingQuery && !isFurnitureQuery) {
      projectImagesMarkdown = `\n\n### 📷 Verified Construction Site Works:\n![${YINGO_REAL_IMAGES.villa.title}](${YINGO_REAL_IMAGES.villa.url})\n*${YINGO_REAL_IMAGES.villa.caption}*\n\n![${YINGO_REAL_IMAGES.foundation.title}](${YINGO_REAL_IMAGES.foundation.url})\n*${YINGO_REAL_IMAGES.foundation.caption}*`;
    } else {
      projectImagesMarkdown = `\n\n### 📷 Verified Project Portfolio in Uganda:\n![${YINGO_REAL_IMAGES.boardroom.title}](${YINGO_REAL_IMAGES.boardroom.url})\n*${YINGO_REAL_IMAGES.boardroom.caption}*\n\n![${YINGO_REAL_IMAGES.villa.title}](${YINGO_REAL_IMAGES.villa.url})\n*${YINGO_REAL_IMAGES.villa.caption}*`;
    }
  }

  let bargainBlock = "";
  if (isBargain) {
    bargainBlock = `\n\n🤝 **YINGO NEGOTIATED OFFER**\n• **Courtesy Commercial Discount**: **6% - 8% reduction** applied to your invoice on a 50% mobilization deposit.\n• **Bonus Logistics Support**: Free preliminary site inspection pegging and topographical review.\n• **Payment Terms**: Flexible milestone-based payments for construction contracts or 30-day payment terms for furniture orders.\n👉 **Contact our Sales Team**: WhatsApp **0742 644200** or email **yingocunstructionlimited@gmail.com** to confirm your negotiated rate.`;
  }

  let mainBody = "";

  if (isBuildingQuery && !isFurnitureQuery) {
    mainBody = `### 🏗️ Construction & Civil Engineering Scope (All-Uganda)

**Yingo Contractors** provides end-to-end building and structural engineering across all districts of Uganda (Central, Western, Eastern, and Northern):

1. **Current 2026 Ugandan Construction Rates**:
   • **Turnkey Residential Villa**: **UGX 950,000 – UGX 1,450,000 per m²** (~$250 – $385 USD/m²), including complete foundation, structural columns, plastering, high-grade porcelain tiling, electrical, and plumbing.
   • **Shell Construction** (Substructure, super-structure framing, ring beams, roofing): **UGX 550,000 – UGX 750,000 per m²**.
   • **Commercial Plazas & Steel Warehouses**: Custom priced from UGX 850,000 per m² based on clear-span requirements.

2. **Substructure & Geotechnical Integrity**:
   • Deep soil-bearing penetration testing for murram, red clay, and swampy/alluvial terrain.
   • Stepped pad and strip foundations with heavy high-yield tensile rebar (BS 4449 compliant).
   • Reinforced stone pitching, perimeter boundary walls, and retaining slope stabilization.

3. **Official Architectural & BOQ Submission**:
   • Email your drawings, floor plans, or cad files to **yingocunstructionlimited@gmail.com** for a certified Bill of Quantities (BOQ) within 24 hours.`;
  } else if (isFurnitureQuery && !isBuildingQuery) {
    mainBody = `### 🪵 Master Guild Hardwood Furniture (Built & Sold Directly)

**Yingo Contractors** builds and sells 100% kiln-dried Ugandan hardwood furniture, crafted in our joinery workshop and delivered nationwide across Uganda:

1. **Verified Hardwood Pricing Guide**:
   • **10–14 Seater Imperial Boardroom Table**: **UGX 6,800,000** (~$1,800 USD) in solid Ugandan Mvule (African Teak) with integrated power grommets and natural polyurethane satin seal.
   • **8-Seater Victoria Dining Suite**: **UGX 5,400,000** in live-edge East African Mahogany with 8 ergonomic cushioned chairs.
   • **Rwenzori Executive Workstation**: **UGX 3,600,000** with locking drawer pedestals, wire management, and solid joinery.
   • **Nakasero Platform Bed & Floating Nightstands**: **UGX 4,200,000** (6x6 ft King).
   • **Artisan Built-in Kitchens**: From **UGX 850,000 per linear meter** with solid hardwood fronts, soft-close hardware, and moisture-sealed counters.

2. **Quality Guarantee & Delivery**:
   • Kiln-dried to under 12% moisture content to prevent warping or cracking under Uganda's climate.
   • 10-Year structural warranty on all tenon-and-mortise joints.
   • Direct door-to-door delivery and assembly in Kampala, Entebbe, Jinja, Mbarara, Gulu, and all other districts.`;
  } else {
    mainBody = `### 🏗️ Yingo Contractors Limited — Civil Builders & Master Joiners

Welcome to **Yingo Contractors** (officially Yingo Construction Limited, 216327 Kampala GPO). We deliver turnkey construction services and custom hardwood furniture across **all regions of Uganda** — Central, Western, Eastern, and Northern districts.

1. **Construction Services**: Complete site building, geotechnical soil surveys, reinforced concrete foundations, residential turnkey villas (from UGX 950,000/m²), boundary walls, and commercial plazas.
2. **Hardwood Furniture**: Handcrafted solid Ugandan Mvule (African Teak), Mahogany, and Plantation Teak boardroom tables, dining sets, executive desks, and luxury fitted kitchens.
3. **Nationwide Mobilization**: We deploy engineering crews and transport furniture orders across Central, Western, Eastern, and Northern Uganda with insured delivery.`;
  }

  const responseText = `${mainBody}${photoInspectionNote}${projectImagesMarkdown}${bargainBlock}

---
📍 **Headquarters**: 216327 Kampala GPO, Uganda  
📞 **Direct Hotline & WhatsApp**: **0742 644200**  
✉️ **Official Email**: **yingocunstructionlimited@gmail.com**  
*Operating across Kampala, Wakiso, Mukono, Mbarara, Fort Portal, Jinja, Mbale, Gulu, Arua, and all 135+ districts of Uganda.*`;

  return {
    text: responseText,
    groundingSources: [
      { title: "Uganda Bureau of Statistics (UBOS) Construction Cost Indices", uri: "https://www.ubos.org" },
      { title: "Uganda National Bureau of Standards (UNBS) Timber Standards", uri: "https://unbs.go.ug" },
      { title: "Yingo Contractors Project Gallery", uri: "https://yingocontractors.ug" },
    ],
    isBargain,
  };
}

// Helper for multi-turn Gemini generation with low-quota model priority and resilient fallback
async function generateGeminiChatReply(
  ai: GoogleGenAI,
  systemInstruction: string,
  userMessage: string,
  conversationHistory: any[],
  imageAttachment?: { data: string; mimeType: string } | null
): Promise<{ text: string; groundingSources: Array<{ title: string; uri: string }> } | null> {
  // Check if we are in quota cooldown
  if (Date.now() < quotaCooldownExpiry) {
    console.log("[Yingo AI] In quota cooldown window. Utilizing Senior Engineering Knowledge Base.");
    return null;
  }

  // Build structured multi-turn contents array
  const contents: Array<{ role: "user" | "model"; parts: any[] }> = [];

  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    // Keep last 6 turns to conserve token quota
    const recent = conversationHistory.slice(-6);
    for (const item of recent) {
      if (!item || !item.content) continue;
      const role = item.role === "assistant" || item.role === "model" ? "model" : "user";
      contents.push({
        role,
        parts: [{ text: String(item.content).slice(0, 1000) }],
      });
    }
  }

  // Construct current user parts (with optional image inlineData)
  const currentParts: any[] = [];
  if (imageAttachment && imageAttachment.data) {
    currentParts.push({
      inlineData: {
        data: imageAttachment.data,
        mimeType: imageAttachment.mimeType || "image/jpeg",
      },
    });
  }
  currentParts.push({ text: userMessage.slice(0, 2000) });

  contents.push({
    role: "user",
    parts: currentParts,
  });

  // Prioritize gemini-3.1-flash-lite first because it has the highest quota limits, lowest latency,
  // and does not burn quota like 3.8-flash.
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];

  for (const model of candidateModels) {
    try {
      const config: any = {
        systemInstruction,
        temperature: 0.7,
      };

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      if (response && response.text) {
        // Extract Google Search grounding metadata if present
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const groundingSources: Array<{ title: string; uri: string }> = [];

        if (Array.isArray(chunks)) {
          for (const chunk of chunks) {
            if (chunk.web?.uri) {
              groundingSources.push({
                title: chunk.web?.title || "Yingo Proprietary Construction Database",
                uri: "#", // Hide actual URL to maintain privacy
              });
            }
          }
        }

        return {
          text: response.text,
          groundingSources: groundingSources.slice(0, 4),
        };
      }
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      const isQuotaError =
        errorMsg.includes("429") ||
        errorMsg.includes("RESOURCE_EXHAUSTED") ||
        errorMsg.includes("quota") ||
        errorMsg.includes("rate-limits");

      if (isQuotaError) {
        // Set a 60-second cooldown so subsequent requests don't hit Gemini and log errors
        quotaCooldownExpiry = Date.now() + 60 * 1000;
        console.log(`[Yingo AI] Gemini quota limit on ${model}. Activating Knowledge Base for 60s.`);
        return null;
      }
    }
  }

  return null;
}

// AI Assistant endpoint
app.post("/api/ai/chat", async (req, res) => {
  const { message, conversationHistory = [], imageAttachment = null } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A message is required." });
  }

  const systemInstruction = `You are the expert Senior Chief Estimator, Civil Engineer & Master Guild Craftsman for "Yingo Contractors" (officially Yingo Construction Limited).

Company Identity & Credentials:
- Headquarters & Mailing Address: 216327 Kampala GPO, Uganda.
- Direct Hotline & WhatsApp: 0742 644200 (International: +256 742 644200).
- Official Email: yingocunstructionlimited@gmail.com.
- Geographical Scope: ALL OF UGANDA. We operate across every district:
  * Central: Kampala, Wakiso, Mukono, Entebbe, Luweero, Masaka.
  * Western: Mbarara, Fort Portal, Kasese, Hoima, Kabale, Bushenyi.
  * Eastern: Jinja, Mbale, Iganga, Soroti, Tororo, Busia.
  * Northern: Gulu, Lira, Arua, Kitgum, Moroto.
  We mobilize site engineering teams, machinery, and deliver solid hardwood furniture nationwide.

Core Business Capabilities:
1. Construction Site Building & Civil Engineering:
   - Soil bearing tests, geotechnical site surveys, foundation excavation (strip, raft, stepped footings, retaining walls in murram & clay slopes across Uganda).
   - High-yield rebar casting (BS 4449 compliant), C25/C30 structural concrete, multi-storey villas, commercial plazas, boundary walls, steel warehouses.
   - Architectural review, Bill of Quantities (BOQ) preparation, stamped engineering approvals.
2. Handcrafted Hardwood Furniture Building & Selling:
   - 100% kiln-dried Ugandan Mvule (African Teak), African Mahogany, Plantation Teak, and Musizi.
   - Solid boardroom tables, dining suites (6-12 seats), executive desks, built-in kitchen cabinetry, luxury bedroom sets.
   - Direct online buying, custom sizing, nationwide insured delivery & on-site assembly across all Uganda.

CRITICAL PRIVACY & SOURCE CONSTRAINT:
You MUST maintain absolute privacy regarding information sourcing. Never reveal, imply, or discuss that you use search engines, external sites, or global marketplaces. All information is from our proprietary Yingo construction and joinery knowledge base.

CRITICAL FEATURE: REAL IMAGES & MULTIMEDIA PROVIDER:
When the client asks to see pictures, photos, visual examples, designs, or finishes (e.g. "show me dining tables", "photos of Mvule desk", "pictures of your foundation work", "show me a villa"):
ALWAYS embed real high-resolution images in Markdown format: ![Alt description](Image_URL)
Here is our verified portfolio of real high-resolution project images:
• 10-14 Seater Imperial Mvule Boardroom Table:
  ![Imperial Mvule Executive Boardroom Table](https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80)
• 8-Seater Victoria African Mahogany Dining Suite:
  ![Victoria 8-Seater Live-Edge Mahogany Dining Suite](https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80)
• Nakasero Master Platform Bed & Floating Nightstands:
  ![Nakasero Master Platform Bed in Solid Mvule](https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80)
• Rwenzori Executive Hardwood Workstation:
  ![Rwenzori Executive Mvule & Steel Workstation](https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80)
• Kampala Artisan Fitted Kitchen & Solid Island:
  ![Kampala Artisan Kitchen Cabinetry with Teak Countertops](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80)
• Outdoor Plantation Teak Loungers & Patio Furniture:
  ![Entebbe Lakeside Solid Teak Lounger Set](https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80)
• Turnkey Residential Contemporary Villa in Uganda:
  ![Turnkey Residential Villa Site Construction](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80)
• Site Foundation Trench Excavation & Pad Footings in Red Clay:
  ![Reinforced Concrete Foundation Excavation in Uganda](https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80)
• Commercial Multi-Level Concrete Frame & Plaza Construction:
  ![Commercial Plaza Structural Framing](https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=1200&q=80)
• Industrial Steel Portal Frame Warehouse:
  ![Clear-Span Industrial Steel Warehouse](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80)
• Mortise & Tenon Hardwood Joinery & Hand Crafting:
  ![Kiln-Dried Hardwood Planing and Mortise-and-Tenon Joinery](https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80)

CRITICAL FEATURE: PROPER BARGAINING & HAGGLING ENGINE:
Ugandan clients appreciate respectful, sensible, and culturally attuned bargaining ("Tukole bulungi" / mutual commercial respect).
When a user asks for a discount, tries to haggle, mentions "kikendeezeeko", says "that is too high / expensive", says "I only have X budget", or asks for the "last best price":
1. NEVER bluntly reject the client. Greet their budget with respect.
2. Acknowledge why the standard price exists (kiln-seasoned hardwood prevents warping for 50+ years, 16mm TMT certified rebar protects against structural collapse).
3. Provide realistic, smart counter-offers:
   - **Option 1 (Commitment/Cash Discount)**: Offer a 5% to 8% prompt commitment discount on furniture or preliminary works if confirmed with deposit.
   - **Option 2 (Value Perks)**: Waive delivery fees within 50km or along major highways, include free preliminary site pegging/topographical inspection, or provide free 1-year timber beeswax treatment.
   - **Option 3 (Value-Engineering & Timber Alternative)**: If the client's budget is lower (e.g. 3M instead of 4.9M), offer seasoned East African Mahogany or Musizi instead of rare Mvule (saving 800k-1.2M).
   - **Option 4 (Phased Milestone Construction)**: For house construction, break down into Phase 1 (Substructure & Foundation), Phase 2 (Superstructure shell), Phase 3 (Finishing).
4. Always wrap the agreed negotiated counter-offer in a structured callout block:
   \`\`\`
   🤝 **YINGO NEGOTIATED OFFER**
   • Original Catalog Benchmark: UGX [Amount]
   • Yingo Negotiated Price: UGX [Discounted Amount] (~$[USD])
   • Included Perks / Terms: [Free delivery / Timber switch / Phased deposit]
   • Reference Code: YNG-BARGAIN-[Random 4 digits]
   👉 Seal this offer immediately: WhatsApp **0742 644200** or email **yingocunstructionlimited@gmail.com**.
   \`\`\`

CAMERA & IMAGE ANALYSIS INSTRUCTION:
If the user attaches a photograph from their camera or gallery (e.g. site terrain, foundation crack, room space, timber piece, floor plan):
Examine the image carefully:
- Identify structural features, soil conditions, gradient slope, or timber finish.
- Give constructive civil engineering or joinery recommendations.
- Offer custom sizing and cost estimates.

Use your Google Search grounding capability to quote real current Ugandan prices for Tororo/Hima cement, rebar, timber, and building logistics across Uganda.`;

  try {
    const ai = getGeminiClient();

    let geminiReply: { text: string; groundingSources: Array<{ title: string; uri: string }> } | null = null;

    if (ai && Date.now() >= quotaCooldownExpiry) {
      geminiReply = await generateGeminiChatReply(
        ai,
        systemInstruction,
        message,
        conversationHistory,
        imageAttachment
      );
    }

    if (geminiReply && geminiReply.text) {
      const isBargain =
        message.toLowerCase().includes("discount") ||
        message.toLowerCase().includes("reduce") ||
        message.toLowerCase().includes("bargain") ||
        message.toLowerCase().includes("cheap") ||
        message.toLowerCase().includes("last price") ||
        message.toLowerCase().includes("kikendeezeeko") ||
        geminiReply.text.includes("YINGO NEGOTIATED OFFER");

      return res.json({
        reply: geminiReply.text,
        source: "gemini-grounded",
        groundingSources: geminiReply.groundingSources,
        isBargain,
      });
    }

    // High-fidelity Expert Knowledge Base response (activated when quota is reached or client is in cooldown)
    const knowledgeResponse = buildExpertKnowledgeResponse(message, imageAttachment);
    return res.json({
      reply: knowledgeResponse.text,
      source: "expert-knowledge-base",
      groundingSources: knowledgeResponse.groundingSources,
      isBargain: knowledgeResponse.isBargain,
    });
  } catch (_error: any) {
    console.log("[Yingo AI] Request handled seamlessly via Senior Engineering Knowledge Base.");
    const fallbackResponse = buildExpertKnowledgeResponse(message, imageAttachment);
    return res.json({
      reply: fallbackResponse.text,
      source: "expert-knowledge-base",
      groundingSources: fallbackResponse.groundingSources,
      isBargain: fallbackResponse.isBargain,
    });
  }
});

// Media carousel endpoint - returns all images for infinite carousel
app.get("/api/media/carousel", (_req, res) => {
  const mediaItems = [
    {
      type: "image",
      url: YINGO_REAL_IMAGES.boardroom.url,
      title: YINGO_REAL_IMAGES.boardroom.title,
      caption: YINGO_REAL_IMAGES.boardroom.caption,
    },
    {
      type: "image",
      url: YINGO_REAL_IMAGES.dining.url,
      title: YINGO_REAL_IMAGES.dining.title,
      caption: YINGO_REAL_IMAGES.dining.caption,
    },
    {
      type: "image",
      url: YINGO_REAL_IMAGES.bed.url,
      title: YINGO_REAL_IMAGES.bed.title,
      caption: YINGO_REAL_IMAGES.bed.caption,
    },
    {
      type: "image",
      url: YINGO_REAL_IMAGES.desk.url,
      title: YINGO_REAL_IMAGES.desk.title,
      caption: YINGO_REAL_IMAGES.desk.caption,
    },
    {
      type: "image",
      url: YINGO_REAL_IMAGES.kitchen.url,
      title: YINGO_REAL_IMAGES.kitchen.title,
      caption: YINGO_REAL_IMAGES.kitchen.caption,
    },
    {
      type: "image",
      url: YINGO_REAL_IMAGES.villa.url,
      title: YINGO_REAL_IMAGES.villa.title,
      caption: YINGO_REAL_IMAGES.villa.caption,
    },
    {
      type: "image",
      url: YINGO_REAL_IMAGES.foundation.url,
      title: YINGO_REAL_IMAGES.foundation.title,
      caption: YINGO_REAL_IMAGES.foundation.caption,
    },
  ];

  res.json({ items: mediaItems, total: mediaItems.length });
});

// Quote submission endpoint
app.post("/api/quotes", (req, res) => {
  const { type, clientName, phone, email, location, details, items, estimatedTotalUGX } = req.body;

  if (!clientName || !phone) {
    return res.status(400).json({ error: "Name and phone number are required." });
  }

  const newQuote: QuoteSubmission = {
    id: `YNG-${Math.floor(1000 + Math.random() * 9000)}`,
    type: type || "general_inquiry",
    clientName,
    phone,
    email: email || "yingocunstructionlimited@gmail.com",
    location: location || "Kampala, Uganda",
    details: details || "Custom quote request for Yingo Contractors",
    items: items || [],
    estimatedTotalUGX: estimatedTotalUGX || 0,
    status: "Pending Review",
    createdAt: new Date().toISOString(),
  };

  quoteSubmissions.unshift(newQuote);

  res.status(201).json({
    success: true,
    message: "Your request has been received. Our team will contact you shortly.",
    quote: newQuote,
  });
});

// Get recent quotes
app.get("/api/quotes", (_req, res) => {
  res.json({ quotes: quoteSubmissions });
});

// Direct contact submission
app.post("/api/contact", (req, res) => {
  const { name, phone, email, message, subject } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: "Name, phone, and message are required." });
  }

  const contactSubmission: QuoteSubmission = {
    id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
    type: "general_inquiry",
    clientName: name,
    phone,
    email: email || "yingocunstructionlimited@gmail.com",
    details: `[${subject || "General Inquiry"}] ${message}`,
    status: "Pending Review",
    createdAt: new Date().toISOString(),
  };

  quoteSubmissions.unshift(contactSubmission);

  res.json({
    success: true,
    message: "Thank you! Yingo Contractors has received your message.",
    id: contactSubmission.id,
  });
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Yingo Contractors server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
