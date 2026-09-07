export type ServiceCategory = "site_building" | "furniture_making" | "all";

export interface FurnitureProduct {
  id: string;
  name: string;
  category: "dining" | "office" | "living" | "bedroom" | "outdoor" | "kitchen";
  timber: "Mvule (African Teak)" | "Ugandan Mahogany" | "Plantation Teak" | "Musizi Hardwood" | "Steel & Hardwood Hybrid";
  priceUGX: number;
  priceUSD: number;
  dimensions: string;
  leadTime: string;
  finish: string;
  inStock: boolean;
  image: string;
  galleryImages: string[];
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
}

export interface ConstructionProject {
  id: string;
  title: string;
  category: "Residential Villa" | "Commercial Complex" | "Civil & Earthworks" | "Structural Steel" | "Interior Fit-Out";
  location: string;
  duration: string;
  year: string;
  scope: string;
  areaSqMeters: number;
  image: string;
  beforeAfterImage?: string;
  keyHighlights: string[];
  client: string;
}

export interface CartItem {
  product: FurnitureProduct;
  quantity: number;
  customNotes?: string;
  customDimensions?: string;
}

export interface QuoteRequest {
  type: "site_building" | "furniture_custom" | "furniture_order" | "general_inquiry";
  clientName: string;
  phone: string;
  email: string;
  location: string;
  projectType?: string;
  areaSqMeters?: number;
  budgetUGX?: number;
  details: string;
  items?: { name: string; quantity: number; priceUGX: number }[];
  estimatedTotalUGX?: number;
}

export interface VideoShowcaseItem {
  id: string;
  title: string;
  category: "Site Construction" | "Woodworking & Joinery" | "Finishing & Detailing";
  videoUrl: string;
  poster: string;
  duration: string;
  description: string;
  locationOrCraft: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  imageAttachment?: string;
  videoAttachment?: {
    title: string;
    url: string;
    poster?: string;
  };
  groundingSources?: Array<{
    title: string;
    uri: string;
  }>;
  isBargain?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}
